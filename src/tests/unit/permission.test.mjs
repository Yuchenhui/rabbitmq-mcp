import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listPermissions,
  getPermission,
  setPermission,
  deletePermission,
  listTopicPermissions,
  getTopicPermission,
  setTopicPermission,
  deleteTopicPermission
} = await import('../../../dist/tools/permission.js')

describe('permission tools', () => {
  it('listPermissions.handler returns permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ permission: 'test-permission' }])
    const result = await listPermissions.handler({})
    expect(result.content[0].text).toContain('test-permission')
  })

  it('getPermission.handler returns permission details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ user: 'user1' })
    const result = await getPermission.handler({ vhost: 'v1', user: 'user1' })
    expect(result.content[0].text).toContain('user1')
  })

  it('setPermission.handler sets permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'set' })
    const result = await setPermission.handler({ vhost: 'v1', user: 'user1', configure: '.*', write: '.*', read: '.*' })
    expect(result.content[0].text).toContain('set')
  })

  it('deletePermission.handler deletes permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deletePermission.handler({ vhost: 'v1', user: 'user1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listTopicPermissions.handler returns topic permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ permission: 'test-topic-permission' }])
    const result = await listTopicPermissions.handler({})
    expect(result.content[0].text).toContain('test-topic-permission')
  })

  it('getTopicPermission.handler returns topic permission details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ user: 'user1' })
    const result = await getTopicPermission.handler({ vhost: 'v1', user: 'user1' })
    expect(result.content[0].text).toContain('user1')
  })

  it('setTopicPermission.handler sets topic permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'set' })
    const result = await setTopicPermission.handler({ vhost: 'v1', user: 'user1', exchange: 'ex1', write: '.*', read: '.*' })
    expect(result.content[0].text).toContain('set')
  })

  it('deleteTopicPermission.handler deletes topic permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteTopicPermission.handler({ vhost: 'v1', user: 'user1' })
    expect(result.content[0].text).toContain('deleted')
  })
})
