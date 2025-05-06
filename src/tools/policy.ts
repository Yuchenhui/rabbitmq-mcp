import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listPolicies = {
  name: "list-policies",
  description: "List all policies in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Policies",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const policies = await rabbitHttpRequest("/policies")
    return { content: [{ type: "text", text: JSON.stringify(policies, null, 2) } as MCPTextContent] }
  }
}

const listPoliciesVhost = {
  name: "list-policies-vhost",
  description: "List all policies for a given vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Policies (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost } = listPoliciesVhost.params.parse(args)
    const policies = await rabbitHttpRequest(`/policies/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(policies, null, 2) } as MCPTextContent] }
  }
}

const getPolicy = {
  name: "get-policy",
  description: "Get a specific policy for a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Get Policy",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = getPolicy.params.parse(args)
    const policy = await rabbitHttpRequest(`/policies/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(policy, null, 2) } as MCPTextContent] }
  }
}

const putPolicy = {
  name: "put-policy",
  description: "Create or update a policy for a vhost.",
  params: z.object({
    vhost: z.string(),
    name: z.string(),
    pattern: z.string(),
    definition: z.record(z.any()),
    priority: z.number().optional(),
    apply_to: z.enum(["all", "queues", "exchanges"]).optional()
  }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" },
      pattern: { type: "string" },
      definition: { type: "object", additionalProperties: true },
      priority: { type: "number" },
      apply_to: { type: "string", enum: ["all", "queues", "exchanges"] }
    },
    required: ["vhost", "name", "pattern", "definition"]
  },
  annotations: {
    title: "Create or Update Policy",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name, ...body } = putPolicy.params.parse(args)
    const result = await rabbitHttpRequest(
      `/policies/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      body
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deletePolicy = {
  name: "delete-policy",
  description: "Delete a policy for a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Delete Policy",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = deletePolicy.params.parse(args)
    const result = await rabbitHttpRequest(
      `/policies/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listOperatorPolicies = {
  name: "list-operator-policies",
  description: "List all operator policies in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Operator Policies",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}): Promise<MCPToolResult> => {
    const policies = await rabbitHttpRequest("/operator-policies")
    return { content: [{ type: "text", text: JSON.stringify(policies, null, 2) } as MCPTextContent] }
  }
}

const listOperatorPoliciesVhost = {
  name: "list-operator-policies-vhost",
  description: "List all operator policies for a given vhost.",
  params: z.object({ vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" } },
    required: ["vhost"]
  },
  annotations: {
    title: "List Operator Policies (Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost } = listOperatorPoliciesVhost.params.parse(args)
    const policies = await rabbitHttpRequest(`/operator-policies/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(policies, null, 2) } as MCPTextContent] }
  }
}

const getOperatorPolicy = {
  name: "get-operator-policy",
  description: "Get a specific operator policy for a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Get Operator Policy",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = getOperatorPolicy.params.parse(args)
    const policy = await rabbitHttpRequest(`/operator-policies/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(policy, null, 2) } as MCPTextContent] }
  }
}

const putOperatorPolicy = {
  name: "put-operator-policy",
  description: "Create or update an operator policy for a vhost.",
  params: z.object({
    vhost: z.string(),
    name: z.string(),
    pattern: z.string(),
    definition: z.record(z.any()),
    priority: z.number().optional(),
    apply_to: z.enum(["all", "queues", "exchanges"]).optional()
  }),
  inputSchema: {
    type: "object",
    properties: {
      vhost: { type: "string" },
      name: { type: "string" },
      pattern: { type: "string" },
      definition: { type: "object", additionalProperties: true },
      priority: { type: "number" },
      apply_to: { type: "string", enum: ["all", "queues", "exchanges"] }
    },
    required: ["vhost", "name", "pattern", "definition"]
  },
  annotations: {
    title: "Create or Update Operator Policy",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name, ...body } = putOperatorPolicy.params.parse(args)
    const result = await rabbitHttpRequest(
      `/operator-policies/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      body
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteOperatorPolicy = {
  name: "delete-operator-policy",
  description: "Delete an operator policy for a vhost.",
  params: z.object({ vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { vhost: { type: "string" }, name: { type: "string" } },
    required: ["vhost", "name"]
  },
  annotations: {
    title: "Delete Operator Policy",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: any): Promise<MCPToolResult> => {
    const { vhost, name } = deleteOperatorPolicy.params.parse(args)
    const result = await rabbitHttpRequest(
      `/operator-policies/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const POLICY_TOOLS = [
  listPolicies,
  listPoliciesVhost,
  getPolicy,
  putPolicy,
  deletePolicy,
  listOperatorPolicies,
  listOperatorPoliciesVhost,
  getOperatorPolicy,
  putOperatorPolicy,
  deleteOperatorPolicy
]
