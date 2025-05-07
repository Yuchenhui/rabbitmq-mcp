import { jest } from '@jest/globals'

const mockRabbitHttpRequest = jest.fn()
await jest.unstable_mockModule('../../../dist/client.js', () => ({
  rabbitHttpRequest: mockRabbitHttpRequest
}))

const {
  listNodes,
  getNode,
  getNodeMemory
} = await import('../../../dist/tools/node.js')

describe('node tools', () => {
  it('listNodes.handler returns nodes', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ node: 'test-node' }])
    const result = await listNodes.handler({})
    expect(result.content[0].text).toContain('test-node')
  })

  it('getNode.handler returns node details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'node1' })
    const result = await getNode.handler({ name: 'node1' })
    expect(result.content[0].text).toContain('node1')
  })

  it('getNodeMemory.handler returns node memory breakdown', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ memory: '1GB' })
    const result = await getNodeMemory.handler({ name: 'node1' })
    expect(result.content[0].text).toContain('1GB')
  })
})
