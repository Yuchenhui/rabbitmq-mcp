import { URL } from "url"
import fetch from 'node-fetch'
import * as fs from "fs"
import * as https from "https"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface RabbitMQApiConfig {
  protocol?: string
  hostname: string
  port: number
  username: string
  password: string
  basePath?: string
  ca?: string | Buffer
  cert?: string | Buffer
  key?: string | Buffer
  caPath?: string
  certPath?: string
  keyPath?: string
  rejectUnauthorized?: boolean
}

function loadFileOrEnv(envVar: string | undefined, pathVar: string | undefined): string | Buffer | undefined {
  if (pathVar) {
    try {
      return fs.readFileSync(pathVar)
    } catch (err: any) {
      console.error(`\n[ERROR] Failed to read certificate file at ${pathVar}:\n${err.message}\n`)
      process.exit(1)
    }
  }
  return envVar
}

const config: RabbitMQApiConfig = {
  protocol: process.env.RABBITMQ_PROTOCOL || "https",
  hostname: process.env.RABBITMQ_HOST,
  port: Number(process.env.RABBITMQ_MANAGEMENT_PORT),
  username: process.env.RABBITMQ_USERNAME,
  password: process.env.RABBITMQ_PASSWORD,
  basePath: process.env.RABBITMQ_BASE_PATH || "/api",
  ca: loadFileOrEnv(process.env.RABBITMQ_CA, process.env.RABBITMQ_CA_PATH),
  cert: loadFileOrEnv(process.env.RABBITMQ_CERT, process.env.RABBITMQ_CERT_PATH),
  key: loadFileOrEnv(process.env.RABBITMQ_KEY, process.env.RABBITMQ_KEY_PATH),
  rejectUnauthorized: process.env.RABBITMQ_REJECT_UNAUTHORIZED !== "false"
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
  body?: any,
  extraHeaders?: Record<string, string>
): Promise<any> {
  const urlStr = buildRabbitUrl(config, endpoint, queryParams)
  const auth = Buffer.from(`${config.username}:${config.password}`).toString("base64")
  const headers: Record<string, string> = {
    "Authorization": `Basic ${auth}`,
    "Accept": "application/json",
    ...extraHeaders
  }
  if (body) {
    headers["Content-Type"] = "application/json"
  }

  let agent: https.Agent | undefined = undefined
  if (config.protocol === "https") {
    agent = new https.Agent({
      ca: config.ca,
      cert: config.cert,
      key: config.key,
      rejectUnauthorized: config.rejectUnauthorized !== false
    })
  }

  const res = await fetch(urlStr, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    agent
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
