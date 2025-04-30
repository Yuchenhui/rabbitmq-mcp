# rabbitmq-mcp

A ModelContextProtocol (MCP) server for RabbitMQ, enabling MCP clients to interact with RabbitMQ queues and management APIs.

## Installation

```sh
npm install -g rabbitmq-mcp
```

Or use directly with npx (no install required):

```sh
npx -y rabbitmq-mcp
```

## Usage

You can run the server with:

```sh
rabbitmq-mcp
```

Or, if using npx:

```sh
npx -y rabbitmq-mcp
```

## Environment Variables

Set the following environment variables to configure your RabbitMQ connection:

- `RABBITMQ_HOST` – RabbitMQ host (e.g., `duck.lmq.cloudamqp.com`)
- `RABBITMQ_USERNAME` – RabbitMQ username
- `RABBITMQ_PASSWORD` – RabbitMQ password
- `RABBITMQ_MANAGEMENT_PORT` – RabbitMQ management port (e.g., `443`)

Example:

```sh
RABBITMQ_HOST=your-host \
RABBITMQ_USERNAME=your-username \
RABBITMQ_PASSWORD=your-password \
RABBITMQ_MANAGEMENT_PORT=443 \
rabbitmq-mcp
```

## MCP Client Configuration Example

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
        "RABBITMQ_MANAGEMENT_PORT": "443"
      }
    }
  }
}
```

## License

MIT