[根目录](../../CLAUDE.md) > [src](../) > **tests**

# Tests 测试模块

## 模块职责

Tests 模块负责 RabbitMQ MCP 服务器的完整测试覆盖，包括单元测试、模拟对象和测试环境配置。该模块确保所有工具功能的正确性和稳定性。

## 模块结构

### 目录组织
```
tests/
├── unit/              # 单元测试目录
│   ├── auth.test.mjs  # 认证工具测试
│   ├── vhost.test.mjs # 虚拟主机工具测试
│   ├── queue.test.mjs # 队列工具测试
│   ├── ...           # 其他工具测试
└── mocks.js          # 测试模拟对象
```

## 入口与启动

### 测试配置
- **配置文件**: `../jest.setup.mjs`
- **测试框架**: Jest 29.0.0
- **测试匹配**: `**/src/tests/**/*.test.mjs`
- **模块类型**: ES Modules (`.mjs`)

### 测试执行
```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- auth.test.mjs
```

## 对外接口

### Mock 系统

#### 核心 Mock 对象
```javascript
// mocks.js
export const mockRabbitHttpRequest = jest.fn()

export async function setupClientMock() {
  await jest.unstable_mockModule('../../dist/client.js', () => ({
    rabbitHttpRequest: mockRabbitHttpRequest
  }))
}
```

### 测试环境配置

#### 环境变量设置 (jest.setup.mjs)
```javascript
process.env.RABBITMQ_HOST = 'localhost'
process.env.RABBITMQ_USERNAME = 'guest'
process.env.RABBITMQ_PASSWORD = 'guest'
process.env.RABBITMQ_PROTOCOL = 'http'
process.env.RABBITMQ_BASE_PATH = '/api'
process.env.RABBITMQ_MANAGEMENT_PORT = 5672
```

## 关键依赖与配置

### 测试依赖
- **Jest**: 测试框架和断言库
- **ES Modules**: 支持 `.mjs` 测试文件
- **Mock 系统**: 模拟 HTTP 请求响应

### 质量工具配置
```json
{
  "jest": {
    "testEnvironment": "node",
    "setupFiles": ["./jest.setup.mjs"],
    "testMatch": ["**/src/tests/**/*.test.mjs"]
  }
}
```

## 测试策略

### Mock 策略
- **HTTP 请求模拟**: 通过 `mockRabbitHttpRequest` 模拟所有 API 调用
- **模块模拟**: 使用 `jest.unstable_mockModule` 动态模拟客户端模块
- **响应数据**: 预定义的测试响应数据，覆盖各种场景

### 测试覆盖范围
- **功能测试**: 验证每个工具的基本功能
- **参数验证**: 测试 Zod 参数验证逻辑
- **错误处理**: 测试异常情况的处理
- **数据转换**: 验证 API 响应的格式化

## 测试用例示例

### 标准测试结构
```javascript
import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const { toolName } = await import('../../../dist/tools/module.js')

describe('module tools', () => {
  it('toolName.handler returns expected result', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'test' })
    const result = await toolName.handler({ param: 'value' })
    expect(result.content[0].text).toContain('test')
  })
})
```

### 参数验证测试
```javascript
it('validates input parameters correctly', async () => {
  const tool = toolName.params
  expect(() => tool.parse({})).toThrow() // 必需参数缺失
  expect(tool.parse({ param: 'value' })).toBeDefined() // 有效参数
})
```

## 质量指标

### 测试覆盖
- **工具覆盖**: 15 个工具模块，每个都有对应测试文件
- **功能覆盖**: 每个工具的主要功能都有测试用例
- **场景覆盖**: 正常情况、边界情况、错误情况

### 测试统计
- 总测试文件: 15+ 个 `.test.mjs` 文件
- Mock 系统: 1 个核心模拟文件
- 配置文件: 1 个 Jest 设置文件

## 常见问题 (FAQ)

**Q: 为什么使用 `.mjs` 而不是 `.js`？**
A: 项目使用 ES Modules，`.mjs` 明确表示 ES Module 文件，避免模块系统混淆。

**Q: Mock 系统如何工作？**
A: 通过 `jest.unstable_mockModule` 动态替换客户端模块，所有 HTTP 请求都会被 `mockRabbitHttpRequest` 拦截。

**Q: 如何添加新测试？**
A: 在 `unit/` 目录下创建对应工具的 `.test.mjs` 文件，遵循标准测试结构。

**Q: 测试环境变量如何配置？**
A: 通过 `jest.setup.mjs` 文件统一配置测试所需的环境变量。

## 相关文件清单

### 核心测试文件
- `unit/auth.test.mjs` - 认证工具测试
- `unit/vhost.test.mjs` - 虚拟主机测试
- `unit/queue.test.mjs` - 队列工具测试
- `unit/exchange.test.mjs` - 交换机测试
- `unit/connection.test.mjs` - 连接测试
- `unit/user.test.mjs` - 用户管理测试
- `unit/healthcheck.test.mjs` - 健康检查测试
- 其他工具测试文件...

### 配置和模拟文件
- `mocks.js` - 测试模拟对象
- `../jest.setup.mjs` - Jest 配置

## 变更记录 (Changelog)

**2025-10-20 14:52:21** - 初始化测试模块文档
- 分析完整的测试结构和策略
- 识别 15+ 个测试文件和 Mock 系统
- 梳理测试配置和质量保证流程

---

*此文档由架构师自动生成，包含模块初始化分析结果*