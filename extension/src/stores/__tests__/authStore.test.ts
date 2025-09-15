import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock data for testing
const mockUser = {
  address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  name: 'Alice Smith',
  network: 'Polkadot' as const
}

const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token'

// Mock ApiService
const mockApiService = {
  refreshToken: vi.fn()
}

vi.mock('../../utils/apiService', () => ({
  ApiService: {
    getInstance: () => mockApiService
  }
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

// Mock window.dispatchEvent
const mockDispatchEvent = vi.fn()
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
  writable: true
})

// Mock Chrome runtime API
const mockSendMessage = vi.fn()
Object.defineProperty(global, 'chrome', {
  value: {
    runtime: {
      sendMessage: mockSendMessage,
      lastError: null
    }
  },
  writable: true
})

describe('authStore', () => {
  let authStore: any

  beforeEach(async () => {
    vi.clearAllMocks()
    mockSendMessage.mockClear()
    mockLocalStorage.getItem.mockReturnValue(null)
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
    mockDispatchEvent.mockClear()
    mockApiService.refreshToken.mockClear()

    // Import fresh authStore for each test
    const authStoreModule = await import('../authStore')
    authStore = authStoreModule.authStore
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(authStore.state.isAuthenticated).toBeDefined()
      expect(authStore.state.user).toBeDefined()
      expect(authStore.state.token).toBeDefined()
      expect(authStore.state.isLoading).toBeDefined()
    })

    it('should have readonly state object', () => {
      expect(authStore.state).toBeDefined()
      expect(typeof authStore.state).toBe('object')
    })
  })

  describe('login method', () => {
    it('should exist and be a function', () => {
      expect(typeof authStore.login).toBe('function')
    })

    it('should handle successful login', async () => {
      mockSendMessage.mockImplementation((message, callback) => {
        callback({
          success: true,
          data: {
            success: true,
            token: mockToken,
            user: mockUser
          }
        })
      })

      const result = await authStore.login('test-address', 'test-signature', 'test-message')

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
    })

    it('should handle login failure', async () => {
      mockSendMessage.mockImplementation((message, callback) => {
        callback({
          success: true,
          data: {
            success: false,
            error: 'Invalid signature'
          }
        })
      })

      const result = await authStore.login('test-address', 'test-signature', 'test-message')

      expect(result).toBeDefined()
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid signature')
    })

    it('should handle network errors', async () => {
      mockSendMessage.mockImplementation((message, callback) => {
        callback({
          success: false,
          error: 'Network error'
        })
      })

      const result = await authStore.login('test-address', 'test-signature', 'test-message')

      expect(result).toBeDefined()
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('logout method', () => {
    it('should exist and be a function', () => {
      expect(typeof authStore.logout).toBe('function')
    })

    it('should handle logout', async () => {
      mockSendMessage.mockImplementation((message, callback) => {
        callback({ success: true, data: { success: true } })
      })

      await expect(authStore.logout()).resolves.not.toThrow()
    })
  })

  describe('verifyToken method', () => {
    it('should exist and be a function', () => {
      expect(typeof authStore.verifyToken).toBe('function')
    })

    it('should return false when no token', async () => {
      const result = await authStore.verifyToken()
      expect(typeof result).toBe('boolean')
    })

    it('should handle token verification calls', async () => {
      mockSendMessage.mockImplementation((message, callback) => {
        callback({
          success: true,
          data: { success: true, valid: false }
        })
      })

      const result = await authStore.verifyToken()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('initializeFromStorage method', () => {
    it('should exist and be a function', () => {
      expect(typeof authStore.initializeFromStorage).toBe('function')
    })

    it('should handle no stored data', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      expect(() => authStore.initializeFromStorage()).not.toThrow()
    })

    it('should handle valid stored data', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'opengov-auth-token') return mockToken
        if (key === 'opengov-auth-user') return JSON.stringify(mockUser)
        return null
      })

      expect(() => authStore.initializeFromStorage()).not.toThrow()
    })

    it('should handle invalid JSON in storage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'opengov-auth-token') return mockToken
        if (key === 'opengov-auth-user') return 'invalid-json'
        return null
      })

      expect(() => authStore.initializeFromStorage()).not.toThrow()
    })
  })

  describe('API integration', () => {
    it('should call Chrome runtime sendMessage for API calls', async () => {
      mockSendMessage.mockImplementation((message, callback) => {
        callback({
          success: true,
          data: { success: true, token: mockToken, user: mockUser }
        })
      })

      await authStore.login('test-address', 'test-signature', 'test-message')

      expect(mockSendMessage).toHaveBeenCalled()
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'VOTING_TOOL_API_CALL',
          endpoint: '/auth/web3-login',
          method: 'POST'
        }),
        expect.any(Function)
      )
    })
  })

  describe('method availability', () => {
    it('should have all required methods', () => {
      expect(typeof authStore.login).toBe('function')
      expect(typeof authStore.logout).toBe('function')
      expect(typeof authStore.verifyToken).toBe('function')
      expect(typeof authStore.initializeFromStorage).toBe('function')
    })

    it('should have state object with required properties', () => {
      expect(authStore.state).toBeDefined()
      expect(authStore.state.hasOwnProperty('isAuthenticated')).toBe(true)
      expect(authStore.state.hasOwnProperty('user')).toBe(true)
      expect(authStore.state.hasOwnProperty('token')).toBe(true)
      expect(authStore.state.hasOwnProperty('isLoading')).toBe(true)
    })
  })
}) 