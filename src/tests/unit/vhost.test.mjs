import { jest } from '@jest/globals'

const mockRabbitHttpRequest = jest.fn()
await jest.unstable_mockModule('../../../dist/client.js', () => ({
  rabbitHttpRequest: mockRabbitHttpRequest
}))

const {
  listVhosts,
  getVhost,
  putVhost,
  deleteVhost,
  getVhostPermissions,
  getVhostTopicPermissions,
  protectVhost,
  unprotectVhost,
  startVhostOnNode,
  listVhostLimits,
  listVhostLimitsVhost,
  putVhostLimit,
  deleteVhostLimit
} = await import('../../../dist/tools/vhost.js')

describe('vhost tools', () => {
  it('listVhosts.handler returns vhosts', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ name: 'test-vhost' }])
    const result = await listVhosts.handler({})
    expect(result.content[0].text).toContain('test-vhost')
  })

  it('getVhost.handler returns vhost details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'vhost1' })
    const result = await getVhost.handler({ name: 'vhost1' })
    expect(result.content[0].text).toContain('vhost1')
  })

  it('putVhost.handler creates or updates a vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putVhost.handler({
      name: 'vhost1',
      description: 'test vhost',
      tags: 'test',
      default_queue_type: 'classic',
      protected_from_deletion: true,
      tracing: false
    })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteVhost.handler deletes a vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteVhost.handler({ name: 'vhost1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('getVhostPermissions.handler returns vhost permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ permission: 'test-permission' }])
    const result = await getVhostPermissions.handler({ name: 'vhost1' })
    expect(result.content[0].text).toContain('test-permission')
  })

  it('getVhostTopicPermissions.handler returns vhost topic permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ permission: 'test-topic-permission' }])
    const result = await getVhostTopicPermissions.handler({ name: 'vhost1' })
    expect(result.content[0].text).toContain('test-topic-permission')
  })

  it('protectVhost.handler protects a vhost from deletion', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'protected' })
    const result = await protectVhost.handler({ name: 'vhost1' })
    expect(result.content[0].text).toContain('protected')
  })

  it('unprotectVhost.handler removes deletion protection from a vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'unprotected' })
    const result = await unprotectVhost.handler({ name: 'vhost1' })
    expect(result.content[0].text).toContain('unprotected')
  })

  it('startVhostOnNode.handler starts a vhost on a node', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'started' })
    const result = await startVhostOnNode.handler({ name: 'vhost1', node: 'node1' })
    expect(result.content[0].text).toContain('started')
  })

  it('listVhostLimits.handler returns all vhost limits', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ limit: 'test-limit' }])
    const result = await listVhostLimits.handler({})
    expect(result.content[0].text).toContain('test-limit')
  })

  it('listVhostLimitsVhost.handler returns vhost limits for a specific vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ limit: 'vhost-limit' }])
    const result = await listVhostLimitsVhost.handler({ vhost: 'vhost1' })
    expect(result.content[0].text).toContain('vhost-limit')
  })

  it('putVhostLimit.handler sets a vhost limit', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'set' })
    const result = await putVhostLimit.handler({ vhost: 'vhost1', name: 'limit1', value: 100 })
    expect(result.content[0].text).toContain('set')
  })

  it('deleteVhostLimit.handler deletes a vhost limit', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteVhostLimit.handler({ vhost: 'vhost1', name: 'limit1' })
    expect(result.content[0].text).toContain('deleted')
  })
})
