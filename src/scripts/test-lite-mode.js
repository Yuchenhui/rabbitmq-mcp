#!/usr/bin/env node

/**
 * Lite 模式功能验证脚本
 * 用于测试 lite 模式和 custom_api 功能
 */

import { parseCliArgs } from '../cli.ts'
import { filterTools, getFilterStats, validateFilterResult } from '../utils/tool-filter.ts'
import * as allTools from '../tools/index.ts'

async function testLiteMode() {
  console.log('🧪 测试 RabbitMQ MCP Lite 模式功能\n')

  // 测试 1: 完整模式
  console.log('📋 测试 1: 完整模式')
  const fullOptions = { liteMode: false }
  const allToolsList = Object.values(allTools).flat()
  const fullFiltered = filterTools(allToolsList, fullOptions)
  const fullStats = getFilterStats(allToolsList.length, fullFiltered.length, fullOptions)
  const fullValidation = validateFilterResult(fullFiltered, fullOptions)

  console.log(`  - 工具总数: ${fullStats.originalCount}`)
  console.log(`  - 已加载: ${fullStats.filteredCount}`)
  console.log(`  - 验证结果: ${fullValidation.message}`)
  console.log()

  // 测试 2: Lite 模式
  console.log('📋 测试 2: Lite 模式')
  const liteOptions = { liteMode: true }
  const liteFiltered = filterTools(allToolsList, liteOptions)
  const liteStats = getFilterStats(allToolsList.length, liteFiltered.length, liteOptions)
  const liteValidation = validateFilterResult(liteFiltered, liteOptions)

  console.log(`  - 工具总数: ${liteStats.originalCount}`)
  console.log(`  - 已加载: ${liteStats.filteredCount}`)
  console.log(`  - 过滤掉: ${liteStats.filteredOut} (${liteStats.reductionPercentage}% 减少)`)
  console.log(`  - 验证结果: ${liteValidation.message}`)
  console.log()

  // 测试 3: 显示 Lite 模式下的工具列表
  console.log('📋 测试 3: Lite 模式工具列表')
  const liteToolNames = liteFiltered.map(tool => tool.name).sort()

  console.log(`  Lite 模式下的 ${liteToolNames.length} 个工具:`)
  liteToolNames.forEach((name, index) => {
    console.log(`    ${index + 1}. ${name}`)
  })
  console.log()

  // 测试 4: Custom API 工具检查
  console.log('📋 测试 4: Custom API 工具检查')
  const customApiTool = liteFiltered.find(tool => tool.name === 'rabbitmq-custom-api')

  if (customApiTool) {
    console.log('  ✅ Custom API 工具已正确加载')
    console.log(`  - 工具名称: ${customApiTool.name}`)
    console.log(`  - 描述: ${customApiTool.description}`)
    console.log(`  - 参数数量: ${Object.keys(customApiTool.params?.shape || {}).length}`)
  } else {
    console.log('  ❌ Custom API 工具未找到')
  }
  console.log()

  // 测试 5: 命令行参数解析
  console.log('📋 测试 5: 命令行参数解析')

  // 模拟不同的命令行参数
  const testArgs = [
    ['node', 'index.js'],
    ['node', 'index.js', '--lite'],
    ['node', 'index.js', '-l']
  ]

  testArgs.forEach((args, index) => {
    const parsed = parseCliArgs(args)
    const mode = parsed.liteMode ? 'Lite' : 'Full'
    console.log(`  ${index + 1}. [${args.slice(2).join(' ') || '无参数'}] -> ${mode} 模式`)
  })

  console.log('\n🎉 测试完成！')
}

// 运行测试
testLiteMode().catch(error => {
  console.error('❌ 测试失败:', error)
  process.exit(1)
})