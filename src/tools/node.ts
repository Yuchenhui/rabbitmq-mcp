import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

export const listNodes = {
  name: "list-nodes",
  description: "List all nodes in the RabbitMQ cluster with their metrics",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Nodes",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const nodes = await rabbitHttpRequest("/nodes")
    return { content: [{ type: "text", text: JSON.stringify(nodes, null, 2) } as MCPTextContent] }
  }
}

export const getNode = {
  name: "get-node",
  description: "Get metrics of an individual cluster node",
  params: z.object({ name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Node Details",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { name } = getNode.params.parse(args)
    const node = await rabbitHttpRequest(`/nodes/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(node, null, 2) } as MCPTextContent] }
  }
}

export const getNodeMemory = {
  name: "get-node-memory",
  description: "Get memory usage breakdown of a specific cluster node",
  params: z.object({ name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Node Memory Breakdown",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { name } = getNodeMemory.params.parse(args)
    const memory = await rabbitHttpRequest(`/nodes/${encodeURIComponent(name)}/memory`)
    return { content: [{ type: "text", text: JSON.stringify(memory, null, 2) } as MCPTextContent] }
  }
}

export const NODE_TOOLS = [
  listNodes,
  getNode,
  getNodeMemory
]
