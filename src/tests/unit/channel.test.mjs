import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listChannels,
  getChannel,
  listChannelsConnection
} = await import('../../../dist/tools/channel.js')

describe('channel tools', () => {
  it('listChannels.handler returns channels', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ channel: 'test-channel' }])
    const result = await listChannels.handler({})
    expect(result.content[0].text).toContain('test-channel')
  })

  it('getChannel.handler returns channel details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'chan1' })
    const result = await getChannel.handler({ name: 'chan1' })
    expect(result.content[0].text).toContain('chan1')
  })

  it('listChannelsConnection.handler returns channels for connection', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ channel: 'conn-channel' }])
    const result = await listChannelsConnection.handler({ name: 'conn1' })
    expect(result.content[0].text).toContain('conn-channel')
  })
})
