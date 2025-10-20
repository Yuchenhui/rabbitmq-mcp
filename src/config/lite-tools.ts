/**
 * Lite 模式工具配置
 *
 * 在 lite 模式下，只保留开发过程中最核心的18个工具
 * 分为开发相关和基础运维两大类
 */

// 开发相关核心工具（11个）
const DEVELOPMENT_TOOLS = [
  // 队列管理 - 最常用
  'list-queues',
  'put-queue',
  'get-queue-messages',
  'delete-queue',
  'purge-queue',

  // 交换机管理
  'list-exchanges',
  'put-exchange',
  'delete-exchange',

  // 绑定管理
  'create-binding-exchange-queue',
  'delete-binding-exchange-queue',

  // 消费者监控
  'list-consumers'
] as const;

// 基础运维核心工具（6个）
const BASIC_OPS_TOOLS = [
  // 虚拟主机管理
  'list-vhosts',
  'put-vhost',

  // 通道管理
  'list-channels',
  'get-channel',

  // 健康检查
  'get-health-alarms',

  // 连接管理（从开发相关移过来）
  'list-connections'
] as const;

// Custom API 工具（始终可用）
const CUSTOM_API_TOOLS = [
  'rabbitmq-custom-api'
] as const;

// Lite 模式下所有可用工具
export const LITE_MODE_TOOLS = [
  ...DEVELOPMENT_TOOLS,
  ...BASIC_OPS_TOOLS,
  ...CUSTOM_API_TOOLS
] as const;

// 工具分类导出
export const LITE_TOOL_CATEGORIES = {
  development: DEVELOPMENT_TOOLS,
  basic_ops: BASIC_OPS_TOOLS,
  custom_api: CUSTOM_API_TOOLS
} as const;

// 工具数量统计
export const LITE_TOOL_COUNT = LITE_MODE_TOOLS.length;

/**
 * 检查工具是否在 lite 模式下可用
 * @param toolName 工具名称
 * @returns 是否可用
 */
export function isToolAvailableInLiteMode(toolName: string): boolean {
  return LITE_MODE_TOOLS.includes(toolName as typeof LITE_MODE_TOOLS[number]);
}

/**
 * 获取 lite 模式下可用的工具列表
 * @returns 工具名称数组
 */
export function getLiteModeTools(): readonly string[] {
  return LITE_MODE_TOOLS;
}