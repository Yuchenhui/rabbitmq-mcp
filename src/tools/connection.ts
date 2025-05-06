import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listConnections = {
  name: "list-connections",
  description: "List all open connections.",
  params: z.object({}),
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
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const connections = await rabbitHttpRequest("/connections")
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const getConnection = {
  name: "get-connection",
  description: "Get details for a specific connection.",
  params: z.object({ name: z.string() }),
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
  handler: async (args: any): Promise<MCPToolResult> => {
    const { name } = getConnection.params.parse(args)
    const connection = await rabbitHttpRequest(`/connections/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(connection, null, 2) } as MCPTextContent] }
  }
}

const deleteConnection = {
  name: "delete-connection",
  description: "Close a specific connection.",
  params: z.object({ name: z.string(), reason: z.string().optional() }),
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
  handler: async (args: any): Promise<MCPToolResult> => {
    const { name, reason } = deleteConnection.params.parse(args)
    const result = await rabbitHttpRequest(
      `/connections/${encodeURIComponent(name)}`,
      "DELETE",
      undefined,
      undefined,
      reason ? { "X-Reason": reason } : undefined
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listConnectionsVhost = {
  name: "list-connections-vhost",
  description: "List all open connections in a specific virtual host.",
  params: z.object({ vhost: z.string() }),
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
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost } = listConnectionsVhost.params.parse(args)
    const connections = await rabbitHttpRequest(`/vhosts/${encodeURIComponent(vhost)}/connections`)
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const listConnectionsUsername = {
  name: "list-connections-username",
  description: "List all open connections for a specific username.",
  params: z.object({ username: z.string() }),
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
  handler: async (args: any): Promise<MCPToolResult> => {
    const { username } = listConnectionsUsername.params.parse(args)
    const connections = await rabbitHttpRequest(`/connections/username/${encodeURIComponent(username)}`)
    return { content: [{ type: "text", text: JSON.stringify(connections, null, 2) } as MCPTextContent] }
  }
}

const deleteConnectionsUsername = {
  name: "delete-connections-username",
  description: "Close all connections for a specific username. Optionally provide a reason.",
  params: z.object({
    username: z.string(),
    reason: z.string().optional()
  }),
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
  handler: async (args: any): Promise<MCPToolResult> => {
    const { username, reason } = deleteConnectionsUsername.params.parse(args)
    const result = await rabbitHttpRequest(
      `/connections/username/${encodeURIComponent(username)}`,
      "DELETE",
      undefined,
      undefined,
      reason ? { "X-Reason": reason } : undefined
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getConnectionChannels = {
  name: "get-connection-channels",
  description: "List all channels for a given connection.",
  params: z.object({ name: z.string() }),
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
  handler: async (args: any): Promise<MCPToolResult> => {
    const { name } = getConnectionChannels.params.parse(args)
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