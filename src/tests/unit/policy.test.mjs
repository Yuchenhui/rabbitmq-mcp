import { jest } from '@jest/globals'

const mockRabbitHttpRequest = jest.fn()
await jest.unstable_mockModule('../../../dist/client.js', () => ({
  rabbitHttpRequest: mockRabbitHttpRequest
}))

const {
  listPolicies,
  listPoliciesVhost,
  getPolicy,
  putPolicy,
  deletePolicy,
  listOperatorPolicies,
  listOperatorPoliciesVhost,
  getOperatorPolicy,
  putOperatorPolicy,
  deleteOperatorPolicy
} = await import('../../../dist/tools/policy.js')

describe('policy tools', () => {
  it('listPolicies.handler returns policies', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ policy: 'test-policy' }])
    const result = await listPolicies.handler({})
    expect(result.content[0].text).toContain('test-policy')
  })

  it('listPoliciesVhost.handler returns policies for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ policy: 'vhost-policy' }])
    const result = await listPoliciesVhost.handler({ vhost: 'v1' })
    expect(result.content[0].text).toContain('vhost-policy')
  })

  it('getPolicy.handler returns policy details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'policy1' })
    const result = await getPolicy.handler({ vhost: 'v1', name: 'policy1' })
    expect(result.content[0].text).toContain('policy1')
  })

  it('putPolicy.handler creates or updates a policy', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putPolicy.handler({ vhost: 'v1', name: 'policy1', pattern: '.*', definition: {} })
    expect(result.content[0].text).toContain('created')
  })

  it('deletePolicy.handler deletes a policy', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deletePolicy.handler({ vhost: 'v1', name: 'policy1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listOperatorPolicies.handler returns operator policies', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ policy: 'test-operator-policy' }])
    const result = await listOperatorPolicies.handler({})
    expect(result.content[0].text).toContain('test-operator-policy')
  })

  it('listOperatorPoliciesVhost.handler returns operator policies for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ policy: 'vhost-operator-policy' }])
    const result = await listOperatorPoliciesVhost.handler({ vhost: 'v1' })
    expect(result.content[0].text).toContain('vhost-operator-policy')
  })

  it('getOperatorPolicy.handler returns operator policy details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'operator-policy1' })
    const result = await getOperatorPolicy.handler({ vhost: 'v1', name: 'operator-policy1' })
    expect(result.content[0].text).toContain('operator-policy1')
  })

  it('putOperatorPolicy.handler creates or updates an operator policy', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putOperatorPolicy.handler({ vhost: 'v1', name: 'operator-policy1', pattern: '.*', definition: {} })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteOperatorPolicy.handler deletes an operator policy', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteOperatorPolicy.handler({ vhost: 'v1', name: 'operator-policy1' })
    expect(result.content[0].text).toContain('deleted')
  })
})
