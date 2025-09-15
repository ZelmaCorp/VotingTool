import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { detectBrowser, getBrowserAPI, isSupportedBrowser } from '../browser'

// Mock browser APIs
const mockFirefoxBrowser = {
  runtime: {
    id: 'firefox-extension-id',
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn()
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

const mockChromeBrowser = {
  runtime: {
    id: 'chrome-extension-id',
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn()
    }
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn()
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

describe('browser utilities', () => {
  // Store original values to restore after tests
  const originalWindow = global.window
  const originalChrome = global.chrome

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset global objects
    delete (global as any).window
    delete (global as any).chrome
    
    // Create fresh window mock
    global.window = {} as any
  })

  afterEach(() => {
    // Restore original values
    global.window = originalWindow
    global.chrome = originalChrome
  })

  describe('detectBrowser', () => {
    it('should detect Firefox browser', () => {
      // Set up Firefox environment
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      const result = detectBrowser()
      expect(result).toBe('firefox')
    })

    it('should detect Chrome browser', () => {
      // Set up Chrome environment
      global.chrome = mockChromeBrowser as any

      const result = detectBrowser()
      expect(result).toBe('chrome')
    })

    it('should return unknown for unsupported browsers', () => {
      // No browser APIs available
      const result = detectBrowser()
      expect(result).toBe('unknown')
    })

    it('should prefer Firefox over Chrome when both are available', () => {
      // Set up both Firefox and Chrome environments
      global.window = {
        browser: mockFirefoxBrowser
      } as any
      global.chrome = mockChromeBrowser as any

      const result = detectBrowser()
      expect(result).toBe('firefox')
    })

    it('should return unknown when browser object exists but runtime.id is missing', () => {
      global.window = {
        browser: {
          runtime: {} // Missing id
        }
      } as any

      const result = detectBrowser()
      expect(result).toBe('unknown')
    })

    it('should return unknown when chrome object exists but runtime.id is missing', () => {
      global.chrome = {
        runtime: {} // Missing id
      } as any

      const result = detectBrowser()
      expect(result).toBe('unknown')
    })

    it('should handle undefined browser objects gracefully', () => {
      global.window = {
        browser: undefined
      } as any
      global.chrome = undefined as any

      const result = detectBrowser()
      expect(result).toBe('unknown')
    })

    it('should handle null browser objects gracefully', () => {
      global.window = {
        browser: null
      } as any
      global.chrome = null as any

      const result = detectBrowser()
      expect(result).toBe('unknown')
    })
  })

  describe('getBrowserAPI', () => {
    it('should return Firefox API when available', () => {
      // Set up Firefox environment
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      const api = getBrowserAPI()
      
      expect(api).toBe(mockFirefoxBrowser)
      expect(api.runtime.id).toBe('firefox-extension-id')
      expect(typeof api.storage.local.get).toBe('function')
      expect(typeof api.tabs.query).toBe('function')
      expect(typeof api.scripting.executeScript).toBe('function')
    })

    it('should return Chrome API when available', () => {
      // Set up Chrome environment
      global.chrome = mockChromeBrowser as any

      const api = getBrowserAPI()
      
      expect(api).toBe(mockChromeBrowser)
      expect(api.runtime.id).toBe('chrome-extension-id')
      expect(typeof api.storage.local.get).toBe('function')
      expect(typeof api.tabs.query).toBe('function')
      expect(typeof api.scripting.executeScript).toBe('function')
    })

    it('should throw error for unsupported browsers', () => {
      // No browser APIs available
      expect(() => {
        getBrowserAPI()
      }).toThrow('Unsupported browser: unknown')
    })

    it('should return Firefox API when both browsers are available', () => {
      // Set up both Firefox and Chrome environments
      global.window = {
        browser: mockFirefoxBrowser
      } as any
      global.chrome = mockChromeBrowser as any

      const api = getBrowserAPI()
      
      expect(api).toBe(mockFirefoxBrowser)
      expect(api.runtime.id).toBe('firefox-extension-id')
    })

    it('should provide all required API methods for Firefox', () => {
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      const api = getBrowserAPI()
      
      // Check storage API
      expect(api.storage).toBeDefined()
      expect(api.storage.local).toBeDefined()
      expect(typeof api.storage.local.get).toBe('function')
      expect(typeof api.storage.local.set).toBe('function')
      expect(typeof api.storage.local.remove).toBe('function')
      
      // Check tabs API
      expect(api.tabs).toBeDefined()
      expect(typeof api.tabs.query).toBe('function')
      expect(typeof api.tabs.sendMessage).toBe('function')
      
      // Check scripting API
      expect(api.scripting).toBeDefined()
      expect(typeof api.scripting.executeScript).toBe('function')
      
      // Check runtime API
      expect(api.runtime).toBeDefined()
      expect(typeof api.runtime.id).toBe('string')
      expect(typeof api.runtime.sendMessage).toBe('function')
      expect(api.runtime.onMessage).toBeDefined()
      expect(typeof api.runtime.onMessage.addListener).toBe('function')
      expect(typeof api.runtime.onMessage.removeListener).toBe('function')
    })

    it('should provide all required API methods for Chrome', () => {
      global.chrome = mockChromeBrowser as any

      const api = getBrowserAPI()
      
      // Check storage API
      expect(api.storage).toBeDefined()
      expect(api.storage.local).toBeDefined()
      expect(typeof api.storage.local.get).toBe('function')
      expect(typeof api.storage.local.set).toBe('function')
      expect(typeof api.storage.local.remove).toBe('function')
      
      // Check tabs API
      expect(api.tabs).toBeDefined()
      expect(typeof api.tabs.query).toBe('function')
      expect(typeof api.tabs.sendMessage).toBe('function')
      
      // Check scripting API
      expect(api.scripting).toBeDefined()
      expect(typeof api.scripting.executeScript).toBe('function')
      
      // Check runtime API
      expect(api.runtime).toBeDefined()
      expect(typeof api.runtime.id).toBe('string')
      expect(typeof api.runtime.sendMessage).toBe('function')
      expect(api.runtime.onMessage).toBeDefined()
      expect(typeof api.runtime.onMessage.addListener).toBe('function')
      expect(typeof api.runtime.onMessage.removeListener).toBe('function')
    })
  })

  describe('isSupportedBrowser', () => {
    it('should return true for Firefox browser', () => {
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      const result = isSupportedBrowser()
      expect(result).toBe(true)
    })

    it('should return true for Chrome browser', () => {
      global.chrome = mockChromeBrowser as any

      const result = isSupportedBrowser()
      expect(result).toBe(true)
    })

    it('should return false for unsupported browsers', () => {
      // No browser APIs available
      const result = isSupportedBrowser()
      expect(result).toBe(false)
    })

    it('should return true when both browsers are available', () => {
      global.window = {
        browser: mockFirefoxBrowser
      } as any
      global.chrome = mockChromeBrowser as any

      const result = isSupportedBrowser()
      expect(result).toBe(true)
    })

    it('should return false when browser objects are incomplete', () => {
      global.window = {
        browser: {
          runtime: {} // Missing id
        }
      } as any

      const result = isSupportedBrowser()
      expect(result).toBe(false)
    })

    it('should return false for undefined browser objects', () => {
      global.window = {
        browser: undefined
      } as any
      global.chrome = undefined as any

      const result = isSupportedBrowser()
      expect(result).toBe(false)
    })

    it('should return false for null browser objects', () => {
      global.window = {
        browser: null
      } as any
      global.chrome = null as any

      const result = isSupportedBrowser()
      expect(result).toBe(false)
    })
  })

  describe('integration scenarios', () => {
    it('should handle browser switching scenarios', () => {
      // Start with Firefox
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      expect(detectBrowser()).toBe('firefox')
      expect(isSupportedBrowser()).toBe(true)
      
      const firefoxAPI = getBrowserAPI()
      expect(firefoxAPI.runtime.id).toBe('firefox-extension-id')

      // Switch to Chrome
      delete (global.window as any).browser
      global.chrome = mockChromeBrowser as any

      expect(detectBrowser()).toBe('chrome')
      expect(isSupportedBrowser()).toBe(true)
      
      const chromeAPI = getBrowserAPI()
      expect(chromeAPI.runtime.id).toBe('chrome-extension-id')
    })

    it('should handle partial browser API availability', () => {
      // Chrome with missing runtime.id
      global.chrome = {
        storage: { local: {} },
        tabs: {},
        runtime: {} // Missing id
      } as any

      expect(detectBrowser()).toBe('unknown')
      expect(isSupportedBrowser()).toBe(false)
      expect(() => getBrowserAPI()).toThrow('Unsupported browser: unknown')
    })

    it('should maintain API consistency across browser types', () => {
      // Test Firefox API structure
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      const firefoxAPI = getBrowserAPI()
      const firefoxMethods = [
        'storage.local.get',
        'storage.local.set', 
        'storage.local.remove',
        'tabs.query',
        'tabs.sendMessage',
        'scripting.executeScript',
        'runtime.sendMessage',
        'runtime.onMessage.addListener',
        'runtime.onMessage.removeListener'
      ]

      firefoxMethods.forEach(method => {
        const methodPath = method.split('.')
        let obj = firefoxAPI as any
        for (const key of methodPath) {
          obj = obj[key]
        }
        expect(typeof obj).toBe('function')
      })

      // Test Chrome API structure
      delete (global.window as any).browser
      global.chrome = mockChromeBrowser as any

      const chromeAPI = getBrowserAPI()
      firefoxMethods.forEach(method => {
        const methodPath = method.split('.')
        let obj = chromeAPI as any
        for (const key of methodPath) {
          obj = obj[key]
        }
        expect(typeof obj).toBe('function')
      })
    })
  })

  describe('error handling', () => {
    it('should provide meaningful error messages for unsupported browsers', () => {
      expect(() => {
        getBrowserAPI()
      }).toThrow('Unsupported browser: unknown')
    })

    it('should handle corrupted browser objects gracefully', () => {
      global.window = {
        browser: 'not-an-object'
      } as any

      expect(detectBrowser()).toBe('unknown')
      expect(isSupportedBrowser()).toBe(false)
    })

    it('should handle browser objects with unexpected structure', () => {
      global.chrome = {
        runtime: {
          id: null // Invalid id type
        }
      } as any

      expect(detectBrowser()).toBe('unknown')
      expect(isSupportedBrowser()).toBe(false)
    })
  })

  describe('type safety', () => {
    it('should ensure returned API matches BrowserAPI interface', () => {
      global.chrome = mockChromeBrowser as any

      const api = getBrowserAPI()
      
      // Runtime type checks
      expect(typeof api.runtime.id).toBe('string')
      expect(api.runtime.id.length).toBeGreaterThan(0)
      
      // Function type checks
      expect(typeof api.storage.local.get).toBe('function')
      expect(typeof api.storage.local.set).toBe('function')
      expect(typeof api.storage.local.remove).toBe('function')
      expect(typeof api.tabs.query).toBe('function')
      expect(typeof api.tabs.sendMessage).toBe('function')
      expect(typeof api.scripting.executeScript).toBe('function')
      expect(typeof api.runtime.sendMessage).toBe('function')
      expect(typeof api.runtime.onMessage.addListener).toBe('function')
      expect(typeof api.runtime.onMessage.removeListener).toBe('function')
    })

    it('should maintain API consistency between Firefox and Chrome', () => {
      // Test Firefox first
      global.window = {
        browser: mockFirefoxBrowser
      } as any

      const firefoxAPI = getBrowserAPI()
      const firefoxStructure = {
        hasStorage: !!firefoxAPI.storage,
        hasStorageLocal: !!firefoxAPI.storage?.local,
        hasTabs: !!firefoxAPI.tabs,
        hasScripting: !!firefoxAPI.scripting,
        hasRuntime: !!firefoxAPI.runtime,
        hasOnMessage: !!firefoxAPI.runtime?.onMessage
      }

      // Test Chrome
      delete (global.window as any).browser
      global.chrome = mockChromeBrowser as any

      const chromeAPI = getBrowserAPI()
      const chromeStructure = {
        hasStorage: !!chromeAPI.storage,
        hasStorageLocal: !!chromeAPI.storage?.local,
        hasTabs: !!chromeAPI.tabs,
        hasScripting: !!chromeAPI.scripting,
        hasRuntime: !!chromeAPI.runtime,
        hasOnMessage: !!chromeAPI.runtime?.onMessage
      }

      // Both should have identical structure
      expect(chromeStructure).toEqual(firefoxStructure)
      
      // All should be true
      Object.values(firefoxStructure).forEach(value => {
        expect(value).toBe(true)
      })
    })
  })
}) 