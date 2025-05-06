#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import * as allTools from "./tools/index.js"
import { z } from "zod"

function registerTools(server: McpServer) {
  const tools = Object.values(allTools).flat()
  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.params && tool.params instanceof z.ZodObject ? tool.params.shape : {},
      tool.annotations,
      tool.handler
    )
  }
}

async function main() {
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

  registerTools(server)

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error("Fatal error in main():", error)
  process.exit(1)
})
