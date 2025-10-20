#!/usr/bin/env node

/**
 * 命令行参数解析模块
 * 处理 --lite 等启动参数
 */

import { CliOptions } from './types/mcp.js'

/**
 * 解析命令行参数
 * @param args 命令行参数数组，默认为 process.argv
 * @returns 解析后的选项对象
 */
export function parseCliArgs(args: string[] = process.argv): CliOptions {
  const options: CliOptions = {
    liteMode: false
  };

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--lite':
      case '-l':
        options.liteMode = true;
        break;

      // 可以在这里添加更多参数
      case '--help':
      case '-h':
        showHelp();
        process.exit(0);
        break;

      case '--version':
      case '-v':
        showVersion();
        process.exit(0);
        break;
    }
  }

  return options;
}

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
RabbitMQ MCP Server

使用方法:
  npm start [选项]

选项:
  --lite, -l      启用 lite 模式（仅20个核心工具）
  --help, -h      显示帮助信息
  --version, -v   显示版本信息

示例:
  npm start -- --lite     # 以 lite 模式启动
  npm start               # 以完整模式启动
`);
}

/**
 * 显示版本信息
 */
function showVersion(): void {
  try {
    const packageJson = require('../../package.json');
    console.log(`RabbitMQ MCP Server v${packageJson.version}`);
  } catch {
    console.log('RabbitMQ MCP Server - 版本信息不可用');
  }
}

/**
 * 获取当前运行模式描述
 * @param options CLI 选项
 * @returns 模式描述字符串
 */
export function getModeDescription(options: CliOptions): string {
  if (options.liteMode) {
    return `Lite 模式 (20个核心工具)`;
  }
  return `完整模式 (所有114个工具)`;
}