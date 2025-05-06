import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listExchanges = {
  name: "list-exchanges",
  description: "List all exchanges in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Exchanges",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const exchanges = await rabbitHttpRequest("/exchanges")
    return { content: [{ type: "text", text: JSON.stringify(exchanges, null, 2) } as MCPTextContent] }
  }
}

const listExchangesVhost = {
  name: "list-exchanges-vhost",
  description: "List all exchanges for a specific vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Exchanges (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost } = listExchangesVhost.params.parse(args)
    const exchanges = await rabbitHttpRequest(`/exchanges/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(exchanges, null, 2) } as MCPTextContent] }
  }
}

const getExchange = {
  name: "get-exchange",
  description: "Get details for a specific exchange.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Get Exchange Details",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = getExchange.params.parse(args)
    const exchange = await rabbitHttpRequest(`/exchanges/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(exchange, null, 2) } as MCPTextContent] }
  }
}

const putExchange = {
  name: "put-exchange",
  description: "Create or update an exchange.",
  params: z.object({
    vhost: z.string(),
    name: z.string(),
    type: z.string(),
    durable: z.boolean().optional(),
    auto_delete: z.boolean().optional(),
    internal: z.boolean().optional(),
    arguments: z.record(z.any()).optional()
  }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" },
      type: { type: "string" },
      durable: { type: "boolean", default: true },
      auto_delete: { type: "boolean", default: false },
      internal: { type: "boolean", default: false },
      arguments: { type: "object", additionalProperties: true }
    },
    required: ["vhost", "name", "type"]
  },
  annotations: {
    title: "Create or Update Exchange",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name, ...body } = putExchange.params.parse(args)
    const result = await rabbitHttpRequest(
      `/exchanges/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      body
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteExchange = {
  name: "delete-exchange",
  description: "Delete an exchange.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Delete Exchange",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = deleteExchange.params.parse(args)
    const result = await rabbitHttpRequest(
      `/exchanges/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getExchangeBindingsSource = {
  name: "get-exchange-bindings-source",
  description: "List bindings from an exchange (source).",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "List Exchange Bindings (Source)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = getExchangeBindingsSource.params.parse(args)
    const bindings = await rabbitHttpRequest(`/exchanges/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}/bindings/source`)
    return { content: [{ type: "text", text: JSON.stringify(bindings, null, 2) } as MCPTextContent] }
  }
}

const getExchangeBindingsDestination = {
  name: "get-exchange-bindings-destination",
  description: "List bindings to an exchange (destination).",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "List Exchange Bindings (Destination)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = getExchangeBindingsDestination.params.parse(args)
    const bindings = await rabbitHttpRequest(`/exchanges/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}/bindings/destination`)
    return { content: [{ type: "text", text: JSON.stringify(bindings, null, 2) } as MCPTextContent] }
  }
}

export const EXCHANGE_TOOLS = [
  listExchanges,
  listExchangesVhost,
  getExchange,
  putExchange,
  deleteExchange,
  getExchangeBindingsSource,
  getExchangeBindingsDestination
]