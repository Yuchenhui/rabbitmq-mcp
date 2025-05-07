import { jest } from '@jest/globals'

export const mockRabbitHttpRequest = jest.fn()

export async function setupClientMock() {
  await jest.unstable_mockModule('../../dist/client.js', () => ({
    rabbitHttpRequest: mockRabbitHttpRequest
  }))
}
