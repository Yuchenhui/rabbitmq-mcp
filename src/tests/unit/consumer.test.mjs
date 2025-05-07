import { jest } from '@jest/globals'

const mockRabbitHttpRequest = jest.fn()
await jest.unstable_mockModule('../../../dist/client.js', () => ({
  rabbitHttpRequest: mockRabbitHttpRequest
}))

const {
  listConsumers,
  listConsumersVhost,
  listConsumersQueue
} = await import('../../../dist/tools/consumer.js')

describe('consumer tools', () => {
  it('listConsumers.handler returns consumers', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ consumer: 'test-consumer' }])
    const result = await listConsumers.handler({})
    expect(result.content[0].text).toContain('test-consumer')
  })

  it('listConsumersVhost.handler returns consumers for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ consumer: 'vhost-consumer' }])
    const result = await listConsumersVhost.handler({ vhost: 'test-vhost' })
    expect(result.content[0].text).toContain('vhost-consumer')
  })

  it('listConsumersQueue.handler returns consumers for queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ consumer: 'queue-consumer' }])
    const result = await listConsumersQueue.handler({ vhost: 'v', queue: 'q' })
    expect(result.content[0].text).toContain('queue-consumer')
  })
})
