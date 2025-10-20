/**
 * 工具过滤模块
 * 根据当前模式过滤可用的工具
 */

import { isToolAvailableInLiteMode, getLiteModeTools } from '../config/lite-tools.js';
import { CliOptions, MCPTool } from '../types/mcp.js';

/**
 * 过滤工具列表
 * @param allTools 所有可用工具
 * @param cliOptions CLI 选项
 * @returns 过滤后的工具列表
 */
export function filterTools(allTools: MCPTool[], cliOptions: CliOptions): MCPTool[] {
  if (!cliOptions.liteMode) {
    // 完整模式：返回所有工具
    return allTools;
  }

  // Lite 模式：只返回配置中允许的工具
  const liteModeTools = getLiteModeTools();
  return allTools.filter(tool =>
    liteModeTools.includes(tool.name as any)
  );
}

/**
 * 获取工具过滤统计信息
 * @param originalCount 原始工具数量
 * @param filteredCount 过滤后工具数量
 * @param cliOptions CLI 选项
 * @returns 统计信息对象
 */
export function getFilterStats(
  originalCount: number,
  filteredCount: number,
  cliOptions: CliOptions
): {
  mode: string;
  originalCount: number;
  filteredCount: number;
  filteredOut: number;
  reductionPercentage: number;
} {
  const filteredOut = originalCount - filteredCount;
  const reductionPercentage = originalCount > 0
    ? Math.round((filteredOut / originalCount) * 100)
    : 0;

  return {
    mode: cliOptions.liteMode ? 'lite' : 'full',
    originalCount,
    filteredCount,
    filteredOut,
    reductionPercentage
  };
}

/**
 * 验证工具过滤结果
 * @param filteredTools 过滤后的工具列表
 * @param cliOptions CLI 选项
 * @returns 验证结果
 */
export function validateFilterResult(
  filteredTools: MCPTool[],
  cliOptions: CliOptions
): {
  isValid: boolean;
  message: string;
  expectedCount?: number;
  actualCount?: number;
} {
  if (cliOptions.liteMode) {
    const expectedCount = getLiteModeTools().length;
    const actualCount = filteredTools.length;

    if (actualCount === 0) {
      return {
        isValid: false,
        message: 'Lite 模式下没有可用工具，请检查工具名称配置',
        expectedCount,
        actualCount
      };
    }

    if (actualCount > expectedCount) {
      return {
        isValid: false,
        message: `Lite 模式下工具数量超出限制：期望 ${expectedCount} 个，实际 ${actualCount} 个`,
        expectedCount,
        actualCount
      };
    }

    // 验证工具是否在允许列表中
    const invalidTools = filteredTools.filter(tool => !isToolAvailableInLiteMode(tool.name));
    if (invalidTools.length > 0) {
      return {
        isValid: false,
        message: `Lite 模式下包含不允许的工具: ${invalidTools.map(t => t.name).join(', ')}`,
        expectedCount,
        actualCount
      };
    }

    return {
      isValid: true,
      message: `Lite 模式验证通过：${actualCount}/${expectedCount} 个工具可用`,
      expectedCount,
      actualCount
    };
  }

  return {
    isValid: true,
    message: '完整模式验证通过'
  };
}

/**
 * 验证工具名称列表的有效性
 * @param toolNames 工具名称列表
 * @param allTools 所有可用工具
 * @returns 验证结果
 */
export function validateToolNames(
  toolNames: string[],
  allTools: MCPTool[]
): {
  isValid: boolean;
  message: string;
  missingTools: string[];
  extraTools: string[];
} {
  const allToolNames = allTools.map(tool => tool.name);
  const missingTools = toolNames.filter(name => !allToolNames.includes(name));
  const extraTools = allToolNames.filter(name => !toolNames.includes(name));

  return {
    isValid: missingTools.length === 0,
    message: missingTools.length > 0
      ? `配置中包含不存在的工具: ${missingTools.join(', ')}`
      : '工具名称验证通过',
    missingTools,
    extraTools
  };
}