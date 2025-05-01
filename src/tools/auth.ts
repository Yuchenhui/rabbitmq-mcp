import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listFederationLinks = {
  name: "list-federation-links",
  description: "List all federation links in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Federation Links",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const links = await rabbitHttpRequest("/federation-links")
    return { content: [{ type: "text", text: JSON.stringify(links, null, 2) } as MCPTextContent] }
  }
}

const listFederationLinksVhost = {
  name: "list-federation-links-vhost",
  description: "List all federation links for a given vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Federation Links (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { vhost } = args
    const links = await rabbitHttpRequest(`/federation-links/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(links, null, 2) } as MCPTextContent] }
  }
}

const listAuthAttemptsNode = {
  name: "list-auth-attempts-node",
  description: "List all authentication attempts for a node.",
  params: z.object({ node: z.string() }),
  inputSchema: {
    type: "object",
    properties: { node: { type: "string" } },
    required: ["node"]
  },
  annotations: {
    title: "List Auth Attempts (Node)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { node: string }, _extra: any): Promise<MCPToolResult> => {
    const { node } = args
    const attempts = await rabbitHttpRequest(`/auth/attempts/${encodeURIComponent(node)}`)
    return { content: [{ type: "text", text: JSON.stringify(attempts, null, 2) } as MCPTextContent] }
  }
}

const listAuthAttemptsNodeSource = {
  name: "list-auth-attempts-node-source",
  description: "List all authentication attempts for a node/source.",
  params: z.object({ node: z.string() }),
  inputSchema: {
    type: "object",
    properties: { node: { type: "string" } },
    required: ["node"]
  },
  annotations: {
    title: "List Auth Attempts (Node/Source)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { node: string }, _extra: any): Promise<MCPToolResult> => {
    const { node } = args
    const attempts = await rabbitHttpRequest(`/auth/attempts/${encodeURIComponent(node)}/source`)
    return { content: [{ type: "text", text: JSON.stringify(attempts, null, 2) } as MCPTextContent] }
  }
}

const hashPassword = {
  name: "hash-password",
  description: "Hash a password using RabbitMQ's internal hashing.",
  params: z.object({ password: z.string() }),
  inputSchema: {
    type: "object",
    properties: { password: { type: "string" } },
    required: ["password"]
  },
  annotations: {
    title: "Hash Password",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { password: string }, _extra: any): Promise<MCPToolResult> => {
    const { password } = args
    const hash = await rabbitHttpRequest(`/auth/hash_password/${encodeURIComponent(password)}`)
    return { content: [{ type: "text", text: JSON.stringify(hash, null, 2) } as MCPTextContent] }
  }
}

const getAuthInfo = {
  name: "get-auth-info",
  description: "Get authentication info for the current user.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Get Auth Info",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const info = await rabbitHttpRequest("/auth")
    return { content: [{ type: "text", text: JSON.stringify(info, null, 2) } as MCPTextContent] }
  }
}

export const AUTH_TOOLS = [
  listFederationLinks,
  listFederationLinksVhost,
  listAuthAttemptsNode,
  listAuthAttemptsNodeSource,
  hashPassword,
  getAuthInfo
]
