import { URL } from "url"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RabbitMQApiConfig {
  protocol?: "https"
  hostname: string
  port: number
  username: string
  password: string
  basePath?: string
}

const config: RabbitMQApiConfig = {
  protocol: "https",
  hostname: process.env.RABBITMQ_HOST || "localhost",
  port: Number(process.env.RABBITMQ_MANAGEMENT_PORT) || 443,
  username: process.env.RABBITMQ_USERNAME || "guest",
  password: process.env.RABBITMQ_PASSWORD || "guest",
  basePath: "/api",
}

function buildRabbitUrl(
  config: RabbitMQApiConfig,
  endpoint: string,
  queryParams?: Record<string, string>
): string {
  const url = new URL(
    `https://${config.hostname}:${config.port}${config.basePath || "/api"}${endpoint}`
  )
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      url.searchParams.append(key, value)
    }
  }
  return url.toString()
}

export async function rabbitHttpRequest(
  endpoint: string,
  method: HttpMethod = "GET",
  queryParams?: Record<string, string>,
  body?: any
): Promise<any> {
  const urlStr = buildRabbitUrl(config, endpoint, queryParams)
  const auth = Buffer.from(`${config.username}:${config.password}`).toString("base64")
  const headers: Record<string, string> = {
    "Authorization": `Basic ${auth}`,
    "Accept": "application/json",
  }
  if (body) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(urlStr, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (res.ok) {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } else {
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
}
