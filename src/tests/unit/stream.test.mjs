import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listStreamConnections,
  listStreamConnectionsVhost,
  getStreamConnection,
  getStreamConnectionPublishers,
  getStreamConnectionConsumers,
  deleteStreamConnection,
  listStreamPublishers,
  listStreamPublishersVhost,
  listStreamPublishersVhostStream,
  listStreamConsumers,
  listStreamConsumersVhost
} = await import('../../../dist/tools/stream.js')

describe('stream tools', () => {
  it('listStreamConnections.handler returns stream connections', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ connection: 'test-connection' }])
    const result = await listStreamConnections.handler({})
    expect(result.content[0].text).toContain('test-connection')
  })

  it('listStreamConnectionsVhost.handler returns stream connections for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ connection: 'vhost-connection' }])
    const result = await listStreamConnectionsVhost.handler({ vhost: 'v1' })
    expect(result.content[0].text).toContain('vhost-connection')
  })

  it('getStreamConnection.handler returns stream connection details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'conn1' })
    const result = await getStreamConnection.handler({ vhost: 'v1', name: 'conn1' })
    expect(result.content[0].text).toContain('conn1')
  })

  it('getStreamConnectionPublishers.handler returns stream connection publishers', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ publisher: 'test-publisher' }])
    const result = await getStreamConnectionPublishers.handler({ vhost: 'v1', name: 'conn1' })
    expect(result.content[0].text).toContain('test-publisher')
  })

  it('getStreamConnectionConsumers.handler returns stream connection consumers', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ consumer: 'test-consumer' }])
    const result = await getStreamConnectionConsumers.handler({ vhost: 'v1', name: 'conn1' })
    expect(result.content[0].text).toContain('test-consumer')
  })

  it('deleteStreamConnection.handler deletes a stream connection', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteStreamConnection.handler({ vhost: 'v1', name: 'conn1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listStreamPublishers.handler returns stream publishers', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ publisher: 'test-publisher' }])
    const result = await listStreamPublishers.handler({})
    expect(result.content[0].text).toContain('test-publisher')
  })

  it('listStreamPublishersVhost.handler returns stream publishers for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ publisher: 'vhost-publisher' }])
    const result = await listStreamPublishersVhost.handler({ vhost: 'v1' })
    expect(result.content[0].text).toContain('vhost-publisher')
  })

  it('listStreamPublishersVhostStream.handler returns stream publishers for stream in vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ publisher: 'stream-publisher' }])
    const result = await listStreamPublishersVhostStream.handler({ vhost: 'v1', stream: 's1' })
    expect(result.content[0].text).toContain('stream-publisher')
  })

  it('listStreamConsumers.handler returns stream consumers', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ consumer: 'test-consumer' }])
    const result = await listStreamConsumers.handler({})
    expect(result.content[0].text).toContain('test-consumer')
  })

  it('listStreamConsumersVhost.handler returns stream consumers for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ consumer: 'vhost-consumer' }])
    const result = await listStreamConsumersVhost.handler({ vhost: 'v1' })
    expect(result.content[0].text).toContain('vhost-consumer')
  })
})
