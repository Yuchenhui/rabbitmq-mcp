import { z } from "zod"
import { rabbitHttpRequest } from "../client.js"
import { MCPTextContent, MCPToolResult } from "../types/mcp.js"

const listParameters = {
  name: "list-parameters",
  description: "List all parameters in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Parameters",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const parameters = await rabbitHttpRequest("/parameters")
    return { content: [{ type: "text", text: JSON.stringify(parameters, null, 2) } as MCPTextContent] }
  }
}

const listParametersComponent = {
  name: "list-parameters-component",
  description: "List all parameters for a given component.",
  params: z.object({ component: z.string() }),
  inputSchema: {
    type: "object",
    properties: { component: { type: "string" } },
    required: ["component"]
  },
  annotations: {
    title: "List Parameters (Component)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { component: string }, _extra: any): Promise<MCPToolResult> => {
    const { component } = args
    const parameters = await rabbitHttpRequest(`/parameters/${encodeURIComponent(component)}`)
    return { content: [{ type: "text", text: JSON.stringify(parameters, null, 2) } as MCPTextContent] }
  }
}

const listParametersComponentVhost = {
  name: "list-parameters-component-vhost",
  description: "List all parameters for a given component in a vhost.",
  params: z.object({ component: z.string(), vhost: z.string() }),
  inputSchema: {
    type: "object",
    properties: { component: { type: "string" }, vhost: { type: "string" } },
    required: ["component", "vhost"]
  },
  annotations: {
    title: "List Parameters (Component/Vhost)",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { component: string; vhost: string }, _extra: any): Promise<MCPToolResult> => {
    const { component, vhost } = args
    const parameters = await rabbitHttpRequest(`/parameters/${encodeURIComponent(component)}/${encodeURIComponent(vhost)}`)
    return { content: [{ type: "text", text: JSON.stringify(parameters, null, 2) } as MCPTextContent] }
  }
}

const getParameter = {
  name: "get-parameter",
  description: "Get a specific parameter for a component in a vhost.",
  params: z.object({ component: z.string(), vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      component: { type: "string" },
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["component", "vhost", "name"]
  },
  annotations: {
    title: "Get Parameter",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { component: string; vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { component, vhost, name } = args
    const parameter = await rabbitHttpRequest(`/parameters/${encodeURIComponent(component)}/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(parameter, null, 2) } as MCPTextContent] }
  }
}

const putParameter = {
  name: "put-parameter",
  description: "Create or update a parameter for a component in a vhost.",
  params: z.object({
    component: z.string(),
    vhost: z.string(),
    name: z.string(),
    value: z.any()
  }),
  inputSchema: {
    type: "object",
    properties: {
      component: { type: "string" },
      vhost: { type: "string" },
      name: { type: "string" },
      value: {}
    },
    required: ["component", "vhost", "name", "value"]
  },
  annotations: {
    title: "Create or Update Parameter",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { component: string; vhost: string; name: string; value: any }, _extra: any): Promise<MCPToolResult> => {
    const { component, vhost, name, value } = args
    const result = await rabbitHttpRequest(
      `/parameters/${encodeURIComponent(component)}/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      { value }
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteParameter = {
  name: "delete-parameter",
  description: "Delete a parameter for a component in a vhost.",
  params: z.object({ component: z.string(), vhost: z.string(), name: z.string() }),
  inputSchema: {
    type: "object",
    properties: {
      component: { type: "string" },
      vhost: { type: "string" },
      name: { type: "string" }
    },
    required: ["component", "vhost", "name"]
  },
  annotations: {
    title: "Delete Parameter",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { component: string; vhost: string; name: string }, _extra: any): Promise<MCPToolResult> => {
    const { component, vhost, name } = args
    const result = await rabbitHttpRequest(
      `/parameters/${encodeURIComponent(component)}/${encodeURIComponent(vhost)}/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const listGlobalParameters = {
  name: "list-global-parameters",
  description: "List all global parameters in the RabbitMQ cluster.",
  params: z.object({}),
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "List Global Parameters",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (_args: {}, _extra: any): Promise<MCPToolResult> => {
    const parameters = await rabbitHttpRequest("/global-parameters")
    return { content: [{ type: "text", text: JSON.stringify(parameters, null, 2) } as MCPTextContent] }
  }
}

const getGlobalParameter = {
  name: "get-global-parameter",
  description: "Get a specific global parameter.",
  params: z.object({ name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Get Global Parameter",
    readOnlyHint: true,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const parameter = await rabbitHttpRequest(`/global-parameters/${encodeURIComponent(name)}`)
    return { content: [{ type: "text", text: JSON.stringify(parameter, null, 2) } as MCPTextContent] }
  }
}

const putGlobalParameter = {
  name: "put-global-parameter",
  description: "Create or update a global parameter.",
  params: z.object({ name: z.string(), value: z.any() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" }, value: {} },
    required: ["name", "value"]
  },
  annotations: {
    title: "Create or Update Global Parameter",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string; value: any }, _extra: any): Promise<MCPToolResult> => {
    const { name, value } = args
    const result = await rabbitHttpRequest(
      `/global-parameters/${encodeURIComponent(name)}`,
      "PUT",
      undefined,
      { value }
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

const deleteGlobalParameter = {
  name: "delete-global-parameter",
  description: "Delete a global parameter.",
  params: z.object({ name: z.string() }),
  inputSchema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"]
  },
  annotations: {
    title: "Delete Global Parameter",
    readOnlyHint: false,
    openWorldHint: true
  },
  handler: async (args: { name: string }, _extra: any): Promise<MCPToolResult> => {
    const { name } = args
    const result = await rabbitHttpRequest(
      `/global-parameters/${encodeURIComponent(name)}`,
      "DELETE"
    )
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) } as MCPTextContent] }
  }
}

export const PARAMETER_TOOLS = [
  listParameters,
  listParametersComponent,
  listParametersComponentVhost,
  getParameter,
  putParameter,
  deleteParameter,
  listGlobalParameters,
  getGlobalParameter,
  putGlobalParameter,
  deleteGlobalParameter
]
