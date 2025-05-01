import { URL } from "url"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RabbitMQApiConfig {
  protocol?: string
  hostname: string
  port: number
  username: string
  password: string
  basePath?: string
}

const config: RabbitMQApiConfig = {
  protocol: process.env.RABBITMQ_PROTOCOL || "https",
  hostname: process.env.RABBITMQ_HOST,
  port: Number(process.env.RABBITMQ_MANAGEMENT_PORT),
  username: process.env.RABBITMQ_USERNAME,
  password: process.env.RABBITMQ_PASSWORD,
  basePath: process.env.RABBITMQ_BASE_PATH || "/api",
}

function buildRabbitUrl(
  config: RabbitMQApiConfig,
  endpoint: string,
  queryParams?: Record<string, string>
): string {
  const url = new URL(
    `${config.protocol}://${config.hostname}:${config.port}${config.basePath}${endpoint}`
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
