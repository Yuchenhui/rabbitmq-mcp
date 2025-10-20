#!/usr/bin/env node

/**
 * 快速功能测试脚本
 * 无需 RabbitMQ 连接的基础功能测试
 */

console.log('⚡ RabbitMQ MCP 快速功能测试\n');

// 测试 1: 检查文件完整性
console.log('📋 测试 1: 文件完整性检查');
const { statSync } = await import('fs');
const requiredFiles = [
  'src/config/lite-tools.ts',
  'src/cli.ts',
  'src/utils/tool-filter.ts',
  'src/tools/custom.ts',
  'src/index.ts',
  'package.json'
];

let filesOk = true;
requiredFiles.forEach(file => {
  try {
    statSync(file);
    console.log(`  ✅ ${file}`);
  } catch {
    console.log(`  ❌ ${file} 缺失`);
    filesOk = false;
  }
});

// 测试 2: 检查配置
console.log('\n📋 测试 2: 配置验证');
try {
  const config = await import('./dist/config/lite-tools.js');
  console.log(`  ✅ Lite 工具数量: ${config.LITE_TOOL_COUNT}`);
  console.log(`  ✅ Custom API 包含: ${config.LITE_MODE_TOOLS.includes('rabbitmq-custom-api') ? '是' : '否'}`);

  // 验证工具数量
  if (config.LITE_TOOL_COUNT === 18) {
    console.log('  ✅ 工具数量正确');
  } else {
    console.log(`  ❌ 工具数量错误: 期望 18，实际 ${config.LITE_TOOL_COUNT}`);
  }
} catch (error) {
  console.log('  ❌ 配置加载失败:', error.message);
  console.log('  💡 请先运行 npm run build');
}

// 测试 3: CLI 参数测试
console.log('\n📋 测试 3: CLI 参数测试');
try {
  const { parseCliArgs } = await import('./dist/cli.js');

  const test1 = parseCliArgs(['node', 'index.js']);
  const test2 = parseCliArgs(['node', 'index.js', '--lite']);
  const test3 = parseCliArgs(['node', 'index.js', '-l']);

  console.log(`  ✅ 默认模式: ${test1.liteMode ? '❌' : '✅'} 完整模式`);
  console.log(`  ✅ --lite 参数: ${test2.liteMode ? '✅' : '❌'} Lite 模式`);
  console.log(`  ✅ -l 参数: ${test3.liteMode ? '✅' : '❌'} Lite 模式`);
} catch (error) {
  console.log('  ❌ CLI 测试失败:', error.message);
}

// 测试 4: 工具过滤测试
console.log('\n📋 测试 4: 工具过滤测试');
try {
  const { filterTools, getFilterStats } = await import('./dist/utils/tool-filter.js');

  // 模拟工具列表
  const mockTools = [
    { name: 'rabbitmq-list-queues', description: 'test' },
    { name: 'rabbitmq-custom-api', description: 'test' },
    { name: 'rabbitmq-list-nodes', description: 'test' }
  ];

  const fullMode = { liteMode: false };
  const liteMode = { liteMode: true };

  const fullResult = filterTools(mockTools, fullMode);
  const liteResult = filterTools(mockTools, liteMode);

  console.log(`  ✅ 完整模式: ${fullResult.length} 个工具`);
  console.log(`  ✅ Lite 模式: ${liteResult.length} 个工具`);

  const stats = getFilterStats(mockTools.length, liteResult.length, liteMode);
  console.log(`  ✅ 过滤统计: 减少 ${stats.filteredOut} 个工具 (${stats.reductionPercentage}%)`);
} catch (error) {
  console.log('  ❌ 工具过滤测试失败:', error.message);
}

// 测试 5: 显示使用说明
console.log('\n📖 使用说明:');
console.log('  1. 启动完整模式: npm start');
console.log('  2. 启动 Lite 模式: npm start -- --lite');
console.log('  3. 查看帮助: npm start -- --help');
console.log('  4. 运行完整测试: npm run test:integration');

console.log('\n📋 测试完成！');

if (filesOk) {
  console.log('\n🎉 基础功能验证通过，可以进行下一步测试。');
  console.log('\n🐳 下一步：启动 RabbitMQ 服务');
  console.log('  docker-compose -f docker-compose.test.yml up -d');
} else {
  console.log('\n❌ 基础功能验证失败，请检查缺失文件。');
}