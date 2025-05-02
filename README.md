# rabbitmq-mcp ![NPM Version](https://img.shields.io/npm/v/rabbitmq-mcp)

A Model Context Protocol (MCP) server for RabbitMQ, enabling MCP clients to interact with RabbitMQ. This server aims to expose the full range of features available in the [official RabbitMQ HTTP API](https://www.rabbitmq.com/docs/http-api-reference) as tools.

MCP is a [standardized protocol](https://modelcontextprotocol.io/) for managing context between large language models (LLMs) and external systems, such as RabbitMQ. It allows users to ask MCP-enabled AI agents, like Claude Desktop or Cursor, to interact with external systems using natural language.

For example, you could ask:

`Get me the message count in the inbound signup metrics queue, and if it's over 10,000, move half of them to the metrics overflow queue.`

or

`Purge the outbound email deadletter queue.`

These are parseable and actionable requests that an MCP client can handle with this server. Fancy, huh?

> [!IMPORTANT]
> The management plugin **must** be [enabled](https://www.rabbitmq.com/docs/management#getting-started) in your RabbitMQ instance to use this server. While there are many options for interacting with RabbitMQ directly via AMQP, the protocol only provides a small subset of the capabilities available through the HTTP API.

## Installation

If you prefer to install locally:
```sh
npm install -g rabbitmq-mcp
```

Or with npx:

```sh
npx -y rabbitmq-mcp
```

## Environment Variables
The following environment variables are required to configure a connection to your RabbitMQ instance:

- `RABBITMQ_HOST` – accessible host (e.g. `test.abc.cloudamqp.com`)
- `RABBITMQ_USERNAME` – RabbitMQ username
- `RABBITMQ_PASSWORD` – RabbitMQ password
- `RABBITMQ_MANAGEMENT_PORT` – management port (e.g. `443` or `15672`)
- `RABBITMQ_PROTOCOL` – `https` (default) or `http`. Use `https` for secure connections.

### Optional TLS/HTTPS Options
You can provide TLS/HTTPS credentials either as file paths or as environment variable strings:
- `RABBITMQ_CA` – CA certificate (PEM string)
- `RABBITMQ_CERT` – Client certificate (PEM string)
- `RABBITMQ_KEY` – Client private key (PEM string)
- `RABBITMQ_CA_PATH` – Path to CA certificate file
- `RABBITMQ_CERT_PATH` – Path to client certificate file
- `RABBITMQ_KEY_PATH` – Path to client private key file

A cert verification flag exists for debugging, if needed:
- `RABBITMQ_REJECT_UNAUTHORIZED` – Set to `false` to disable server certificate verification (defaults to `true`)

## MCP Client Configuration Example

As MPC is in rapid development, clients can be finicky to set up correctly. Here's an example best-case config for Claude and Cursor:

```json
{
  "mcpServers": {
    "rabbitmq-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "rabbitmq-mcp"],
      "env": {
        "RABBITMQ_HOST": "your-host",
        "RABBITMQ_USERNAME": "your-username",
        "RABBITMQ_PASSWORD": "your-password",
        "RABBITMQ_MANAGEMENT_PORT": "15671",
        "RABBITMQ_CA_PATH": "/path/to/rabbit-cert.crt"
      }
    }
  }
}
```

If you experience initialization errors, you may need to use absolute paths for the command and/or args:

```json
// ...
  "command": "/local/path/to/node",
  "args": ["/local/path/to/rabbitmq-mcp/dist/index.js"],
// ...
```

> [!IMPORTANT]
> Currently, this server only supports running locally with stdio. Remote functionality using SSE/streaming is planned for a future update.

## License

MIT