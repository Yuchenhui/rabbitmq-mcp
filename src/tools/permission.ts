import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

export const listPermissions = {
  name: "list-permissions",
  description: "List all permissions in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Permissions",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const permissions = await rabbitHttpRequest("/permissions")
    return { content: [{ type: "text", text: JSON.stringify(permissions, null, 2) } as MCPTextContent] }
  }
}

export const getPermission = {
  name: "get-permission",
  description: "Get permissions for a user in a vhost.",
  params: z.object({ vhost: z.string(), user: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, user: { type: "string" } },
    required: ["vhost", "user"]
  },
  annotations: {
    title: "Get Permission",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, user } = getPermission.params.parse(args)
    const permission = await rabbitHttpRequest(`/permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(user)}`)
    return { content: [{ type: "text", text: JSON.stringify(permission, null, 2) } as MCPTextContent] }
  }
}

export const setPermission = {
  name: "set-permission",
  description: "Set permissions for a user in a vhost.",
  params: z.object({ vhost: z.string(), user: z.string(), configure: z.string(), write: z.string(), read: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      user: { type: "string" },
      configure: { type: "string" },
      write: { type: "string" },
      read: { type: "string" }
    },
    required: ["vhost", "user", "configure", "write", "read"]
  },
  annotations: {
    title: "Set Permission",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, user, configure, write, read } = setPermission.params.parse(args)
    const result = await rabbitHttpRequest(
      `/permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(user)}`,
      "PUT",
      undefined,
      { configure, write, read }
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const deletePermission = {
  name: "delete-permission",
  description: "Delete permissions for a user in a vhost.",
  params: z.object({ vhost: z.string(), user: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, user: { type: "string" } },
    required: ["vhost", "user"]
  },
  annotations: {
    title: "Delete Permission",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, user } = deletePermission.params.parse(args)
    const result = await rabbitHttpRequest(
      `/permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(user)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const listTopicPermissions = {
  name: "list-topic-permissions",
  description: "List all topic permissions in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Topic Permissions",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const topicPermissions = await rabbitHttpRequest("/topic-permissions")
    return { content: [{ type: "text", text: JSON.stringify(topicPermissions, null, 2) } as MCPTextContent] }
  }
}

export const getTopicPermission = {
  name: "get-topic-permission",
  description: "Get topic permissions for a user in a vhost.",
  params: z.object({ vhost: z.string(), user: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, user: { type: "string" } },
    required: ["vhost", "user"]
  },
  annotations: {
    title: "Get Topic Permission",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, user } = getTopicPermission.params.parse(args)
    const topicPermission = await rabbitHttpRequest(`/topic-permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(user)}`)
    return { content: [{ type: "text", text: JSON.stringify(topicPermission, null, 2) } as MCPTextContent] }
  }
}

export const setTopicPermission = {
  name: "set-topic-permission",
  description: "Set topic permissions for a user in a vhost.",
  params: z.object({ vhost: z.string(), user: z.string(), exchange: z.string(), write: z.string(), read: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      user: { type: "string" },
      exchange: { type: "string" },
      write: { type: "string" },
      read: { type: "string" }
    },
    required: ["vhost", "user", "exchange", "write", "read"]
  },
  annotations: {
    title: "Set Topic Permission",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, user, exchange, ...body } = setTopicPermission.params.parse(args)
    const result = await rabbitHttpRequest(
      `/topic-permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(user)}`,
      "PUT",
      undefined,
      { exchange, ...body }
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const deleteTopicPermission = {
  name: "delete-topic-permission",
  description: "Delete topic permissions for a user in a vhost.",
  params: z.object({ vhost: z.string(), user: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, user: { type: "string" } },
    required: ["vhost", "user"]
  },
  annotations: {
    title: "Delete Topic Permission",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, user } = deleteTopicPermission.params.parse(args)
    const result = await rabbitHttpRequest(
      `/topic-permissions/${encodeURIComponent(vhost)}/${encodeURIComponent(user)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const PERMISSION_TOOLS = [
  listPermissions,
  getPermission,
  setPermission,
  deletePermission,
  listTopicPermissions,
  getTopicPermission,
  setTopicPermission,
  deleteTopicPermission
]
