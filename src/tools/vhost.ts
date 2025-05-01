import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listVhosts = {
  name: "list-vhosts",
  description: "List all virtual hosts in the cluster",
  params: {},
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Vhosts",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const vhosts = await rabbitHttpRequest("/vhosts")
    return { content: [{ type: "text", text: JSON.stringify(vhosts, null, 2) } as MCPTextContent] }
  }
}

const getVhost = {
  name: "get-vhost",
  description: "Get details for a specific virtual host",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Vhost Details",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const vhost = await rabbitHttpRequest(`/vhosts/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(vhost, null, 2) } as MCPTextContent] }
  }
}

const putVhost = {
  name: "put-vhost",
  description: "Create or update a virtual host",
  params: {
    name: z.string(),
    description: z.string().optional(),
    tags: z.string().optional(),
    default_queue_type: z.enum(["classic", "quorum", "stream"]).optional(),
    protected_from_deletion: z.boolean().optional(),
    tracing: z.boolean().optional()
  },
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      tags: { type: "string" },
      default_queue_type: { type: "string", enum: ["classic", "quorum", "stream"] },
      protected_from_deletion: { type: "boolean" },
      tracing: { type: "boolean" }
    },
    required: ["name"]
  },
  annotations: {
    title: "Create or Update Vhost",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string; [key: string]: any }, _extra: any): Promise<MCPToolResult> => {
    const { name, ...body } = args
    const result = await rabbitHttpRequest(
      `/vhosts/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      Object.keys(body).length > 0 ? body : undefined
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteVhost = {
  name: "delete-vhost",
  description: "Delete a virtual host",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Delete Vhost",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const result = await rabbitHttpRequest(
      `/vhosts/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getVhostPermissions = {
  name: "get-vhost-permissions",
  description: "List all permissions for a given virtual host",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "List Vhost Permissions",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const perms = await rabbitHttpRequest(`/vhosts/${encodeURIComponent(name)}/permissions`)
    return { content: [{ type: "text", text: JSON.stringify(perms, null, 2) } as MCPTextContent] }
  }
}

const getVhostTopicPermissions = {
  name: "get-vhost-topic-permissions",
  description: "List all topic permissions for a given virtual host",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "List Vhost Topic Permissions",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const perms = await rabbitHttpRequest(`/vhosts/${encodeURIComponent(name)}/topic-permissions`)
    return { content: [{ type: "text", text: JSON.stringify(perms, null, 2) } as MCPTextContent] }
  }
}

const protectVhost = {
  name: "protect-vhost",
  description: "Protect a virtual host from deletion",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Protect Vhost from Deletion",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const result = await rabbitHttpRequest(
      `/vhosts/${encodeURIComponent(name)}/deletion/protection`,
      "POST"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const unprotectVhost = {
  name: "unprotect-vhost",
  description: "Remove deletion protection from a virtual host",
  params: { name: z.string() },
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Unprotect Vhost from Deletion",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const result = await rabbitHttpRequest(
      `/vhosts/${encodeURIComponent(name)}/deletion/protection`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const startVhostOnNode = {
  name: "start-vhost-on-node",
  description: "Start or restart a virtual host on a node",
  params: { name: z.string(), node: z.string() },
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      node: { type: "string" }
    },
    required: ["name", "node"]
  },
  annotations: {
    title: "Start Vhost on Node",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string; node: string }, _extra: any): Promise<MCPToolResult> => {
    const { name, node } = args
    const result = await rabbitHttpRequest(
      `/vhosts/${encodeURIComponent(name)}/start/${encodeURIComponent(node)}`,
      "POST"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listVhostLimits = {
  name: "list-vhost-limits",
  description: "List all vhost limits in the RabbitMQ cluster.",
  params: {},
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Vhost Limits",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const limits = await rabbitHttpRequest("/vhost-limits")
    return { content: [{ type: "text", text: JSON.stringify(limits, null, 2) } as MCPTextContent] }
  }
}

const listVhostLimitsVhost = {
  name: "list-vhost-limits-vhost",
  description: "List all vhost limits for a specific vhost.",
  params: { vhost: z.string() },
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Vhost Limits (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const limits = await rabbitHttpRequest(`/vhost-limits/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(limits, null, 2) } as MCPTextContent] }
  }
}

const putVhostLimit = {
  name: "put-vhost-limit",
  description: "Set a vhost limit for a vhost.",
  params: { vhost: z.string(), name: z.string(), value: z.any() },
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" },
      value: {}
    },
    required: ["vhost", "name", "value"]
  },
  annotations: {
    title: "Set Vhost Limit",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; name: string; value: any }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, name, value } = args
    const result = await rabbitHttpRequest(
      `/vhost-limits/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      { value }
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteVhostLimit = {
  name: "delete-vhost-limit",
  description: "Delete a vhost limit for a vhost.",
  params: { vhost: z.string(), name: z.string() },
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Delete Vhost Limit",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost, name } = args
    const result = await rabbitHttpRequest(
      `/vhost-limits/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const VHOST_TOOLS = [
  listVhosts,
  getVhost,
  putVhost,
  deleteVhost,
  getVhostPermissions,
  getVhostTopicPermissions,
  protectVhost,
  unprotectVhost,
  startVhostOnNode,
  listVhostLimits,
  listVhostLimitsVhost,
  putVhostLimit,
  deleteVhostLimit
]
