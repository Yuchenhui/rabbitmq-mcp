import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listBindings = {
  name: "list-bindings",
  description: "List all bindings in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Bindings",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const bindings = await rabbitHttpRequest("/bindings")
    return { content: [{ type: "text", text: JSON.stringify(bindings, null, 2) } as MCPTextContent] }
  }
}

const listBindingsVhost = {
  name: "list-bindings-vhost",
  description: "List all bindings for a specific vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Bindings (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost } = listBindingsVhost.params.parse(args)
    const bindings = await rabbitHttpRequest(`/bindings/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(bindings, null, 2) } as MCPTextContent] }
  }
}

const listBindingsExchangeQueue = {
  name: "list-bindings-exchange-queue",
  description: "List bindings between an exchange and a queue.",
  params: z.object({ vhost: z.string(), exchange: z.string(), queue: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      exchange: { type: "string" },
      queue: { type: "string" }
    },
    required: ["vhost", "exchange", "queue"]
  },
  annotations: {
    title: "List Bindings (Exchange-Queue)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, exchange, queue } = listBindingsExchangeQueue.params.parse(args)
    const bindings = await rabbitHttpRequest(`/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(exchange)}/q/${encodeURIComponent(queue)}`)
    return { content: [{ type: "text", text: JSON.stringify(bindings, null, 2) } as MCPTextContent] }
  }
}

const createBindingExchangeQueue = {
  name: "create-binding-exchange-queue",
  description: "Create a binding from an exchange to a queue.",
  params: z.object({
    vhost: z.string(),
    exchange: z.string(),
    queue: z.string(),
    routing_key: z.string().optional(),
    arguments: z.record(z.any()).optional()
  }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      exchange: { type: "string" },
      queue: { type: "string" },
      routing_key: { type: "string" },
      arguments: { type: "object", additionalProperties: true }
    },
    required: ["vhost", "exchange", "queue"]
  },
  annotations: {
    title: "Create Binding (Exchange-Queue)",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, exchange, queue, ...body } = createBindingExchangeQueue.params.parse(args)
    const result = await rabbitHttpRequest(
      `/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(exchange)}/q/${encodeURIComponent(queue)}`,
      "POST",
      undefined,
      body
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteBindingExchangeQueue = {
  name: "delete-binding-exchange-queue",
  description: "Delete a binding from an exchange to a queue.",
  params: z.object({ vhost: z.string(), exchange: z.string(), queue: z.string(), props: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      exchange: { type: "string" },
      queue: { type: "string" },
      props: { type: "string" }
    },
    required: ["vhost", "exchange", "queue", "props"]
  },
  annotations: {
    title: "Delete Binding (Exchange-Queue)",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, exchange, queue, props } = deleteBindingExchangeQueue.params.parse(args)
    const result = await rabbitHttpRequest(
      `/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(exchange)}/q/${encodeURIComponent(queue)}/${encodeURIComponent(props)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listBindingsExchangeExchange = {
  name: "list-bindings-exchange-exchange",
  description: "List bindings between two exchanges.",
  params: z.object({ vhost: z.string(), source: z.string(), destination: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      source: { type: "string" },
      destination: { type: "string" }
    },
    required: ["vhost", "source", "destination"]
  },
  annotations: {
    title: "List Bindings (Exchange-Exchange)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, source, destination } = listBindingsExchangeExchange.params.parse(args)
    const bindings = await rabbitHttpRequest(`/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(source)}/e/${encodeURIComponent(destination)}`)
    return { content: [{ type: "text", text: JSON.stringify(bindings, null, 2) } as MCPTextContent] }
  }
}

const createBindingExchangeExchange = {
  name: "create-binding-exchange-exchange",
  description: "Create a binding from one exchange to another.",
  params: z.object({
    vhost: z.string(),
    source: z.string(),
    destination: z.string(),
    routing_key: z.string().optional(),
    arguments: z.record(z.any()).optional()
  }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      source: { type: "string" },
      destination: { type: "string" },
      routing_key: { type: "string" },
      arguments: { type: "object", additionalProperties: true }
    },
    required: ["vhost", "source", "destination"]
  },
  annotations: {
    title: "Create Binding (Exchange-Exchange)",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, source, destination, ...body } = createBindingExchangeExchange.params.parse(args)
    const result = await rabbitHttpRequest(
      `/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(source)}/e/${encodeURIComponent(destination)}`,
      "POST",
      undefined,
      body
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteBindingExchangeExchange = {
  name: "delete-binding-exchange-exchange",
  description: "Delete a binding from one exchange to another.",
  params: z.object({ vhost: z.string(), source: z.string(), destination: z.string(), props: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      source: { type: "string" },
      destination: { type: "string" },
      props: { type: "string" }
    },
    required: ["vhost", "source", "destination", "props"]
  },
  annotations: {
    title: "Delete Binding (Exchange-Exchange)",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, source, destination, props } = deleteBindingExchangeExchange.params.parse(args)
    const result = await rabbitHttpRequest(
      `/bindings/${encodeURIComponent(vhost)}/e/${encodeURIComponent(source)}/e/${encodeURIComponent(destination)}/${encodeURIComponent(props)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const BINDING_TOOLS = [
  listBindings,
  listBindingsVhost,
  listBindingsExchangeQueue,
  createBindingExchangeQueue,
  deleteBindingExchangeQueue,
  listBindingsExchangeExchange,
  createBindingExchangeExchange,
  deleteBindingExchangeExchange
]
