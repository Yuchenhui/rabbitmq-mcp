import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listParameters,
  listParametersComponent,
  listParametersComponentVhost,
  getParameter,
  putParameter,
  deleteParameter,
  listGlobalParameters,
  getGlobalParameter,
  putGlobalParameter,
  deleteGlobalParameter
} = await import('../../../dist/tools/parameter.js')

describe('parameter tools', () => {
  it('listParameters.handler returns parameters', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ parameter: 'test-parameter' }])
    const result = await listParameters.handler({})
    expect(result.content[0].text).toContain('test-parameter')
  })

  it('listParametersComponent.handler returns parameters for component', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ parameter: 'component-parameter' }])
    const result = await listParametersComponent.handler({ component: 'comp1' })
    expect(result.content[0].text).toContain('component-parameter')
  })

  it('listParametersComponentVhost.handler returns parameters for component in vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ parameter: 'vhost-parameter' }])
    const result = await listParametersComponentVhost.handler({ component: 'comp1', vhost: 'v1' })
    expect(result.content[0].text).toContain('vhost-parameter')
  })

  it('getParameter.handler returns parameter details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'param1' })
    const result = await getParameter.handler({ component: 'comp1', vhost: 'v1', name: 'param1' })
    expect(result.content[0].text).toContain('param1')
  })

  it('putParameter.handler creates or updates a parameter', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putParameter.handler({ component: 'comp1', vhost: 'v1', name: 'param1', value: 'value1' })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteParameter.handler deletes a parameter', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteParameter.handler({ component: 'comp1', vhost: 'v1', name: 'param1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('listGlobalParameters.handler returns global parameters', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ parameter: 'global-parameter' }])
    const result = await listGlobalParameters.handler({})
    expect(result.content[0].text).toContain('global-parameter')
  })

  it('getGlobalParameter.handler returns global parameter details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'global-param1' })
    const result = await getGlobalParameter.handler({ name: 'global-param1' })
    expect(result.content[0].text).toContain('global-param1')
  })

  it('putGlobalParameter.handler creates or updates a global parameter', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putGlobalParameter.handler({ name: 'global-param1', value: 'value1' })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteGlobalParameter.handler deletes a global parameter', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteGlobalParameter.handler({ name: 'global-param1' })
    expect(result.content[0].text).toContain('deleted')
  })
})
