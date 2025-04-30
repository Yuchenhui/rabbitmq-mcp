import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"

import { QUEUE_TOOLS } from "./tools/queue.js"

function rabbitmqTools(server: McpServer) {
  for (const tool of QUEUE_TOOLS) {
    server.tool(tool.name, tool.description, tool.params, tool.handler)
  }
}

async function main() {
  const server = new McpServer(
    {
      name: "rabbitmq-mcp",
      version: "0.1.0"
    },
    {
      capabilities: {
        logging: {},
        tools: {}
      }
    }
  )

  rabbitmqTools(server)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error(`RabbitMQ MCP Server running on stdio`)
}

main().catch((error) => {
  console.error("Fatal error in main():", error)
  process.exit(1)
})
