import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

// GET /api/health/checks/alarms
const getHealthAlarms = {
  name: "get-health-alarms",
  description: "Get health check status for alarms.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Health Check: Alarms",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/health/checks/alarms")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getHealthLocalAlarms = {
  name: "get-health-local-alarms",
  description: "Get health check status for local alarms.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Health Check: Local Alarms",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/health/checks/local-alarms")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getHealthCertificateExpiration = {
  name: "get-health-certificate-expiration",
  description: "Get health check status for certificate expiration within a given time.",
  params: z.object({ within: z.string(), unit: z.string() }),
  inputSchema: {
    type: "object",
    properties: { within: { type: "string" }, unit: { type: "string" } },
    required: ["within", "unit"]
  },
  annotations: {
    title: "Health Check: Certificate Expiration",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { within: string; unit: string }, _extra: any): Promise<MCPToolResult> => {
    const { within, unit } = args
    const result = await rabbitHttpRequest(`/health/checks/certificate-expiration/${encodeURIComponent(within)}/${encodeURIComponent(unit)}`)
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getHealthPortListener = {
  name: "get-health-port-listener",
  description: "Get health check status for a port listener.",
  params: z.object({ port: z.string() }),
  inputSchema: {
    type: "object",
    properties: { port: { type: "string" } },
    required: ["port"]
  },
  annotations: {
    title: "Health Check: Port Listener",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { port: string }, _extra: any): Promise<MCPToolResult> => {
    const { port } = args
    const result = await rabbitHttpRequest(`/health/checks/port-listener/${encodeURIComponent(port)}`)
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getHealthProtocolListener = {
  name: "get-health-protocol-listener",
  description: "Get health check status for a protocol listener.",
  params: z.object({ protocol: z.string() }),
  inputSchema: {
    type: "object",
    properties: { protocol: { type: "string" } },
    required: ["protocol"]
  },
  annotations: {
    title: "Health Check: Protocol Listener",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { protocol: string }, _extra: any): Promise<MCPToolResult> => {
    const { protocol } = args
    const result = await rabbitHttpRequest(`/health/checks/protocol-listener/${encodeURIComponent(protocol)}`)
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getHealthVirtualHosts = {
  name: "get-health-virtual-hosts",
  description: "Get health check status for all virtual hosts.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Health Check: Virtual Hosts",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/health/checks/virtual-hosts")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getHealthNodeIsQuorumCritical = {
  name: "get-health-node-is-quorum-critical",
  description: "Get health check status for node quorum criticality.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Health Check: Node Is Quorum Critical",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/health/checks/node-is-quorum-critical")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getRebalanceQueues = {
  name: "get-rebalance-queues",
  description: "Get rebalance status for queues.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Rebalance Queues",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/rebalance/queues")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getWhoami = {
  name: "get-whoami",
  description: "Get information about the current user.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Whoami",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/whoami")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getAuth = {
  name: "get-auth",
  description: "Get authentication status for the current user.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Auth Status",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/auth")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const getExtensions = {
  name: "get-extensions",
  description: "Get information about enabled RabbitMQ extensions.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Extensions",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const result = await rabbitHttpRequest("/extensions")
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const HEALTHCHECK_TOOLS = [
  getHealthAlarms,
  getHealthLocalAlarms,
  getHealthCertificateExpiration,
  getHealthPortListener,
  getHealthProtocolListener,
  getHealthVirtualHosts,
  getHealthNodeIsQuorumCritical,
  getRebalanceQueues,
  getWhoami,
  getAuth,
  getExtensions
]
