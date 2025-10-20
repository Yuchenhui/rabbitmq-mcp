# RabbitMQ MCP 手动测试指南

## 🚀 快速开始

### 1. 环境准备

#### 方式 A: 使用 Docker（推荐）
```bash
# 启动 RabbitMQ 服务
docker-compose -f docker-compose.test.yml up -d

# 检查服务状态
docker-compose -f docker-compose.test.yml ps

# 查看日志（如有问题）
docker-compose -f docker-compose.test.yml logs -f
```

#### 方式 B: 使用现有 RabbitMQ 服务
```bash
# 配置环境变量
export RABBITMQ_HOST=your-rabbitmq-host
export RABBITMQ_MANAGEMENT_PORT=15672
export RABBITMQ_USERNAME=your-username
export RABBITMQ_PASSWORD=your-password
```

### 2. 基础功能测试

#### 测试 1: Lite 模式启动
```bash
npm start -- --lite
```

**预期输出：**
```
🚀 RabbitMQ MCP 服务器启动 - Lite 模式 (20个核心工具)
📊 工具统计: 20/114 个工具已加载
✨ Lite 模式: 减少了 94 个工具 (82% 减少)
✅ 工具验证: Lite 模式验证通过：20/20 个工具可用
---
```

#### 测试 2: 完整模式启动
```bash
npm start
```

**预期输出：**
```
🚀 RabbitMQ MCP 服务器启动 - 完整模式 (所有114个工具)
📊 工具统计: 114/114 个工具已加载
✅ 工具验证: 完整模式验证通过
---
```

#### 测试 3: 帮助信息
```bash
npm start -- --help
```

**预期输出：** 包含 --lite 选项的使用说明

### 3. MCP 客户端测试

在支持 MCP 的客户端中（如 Claude Desktop）配置：

```json
{
  "mcpServers": {
    "rabbitmq": {
      "command": "node",
      "args": ["/path/to/rabbitmq-mcp/dist/index.js", "--lite"],
      "env": {
        "RABBITMQ_HOST": "localhost",
        "RABBITMQ_MANAGEMENT_PORT": "15672",
        "RABBITMQ_USERNAME": "admin",
        "RABBITMQ_PASSWORD": "password"
      }
    }
  }
}
```

#### Lite 模式工具测试

**1. 列出队列**
```javascript
// 调用 rabbitmq-list-queues 工具
{
  "tool": "rabbitmq-list-queues",
  "arguments": {}
}
```

**2. 创建队列**
```javascript
// 调用 rabbitmq-put-queue 工具
{
  "tool": "rabbitmq-put-queue",
  "arguments": {
    "vhost": "/",
    "name": "test-queue",
    "durable": true,
    "auto_delete": false
  }
}
```

**3. 获取队列消息**
```javascript
// 调用 rabbitmq-get-queue-messages 工具
{
  "tool": "rabbitmq-get-queue-messages",
  "arguments": {
    "vhost": "/",
    "name": "test-queue",
    "count": 1,
    "requeue": true
  }
}
```

**4. Custom API 测试**
```javascript
// 调用 rabbitmq-custom-api 工具
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/exchanges",
    "method": "GET"
  }
}
```

```javascript
// 创建交换机
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/exchanges/%2F/test-exchange",
    "method": "PUT",
    "body": {
      "type": "direct",
      "durable": true
    }
  }
}
```

### 4. 高级测试场景

#### 场景 1: 完整工作流测试
```javascript
// 1. 创建交换机
{
  "tool": "rabbitmq-put-exchange",
  "arguments": {
    "vhost": "/",
    "name": "workflow-exchange",
    "type": "direct",
    "durable": true
  }
}

// 2. 创建队列
{
  "tool": "rabbitmq-put-queue",
  "arguments": {
    "vhost": "/",
    "name": "workflow-queue",
    "durable": true
  }
}

// 3. 创建绑定
{
  "tool": "rabbitmq-create-binding-exchange-queue",
  "arguments": {
    "vhost": "/",
    "exchange": "workflow-exchange",
    "queue": "workflow-queue",
    "routing_key": "test"
  }
}

// 4. 检查绑定结果
{
  "tool": "rabbitmq-get-queue-bindings",
  "arguments": {
    "vhost": "/",
    "name": "workflow-queue"
  }
}
```

#### 场景 2: Custom API 完整功能测试
```javascript
// 使用 Custom API 获取所有队列信息
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/queues",
    "method": "GET"
  }
}

// 使用 Custom API 创建用户（完整 API 测试）
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/users/test-user",
    "method": "PUT",
    "body": {
      "password": "test-password",
      "tags": "management,policymaker"
    }
  }
}

// 使用 Custom API 设置权限
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/permissions/%2F/test-user",
    "method": "PUT",
    "body": {
      "configure": ".*",
      "write": ".*",
      "read": ".*"
    }
  }
}
```

### 5. 错误处理测试

#### 测试无效参数
```javascript
// 无效的队列名称
{
  "tool": "rabbitmq-put-queue",
  "arguments": {
    "vhost": "/invalid-vhost",
    "name": ""
  }
}
```

#### 测试权限问题
```javascript
// 尝试访问不存在的 vhost
{
  "tool": "rabbitmq-list-queues-vhost",
  "arguments": {
    "vhost": "/nonexistent-vhost"
  }
}
```

#### 测试 Custom API 错误
```javascript
// 无效的 API 路径
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/invalid-endpoint",
    "method": "GET"
  }
}
```

### 6. 性能测试

#### 批量操作测试
```javascript
// 创建多个队列
for (let i = 1; i <= 10; i++) {
  {
    "tool": "rabbitmq-put-queue",
    "arguments": {
      "vhost": "/",
      "name": `perf-test-queue-${i}`,
      "durable": true
    }
  }
}
```

### 7. 验证清单

- [ ] Lite 模式启动成功，显示 20 个工具
- [ ] 完整模式启动成功，显示 114 个工具
- [ ] 帮助信息正确显示
- [ ] 所有 Lite 模式工具都能正常调用
- [ ] Custom API 能调用任意 RabbitMQ HTTP API
- [ ] 错误处理正常工作
- [ ] 参数验证正确执行
- [ ] 响应格式符合 MCP 规范

### 8. 故障排除

#### 常见问题

**问题 1：服务启动失败**
```bash
# 检查环境变量
echo $RABBITMQ_HOST
echo $RABBITMQ_USERNAME
echo $RABBITMQ_PASSWORD

# 检查 RabbitMQ 连接
curl -u admin:password http://localhost:15672/api/overview
```

**问题 2：工具调用失败**
- 检查 RabbitMQ Management UI 是否可访问
- 验证用户权限是否足够
- 确认 vhost 名称正确（通常为 "%2F" 代表 "/"）

**问题 3：Custom API 404 错误**
- 确认 API 路径正确
- 检查 URL 编码（vhost "/" 需要编码为 "%2F"）

### 9. 日志分析

启用详细日志：
```bash
DEBUG=* npm start -- --lite
```

查看 RabbitMQ 日志：
```bash
docker-compose -f docker-compose.test.yml logs rabbitmq
```

## 🎯 测试完成标准

当以下条件全部满足时，认为测试通过：

1. ✅ 两种模式都能正常启动
2. ✅ 所有 Lite 模式工具功能正常
3. ✅ Custom API 能调用标准 API 和高级 API
4. ✅ 错误处理机制工作正常
5. ✅ 响应格式符合 MCP 规范
6. ✅ 性能满足基本要求

测试通过后，项目即可投入生产使用！