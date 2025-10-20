[根目录](../../CLAUDE.md) > [src](../) > **tools**

# Tools 模块

## 模块职责

Tools 模块是 RabbitMQ MCP 服务器的核心功能模块集合，负责将 RabbitMQ HTTP API 封装为标准化的 MCP 工具。每个工具文件对应 RabbitMQ 的一个功能领域，提供完整的 CRUD 操作和监控能力。

## 模块结构

### 工具模块清单

| 工具文件 | 功能领域 | 工具数量 | 主要操作 |
|---------|---------|---------|---------|
| `auth.ts` | 认证与安全 | 6个 | 联邦链接、认证尝试、密码哈希 |
| `vhost.ts` | 虚拟主机 | 13个 | VHost CRUD、权限、限制管理 |
| `queue.ts` | 队列管理 | 多个 | 队列 CRUD、消息操作、统计 |
| `exchange.ts` | 交换机管理 | 多个 | 交换机 CRUD、绑定管理 |
| `connection.ts` | 连接管理 | 多个 | 连接查询、强制关闭 |
| `user.ts` | 用户管理 | 多个 | 用户 CRUD、标签管理 |
| `healthcheck.ts` | 健康检查 | 多个 | 集群健康、告警监控 |
| `binding.ts` | 绑定管理 | 多个 | 绑定 CRUD 和查询 |
| `channel.ts` | 通道管理 | 多个 | 通道查询和统计 |
| `consumer.ts` | 消费者管理 | 多个 | 消费者查询和监控 |
| `node.ts` | 节点管理 | 多个 | 节点状态和内存管理 |
| `parameter.ts` | 参数管理 | 多个 | 运行时参数配置 |
| `permission.ts` | 权限管理 | 多个 | 用户权限和主题权限 |
| `policy.ts` | 策略管理 | 多个 | 策略 CRUD 和应用 |
| `stream.ts` | 流管理 | 多个 | RabbitMQ Stream 功能 |

## 入口与启动

- **主入口**: `index.ts` 导出所有工具模块
- **注册机制**: 在 `src/index.ts` 中通过 `registerTools()` 函数动态注册
- **工具加载**: 使用 `Object.values(allTools).flat()` 扁平化所有工具

## 对外接口

### 标准工具结构

每个工具都遵循统一的接口规范：

```typescript
export const toolName = {
  name: "tool-name",
  description: "工具描述",
  params: z.object({...}), // Zod 参数验证
  inputSchema: {...},     // MCP 输入模式
  annotations: {          // MCP 注解
    title: "工具标题",
    readOnlyHint: boolean,
    openWorldHint: boolean
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    // 工具处理逻辑
  }
}
```

### 核心依赖

- **HTTP 客户端**: `../client.js` 的 `rabbitHttpRequest` 函数
- **类型定义**: `../types/mcp.js` 的 `MCPTextContent` 和 `MCPToolResult`
- **参数验证**: `zod` 库进行输入验证

## 关键依赖与配置

### 内部依赖
- `../client.js` - RabbitMQ HTTP API 客户端
- `../types/mcp.js` - MCP 类型定义
- `zod` - 参数验证和类型安全

### 外部依赖
- `@modelcontextprotocol/sdk` - MCP 框架
- `node-fetch` - HTTP 请求库

## 数据模型

工具主要操作的数据模型包括：
- **虚拟主机**: 配置、权限、限制
- **队列**: 经典队列、仲裁队列、流队列
- **交换机**: direct、topic、fanout、headers
- **用户**: 认证、标签、权限
- **连接**: 客户端连接状态和统计

## 测试与质量

### 测试覆盖
- 每个工具模块都有对应的单元测试文件
- 测试文件位于 `../tests/unit/` 目录
- 使用 Jest 框架和 Mock 策略

### 质量保证
- TypeScript 严格类型检查
- Zod 参数验证确保输入安全
- 统一的错误处理机制
- 标准化的工具接口规范

## 常见问题 (FAQ)

**Q: 如何添加新的工具？**
A: 在对应的功能文件中创建新工具，遵循标准结构，然后在 `index.ts` 中导出。

**Q: 工具的参数如何验证？**
A: 使用 Zod 对象定义参数模式，自动进行类型验证和转换。

**Q: 如何处理 HTTP 错误？**
A: 通过 `rabbitHttpRequest` 统一处理，错误会被转换为异常抛出。

## 相关文件清单

### 核心文件
- `index.ts` - 工具导出入口
- `auth.ts` - 认证相关工具
- `vhost.ts` - 虚拟主机工具
- `queue.ts` - 队列管理工具
- `exchange.ts` - 交换机工具
- `connection.ts` - 连接管理工具

### 支持文件
- `user.ts` - 用户管理
- `healthcheck.ts` - 健康检查
- `binding.ts` - 绑定管理
- `channel.ts` - 通道管理
- `consumer.ts` - 消费者管理
- `node.ts` - 节点管理
- `parameter.ts` - 参数管理
- `permission.ts` - 权限管理
- `policy.ts` - 策略管理
- `stream.ts` - 流管理

## 变更记录 (Changelog)

**2025-10-20 14:52:21** - 初始化模块文档
- 完成工具模块结构分析
- 识别 15 个功能领域工具文件
- 标准化工具接口规范说明

---

*此文档由架构师自动生成，包含模块初始化分析结果*