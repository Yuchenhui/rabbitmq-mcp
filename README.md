# rabbitmq-mcp ![NPM Version](https://img.shields.io/npm/v/rabbitmq-mcp)

A Model Context Protocol (MCP) server for RabbitMQ, enabling MCP clients to interact with RabbitMQ. This server aims to expose the full range of features available in the [official RabbitMQ HTTP API](https://www.rabbitmq.com/docs/http-api-reference) as tools.

MCP is a [standardized protocol](https://modelcontextprotocol.io/) for managing context between large language models (LLMs) and external systems, such as RabbitMQ. It allows users to ask MCP-enabled AI agents, like Claude Desktop or Cursor, to interact with external systems using natural language.

💬 Example Requests:
> - Get me the message count in the inbound signup metrics queue, and if it's over 10,000, move half of them to the metrics overflow queue.
> - Purge the outbound email deadletter queue.
> - Check if there are any alarms triggered in the production vhost.

## 🚀 New Features

### Lite Mode
The server now supports a **Lite mode** that provides a focused set of 20 essential tools optimized for development workflows. This reduces complexity while maintaining full RabbitMQ API coverage through the Custom API tool.

**Usage:**
```bash
# Lite mode (20 core tools for development)
npm start -- --lite

# Full mode (all 124 tools for complete management)
npm start

# Show help with all available options
npm start -- --help
```

**Lite Mode Tool Categories:**
- **Queue Management** (5 tools): `list-queues`, `put-queue`, `get-queue-messages`, `delete-queue`, `purge-queue`
- **Exchange Management** (3 tools): `list-exchanges`, `put-exchange`, `delete-exchange`
- **Binding Management** (2 tools): `create-binding-exchange-queue`, `delete-binding-exchange-queue`
- **Monitoring** (2 tools): `list-consumers`, `list-connections`
- **Basic Operations** (7 tools): `list-users`, `put-user`, `list-vhosts`, `put-vhost`, `list-permissions`, `set-permission`, `get-health-alarms`
- **Custom API** (1 tool): `rabbitmq-custom-api` - Access to any RabbitMQ HTTP API endpoint

### Custom API Tool
The `rabbitmq-custom-api` tool provides universal access to the complete RabbitMQ HTTP API, allowing you to call any endpoint with any HTTP method. This ensures full API coverage while keeping the Lite mode focused.

**Usage Examples:**

```javascript
// List all queues
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/queues",
    "method": "GET"
  }
}

// Create a new exchange
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/exchanges/%2F/my-direct-exchange",
    "method": "PUT",
    "body": {
      "type": "direct",
      "durable": true,
      "auto_delete": false
    }
  }
}

// Set user permissions
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/permissions/%2F/my-user",
    "method": "PUT",
    "body": {
      "configure": ".*",
      "write": ".*",
      "read": ".*"
    }
  }
}

// Get cluster health
{
  "tool": "rabbitmq-custom-api",
  "arguments": {
    "path": "/healthchecks/node-is-quorum-critical",
    "method": "GET"
  }
}
```

**Custom API Parameters:**
- `path` (required): RabbitMQ HTTP API path (e.g., `/queues`, `/exchanges/%2F/my-exchange`)
- `method` (optional, default: `GET`): HTTP method (`GET`, `POST`, `PUT`, `DELETE`)
- `body` (optional): Request body as JSON object (for `POST` and `PUT` requests)
- `query` (optional): Query parameters object (automatically URL-encoded)
- `contentType` (optional, default: `application/json`): Content type for the request

### Benefits

- **84% Tool Reduction**: Lite mode reduces from 124 tools to 20 focused tools
- **Developer-Focused**: Essential tools for development workflows
- **Full API Access**: Custom API provides access to any RabbitMQ HTTP endpoint
- **Flexible Usage**: Choose between Lite mode for daily development or Full mode for complete management
- **Easy Migration**: Seamlessly switch between modes as needed

These are parseable and actionable requests that an MCP client can handle with this server.


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

### Lite Mode Configuration (Recommended for Development)

```json
{
  "mcpServers": {
    "rabbitmq-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "rabbitmq-mcp", "--lite"],
      "env": {
        "RABBITMQ_HOST": "your-host",
        "RABBITMQ_USERNAME": "your-username",
        "RABBITMQ_PASSWORD": "your-password",
        "RABBITMQ_MANAGEMENT_PORT": "15672"
      }
    }
  }
}
```

### Full Mode Configuration (For Complete Management)

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

### Local Installation Configuration

If you prefer to use a local installation:

```json
{
  "mcpServers": {
    "rabbitmq-mcp": {
      "type": "stdio",
      "command": "/local/path/to/node",
      "args": ["/local/path/to/rabbitmq-mcp/dist/index.js", "--lite"],
      "env": {
        "RABBITMQ_HOST": "localhost",
        "RABBITMQ_USERNAME": "admin",
        "RABBITMQ_PASSWORD": "your-password",
        "RABBITMQ_MANAGEMENT_PORT": "15672"
      }
    }
  }
}
```

> [!IMPORTANT]
> Currently, this server only supports running locally with stdio. Remote functionality using SSE/streaming is planned for a future update.

> [!IMPORTANT]
> The management plugin **must** be [enabled](https://www.rabbitmq.com/docs/management#getting-started) in your RabbitMQ instance to use this server. While there are many options for interacting with RabbitMQ directly via AMQP, the protocol only provides a small subset of the capabilities available through the HTTP API.

## Testing

The project includes comprehensive testing capabilities to verify functionality:

### Quick Test
```bash
npm run test:quick
```
Runs basic functionality checks without requiring a RabbitMQ connection.

### Integration Test
```bash
# Start RabbitMQ (using Docker)
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
npm run test:integration

# Clean up
docker-compose -f docker-compose.test.yml down
```

### Manual Testing
For detailed manual testing instructions, see:
- `MANUAL_TEST_GUIDE.md` - Comprehensive manual testing guide
- `live-test.js` - Automated live testing with actual RabbitMQ instance

### Test Coverage
- ✅ Lite mode functionality (20 core tools)
- ✅ Full mode functionality (124 tools)
- ✅ Custom API tool (complete RabbitMQ HTTP API access)
- ✅ Command-line interface (--lite, --help, --version)
- ✅ Error handling and validation
- ✅ Real RabbitMQ server integration

## License

MIT