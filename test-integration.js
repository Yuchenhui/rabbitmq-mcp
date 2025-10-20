#!/usr/bin/env node

/**
 * RabbitMQ MCP 集成测试脚本
 * 测试 lite 模式和 custom_api 功能
 */

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';

console.log('🧪 开始 RabbitMQ MCP 集成测试\n');

// 测试配置
const TEST_CONFIG = {
  rabbitmqHost: 'localhost',
  rabbitmqPort: '15672',
  rabbitmqUser: 'admin',
  rabbitmqPass: 'password',
  timeout: 30000 // 30秒超时
};

// 检查 RabbitMQ 是否运行
async function checkRabbitMQ() {
  console.log('📋 步骤 1: 检查 RabbitMQ 服务');
  try {
    const response = await fetch(`http://${TEST_CONFIG.rabbitmqHost}:${TEST_CONFIG.rabbitmqPort}/api/overview`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TEST_CONFIG.rabbitmqUser}:${TEST_CONFIG.rabbitmqPass}`).toString('base64')
      }
    });

    if (response.ok) {
      console.log('  ✅ RabbitMQ 服务正常运行');
      const data = await response.json();
      console.log(`  ✅ RabbitMQ 版本: ${data.rabbitmq_version}`);
      console.log(`  ✅ Erlang 版本: ${data.erlang_version}`);
      return true;
    } else {
      console.log('  ❌ RabbitMQ 认证失败');
      return false;
    }
  } catch (error) {
    console.log('  ❌ 无法连接到 RabbitMQ 服务');
    console.log('  💡 请先启动 RabbitMQ: docker-compose -f docker-compose.test.yml up -d');
    return false;
  }
}

// 测试 lite 模式启动
async function testLiteMode() {
  console.log('\n📋 步骤 2: 测试 Lite 模式启动');

  return new Promise((resolve) => {
    const env = { ...process.env };
    Object.assign(env, {
      RABBITMQ_HOST: TEST_CONFIG.rabbitmqHost,
      RABBITMQ_MANAGEMENT_PORT: TEST_CONFIG.rabbitmqPort,
      RABBITMQ_USERNAME: TEST_CONFIG.rabbitmqUser,
      RABBITMQ_PASSWORD: TEST_CONFIG.rabbitmqPass,
      RABBITMQ_PROTOCOL: 'http'
    });

    const child = spawn('npm', ['start', '--', '--lite'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: env
    });

    let output = '';
    let hasStarted = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log('  📝', data.toString().trim());

      // 检查是否包含预期的启动信息
      if (output.includes('Lite 模式') && output.includes('20个核心工具')) {
        hasStarted = true;
        console.log('  ✅ Lite 模式启动成功');
        console.log(`  ✅ 工具数量验证: ${output.includes('20/114') ? '通过' : '失败'}`);
        console.log(`  ✅ Custom API 工具: ${output.includes('rabbitmq-custom-api') ? '已包含' : '未找到'}`);
        child.kill('SIGTERM');
        resolve(true);
      }
    });

    child.stderr.on('data', (data) => {
      console.log('  ❌', data.toString().trim());
    });

    child.on('exit', (code) => {
      if (!hasStarted) {
        console.log(`  ❌ Lite 模式启动失败，退出码: ${code}`);
        resolve(false);
      }
    });

    // 超时处理
    setTimeout(() => {
      if (!hasStarted) {
        console.log('  ⏰ Lite 模式启动超时');
        child.kill('SIGTERM');
        resolve(false);
      }
    }, TEST_CONFIG.timeout);
  });
}

// 测试完整模式启动
async function testFullMode() {
  console.log('\n📋 步骤 3: 测试完整模式启动');

  return new Promise((resolve) => {
    const env = { ...process.env };
    Object.assign(env, {
      RABBITMQ_HOST: TEST_CONFIG.rabbitmqHost,
      RABBITMQ_MANAGEMENT_PORT: TEST_CONFIG.rabbitmqPort,
      RABBITMQ_USERNAME: TEST_CONFIG.rabbitmqUser,
      RABBITMQ_PASSWORD: TEST_CONFIG.rabbitmqPass,
      RABBITMQ_PROTOCOL: 'http'
    });

    const child = spawn('npm', ['start'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: env
    });

    let output = '';
    let hasStarted = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log('  📝', data.toString().trim());

      // 检查是否包含预期的启动信息
      if (output.includes('完整模式') && output.includes('114个工具')) {
        hasStarted = true;
        console.log('  ✅ 完整模式启动成功');
        child.kill('SIGTERM');
        resolve(true);
      }
    });

    child.stderr.on('data', (data) => {
      console.log('  ❌', data.toString().trim());
    });

    child.on('exit', (code) => {
      if (!hasStarted) {
        console.log(`  ❌ 完整模式启动失败，退出码: ${code}`);
        resolve(false);
      }
    });

    // 超时处理
    setTimeout(() => {
      if (!hasStarted) {
        console.log('  ⏰ 完整模式启动超时');
        child.kill('SIGTERM');
        resolve(false);
      }
    }, TEST_CONFIG.timeout);
  });
}

// 测试帮助信息
async function testHelpInfo() {
  console.log('\n📋 步骤 4: 测试帮助信息');

  return new Promise((resolve) => {
    const child = spawn('npm', ['start', '--', '--help'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log('  📝', data.toString().trim());
    });

    child.on('exit', (code) => {
      const hasLiteOption = output.includes('--lite') || output.includes('-l');
      const hasHelpInfo = output.includes('使用方法') || output.includes('RabbitMQ MCP Server');

      if (hasLiteOption && hasHelpInfo) {
        console.log('  ✅ 帮助信息包含 --lite 选项');
        console.log('  ✅ 帮助信息格式正确');
        resolve(true);
      } else {
        console.log('  ❌ 帮助信息不完整');
        console.log(`    Lite 选项: ${hasLiteOption ? '✅' : '❌'}`);
        console.log(`    帮助内容: ${hasHelpInfo ? '✅' : '❌'}`);
        resolve(false);
      }
    });
  });
}

// 创建测试用的 RabbitMQ 资源
async function createTestResources() {
  console.log('\n📋 步骤 5: 创建测试资源');

  try {
    // 创建测试队列
    const queueResponse = await fetch(`http://${TEST_CONFIG.rabbitmqHost}:${TEST_CONFIG.rabbitmqPort}/api/queues/%2F/test-queue`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TEST_CONFIG.rabbitmqUser}:${TEST_CONFIG.rabbitmqPass}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "durable": true,
        "auto_delete": false
      })
    });

    if (queueResponse.ok) {
      console.log('  ✅ 测试队列创建成功');
    } else {
      console.log('  ❌ 测试队列创建失败');
    }

    // 创建测试交换机
    const exchangeResponse = await fetch(`http://${TEST_CONFIG.rabbitmqHost}:${TEST_CONFIG.rabbitmqPort}/api/exchanges/%2F/test-exchange`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TEST_CONFIG.rabbitmqUser}:${TEST_CONFIG.rabbitmqPass}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "type": "direct",
        "durable": true,
        "auto_delete": false
      })
    });

    if (exchangeResponse.ok) {
      console.log('  ✅ 测试交换机创建成功');
    } else {
      console.log('  ❌ 测试交换机创建失败');
    }

    return true;
  } catch (error) {
    console.log('  ❌ 创建测试资源失败:', error.message);
    return false;
  }
}

