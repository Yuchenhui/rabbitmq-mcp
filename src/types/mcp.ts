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

// 增强的工具类型定义
export interface MCPTool {
  name: string;
  description: string;
  params?: any;
  inputSchema?: {
    type: "object";
    properties?: Record<string, any>;
    required?: string[];
  };
  annotations?: {
    title?: string;
    readOnlyHint?: boolean;
    destructiveHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
  };
  handler: (args: any) => Promise<MCPToolResult>;
}

// CLI 选项类型
export interface CliOptions {
  liteMode: boolean;
  [key: string]: any;
}