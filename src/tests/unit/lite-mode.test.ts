/**
 * Lite 模式功能测试
 */

import { describe, it, expect } from '@jest/globals'
import { isToolAvailableInLiteMode, getLiteModeTools, LITE_TOOL_COUNT } from '../../config/lite-tools.js'
import { filterTools, getFilterStats, validateFilterResult } from '../../utils/tool-filter.js'
import { CliOptions } from '../../types/mcp.js'

// 模拟工具对象
const mockTool = (name: string) => ({
  name,
  description: `Mock tool ${name}`,
  params: {},
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: []
  },
  annotations: {},
  handler: async () => ({ content: [] })
})

describe('Lite Mode Configuration', () => {
  it('should have correct number of tools', () => {
    expect(LITE_TOOL_COUNT).toBe(20)
  })

  it('should include custom API in lite mode', () => {
    const liteTools = getLiteModeTools()
    expect(liteTools).toContain('rabbitmq-custom-api')
  })

  it('should correctly identify lite mode tools', () => {
    expect(isToolAvailableInLiteMode('rabbitmq-list-queues')).toBe(true)
    expect(isToolAvailableInLiteMode('rabbitmq-custom-api')).toBe(true)
    expect(isToolAvailableInLiteMode('rabbitmq-list-nodes')).toBe(false) // 不在 lite 模式中
  })
})

describe('Tool Filter', () => {
  const mockTools = [
    mockTool('rabbitmq-list-queues'),
    mockTool('rabbitmq-custom-api'),
    mockTool('rabbitmq-list-nodes'),
    mockTool('rabbitmq-list-users')
  ]

  it('should return all tools in full mode', () => {
    const options: CliOptions = { liteMode: false }
    const filtered = filterTools(mockTools, options)

    expect(filtered).toHaveLength(mockTools.length)
  })

  it('should filter tools in lite mode', () => {
    const options: CliOptions = { liteMode: true }
    const filtered = filterTools(mockTools, options)

    // 只有 'rabbitmq-list-queues', 'rabbitmq-custom-api', 'rabbitmq-list-users' 应该在 lite 模式中
    expect(filtered).toHaveLength(3)
    expect(filtered.map(t => t.name)).toEqual([
      'rabbitmq-list-queues',
      'rabbitmq-custom-api',
      'rabbitmq-list-users'
    ])
  })
})

describe('Filter Statistics', () => {
  it('should calculate correct stats for lite mode', () => {
    const options: CliOptions = { liteMode: true }
    const stats = getFilterStats(114, 20, options)

    expect(stats.mode).toBe('lite')
    expect(stats.originalCount).toBe(114)
    expect(stats.filteredCount).toBe(20)
    expect(stats.filteredOut).toBe(94)
    expect(stats.reductionPercentage).toBe(82)
  })

  it('should calculate correct stats for full mode', () => {
    const options: CliOptions = { liteMode: false }
    const stats = getFilterStats(114, 114, options)

    expect(stats.mode).toBe('full')
    expect(stats.originalCount).toBe(114)
    expect(stats.filteredCount).toBe(114)
    expect(stats.filteredOut).toBe(0)
    expect(stats.reductionPercentage).toBe(0)
  })
})

describe('Filter Validation', () => {
  it('should validate lite mode with correct number of tools', () => {
    const options: CliOptions = { liteMode: true }
    const validation = validateFilterResult([
      mockTool('rabbitmq-list-queues'),
      mockTool('rabbitmq-custom-api')
    ], options)

    expect(validation.isValid).toBe(true)
    expect(validation.actualCount).toBe(2)
  })

  it('should fail validation with too many tools in lite mode', () => {
    const options: CliOptions = { liteMode: true }
    const validation = validateFilterResult([
      mockTool('tool1'),
      mockTool('tool2'),
      mockTool('tool3'),
      mockTool('tool4'),
      mockTool('tool5'),
      // ... 添加更多工具使总数超过 20
    ], options)

    expect(validation.isValid).toBe(false)
    expect(validation.message).toContain('超出限制')
  })

  it('should always validate full mode', () => {
    const options: CliOptions = { liteMode: false }
    const validation = validateFilterResult([
      mockTool('tool1'),
      mockTool('tool2')
    ], options)

    expect(validation.isValid).toBe(true)
  })
})