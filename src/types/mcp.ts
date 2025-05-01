export type MCPTextContent = {
  [x: string]: unknown
  type: "text"
  text: string
}

export type MCPToolResult = {
  content: MCPTextContent[]
  _meta?: { [x: string]: unknown }
  isError?: boolean
}