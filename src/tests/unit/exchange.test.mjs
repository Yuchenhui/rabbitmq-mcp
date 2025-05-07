import { jest } from '@jest/globals'

const mockRabbitHttpRequest = jest.fn()
await jest.unstable_mockModule('../../../dist/client.js', () => ({
  rabbitHttpRequest: mockRabbitHttpRequest
}))

const {
  listExchanges,
  listExchangesVhost,
  getExchange,
  putExchange,
  deleteExchange,
  getExchangeBindingsSource,
  getExchangeBindingsDestination
} = await import('../../../dist/tools/exchange.js')

describe('exchange tools', () => {
  it('listExchanges.handler returns exchanges', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ exchange: 'test-exchange' }])
    const result = await listExchanges.handler({})
    expect(result.content[0].text).toContain('test-exchange')
  })

  it('listExchangesVhost.handler returns exchanges for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ exchange: 'vhost-exchange' }])
    const result = await listExchangesVhost.handler({ vhost: 'test-vhost' })
    expect(result.content[0].text).toContain('vhost-exchange')
  })

  it('getExchange.handler returns exchange details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'ex1' })
    const result = await getExchange.handler({ vhost: 'v', name: 'ex1' })
    expect(result.content[0].text).toContain('ex1')
  })

  it('putExchange.handler creates or updates an exchange', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putExchange.handler({ vhost: 'v', name: 'ex1', type: 'direct' })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteExchange.handler deletes an exchange', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteExchange.handler({ vhost: 'v', name: 'ex1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('getExchangeBindingsSource.handler returns bindings from exchange', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'source-binding' }])
    const result = await getExchangeBindingsSource.handler({ vhost: 'v', name: 'ex1' })
    expect(result.content[0].text).toContain('source-binding')
  })

  it('getExchangeBindingsDestination.handler returns bindings to exchange', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'dest-binding' }])
    const result = await getExchangeBindingsDestination.handler({ vhost: 'v', name: 'ex1' })
    expect(result.content[0].text).toContain('dest-binding')
  })
})
