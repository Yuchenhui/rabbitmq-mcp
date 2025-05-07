import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listFederationLinks,
  listFederationLinksVhost,
  listAuthAttemptsNode,
  listAuthAttemptsNodeSource,
  hashPassword,
  getAuthInfo
} = await import('../../../dist/tools/auth.js')

describe('auth tools', () => {
  it('listFederationLinks.handler returns federation links', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ link: 'test-link' }])
    const result = await listFederationLinks.handler({})
    expect(result.content[0].text).toContain('test-link')
  })

  it('listFederationLinksVhost.handler returns federation links for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ link: 'vhost-link' }])
    const result = await listFederationLinksVhost.handler({ vhost: 'test-vhost' })
    expect(result.content[0].text).toContain('vhost-link')
  })

  it('listAuthAttemptsNode.handler returns auth attempts for node', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ attempt: 'node-attempt' }])
    const result = await listAuthAttemptsNode.handler({ node: 'test-node' })
    expect(result.content[0].text).toContain('node-attempt')
  })

  it('listAuthAttemptsNodeSource.handler returns auth attempts for node/source', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ attempt: 'source-attempt' }])
    const result = await listAuthAttemptsNodeSource.handler({ node: 'test-node' })
    expect(result.content[0].text).toContain('source-attempt')
  })

  it('hashPassword.handler returns hashed password', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ hash: 'hashed-password' })
    const result = await hashPassword.handler({ password: 'secret' })
    expect(result.content[0].text).toContain('hashed-password')
  })

  it('getAuthInfo.handler returns auth info', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ user: 'guest' })
    const result = await getAuthInfo.handler({})
    expect(result.content[0].text).toContain('guest')
  })
})
