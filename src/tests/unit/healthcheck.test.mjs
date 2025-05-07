import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  getHealthAlarms,
  getHealthLocalAlarms,
  getHealthCertificateExpiration,
  getHealthPortListener,
  getHealthProtocolListener,
  getHealthVirtualHosts,
  getHealthNodeIsQuorumCritical,
  getRebalanceQueues,
  getWhoami,
  getAuth,
  getExtensions
} = await import('../../../dist/tools/healthcheck.js')

describe('healthcheck tools', () => {
  it('getHealthAlarms.handler returns health alarms', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthAlarms.handler({})
    expect(result.content[0].text).toContain('ok')
  })

  it('getHealthLocalAlarms.handler returns local alarms', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthLocalAlarms.handler({})
    expect(result.content[0].text).toContain('ok')
  })

  it('getHealthCertificateExpiration.handler returns certificate expiration status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthCertificateExpiration.handler({ within: '30', unit: 'days' })
    expect(result.content[0].text).toContain('ok')
  })

  it('getHealthPortListener.handler returns port listener status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthPortListener.handler({ port: '5672' })
    expect(result.content[0].text).toContain('ok')
  })

  it('getHealthProtocolListener.handler returns protocol listener status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthProtocolListener.handler({ protocol: 'amqp' })
    expect(result.content[0].text).toContain('ok')
  })

  it('getHealthVirtualHosts.handler returns virtual hosts status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthVirtualHosts.handler({})
    expect(result.content[0].text).toContain('ok')
  })

  it('getHealthNodeIsQuorumCritical.handler returns node quorum criticality status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getHealthNodeIsQuorumCritical.handler({})
    expect(result.content[0].text).toContain('ok')
  })

  it('getRebalanceQueues.handler returns rebalance status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getRebalanceQueues.handler({})
    expect(result.content[0].text).toContain('ok')
  })

  it('getWhoami.handler returns current user info', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ user: 'test-user' })
    const result = await getWhoami.handler({})
    expect(result.content[0].text).toContain('test-user')
  })

  it('getAuth.handler returns auth status', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ status: 'ok' })
    const result = await getAuth.handler({})
    expect(result.content[0].text).toContain('ok')
  })

  it('getExtensions.handler returns extensions', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ extensions: ['test-extension'] })
    const result = await getExtensions.handler({})
    expect(result.content[0].text).toContain('test-extension')
  })
})