// 清理测试资源
async function cleanupTestResources() {
  console.log('\n📋 步骤 6: 清理测试资源');

  try {
    // 删除测试队列
    await fetch(`http://${TEST_CONFIG.rabbitmqHost}:${TEST_CONFIG.rabbitmqPort}/api/queues/%2F/test-queue`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TEST_CONFIG.rabbitmqUser}:${TEST_CONFIG.rabbitmqPass}`).toString('base64')
      }
    });

    // 删除测试交换机
    await fetch(`http://${TEST_CONFIG.rabbitmqHost}:${TEST_CONFIG.rabbitmqPort}/api/exchanges/%2F/test-exchange`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TEST_CONFIG.rabbitmqUser}:${TEST_CONFIG.rabbitmqPass}`).toString('base64')
      }
    });

    console.log('  ✅ 测试资源清理完成');
    return true;
  } catch (error) {
    console.log('  ❌ 清理测试资源失败:', error.message);
    return false;
  }
}

// 主测试函数
async function runIntegrationTests() {
  console.log('🚀 RabbitMQ MCP 集成测试开始\n');

  const results = {
    rabbitmqCheck: false,
    liteMode: false,
    fullMode: false,
    helpInfo: false,
    testResources: false,
    cleanup: false
  };

  // 依次执行测试
  results.rabbitmqCheck = await checkRabbitMQ();

  if (!results.rabbitmqCheck) {
    console.log('\n❌ RabbitMQ 服务不可用，跳过后续测试');
    console.log('\n💡 解决方案:');
    console.log('1. 启动 Docker: docker-compose -f docker-compose.test.yml up -d');
    console.log('2. 等待服务启动: docker-compose -f docker-compose.test.yml ps');
    console.log('3. 重新运行测试');
    return;
  }

  results.liteMode = await testLiteMode();
  results.fullMode = await testFullMode();
  results.helpInfo = await testHelpInfo();
  results.testResources = await createTestResources();
  results.cleanup = await cleanupTestResources();

  // 输出测试结果
  console.log('\n🎯 测试结果汇总:');
  console.log(`  RabbitMQ 连接: ${results.rabbitmqCheck ? '✅' : '❌'}`);
  console.log(`  Lite 模式启动: ${results.liteMode ? '✅' : '❌'}`);
  console.log(`  完整模式启动: ${results.fullMode ? '✅' : '❌'}`);
  console.log(`  帮助信息: ${results.helpInfo ? '✅' : '❌'}`);
  console.log(`  测试资源创建: ${results.testResources ? '✅' : '❌'}`);
  console.log(`  资源清理: ${results.cleanup ? '✅' : '❌'}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  const successRate = Math.round((passedTests / totalTests) * 100);

  console.log(`\n📊 测试通过率: ${passedTests}/${totalTests} (${successRate}%)`);

  if (successRate === 100) {
    console.log('\n🎉 所有测试通过！项目已就绪。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关配置。');
  }

  console.log('\n📖 下一步操作指南:');
  console.log('1. 复制环境配置: cp .env.example .env');
  console.log('2. 修改 .env 文件中的连接信息');
  console.log('3. 启动服务: npm start -- --lite');
  console.log('4. 在 MCP 客户端中测试工具功能');
}

// 运行测试
runIntegrationTests().catch(error => {
  console.error('❌ 测试运行失败:', error);
  process.exit(1);
});