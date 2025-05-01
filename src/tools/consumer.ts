import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listConsumers = {
  name: "list-consumers",
  description: "List all consumers in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Consumers",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const consumers = await rabbitHttpRequest("/consumers")
    return { content: [{ type: "text", text: JSON.stringify(consumers, null, 2) } as MCPTextContent] }
  }
}

const listConsumersVhost = {
  name: "list-consumers-vhost",
  description: "List all consumers for a specific vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Consumers (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const consumers = await rabbitHttpRequest(`/consumers/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(consumers, null, 2) } as MCPTextContent] }
  }
}

const listConsumersQueue = {
  name: "list-consumers-queue",
  description: "List all consumers for a specific queue.",
  params: z.object({ vhost: z.string(), queue: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      queue: { type: "string" }
    },
    required: ["vhost", "queue"]
  },
  annotations: {
    title: "List Consumers (Queue)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; queue: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, queue } = args
    const consumers = await rabbitHttpRequest(`/queues/${encodeURIComponent(vhost)}/${encodeURIComponent(queue)}/consumers`)
    return { content: [{ type: "text", text: JSON.stringify(consumers, null, 2) } as MCPTextContent] }
  }
}

export const CONSUMER_TOOLS = [
  listConsumers,
  listConsumersVhost,
  listConsumersQueue
]