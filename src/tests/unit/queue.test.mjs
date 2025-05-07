import { mockRabbitHttpRequest, setupClientMock } from '../mocks.js'

await setupClientMock()

const {
  listQueues,
  listQueuesVhost,
  getQueue,
  putQueue,
  deleteQueue,
  purgeQueue,
  getQueueMessages,
  getQueueBindings,
  getQueueUnacked,
  pauseQueue,
  resumeQueue
} = await import('../../../dist/tools/queue.js')

describe('queue tools', () => {
  it('listQueues.handler returns queues', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ queue: 'test-queue' }])
    const result = await listQueues.handler({})
    expect(result.content[0].text).toContain('test-queue')
  })

  it('listQueuesVhost.handler returns queues for vhost', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ queue: 'vhost-queue' }])
    const result = await listQueuesVhost.handler({ vhost: 'test-vhost' })
    expect(result.content[0].text).toContain('vhost-queue')
  })

  it('getQueue.handler returns queue details', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ name: 'q1' })
    const result = await getQueue.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('q1')
  })

  it('putQueue.handler creates or updates a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'created' })
    const result = await putQueue.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('created')
  })

  it('deleteQueue.handler deletes a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'deleted' })
    const result = await deleteQueue.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('deleted')
  })

  it('purgeQueue.handler purges a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'purged' })
    const result = await purgeQueue.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('purged')
  })

  it('getQueueMessages.handler returns messages from a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ message: 'test-message' }])
    const result = await getQueueMessages.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('test-message')
  })

  it('getQueueBindings.handler returns queue bindings', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ binding: 'test-binding' }])
    const result = await getQueueBindings.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('test-binding')
  })

  it('getQueueUnacked.handler returns unacked messages from a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce([{ message: 'test-message' }])
    const result = await getQueueUnacked.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('test-message')
  })

  it('pauseQueue.handler pauses a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'paused' })
    const result = await pauseQueue.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('paused')
  })

  it('resumeQueue.handler resumes a queue', async () => {
    mockRabbitHttpRequest.mockResolvedValueOnce({ result: 'resumed' })
    const result = await resumeQueue.handler({ vhost: 'v', name: 'q1' })
    expect(result.content[0].text).toContain('resumed')
  })
})
