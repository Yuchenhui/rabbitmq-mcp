#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import * as allTools from "./tools/index.js"
import { z } from "zod"
import { parseCliArgs, getModeDescription } from "./cli.js"
import { filterTools, getFilterStats, validateFilterResult } from "./utils/tool-filter.js"
import { MCPTool } from "./types/mcp.js"

function registerTools(server: McpServer, cliOptions: any) {
  const allToolsList = Object.values(allTools).flat() as MCPTool[]

  // 根据模式过滤工具
  const filteredTools = filterTools(allToolsList, cliOptions)

  // 获取过滤统计信息
  const stats = getFilterStats(allToolsList.length, filteredTools.length, cliOptions)

  // 验证过滤结果
  const validation = validateFilterResult(filteredTools, cliOptions)
  if (!validation.isValid) {
    console.error(`❌ 工具过滤验证失败: ${validation.message}`)
    process.exit(1)
  }

  // 输出模式信息
  console.log(`🚀 RabbitMQ MCP 服务器启动 - ${getModeDescription(cliOptions)}`)
  console.log(`📊 工具统计: ${stats.filteredCount}/${stats.originalCount} 个工具已加载`)
  if (cliOptions.liteMode) {
    console.log(`✨ Lite 模式: 减少了 ${stats.filteredOut} 个工具 (${stats.reductionPercentage}% 减少)`)
  }
  console.log(`✅ 工具验证: ${validation.message}`)
  console.log('---')

  // 注册工具
  for (const tool of filteredTools) {
    try {
      server.tool(
        tool.name,
        tool.description,
        tool.params && tool.params instanceof z.ZodObject ? tool.params.shape : {},
        tool.annotations || {},
        tool.handler
      )
    } catch (error) {
      console.warn(`警告：跳过工具 ${tool.name}，原因：`, error)
    }
  }
}

async function main() {
  // 解析命令行参数
  const cliOptions = parseCliArgs()

  const server = new McpServer(
    {
      name: "rabbitmq-mcp",
      version: "0.2.0"
    },
    {
      capabilities: {
        logging: {},
        tools: {}
      }
    }
  )

  registerTools(server, cliOptions)

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error("Fatal error in main():", error)
  process.exit(1)
})
