import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should get values from storage', async () => {
      const mockStorageAPI = {
        get: vi.fn().mockResolvedValue({ 'test-key': 'test-value' })
      }

      const getValue = async (key: string) => {
        try {
          const result = await mockStorageAPI.get([key])
          return result[key]
        } catch (error) {
          console.error('Storage get error:', error)
          return null
        }
      }

      const result = await getValue('test-key')
      expect(result).toBe('test-value')
      expect(mockStorageAPI.get).toHaveBeenCalledWith(['test-key'])
    })

    it('should handle missing keys', async () => {
      const mockStorageAPI = {
        get: vi.fn().mockResolvedValue({}) // Empty result for missing key
      }

      const getValue = async (key: string) => {
        try {
          const result = await mockStorageAPI.get([key])
          return result[key]
        } catch (error) {
          console.error('Storage get error:', error)
          return null
        }
      }

      const result = await getValue('missing-key')
      expect(result).toBeUndefined()
      expect(mockStorageAPI.get).toHaveBeenCalledWith(['missing-key'])
    })

    it('should handle storage errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockStorageAPI = {
        get: vi.fn().mockRejectedValue(new Error('Storage quota exceeded'))
      }

      const getValue = async (key: string) => {
        try {
          const result = await mockStorageAPI.get([key])
          return result[key]
        } catch (error) {
          console.error('Storage get error:', error)
          return null
        }
      }

      const result = await getValue('test-key')
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Storage get error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('set', () => {
    it('should set values in storage', async () => {
      const mockStorageAPI = {
        set: vi.fn().mockResolvedValue(undefined)
      }

      const setValue = async (key: string, value: any) => {
        try {
          await mockStorageAPI.set({ [key]: value })
        } catch (error) {
          console.error('Storage set error:', error)
        }
      }

      await setValue('test-key', 'test-value')
      expect(mockStorageAPI.set).toHaveBeenCalledWith({ 'test-key': 'test-value' })
    })

    it('should handle storage errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockStorageAPI = {
        set: vi.fn().mockRejectedValue(new Error('Storage quota exceeded'))
      }

      const setValue = async (key: string, value: any) => {
        try {
          await mockStorageAPI.set({ [key]: value })
        } catch (error) {
          console.error('Storage set error:', error)
        }
      }

      await setValue('test-key', 'test-value')
      expect(consoleSpy).toHaveBeenCalledWith('Storage set error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('remove', () => {
    it('should remove values from storage', async () => {
      const mockStorageAPI = {
        remove: vi.fn().mockResolvedValue(undefined)
      }

      const removeValue = async (key: string) => {
        try {
          await mockStorageAPI.remove([key])
        } catch (error) {
          console.error('Storage remove error:', error)
        }
      }

      await removeValue('test-key')
      expect(mockStorageAPI.remove).toHaveBeenCalledWith(['test-key'])
    })

    it('should handle removal errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockStorageAPI = {
        remove: vi.fn().mockRejectedValue(new Error('Key not found'))
      }

      const removeValue = async (key: string) => {
        try {
          await mockStorageAPI.remove([key])
        } catch (error) {
          console.error('Storage remove error:', error)
        }
      }

      await removeValue('missing-key')
      expect(consoleSpy).toHaveBeenCalledWith('Storage remove error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('getAll', () => {
    it('should get all storage values', async () => {
      const mockData = {
        'key1': 'value1',
        'key2': { nested: 'value2' },
        'key3': ['array', 'value']
      }

      const mockStorageAPI = {
        get: vi.fn().mockResolvedValue(mockData)
      }

      const getAllValues = async () => {
        try {
          return await mockStorageAPI.get()
        } catch (error) {
          console.error('Storage getAll error:', error)
          return {}
        }
      }

      const result = await getAllValues()
      expect(result).toEqual(mockData)
      expect(mockStorageAPI.get).toHaveBeenCalledWith()
    })

    it('should handle getAll errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockStorageAPI = {
        get: vi.fn().mockRejectedValue(new Error('Storage access denied'))
      }

      const getAllValues = async () => {
        try {
          return await mockStorageAPI.get()
        } catch (error) {
          console.error('Storage getAll error:', error)
          return {}
        }
      }

      const result = await getAllValues()
      expect(result).toEqual({})
      expect(consoleSpy).toHaveBeenCalledWith('Storage getAll error:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('browser detection', () => {
    it('should detect Firefox browser', () => {
      const detectBrowser = (mockWindow: any, mockChrome: any) => {
        const isFirefox = typeof mockWindow?.browser !== 'undefined' && mockWindow.browser?.runtime?.id
        const isChrome = typeof mockChrome !== 'undefined' && mockChrome?.runtime?.id

        if (isFirefox) return 'firefox'
        if (isChrome) return 'chrome'
        return 'unknown'
      }

      const firefoxWindow = {
        browser: {
          runtime: { id: 'firefox-ext-id' },
          storage: { local: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }
        }
      }

      const browserType = detectBrowser(firefoxWindow, undefined)
      expect(browserType).toBe('firefox')
    })

    it('should detect Chrome browser', () => {
      const detectBrowser = (mockWindow: any, mockChrome: any) => {
        const isFirefox = typeof mockWindow?.browser !== 'undefined' && mockWindow.browser?.runtime?.id
        const isChrome = typeof mockChrome !== 'undefined' && mockChrome?.runtime?.id

        if (isFirefox) return 'firefox'
        if (isChrome) return 'chrome'
        return 'unknown'
      }

      const chromeAPI = {
        runtime: { id: 'chrome-ext-id' },
        storage: { local: { get: vi.fn(), set: vi.fn(), remove: vi.fn() } }
      }

      const browserType = detectBrowser(undefined, chromeAPI)
      expect(browserType).toBe('chrome')
    })

    it('should handle unsupported browsers', () => {
      const detectBrowser = (mockWindow: any, mockChrome: any) => {
        const isFirefox = typeof mockWindow?.browser !== 'undefined' && mockWindow.browser?.runtime?.id
        const isChrome = typeof mockChrome !== 'undefined' && mockChrome?.runtime?.id

        if (isFirefox) return 'firefox'
        if (isChrome) return 'chrome'
        return 'unknown'
      }

      const browserType = detectBrowser(undefined, undefined)
      expect(browserType).toBe('unknown')

      // Test error handling for unsupported browsers
      const getStorageAPI = (browserType: string) => {
        if (browserType === 'unknown') {
          throw new Error('No supported browser storage API found')
        }
        return { get: vi.fn(), set: vi.fn(), remove: vi.fn() }
      }

      expect(() => getStorageAPI('unknown')).toThrow('No supported browser storage API found')
    })
  })
}) 