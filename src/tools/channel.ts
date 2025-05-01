import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listChannels = {
  name: "list-channels",
  description: "List all channels in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Channels",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const channels = await rabbitHttpRequest("/channels")
    return { content: [{ type: "text", text: JSON.stringify(channels, null, 2) } as MCPTextContent] }
  }
}

const getChannel = {
  name: "get-channel",
  description: "Get details for a specific channel.",
  params: z.object({ name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Channel Details",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const channel = await rabbitHttpRequest(`/channels/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(channel, null, 2) } as MCPTextContent] }
  }
}

const listChannelsConnection = {
  name: "list-channels-connection",
  description: "List all channels for a given connection.",
  params: z.object({ name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "List Channels (Connection)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const channels = await rabbitHttpRequest(`/connections/${encodeURIComponent(name)}/channels`)
    return { content: [{ type: "text", text: JSON.stringify(channels, null, 2) } as MCPTextContent] }
  }
}

export const CHANNEL_TOOLS = [
  listChannels,
  getChannel,
  listChannelsConnection
]