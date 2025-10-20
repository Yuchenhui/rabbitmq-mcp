import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

/**
 * 通用 RabbitMQ HTTP API 调用工具
 * 支持调用任意 RabbitMQ HTTP API 端点
 */
export const customApi = {
  name: "rabbitmq-custom-api",
  description: "通用的 RabbitMQ HTTP API 调用工具，支持调用任意 RabbitMQ HTTP API 端点",
  params: z.object({
    // API 路径，如 "/queues", "/exchanges", "/vhosts" 等
    path: z.string()
      .min(1, "API 路径不能为空")
      .startsWith("/", "API 路径必须以 / 开头")
      .describe("RabbitMQ HTTP API 路径，例如：/queues, /exchanges/my-vhost/my-exchange"),

    // HTTP 方法
    method: z.enum(["GET", "POST", "PUT", "DELETE"])
      .default("GET")
      .describe("HTTP 方法：GET（查询）、POST（创建）、PUT（更新）、DELETE（删除）"),

    // 请求体（可选）
    body: z.any()
      .optional()
      .describe("请求体数据（JSON 对象），用于 POST 和 PUT 请求"),

    // 查询参数（可选）
    query: z.record(z.string(), z.any())
      .optional()
      .describe("查询参数对象，会自动编码为 URL 查询字符串"),

    // 内容类型（可选）
    contentType: z.string()
      .default("application/json")
      .describe("请求内容类型，默认为 application/json")
  }),
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "RabbitMQ HTTP API 路径，例如：/queues, /exchanges/my-vhost/my-exchange"
      },
      method: {
        type: "string",
        enum: ["GET", "POST", "PUT", "DELETE"],
        default: "GET",
        description: "HTTP 方法：GET（查询）、POST（创建）、PUT（更新）、DELETE（删除）"
      },
      body: {
        description: "请求体数据（JSON 对象），用于 POST 和 PUT 请求"
      },
      query: {
        type: "object",
        description: "查询参数对象，会自动编码为 URL 查询字符串"
      },
      contentType: {
        type: "string",
        default: "application/json",
        description: "请求内容类型，默认为 application/json"
      }
    },
    required: ["path"]
  },
  annotations: {
    title: "RabbitMQ Custom API",
    readOnlyHint: false, // 支持写操作
    openWorldHint: true // 可以调用任意 API
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { path, method, body, query, contentType } = customApi.params.parse(args)

    try {
      // 构建完整的 API 路径
      let apiPath = path

      // 添加查询参数
      if (query && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(query)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        }
        const queryString = searchParams.toString()
        if (queryString) {
          apiPath += `?${queryString}`
        }
      }

      // 准备请求选项
      const requestOptions: {
        method: string
        body?: string
        headers?: Record<string, string>
      } = {
        method: method.toUpperCase()
      }

      // 添加请求体
      if (body && (method === "POST" || method === "PUT")) {
        if (contentType === "application/json") {
          requestOptions.body = JSON.stringify(body)
          requestOptions.headers = {
            "Content-Type": "application/json"
          }
        } else {
          // 对于非 JSON 内容类型，直接使用字符串
          requestOptions.body = String(body)
          requestOptions.headers = {
            "Content-Type": contentType
          }
        }
      }

      // 调用 RabbitMQ HTTP API
      const result = await rabbitHttpRequest(
        apiPath,
        requestOptions.method as any,
        undefined, // queryParams
        requestOptions.body ? JSON.parse(requestOptions.body) : undefined,
        requestOptions.headers
      )

      // 格式化响应
      let responseText: string
      try {
        responseText = JSON.stringify(result, null, 2)
      } catch {
        // 如果结果不是 JSON 对象，直接转换为字符串
        responseText = String(result)
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              method: method.toUpperCase(),
              path: apiPath,
              result: result
            }, null, 2)
          } as MCPTextContent
        ]
      }

    } catch (error) {
      // 错误处理
      let errorMessage: string
      let statusCode: number | undefined

      if (error instanceof Error) {
        errorMessage = error.message
        // 尝试从错误消息中提取 HTTP 状态码
        const statusCodeMatch = error.message.match(/HTTP (\d{3})/)
        if (statusCodeMatch) {
          statusCode = parseInt(statusCodeMatch[1], 10)
        }
      } else {
        errorMessage = String(error)
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: errorMessage,
              statusCode,
              method: method.toUpperCase(),
              path: path,
              hint: "请检查 API 路径、参数和权限是否正确"
            }, null, 2)
          } as MCPTextContent
        ],
        isError: true
      }
    }
  }
}

// 导出工具
export const CUSTOM_API_TOOLS = [customApi] as const