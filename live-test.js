#!/usr/bin/env node

/**
 * 实际功能测试脚本
 * 使用当前运行的 RabbitMQ 服务进行完整测试
 */

console.log('🚀 RabbitMQ MCP 实时功能测试\n');

// 设置环境变量
process.env.RABBITMQ_HOST = 'localhost';
process.env.RABBITMQ_MANAGEMENT_PORT = '15672';
process.env.RABBITMQ_USERNAME = 'admin';
process.env.RABBITMQ_PASSWORD = 'Pass1234';
process.env.RABBITMQ_PROTOCOL = 'http';

// 测试 1: 验证 RabbitMQ 连接
async function testRabbitMQConnection() {
  console.log('📋 测试 1: 验证 RabbitMQ 连接');
  try {
    const response = await fetch('http://localhost:15672/api/overview', {
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:Pass1234').toString('base64')
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ RabbitMQ 连接成功`);
      console.log(`  ✅ 版本: ${data.rabbitmq_version}`);
      console.log(`  ✅ 节点: ${data.node}`);
      return true;
    } else {
      console.log(`  ❌ RabbitMQ 连接失败: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`  ❌ RabbitMQ 连接错误: ${error.message}`);
    return false;
  }
}

// 测试 2: 创建测试资源
async function createTestResources() {
  console.log('\n📋 测试 2: 创建测试资源');

  const resources = [
    { name: 'test-queue', type: 'queue', endpoint: '/queues/%2F/test-queue' },
    { name: 'test-exchange', type: 'exchange', endpoint: '/exchanges/%2F/test-exchange' }
  ];

  let successCount = 0;

  for (const resource of resources) {
    try {
      const body = resource.type === 'queue'
        ? { durable: true, auto_delete: false }
        : { type: 'direct', durable: true, auto_delete: false };

      const response = await fetch(`http://localhost:15672/api${resource.endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('admin:Pass1234').toString('base64'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        console.log(`  ✅ 创建 ${resource.type} ${resource.name} 成功`);
        successCount++;
      } else {
        console.log(`  ❌ 创建 ${resource.type} ${resource.name} 失败: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ 创建 ${resource.type} ${resource.name} 错误: ${error.message}`);
    }
  }

  console.log(`  📊 资源创建结果: ${successCount}/${resources.length} 成功`);
  return successCount === resources.length;
}

// 测试 3: Lite 模式启动测试
async function testLiteMode() {
  console.log('\n📋 测试 3: Lite 模式启动测试');

  const { spawn } = await import('child_process');

  return new Promise((resolve) => {
    const child = spawn('npm', ['start', '--', '--lite'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let output = '';
    let started = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log('  📝', data.toString().trim());

      if (output.includes('Lite 模式') && output.includes('20/124')) {
        started = true;
        console.log('  ✅ Lite 模式启动成功');
        console.log(`  ✅ 工具过滤: ${output.includes('减少 104 个工具') ? '正确' : '错误'}`);
        console.log(`  ✅ 验证通过: ${output.includes('20/20') ? '是' : '否'}`);
        child.kill('SIGTERM');
        resolve(true);
      }
    });

    child.stderr.on('data', (data) => {
      console.log('  ❌', data.toString().trim());
    });

    child.on('exit', (code) => {
      if (!started) {
        console.log(`  ❌ Lite 模式启动失败，退出码: ${code}`);
        resolve(false);
      }
    });

    setTimeout(() => {
      if (!started) {
        console.log('  ⏰ Lite 模式启动超时');
        child.kill('SIGTERM');
        resolve(false);
      }
    }, 15000);
  });
}

// 测试 4: 完整模式启动测试
async function testFullMode() {
  console.log('\n📋 测试 4: 完整模式启动测试');

  const { spawn } = await import('child_process');

  return new Promise((resolve) => {
    const child = spawn('npm', ['start'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let output = '';
    let started = false;

    child.stdout.on('data', (data) => {
      output += data.toString();
      console.log('  📝', data.toString().trim());

      if (output.includes('完整模式') && output.includes('124/124')) {
        started = true;
        console.log('  ✅ 完整模式启动成功');
        console.log(`  ✅ 所有工具加载: ${output.includes('124/124') ? '是' : '否'}`);
        child.kill('SIGTERM');
        resolve(true);
      }
    });

    child.stderr.on('data', (data) => {
      console.log('  ❌', data.toString().trim());
    });

    child.on('exit', (code) => {
      if (!started) {
        console.log(`  ❌ 完整模式启动失败，退出码: ${code}`);
        resolve(false);
      }
    });

    setTimeout(() => {
      if (!started) {
        console.log('  ⏰ 完整模式启动超时');
        child.kill('SIGTERM');
        resolve(false);
      }
    }, 15000);
  });
}

// 测试 5: 清理测试资源
async function cleanupTestResources() {
  console.log('\n📋 测试 5: 清理测试资源');

  const resources = [
    { name: 'test-queue', endpoint: '/queues/%2F/test-queue' },
    { name: 'test-exchange', endpoint: '/exchanges/%2F/test-exchange' }
  ];

  let successCount = 0;

  for (const resource of resources) {
    try {
      const response = await fetch(`http://localhost:15672/api${resource.endpoint}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + Buffer.from('admin:Pass1234').toString('base64')
        }
      });

      if (response.ok || response.status === 404) {
        console.log(`  ✅ 删除 ${resource.name} 成功`);
        successCount++;
      } else {
        console.log(`  ❌ 删除 ${resource.name} 失败: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ 删除 ${resource.name} 错误: ${error.message}`);
    }
  }

  console.log(`  📊 资源清理结果: ${successCount}/${resources.length} 成功`);
  return successCount === resources.length;
}

// 主测试函数
async function runLiveTests() {
  console.log('开始实时功能测试...\n');

  const results = {
    connection: false,
    resources: false,
    liteMode: false,
    fullMode: false,
    cleanup: false
  };

  // 依次执行测试
  results.connection = await testRabbitMQConnection();

  if (!results.connection) {
    console.log('\n❌ RabbitMQ 连接失败，跳过后续测试');
    return;
  }

  results.resources = await createTestResources();
  results.liteMode = await testLiteMode();
  results.fullMode = await testFullMode();
  results.cleanup = await cleanupTestResources();

  // 输出测试结果
  console.log('\n🎯 实时测试结果汇总:');
  console.log(`  RabbitMQ 连接: ${results.connection ? '✅' : '❌'}`);
  console.log(`  资源管理: ${results.resources ? '✅' : '❌'}`);
  console.log(`  Lite 模式: ${results.liteMode ? '✅' : '❌'}`);
  console.log(`  完整模式: ${results.fullMode ? '✅' : '❌'}`);
  console.log(`  资源清理: ${results.cleanup ? '✅' : '❌'}`);

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  const successRate = Math.round((passedTests / totalTests) * 100);

  console.log(`\n📊 测试通过率: ${passedTests}/${totalTests} (${successRate}%)`);

  if (successRate === 100) {
    console.log('\n🎉 所有实时测试通过！项目已完全就绪。');
    console.log('\n📖 下一步使用指南:');
    console.log('1. 在 MCP 客户端中配置服务器');
    console.log('2. 使用 --lite 参数启动开发模式');
    console.log('3. 测试各种工具功能');
    console.log('4. 尝试 Custom API 调用任意 RabbitMQ HTTP API');
  } else {
    console.log('\n⚠️  部分测试失败，请检查相关配置。');
  }
}

// 运行测试
runLiveTests().catch(error => {
  console.error('❌ 实时测试运行失败:', error);
  process.exit(1);
});