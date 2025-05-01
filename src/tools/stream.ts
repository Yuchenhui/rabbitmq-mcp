import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listStreamConnections = {
  name: "list-stream-connections",
  description: "List all stream connections in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Stream Connections",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const connections = await rabbitHttpRequest("/stream/connections")
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const listStreamConnectionsVhost = {
  name: "list-stream-connections-vhost",
  description: "List all stream connections for a given vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Stream Connections (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const connections = await rabbitHttpRequest(`/stream/connections/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const getStreamConnection = {
  name: "get-stream-connection",
  description: "Get details for a specific stream connection in a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Get Stream Connection",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, name } = args
    const connection = await rabbitHttpRequest(`/stream/connections/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(connection, null, 2) } as MCPTextContent] }
  }
}

const getStreamConnectionPublishers = {
  name: "get-stream-connection-publishers",
  description: "Get all publishers for a specific stream connection in a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Get Stream Connection Publishers",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, name } = args
    const publishers = await rabbitHttpRequest(`/stream/connections/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}/publishers`)
    return { content: [{ type: "text", text: JSON.stringify(publishers, null, 2) } as MCPTextContent] }
  }
}

const getStreamConnectionConsumers = {
  name: "get-stream-connection-consumers",
  description: "Get all consumers for a specific stream connection in a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Get Stream Connection Consumers",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, name } = args
    const consumers = await rabbitHttpRequest(`/stream/connections/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}/consumers`)
    return { content: [{ type: "text", text: JSON.stringify(consumers, null, 2) } as MCPTextContent] }
  }
}

const deleteStreamConnection = {
  name: "delete-stream-connection",
  description: "Delete a specific stream connection in a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Delete Stream Connection",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, name } = args
    const result = await rabbitHttpRequest(`/stream/connections/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`, "DELETE")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listStreamPublishers = {
  name: "list-stream-publishers",
  description: "List all stream publishers in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Stream Publishers",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const publishers = await rabbitHttpRequest("/stream/publishers")
    return { content: [{ type: "text", text: JSON.stringify(publishers, null, 2) } as MCPTextContent] }
  }
}

const listStreamPublishersVhost = {
  name: "list-stream-publishers-vhost",
  description: "List all stream publishers for a given vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Stream Publishers (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const publishers = await rabbitHttpRequest(`/stream/publishers/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(publishers, null, 2) } as MCPTextContent] }
  }
}

const listStreamPublishersVhostStream = {
  name: "list-stream-publishers-vhost-stream",
  description: "List all stream publishers for a stream in a vhost.",
  params: z.object({ vhost: z.string(), stream: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, stream: { type: "string" } },
    required: ["vhost", "stream"]
  },
  annotations: {
    title: "List Stream Publishers (Vhost/Stream)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; stream: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, stream } = args
    const publishers = await rabbitHttpRequest(`/stream/publishers/${encodeURIComponent(vhost)}/${encodeURIComponent(stream)}`)
    return { content: [{ type: "text", text: JSON.stringify(publishers, null, 2) } as MCPTextContent] }
  }
}

const listStreamConsumers = {
  name: "list-stream-consumers",
  description: "List all stream consumers in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Stream Consumers",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const consumers = await rabbitHttpRequest("/stream/consumers")
    return { content: [{ type: "text", text: JSON.stringify(consumers, null, 2) } as MCPTextContent] }
  }
}

const listStreamConsumersVhost = {
  name: "list-stream-consumers-vhost",
  description: "List all stream consumers for a given vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Stream Consumers (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const consumers = await rabbitHttpRequest(`/stream/consumers/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(consumers, null, 2) } as MCPTextContent] }
  }
}

export const STREAM_TOOLS = [
  listStreamConnections,
  listStreamConnectionsVhost,
  getStreamConnection,
  getStreamConnectionPublishers,
  getStreamConnectionConsumers,
  deleteStreamConnection,
  listStreamPublishers,
  listStreamPublishersVhost,
  listStreamPublishersVhostStream,
  listStreamConsumers,
  listStreamConsumersVhost
]
