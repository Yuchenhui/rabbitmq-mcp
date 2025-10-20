#!/usr/bin/env node

/**
 * 测试 Custom API 工具的修复效果
 */

async function testCustomAPI() {
  console.log('🧪 测试 Custom API 工具修复效果\n')

  // 设置环境变量 - 必须在导入 client.js 之前设置
  process.env.RABBITMQ_HOST = 'localhost'
  process.env.RABBITMQ_MANAGEMENT_PORT = '15672'
  process.env.RABBITMQ_USERNAME = 'admin'
  process.env.RABBITMQ_PASSWORD = 'Pass1234'
  process.env.RABBITMQ_PROTOCOL = 'http'

  // 导入 client.js
  const { rabbitHttpRequest } = await import('./dist/client.js')

  const testCases = [
    {
      name: '创建队列 (PUT)',
      method: 'PUT',
      path: '/queues/%2F/test-api-queue',
      body: { durable: true, auto_delete: false }
    },
    {
      name: '获取队列信息 (GET)',
      method: 'GET',
      path: '/queues/%2F/test-api-queue'
    },
    {
      name: '创建交换机 (PUT)',
      method: 'PUT',
      path: '/exchanges/%2F/test-api-exchange',
      body: { type: 'direct', durable: true }
    },
    {
      name: '删除队列 (DELETE)',
      method: 'DELETE',
      path: '/queues/%2F/test-api-queue'
    },
    {
      name: '删除交换机 (DELETE)',
      method: 'DELETE',
      path: '/exchanges/%2F/test-api-exchange'
    }
  ]

  for (const testCase of testCases) {
    try {
      console.log(`📋 测试: ${testCase.name}`)

      let result
      if (testCase.method === 'GET') {
        result = await rabbitHttpRequest(testCase.path, testCase.method)
      } else {
        result = await rabbitHttpRequest(
          testCase.path,
          testCase.method,
          undefined,
          testCase.body
        )
      }

      console.log(`  ✅ 成功: ${JSON.stringify(result).substring(0, 100)}...`)

    } catch (error) {
      console.log(`  ❌ 失败: ${error.message}`)
    }
    console.log()
  }
}

testCustomAPI().catch(error => {
  console.error('❌ 测试失败:', error)
})