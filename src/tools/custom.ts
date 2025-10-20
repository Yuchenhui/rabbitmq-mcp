import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

/**
 * Universal RabbitMQ HTTP API tool
 * Supports calling any RabbitMQ HTTP API endpoint
 */
export const customApi = {
  name: "rabbitmq-custom-api",
  description: "Universal RabbitMQ HTTP API tool for calling any RabbitMQ HTTP API endpoint",
  params: z.object({
    // API path, e.g., "/queues", "/exchanges", "/vhosts" etc.
    path: z.string()
      .min(1, "API path cannot be empty")
      .startsWith("/", "API path must start with /")
      .describe("RabbitMQ HTTP API path, e.g., /queues, /exchanges/my-vhost/my-exchange"),

    // HTTP method
    method: z.enum(["GET", "POST", "PUT", "DELETE"])
      .default("GET")
      .describe("HTTP method: GET (query), POST (create), PUT (update), DELETE (delete)"),

    // Request body (optional)
    body: z.any()
      .optional()
      .describe("Request body data (JSON object), used for POST and PUT requests"),

    // Query parameters (optional)
    query: z.record(z.string(), z.any())
      .optional()
      .describe("Query parameters object, automatically URL-encoded"),

    // Content type (optional)
    contentType: z.string()
      .default("application/json")
      .describe("Request content type, defaults to application/json")
  }),
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "RabbitMQ HTTP API path, e.g., /queues, /exchanges/my-vhost/my-exchange"
      },
      method: {
        type: "string",
        enum: ["GET", "POST", "PUT", "DELETE"],
        default: "GET",
        description: "HTTP method: GET (query), POST (create), PUT (update), DELETE (delete)"
      },
      body: {
        description: "Request body data (JSON object), used for POST and PUT requests"
      },
      query: {
        type: "object",
        description: "Query parameters object, automatically URL-encoded"
      },
      contentType: {
        type: "string",
        default: "application/json",
        description: "Request content type, defaults to application/json"
      }
    },
    required: ["path"]
  },
  annotations: {
    title: "RabbitMQ Custom API",
    readOnlyHint: false, // Supports write operations
    openWorldHint: true // Can call any API
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { path, method, body, query, contentType } = customApi.params.parse(args)

    try {
      // Build complete API path
      let apiPath = path

      // Add query parameters
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

      // Prepare request options
      const requestOptions: {
        method: string
        body?: string
        headers?: Record<string, string>
      } = {
        method: method.toUpperCase()
      }

      // Add request body
      if (body && (method === "POST" || method === "PUT")) {
        if (contentType === "application/json") {
          requestOptions.body = JSON.stringify(body)
          requestOptions.headers = {
            "Content-Type": "application/json"
          }
        } else {
          // For non-JSON content types, use string directly
          requestOptions.body = String(body)
          requestOptions.headers = {
            "Content-Type": contentType
          }
        }
      }

      // Call RabbitMQ HTTP API
      const requestBody = requestOptions.body ? JSON.parse(requestOptions.body) : undefined
      const result = await rabbitHttpRequest(
        apiPath,
        requestOptions.method as any,
        undefined, // queryParams
        requestBody,
        requestOptions.headers
      )

      // Format response
      let responseText: string
      try {
        responseText = JSON.stringify(result, null, 2)
      } catch {
        // If result is not a JSON object, convert to string directly
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
      // Error handling
      let errorMessage: string
      let statusCode: number | undefined

      if (error instanceof Error) {
        errorMessage = error.message
        // Try to extract HTTP status code from error message
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
              hint: "Please check API path, parameters, and permissions"
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