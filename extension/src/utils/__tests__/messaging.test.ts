import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Message, MessageResponse } from '../messaging'

describe('messaging utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('message type definitions', () => {
    it('should validate Message interface structure', () => {
      const basicMessage: Message = { type: 'TEST_MESSAGE' }
      expect(basicMessage).toHaveProperty('type')
      expect(typeof basicMessage.type).toBe('string')

      const fullMessage: Message = {
        type: 'COMPLEX_MESSAGE',
        payload: { data: 'test' },
        id: 'msg-123'
      }
      expect(fullMessage).toHaveProperty('type')
      expect(fullMessage).toHaveProperty('payload')
      expect(fullMessage).toHaveProperty('id')
    })

    it('should validate MessageResponse interface structure', () => {
      const successResponse: MessageResponse = { success: true }
      expect(successResponse).toHaveProperty('success')
      expect(typeof successResponse.success).toBe('boolean')

      const successWithDataResponse: MessageResponse = { 
        success: true, 
        data: { result: 'test' } 
      }
      expect(successWithDataResponse).toHaveProperty('success')
      expect(successWithDataResponse).toHaveProperty('data')

      const errorResponse: MessageResponse = { 
        success: false, 
        error: 'Something went wrong' 
      }
      expect(errorResponse).toHaveProperty('success')
      expect(errorResponse).toHaveProperty('error')
      expect(typeof errorResponse.error).toBe('string')
    })

    it('should handle different message types', () => {
      const messageTypes = [
        'GET_PROPOSALS',
        'SUBMIT_VOTE',
        'USER_AUTH',
        'PING',
        'GET_TEAM_DATA',
        'CONTENT_SCRIPT_MESSAGE',
        'VOTING_TOOL_API_CALL'
      ]

      messageTypes.forEach(type => {
        const message: Message = { type }
        expect(message.type).toBe(type)
        expect(typeof message.type).toBe('string')
      })
    })

    it('should handle complex payload structures', () => {
      const complexPayload = {
        user: {
          address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          name: 'Alice',
          permissions: ['vote', 'comment']
        },
        proposal: {
          id: 123,
          chain: 'Polkadot',
          metadata: {
            title: 'Test Proposal',
            description: 'A test proposal for unit testing'
          }
        },
        timestamp: Date.now()
      }

      const message: Message = {
        type: 'COMPLEX_MESSAGE',
        payload: complexPayload,
        id: 'complex-msg-001'
      }

      expect(message.payload).toEqual(complexPayload)
      expect(message.payload.user.address).toBe('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
      expect(message.payload.proposal.id).toBe(123)
      expect(Array.isArray(message.payload.user.permissions)).toBe(true)
    })
  })

  describe('message routing patterns', () => {
    it('should define content script to background communication pattern', () => {
      const contentToBackground: Message = {
        type: 'CONTENT_TO_BACKGROUND',
        payload: {
          action: 'detectProposal',
          url: 'https://polkadot.polkassembly.io/referendum/123',
          proposalData: {
            id: 123,
            title: 'Test Proposal'
          }
        }
      }

      expect(contentToBackground.type).toBe('CONTENT_TO_BACKGROUND')
      expect(contentToBackground.payload.action).toBe('detectProposal')
      expect(contentToBackground.payload.proposalData.id).toBe(123)
    })

    it('should define background to content script communication pattern', () => {
      const backgroundToContent: Message = {
        type: 'BACKGROUND_TO_CONTENT',
        payload: {
          command: 'showVotingInterface',
          proposalId: 123,
          userVote: 'aye'
        }
      }

      expect(backgroundToContent.type).toBe('BACKGROUND_TO_CONTENT')
      expect(backgroundToContent.payload.command).toBe('showVotingInterface')
      expect(backgroundToContent.payload.proposalId).toBe(123)
    })

    it('should define popup to background communication pattern', () => {
      const popupToBackground: Message = {
        type: 'POPUP_TO_BACKGROUND',
        payload: {
          request: 'getUserData',
          userId: 'user-123'
        }
      }

      expect(popupToBackground.type).toBe('POPUP_TO_BACKGROUND')
      expect(popupToBackground.payload.request).toBe('getUserData')
    })

    it('should define inject to content script communication pattern', () => {
      const injectToContent: Message = {
        type: 'INJECT_TO_CONTENT',
        payload: {
          walletData: {
            accounts: [
              { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Alice' }
            ],
            selectedWallet: 'polkadot-js'
          }
        }
      }

      expect(injectToContent.type).toBe('INJECT_TO_CONTENT')
      expect(injectToContent.payload.walletData.selectedWallet).toBe('polkadot-js')
      expect(Array.isArray(injectToContent.payload.walletData.accounts)).toBe(true)
    })
  })

  describe('message handling patterns', () => {
    it('should handle successful message responses', () => {
      const responses: MessageResponse[] = [
        { success: true },
        { success: true, data: 'simple data' },
        { success: true, data: { complex: 'object', with: ['array'] } },
        { success: true, data: null },
        { success: true, data: undefined }
      ]

      responses.forEach(response => {
        expect(response.success).toBe(true)
        expect(response).not.toHaveProperty('error')
      })
    })

    it('should handle error message responses', () => {
      const errorResponses: MessageResponse[] = [
        { success: false, error: 'Network error' },
        { success: false, error: 'Authentication failed' },
        { success: false, error: 'Invalid proposal ID' },
        { success: false, error: 'Extension context invalidated' }
      ]

      errorResponses.forEach(response => {
        expect(response.success).toBe(false)
        expect(response).toHaveProperty('error')
        expect(typeof response.error).toBe('string')
        expect(response.error!.length).toBeGreaterThan(0)
      })
    })

    it('should handle message listener callback patterns', () => {
      const mockCallback = vi.fn()
      const mockSender = { 
        tab: { id: 123, url: 'https://example.com' },
        id: 'extension-id'
      }

      // Simulate message listener behavior
      const testMessage: Message = { type: 'TEST', payload: { test: true } }
      mockCallback(testMessage, mockSender)

      expect(mockCallback).toHaveBeenCalledWith(testMessage, mockSender)
      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    it('should handle message response callback patterns', () => {
      const mockResponseCallback = vi.fn()
      
      // Simulate response callback behavior
      const successResponse: MessageResponse = { success: true, data: 'test result' }
      mockResponseCallback(successResponse)

      const errorResponse: MessageResponse = { success: false, error: 'Test error' }
      mockResponseCallback(errorResponse)

      expect(mockResponseCallback).toHaveBeenCalledTimes(2)
      expect(mockResponseCallback).toHaveBeenNthCalledWith(1, successResponse)
      expect(mockResponseCallback).toHaveBeenNthCalledWith(2, errorResponse)
    })
  })

  describe('error handling patterns', () => {
    it('should handle browser API unavailability', () => {
      const createErrorResponse = (error: any): MessageResponse => {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }

      const apiError = new Error('No supported browser runtime API found')
      const errorResponse = createErrorResponse(apiError)

      expect(errorResponse.success).toBe(false)
      expect(errorResponse.error).toBe('No supported browser runtime API found')
    })

    it('should handle extension context errors', () => {
      const contextErrors = [
        'Extension context invalidated',
        'Could not establish connection',
        'The message port closed before a response was received'
      ]

      contextErrors.forEach(errorMessage => {
        const error = new Error(errorMessage)
        const response: MessageResponse = {
          success: false,
          error: error.message
        }

        expect(response.success).toBe(false)
        expect(response.error).toBe(errorMessage)
      })
    })

    it('should handle tab access errors', () => {
      const tabErrors = [
        'Cannot access contents of the page',
        'No tab with id: 999',
        'Tab not found',
        'Tabs permission denied'
      ]

      tabErrors.forEach(errorMessage => {
        const handleTabError = (error: Error) => {
          console.error('Tab error:', error)
          return null
        }

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = handleTabError(new Error(errorMessage))

        expect(result).toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith('Tab error:', expect.any(Error))

        consoleSpy.mockRestore()
      })
    })

    it('should handle script execution errors', () => {
      const scriptErrors = [
        'Script execution failed',
        'Cannot access contents of the page',
        'Invalid script target'
      ]

      scriptErrors.forEach(errorMessage => {
        const handleScriptError = (error: Error) => {
          console.error('Script execution error:', error)
          return null
        }

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = handleScriptError(new Error(errorMessage))

        expect(result).toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith('Script execution error:', expect.any(Error))

        consoleSpy.mockRestore()
      })
    })

    it('should handle non-Error exceptions', () => {
      const createErrorResponse = (error: any): MessageResponse => {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }

      // Test with various non-Error types
      const nonErrorExceptions = [
        'string error',
        42,
        null,
        undefined,
        { message: 'object error' },
        ['array', 'error']
      ]

      nonErrorExceptions.forEach(exception => {
        const response = createErrorResponse(exception)
        expect(response.success).toBe(false)
        expect(response.error).toBe('Unknown error')
      })
    })
  })

  describe('cross-context communication patterns', () => {
    it('should handle inject to content script message flow', () => {
      // Simulate the inject script sending wallet data to content script
      const walletMessage = {
        type: 'WALLET_DATA',
        source: 'inject',
        target: 'content',
        data: {
          accounts: [
            { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Alice' }
          ],
          selectedAccount: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
        }
      }

      expect(walletMessage.source).toBe('inject')
      expect(walletMessage.target).toBe('content')
      expect(walletMessage.data.accounts).toHaveLength(1)
    })

    it('should handle content script to popup message flow', () => {
      // Simulate content script sending proposal data to popup
      const proposalMessage = {
        type: 'PROPOSAL_DATA',
        source: 'content',
        target: 'popup',
        data: {
          proposalId: 123,
          title: 'Test Proposal',
          status: 'active',
          userCanVote: true
        }
      }

      expect(proposalMessage.source).toBe('content')
      expect(proposalMessage.target).toBe('popup')
      expect(proposalMessage.data.proposalId).toBe(123)
      expect(proposalMessage.data.userCanVote).toBe(true)
    })

    it('should handle message forwarding patterns', () => {
      // Simulate background script forwarding messages between contexts
      const originalMessage: Message = {
        type: 'VOTE_SUBMISSION',
        payload: { proposalId: 123, vote: 'aye' }
      }

      const forwardedMessage = {
        type: 'FORWARDED_MESSAGE',
        originalType: originalMessage.type,
        payload: originalMessage.payload,
        source: 'popup',
        destination: 'content',
        timestamp: Date.now()
      }

      expect(forwardedMessage.originalType).toBe('VOTE_SUBMISSION')
      expect(forwardedMessage.payload).toEqual(originalMessage.payload)
      expect(forwardedMessage.source).toBe('popup')
      expect(forwardedMessage.destination).toBe('content')
    })

    it('should handle bidirectional communication patterns', () => {
      // Request-response pattern
      const request: Message = {
        type: 'GET_PROPOSAL_DATA',
        payload: { proposalId: 123 },
        id: 'req-123'
      }

      const response: MessageResponse = {
        success: true,
        data: {
          id: 123,
          title: 'Test Proposal',
          description: 'A test proposal'
        }
      }

      // Simulate matching request and response
      expect(request.id).toBe('req-123')
      expect(response.success).toBe(true)
      expect(response.data.id).toBe(123)
    })
  })

  describe('message validation and sanitization', () => {
    it('should validate required message fields', () => {
      const validateMessage = (msg: any): boolean => {
        return typeof msg === 'object' && 
               msg !== null && 
               typeof msg.type === 'string' && 
               msg.type.length > 0
      }

      // Valid messages
      expect(validateMessage({ type: 'TEST' })).toBe(true)
      expect(validateMessage({ type: 'TEST', payload: {} })).toBe(true)
      expect(validateMessage({ type: 'TEST', id: '123' })).toBe(true)

      // Invalid messages
      expect(validateMessage(null)).toBe(false)
      expect(validateMessage(undefined)).toBe(false)
      expect(validateMessage({})).toBe(false)
      expect(validateMessage({ type: '' })).toBe(false)
      expect(validateMessage({ type: 123 })).toBe(false)
      expect(validateMessage('string')).toBe(false)
    })

    it('should sanitize message payloads', () => {
      const sanitizePayload = (payload: any): any => {
        if (payload === null || payload === undefined) {
          return undefined
        }

        if (typeof payload === 'string') {
          return payload.slice(0, 10000) // Limit string length
        }

        if (Array.isArray(payload)) {
          return payload.slice(0, 100) // Limit array length
        }

        if (typeof payload === 'object') {
          const sanitized: any = {}
          let keyCount = 0
          for (const [key, value] of Object.entries(payload)) {
            if (keyCount >= 50) break // Limit object keys
            sanitized[key] = sanitizePayload(value)
            keyCount++
          }
          return sanitized
        }

        return payload
      }

      // Test string sanitization
      const longString = 'x'.repeat(20000)
      expect(sanitizePayload(longString)).toHaveLength(10000)

      // Test array sanitization
      const longArray = Array.from({ length: 200 }, (_, i) => i)
      expect(sanitizePayload(longArray)).toHaveLength(100)

      // Test object sanitization
      const largeObject = Object.fromEntries(
        Array.from({ length: 100 }, (_, i) => [`key${i}`, `value${i}`])
      )
      const sanitizedObject = sanitizePayload(largeObject)
      expect(Object.keys(sanitizedObject)).toHaveLength(50)

      // Test null/undefined handling
      expect(sanitizePayload(null)).toBeUndefined()
      expect(sanitizePayload(undefined)).toBeUndefined()
    })

    it('should handle message size limits', () => {
      const checkMessageSize = (message: Message): boolean => {
        const messageString = JSON.stringify(message)
        return messageString.length <= 64 * 1024 // 64KB limit
      }

      // Small message
      const smallMessage: Message = { type: 'SMALL', payload: { data: 'test' } }
      expect(checkMessageSize(smallMessage)).toBe(true)

      // Large message
      const largeMessage: Message = {
        type: 'LARGE',
        payload: {
          data: 'x'.repeat(70 * 1024) // 70KB
        }
      }
      expect(checkMessageSize(largeMessage)).toBe(false)
    })
  })

  describe('performance and reliability patterns', () => {
    it('should handle message timeout patterns', async () => {
      const createTimeoutPromise = (timeoutMs: number) => {
        return new Promise<MessageResponse>((resolve) => {
          setTimeout(() => {
            resolve({ success: false, error: 'Message timeout' })
          }, timeoutMs)
        })
      }

      const timeoutResponse = await createTimeoutPromise(100)
      expect(timeoutResponse.success).toBe(false)
      expect(timeoutResponse.error).toBe('Message timeout')
    })

    it('should handle concurrent message processing', async () => {
      const processMessage = async (message: Message): Promise<MessageResponse> => {
        // Simulate async processing
        await new Promise(resolve => setTimeout(resolve, 10))
        return { success: true, data: `processed-${message.type}` }
      }

      const messages = Array.from({ length: 10 }, (_, i) => ({ type: `MESSAGE_${i}` }))
      const results = await Promise.all(messages.map(processMessage))

      expect(results).toHaveLength(10)
      results.forEach((result, index) => {
        expect(result.success).toBe(true)
        expect(result.data).toBe(`processed-MESSAGE_${index}`)
      })
    })

    it('should handle message queue patterns', () => {
      const messageQueue: Message[] = []
      const maxQueueSize = 100

      const enqueueMessage = (message: Message): boolean => {
        if (messageQueue.length >= maxQueueSize) {
          return false // Queue full
        }
        messageQueue.push(message)
        return true
      }

      const dequeueMessage = (): Message | null => {
        return messageQueue.shift() || null
      }

      // Test queue operations
      const testMessage: Message = { type: 'TEST' }
      expect(enqueueMessage(testMessage)).toBe(true)
      expect(messageQueue).toHaveLength(1)

      const dequeuedMessage = dequeueMessage()
      expect(dequeuedMessage).toEqual(testMessage)
      expect(messageQueue).toHaveLength(0)

      // Test queue limit
      for (let i = 0; i < 101; i++) {
        const success = enqueueMessage({ type: `MSG_${i}` })
        if (i < 100) {
          expect(success).toBe(true)
        } else {
          expect(success).toBe(false) // Queue should be full
        }
      }
    })

    it('should handle message retry patterns', async () => {
      let attemptCount = 0
      const maxRetries = 3

      const unreliableOperation = async (): Promise<MessageResponse> => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error('Temporary failure')
        }
        return { success: true, data: 'success after retries' }
      }

      const retryOperation = async (): Promise<MessageResponse> => {
        let lastError: Error | null = null

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
          try {
            return await unreliableOperation()
          } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error')
            if (attempt < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1))) // Exponential backoff
            }
          }
        }

        return { success: false, error: lastError?.message || 'Max retries exceeded' }
      }

      const result = await retryOperation()
      expect(result.success).toBe(true)
      expect(result.data).toBe('success after retries')
      expect(attemptCount).toBe(3)
    })
  })

  describe('browser API integration patterns', () => {
    it('should handle browser detection patterns', () => {
      const detectBrowser = (mockWindow: any, mockChrome: any) => {
        const isFirefox = typeof mockWindow?.browser !== 'undefined' && mockWindow.browser?.runtime?.id
        const isChrome = typeof mockChrome !== 'undefined' && mockChrome?.runtime?.id

        if (isFirefox) return 'firefox'
        if (isChrome) return 'chrome'
        return 'unknown'
      }

      // Test Firefox detection
      const firefoxWindow = {
        browser: { runtime: { id: 'firefox-ext-id' } }
      }
      expect(detectBrowser(firefoxWindow, undefined)).toBe('firefox')

      // Test Chrome detection
      const chromeAPI = { runtime: { id: 'chrome-ext-id' } }
      expect(detectBrowser(undefined, chromeAPI)).toBe('chrome')

      // Test unknown browser
      expect(detectBrowser(undefined, undefined)).toBe('unknown')
    })

    it('should handle API method availability patterns', () => {
      const checkAPIAvailability = (api: any) => {
        const requiredMethods = [
          'runtime.sendMessage',
          'runtime.onMessage.addListener',
          'runtime.onMessage.removeListener',
          'tabs.query',
          'tabs.sendMessage',
          'scripting.executeScript'
        ]

        return requiredMethods.every(method => {
          const methodPath = method.split('.')
          let obj = api
          for (const key of methodPath) {
            if (!obj || typeof obj[key] === 'undefined') {
              return false
            }
            obj = obj[key]
          }
          return typeof obj === 'function'
        })
      }

      // Complete API
      const completeAPI = {
        runtime: {
          sendMessage: vi.fn(),
          onMessage: {
            addListener: vi.fn(),
            removeListener: vi.fn()
          }
        },
        tabs: {
          query: vi.fn(),
          sendMessage: vi.fn()
        },
        scripting: {
          executeScript: vi.fn()
        }
      }
      expect(checkAPIAvailability(completeAPI)).toBe(true)

      // Incomplete API
      const incompleteAPI = {
        runtime: {
          sendMessage: vi.fn()
          // Missing onMessage
        }
      }
      expect(checkAPIAvailability(incompleteAPI)).toBe(false)
    })

    it('should handle cross-browser compatibility patterns', () => {
      const createUnifiedAPI = (firefoxAPI: any, chromeAPI: any) => {
        const api = firefoxAPI || chromeAPI

        return {
          sendMessage: api?.runtime?.sendMessage,
          addListener: api?.runtime?.onMessage?.addListener,
          removeListener: api?.runtime?.onMessage?.removeListener,
          queryTabs: api?.tabs?.query,
          sendMessageToTab: api?.tabs?.sendMessage,
          executeScript: api?.scripting?.executeScript
        }
      }

      const firefoxAPI = {
        runtime: { 
          sendMessage: vi.fn(), 
          onMessage: { addListener: vi.fn(), removeListener: vi.fn() } 
        },
        tabs: { query: vi.fn(), sendMessage: vi.fn() },
        scripting: { executeScript: vi.fn() }
      }

      const unifiedAPI = createUnifiedAPI(firefoxAPI, null)

      expect(typeof unifiedAPI.sendMessage).toBe('function')
      expect(typeof unifiedAPI.addListener).toBe('function')
      expect(typeof unifiedAPI.queryTabs).toBe('function')
    })
  })
}) 