import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listUsers,
  getUser,
  putUser,
  deleteUser,
  listUserPermissions,
  listUserTopicPermissions,
  listUsersWithoutPermissions,
  bulkDeleteUsers,
  listUserLimits,
  getUserLimit,
  setUserLimit,
  deleteUserLimit
} = await import('../../../dist/tools/user.js')

describe('user tools', () => {
  it('listUsers.handler returns users', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ name: 'test-user' }])
    const result = await listUsers.handler({})
    expect(result.content[0].text).toContain('test-user')
  })

  it('getUser.handler returns user details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'user1', tags: 'administrator' })
    const result = await getUser.handler({ name: 'user1' })
    expect(result.content[0].text).toContain('user1')
    expect(result.content[0].text).toContain('administrator')
  })

  it('putUser.handler creates or updates a user', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putUser.handler({
      name: 'user1',
      password: 'secret',
      tags: 'administrator'
    })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteUser.handler deletes a user', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteUser.handler({ name: 'user1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listUserPermissions.handler returns user permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ vhost: 'v1', configure: '.*', write: '.*', read: '.*' }])
    const result = await listUserPermissions.handler({ user: 'user1' })
    expect(result.content[0].text).toContain('configure')
    expect(result.content[0].text).toContain('write')
    expect(result.content[0].text).toContain('read')
  })

  it('listUserTopicPermissions.handler returns user topic permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ vhost: 'v1', exchange: 'ex1', write: '.*', read: '.*' }])
    const result = await listUserTopicPermissions.handler({ user: 'user1' })
    expect(result.content[0].text).toContain('exchange')
    expect(result.content[0].text).toContain('write')
    expect(result.content[0].text).toContain('read')
  })

  it('listUsersWithoutPermissions.handler returns users without permissions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ name: 'user2' }])
    const result = await listUsersWithoutPermissions.handler({})
    expect(result.content[0].text).toContain('user2')
  })

  it('bulkDeleteUsers.handler deletes multiple users', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await bulkDeleteUsers.handler({ users: ['user1', 'user2'] })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listUserLimits.handler returns user limits', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ user: 'user1', 'max-connections': 100 }])
    const result = await listUserLimits.handler({})
    expect(result.content[0].text).toContain('max-connections')
  })

  it('getUserLimit.handler returns user limit details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ 'max-connections': 100 })
    const result = await getUserLimit.handler({ user: 'user1' })
    expect(result.content[0].text).toContain('max-connections')
  })

  it('setUserLimit.handler sets a user limit', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await setUserLimit.handler({
      user: 'user1',
      name: 'max-connections',
      value: 100
    })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteUserLimit.handler deletes a user limit', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteUserLimit.handler({
      user: 'user1',
      name: 'max-connections'
    })
    expect(result.content[0].text).toContain('deleted')
  })
})
