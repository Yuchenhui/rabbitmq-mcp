import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listConnections = {
  name: "list-connections",
  description: "List all open connections.",
  params: {},
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Connections",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const connections = await rabbitHttpRequest("/connections")
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const getConnection = {
  name: "get-connection",
  description: "Get details for a specific connection.",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Connection Details",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const connection = await rabbitHttpRequest(`/connections/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(connection, null, 2) } as MCPTextContent] }
  }
}

// Helper for DELETE with X-Reason header
async function deleteWithReason(endpoint: string, reason?: string): Promise<any> {
  const { hostname, port, basePath, username, password } = {
    hostname: process.env.RABBITMQ_HOST || "localhost",
    port: Number(process.env.RABBITMQ_MANAGEMENT_PORT) || 443,
    basePath: "/api",
    username: process.env.RABBITMQ_USERNAME || "guest",
    password: process.env.RABBITMQ_PASSWORD || "guest"
  }
  const url = `https://${hostname}:${port}${basePath}${endpoint}`
  const auth = Buffer.from(`${username}:${password}`).toString("base64")
  const headers: Record<string, string> = {
    "Authorization": `Basic ${auth}`,
    "Accept": "application/json"
  }
  if (reason) headers["X-Reason"] = reason
  const res = await fetch(url, {
    method: "DELETE",
    headers
  })
  const text = await res.text()
  if (res.ok) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } else {
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
}

const deleteConnection = {
  name: "delete-connection",
  description: "Close a specific connection.",
  params: { name: z.string(), reason: z.string().optional() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" }, reason: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Delete Connection",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string; reason?: string }, _extra: any): Promise<MCPToolResult> => {
    const { name, reason } = args
    const result = await deleteWithReason(`/connections/${encodeURIComponent(name)}`, reason)
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listConnectionsVhost = {
  name: "list-connections-vhost",
  description: "List all open connections in a specific virtual host.",
  params: { vhost: z.string() },
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Connections (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const connections = await rabbitHttpRequest(`/vhosts/${encodeURIComponent(vhost)}/connections`)
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const listConnectionsUsername = {
  name: "list-connections-username",
  description: "List all open connections for a specific username.",
  params: { username: z.string() },
  inputSchema: {
    type: "object",
    properties: { username: { type: "string" } },
    required: ["username"]
  },
  annotations: {
    title: "List Connections (Username)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { username: string }, _extra: any): Promise<MCPToolResult> => {
    const { username } = args
    const connections = await rabbitHttpRequest(`/connections/username/${encodeURIComponent(username)}`)
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const deleteConnectionsUsername = {
  name: "delete-connections-username",
  description: "Close all connections for a specific username. Optionally provide a reason.",
  params: {
    username: z.string(),
    reason: z.string().optional()
  },
  inputSchema: {
    type: "object",
    properties: {
      username: { type: "string" },
      reason: { type: "string" }
    },
    required: ["username"]
  },
  annotations: {
    title: "Delete Connections (Username)",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { username: string; reason?: string }, _extra: any): Promise<MCPToolResult> => {
    const { username, reason } = args
    const result = await deleteWithReason(`/connections/username/${encodeURIComponent(username)}`, reason)
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getConnectionChannels = {
  name: "get-connection-channels",
  description: "List all channels for a given connection.",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Connection Channels",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const channels = await rabbitHttpRequest(`/connections/${encodeURIComponent(name)}/channels`)
    return { content: [{ type: "text", text: JSON.stringify(channels, null, 2) } as MCPTextContent] }
  }
}

export const CONNECTION_TOOLS = [
  listConnections,
  getConnection,
  deleteConnection,
  listConnectionsVhost,
  listConnectionsUsername,
  deleteConnectionsUsername,
  getConnectionChannels
]