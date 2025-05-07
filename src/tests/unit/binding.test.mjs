import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listBindings,
  listBindingsVhost,
  listBindingsExchangeQueue,
  createBindingExchangeQueue,
  deleteBindingExchangeQueue,
  listBindingsExchangeExchange,
  createBindingExchangeExchange,
  deleteBindingExchangeExchange
} = await import('../../../dist/tools/binding.js')

describe('binding tools', () => {
  it('listBindings.handler returns bindings', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'test-binding' }])
    const result = await listBindings.handler({})
    expect(result.content[0].text).toContain('test-binding')
  })

  it('listBindingsVhost.handler returns bindings for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'vhost-binding' }])
    const result = await listBindingsVhost.handler({ vhost: 'test-vhost' })
    expect(result.content[0].text).toContain('vhost-binding')
  })

  it('listBindingsExchangeQueue.handler returns bindings for exchange and queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'exchange-queue-binding' }])
    const result = await listBindingsExchangeQueue.handler({ vhost: 'v', exchange: 'e', queue: 'q' })
    expect(result.content[0].text).toContain('exchange-queue-binding')
  })

  it('createBindingExchangeQueue.handler creates a binding', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await createBindingExchangeQueue.handler({ vhost: 'v', exchange: 'e', queue: 'q' })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteBindingExchangeQueue.handler deletes a binding', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteBindingExchangeQueue.handler({ vhost: 'v', exchange: 'e', queue: 'q', props: 'p' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listBindingsExchangeExchange.handler returns bindings between exchanges', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'exchange-exchange-binding' }])
    const result = await listBindingsExchangeExchange.handler({ vhost: 'v', source: 's', destination: 'd' })
    expect(result.content[0].text).toContain('exchange-exchange-binding')
  })

  it('createBindingExchangeExchange.handler creates a binding between exchanges', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await createBindingExchangeExchange.handler({ vhost: 'v', source: 's', destination: 'd' })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteBindingExchangeExchange.handler deletes a binding between exchanges', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteBindingExchangeExchange.handler({ vhost: 'v', source: 's', destination: 'd', props: 'p' })
    expect(result.content[0].text).toContain('deleted')
  })
})
