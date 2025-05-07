import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listConnections,
  getConnection,
  deleteConnection,
  listConnectionsVhost,
  listConnectionsUsername,
  deleteConnectionsUsername,
  getConnectionChannels
} = await import('../../../dist/tools/connection.js')

describe('connection tools', () => {
  it('listConnections.handler returns all connections', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([
      { name: 'conn1', user: 'guest', vhost: '/', peer_host: 'localhost' }
    ])
    const result = await listConnections.handler({})
    expect(result.content[0].text).toContain('conn1')
    expect(result.content[0].text).toContain('guest')
    expect(result.content[0].text).toContain('localhost')
  })

  it('getConnection.handler returns connection details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({
      name: 'conn1',
      user: 'guest',
      vhost: '/',
      peer_host: 'localhost',
      port: 5672,
      protocol: 'AMQP 0-9-1'
    })
    const result = await getConnection.handler({ name: 'conn1' })
    expect(result.content[0].text).toContain('conn1')
    expect(result.content[0].text).toContain('AMQP 0-9-1')
  })

  it('deleteConnection.handler closes a connection', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'closed' })
    const result = await deleteConnection.handler({
      name: 'conn1',
      reason: 'test cleanup'
    })
    expect(result.content[0].text).toContain('closed')
  })

  it('deleteConnection.handler closes a connection without reason', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'closed' })
    const result = await deleteConnection.handler({ name: 'conn1' })
    expect(result.content[0].text).toContain('closed')
  })

  it('listConnectionsVhost.handler returns vhost connections', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([
      { name: 'conn1', user: 'guest', vhost: 'test-vhost' }
    ])
    const result = await listConnectionsVhost.handler({ vhost: 'test-vhost' })
    expect(result.content[0].text).toContain('conn1')
    expect(result.content[0].text).toContain('test-vhost')
  })

  it('listConnectionsUsername.handler returns user connections', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([
      { name: 'conn1', user: 'test-user', vhost: '/' }
    ])
    const result = await listConnectionsUsername.handler({ username: 'test-user' })
    expect(result.content[0].text).toContain('conn1')
    expect(result.content[0].text).toContain('test-user')
  })

  it('deleteConnectionsUsername.handler closes user connections with reason', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'closed' })
    const result = await deleteConnectionsUsername.handler({
      username: 'test-user',
      reason: 'security cleanup'
    })
    expect(result.content[0].text).toContain('closed')
  })

  it('deleteConnectionsUsername.handler closes user connections without reason', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'closed' })
    const result = await deleteConnectionsUsername.handler({ username: 'test-user' })
    expect(result.content[0].text).toContain('closed')
  })

  it('getConnectionChannels.handler returns connection channels', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([
      { number: 1, name: 'channel1', connection_name: 'conn1', state: 'running' }
    ])
    const result = await getConnectionChannels.handler({ name: 'conn1' })
    expect(result.content[0].text).toContain('channel1')
    expect(result.content[0].text).toContain('running')
  })
})
