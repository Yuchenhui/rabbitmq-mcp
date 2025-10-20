[根目录](../../../CLAUDE.md) > [src](../../) > [tools](../) > **auth**

# Auth 认证工具模块

## 模块职责

Auth 模块提供 RabbitMQ 认证和安全相关的 MCP 工具，包括联邦链接管理、认证尝试监控、密码哈希和用户认证信息查询功能。

## 入口与启动

- **模块入口**: `auth.ts`
- **工具数量**: 6个认证相关工具
- **注册方式**: 通过 `../index.ts` 中的 `AUTH_TOOLS` 导出

## 对外接口

### 工具列表

| 工具名称 | 功能描述 | 参数 | 只读 |
|---------|---------|------|------|
| `list-federation-links` | 列出集群中所有联邦链接 | 无 | ✓ |
| `list-federation-links-vhost` | 列出指定虚拟主机的联邦链接 | vhost: string | ✓ |
| `list-auth-attempts-node` | 列出节点的认证尝试记录 | node: string | ✓ |
| `list-auth-attempts-node-source` | 列出节点/源的认证尝试 | node: string | ✓ |
| `hash-password` | 使用 RabbitMQ 内部哈希算法哈希密码 | password: string | ✓ |
| `get-auth-info` | 获取当前用户的认证信息 | 无 | ✓ |

### 使用示例

```bash
# 查看所有联邦链接
list-federation-links

# 查看特定虚拟主机的联邦链接
list-federation-links-vhost with vhost="production"

# 哈希新密码
hash-password with password="newSecurePassword"

# 查看认证失败记录
list-auth-attempts-node with node="rabbit@node1"
```

## 关键依赖与配置

### 内部依赖
- `../client.js` - RabbitMQ HTTP API 客户端
- `../types/mcp.js` - MCP 类型定义

### API 端点
- `/federation-links` - 联邦链接管理
- `/auth/attempts/{node}` - 认证尝试记录
- `/auth/hash_password/{password}` - 密码哈希
- `/auth` - 认证信息

## 数据模型

### 联邦链接数据结构
```typescript
{
  upstream: string,
  vhost: string,
  status: string,
  local_connection: string,
  upstream_connection: string
}
```

### 认证尝试数据结构
```typescript
{
  user: string,
  source: string,
  timestamp: string,
  success: boolean,
  error?: string
}
```

## 测试与质量

### 单元测试
- 测试文件: `../../tests/unit/auth.test.mjs`
- Mock 策略: 使用 `mockRabbitHttpRequest` 模拟 API 响应
- 覆盖范围: 所有 6 个工具的基本功能

### 测试用例示例
```javascript
describe('auth tools', () => {
  it('listFederationLinks.handler returns federation links', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ upstream: 'test' }])
    const result = await listFederationLinks.handler({})
    expect(result.content[0].text).toContain('test')
  })
})
```

## 常见问题 (FAQ)

**Q: 联邦链接和认证尝试有什么区别？**
A: 联邦链接用于不同 RabbitMQ 集群间的消息同步，认证尝试记录用户登录成功/失败的历史。

**Q: 密码哈希功能的作用是什么？**
A: 用于生成符合 RabbitMQ 内部哈希算法的密码哈希值，可用于批量用户创建。

**Q: 如何排查认证问题？**
A: 使用 `list-auth-attempts-node` 工具查看特定节点的认证尝试记录，分析失败原因。

## 相关文件清单

### 核心文件
- `auth.ts` - 认证工具实现
- `../../tests/unit/auth.test.mjs` - 单元测试

### 依赖文件
- `../client.js` - HTTP 客户端
- `../types/mcp.js` - 类型定义

## 变更记录 (Changelog)

**2025-10-20 14:52:21** - 初始化模块文档
- 分析认证工具的 6 个功能模块
- 识别联邦链接、认证尝试、密码哈希三大功能领域
- 完成 API 端点和数据模型梳理

---

*此文档由架构师自动生成，包含模块初始化分析结果*