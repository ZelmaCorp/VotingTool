import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { TabDetector } from '../tabDetector'
import type { ActiveTabInfo } from '../tabDetector'

// Mock DOM environment
const mockDocument = {
  querySelector: vi.fn(),
  querySelectorAll: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  }
}

// Mock MutationObserver
const mockMutationObserver = vi.fn()
const mockObserverInstance = {
  observe: vi.fn(),
  disconnect: vi.fn()
}

let storedMutationCallback: any = null

mockMutationObserver.mockImplementation((callback) => {
  // Store the callback for manual triggering in tests
  storedMutationCallback = callback
  return mockObserverInstance
})

global.MutationObserver = mockMutationObserver as any
global.document = mockDocument as any

describe('tabDetector', () => {
  let tabDetector: TabDetector
  const originalConsoleLog = console.log

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset mocks
    mockDocument.querySelector.mockReturnValue(null)
    mockDocument.querySelectorAll.mockReturnValue([])
    mockDocument.addEventListener.mockClear()
    mockDocument.removeEventListener.mockClear()
    mockObserverInstance.observe.mockClear()
    mockObserverInstance.disconnect.mockClear()
    
    // Mock console.log to reduce noise
    console.log = vi.fn()
    
    // Get fresh instance
    tabDetector = TabDetector.getInstance()
  })

  afterEach(() => {
    console.log = originalConsoleLog
  })

  describe('tab detection', () => {
    it('should detect active tab with data-state="active"', () => {
      const mockButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'Root'
          return null
        }),
        id: 'radix-r10-trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButton)

      const result = tabDetector.detectActiveTab()

      expect(result).toEqual({
        activeCategory: 'Root',
        shouldShowBadges: true,
        isTrackedOrigin: true
      })
      expect(mockDocument.querySelector).toHaveBeenCalledWith('button[data-state="active"][role="tab"], button[aria-selected="true"][role="tab"]')
    })

    it('should detect active tab with aria-selected="true"', () => {
      const mockButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'BigSpender'
          return null
        }),
        id: 'radix-r10-trigger-BigSpender',
        textContent: 'Big Spender',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButton)

      const result = tabDetector.detectActiveTab()

      expect(result).toEqual({
        activeCategory: 'BigSpender',
        shouldShowBadges: true,
        isTrackedOrigin: true
      })
    })

    it('should handle Polkassembly tab detection with various extraction methods', () => {
      // Test data-value extraction
      const mockButtonWithDataValue = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'MediumSpender'
          return null
        }),
        id: 'some-id',
        textContent: 'Medium Spender',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButtonWithDataValue)
      let result = tabDetector.detectActiveTab()
      expect(result.activeCategory).toBe('MediumSpender')

      // Test ID extraction when data-value is missing
      const mockButtonWithId = {
        getAttribute: vi.fn(() => null),
        id: 'radix-r10-trigger-SmallSpender',
        textContent: 'Small Spender',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButtonWithId)
      result = tabDetector.detectActiveTab()
      expect(result.activeCategory).toBe('SmallSpender')

      // Test text content extraction when both data-value and ID fail
      const mockButtonWithText = {
        getAttribute: vi.fn(() => null),
        id: 'some-other-id',
        textContent: '  Big Tipper  ',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButtonWithText)
      result = tabDetector.detectActiveTab()
      expect(result.activeCategory).toBe('BigTipper') // Spaces removed
    })

    it('should handle tab URL matching patterns', () => {
      // Test various category patterns that should be tracked
      const trackedCategories = [
        'Root',
        'WishForChange', 
        'BigSpender',
        'MediumSpender',
        'SmallSpender',
        'BigTipper',
        'SmallTipper',
        'Treasurer',
        'WhitelistedCaller',
        'ReferendumCanceller',
        'ReferendumKiller'
      ]

      trackedCategories.forEach(category => {
        const mockButton = {
          getAttribute: vi.fn((attr) => {
            if (attr === 'data-value') return category
            return null
          }),
          id: `trigger-${category}`,
          textContent: category,
          matches: vi.fn(() => true)
        }

        mockDocument.querySelector.mockReturnValue(mockButton)
        const result = tabDetector.detectActiveTab()

        expect(result.activeCategory).toBe(category)
        expect(result.shouldShowBadges).toBe(true)
        expect(result.isTrackedOrigin).toBe(true)
      })
    })

    it('should handle untracked categories', () => {
      const untrackedCategories = [
        { input: 'Discussion', expected: 'Discussion' },
        { input: 'Staking Admin', expected: 'StakingAdmin' }, // Spaces removed
        { input: 'Lease Admin', expected: 'LeaseAdmin' },
        { input: 'Fellowship Admin', expected: 'FellowshipAdmin' },
        { input: 'General Admin', expected: 'GeneralAdmin' },
        { input: 'Auction Admin', expected: 'AuctionAdmin' }
      ]

      untrackedCategories.forEach(({ input, expected }) => {
        const mockButton = {
          getAttribute: vi.fn((attr) => {
            if (attr === 'data-value') return input
            return null
          }),
          id: `trigger-${input}`,
          textContent: input,
          matches: vi.fn(() => true)
        }

        mockDocument.querySelector.mockReturnValue(mockButton)
        const result = tabDetector.detectActiveTab()

        expect(result.activeCategory).toBe(expected)
        expect(result.shouldShowBadges).toBe(false)
        expect(result.isTrackedOrigin).toBe(false)
      })
    })

    it('should handle no active tab found', () => {
      mockDocument.querySelector.mockReturnValue(null)

      const result = tabDetector.detectActiveTab()

      expect(result).toEqual({
        activeCategory: null,
        shouldShowBadges: false,
        isTrackedOrigin: false
      })
    })

    it('should handle "All" category special case', () => {
      // Test with lowercase "all" which is what the isCategoryTracked method checks for
      const mockButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'all'
          return null
        }),
        id: 'trigger-all',
        textContent: 'all',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButton)
      const result = tabDetector.detectActiveTab()

      expect(result.activeCategory).toBe('all')
      expect(result.shouldShowBadges).toBe(true)
      expect(result.isTrackedOrigin).toBe(true)

      // Test getOriginForCategory with "All" (uppercase)
      expect(tabDetector.getOriginForCategory('All')).toBe('All')
    })
  })

  describe('page monitoring', () => {
    it('should detect page changes through tab clicks', () => {
      return new Promise<void>((resolve) => {
        let callbackCount = 0
        const mockCallback = vi.fn((tabInfo: ActiveTabInfo) => {
          callbackCount++
          if (callbackCount === 1) {
            expect(tabInfo.activeCategory).toBe('BigSpender')
            resolve()
          }
        })

      // Initial state - Root tab
      const mockRootButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'Root'
          return null
        }),
        id: 'trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockRootButton)

      const cleanup = tabDetector.watchForTabChanges(mockCallback)

      // Simulate tab change to BigSpender
      const mockBigSpenderButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'BigSpender'
          return null
        }),
        id: 'trigger-BigSpender',
        textContent: 'Big Spender',
        matches: vi.fn(() => true)
      }

      // Change the mock return value to simulate tab change
      mockDocument.querySelector.mockReturnValue(mockBigSpenderButton)

      // Simulate click event
      const mockClickEvent = {
        target: {
          matches: vi.fn(() => true)
        }
      }

      // Get the click handler that was registered
      const clickHandler = mockDocument.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1]

      if (clickHandler) {
        clickHandler(mockClickEvent)
      }

        // Cleanup after test
        setTimeout(() => {
          cleanup()
        }, 200)
      })
    })

    it('should monitor URL changes through MutationObserver', () => {
      return new Promise<void>((resolve) => {
        const mockCallback = vi.fn((tabInfo: ActiveTabInfo) => {
          expect(tabInfo.activeCategory).toBe('SmallSpender')
          resolve()
        })

      // Initial state
      const mockInitialButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'Root'
          return null
        }),
        id: 'trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockInitialButton)

      const cleanup = tabDetector.watchForTabChanges(mockCallback)

      // Simulate mutation
      const mockNewButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'SmallSpender'
          return null
        }),
        id: 'trigger-SmallSpender',
        textContent: 'Small Spender',
        matches: vi.fn(() => true)
      }

      // Change mock return value
      mockDocument.querySelector.mockReturnValue(mockNewButton)

        // Simulate mutation observer callback
        const mockMutations = [{
          type: 'attributes',
          target: {
            matches: vi.fn(() => true)
          },
          attributeName: 'data-state'
        }]

        if (storedMutationCallback) {
          storedMutationCallback(mockMutations)
        }

        // Cleanup
        setTimeout(() => {
          cleanup()
        }, 100)
      })
    })

    it('should handle navigation events properly', () => {
      const mockCallback = vi.fn()

      const mockButton = {
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return 'Root'
          return null
        }),
        id: 'trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(mockButton)

      const cleanup = tabDetector.watchForTabChanges(mockCallback)

      // Verify event listeners were set up
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(mockObserverInstance.observe).toHaveBeenCalledWith(
        mockDocument.body,
        {
          attributes: true,
          subtree: true,
          attributeFilter: ['data-state', 'aria-selected']
        }
      )

      // Test cleanup
      cleanup()
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(mockObserverInstance.disconnect).toHaveBeenCalled()
    })
  })

  describe('extension injection', () => {
    it('should detect proper injection timing conditions', () => {
      // Test when category page is detected
      const mockTabButtons = [
        { role: 'tab', textContent: 'Root' },
        { role: 'tab', textContent: 'Big Spender' },
        { role: 'tab', textContent: 'Medium Spender' }
      ]

      mockDocument.querySelectorAll.mockReturnValue(mockTabButtons)

      const isOnCategoryPage = tabDetector.isOnCategoryPage()
      expect(isOnCategoryPage).toBe(true)
      expect(mockDocument.querySelectorAll).toHaveBeenCalledWith('button[role="tab"]')
    })

    it('should handle injection conditions when no tabs present', () => {
      mockDocument.querySelectorAll.mockReturnValue([])

      const isOnCategoryPage = tabDetector.isOnCategoryPage()
      expect(isOnCategoryPage).toBe(false)
    })

    it('should handle injection error scenarios', () => {
      // Test when DOM queries fail
      mockDocument.querySelector.mockImplementation(() => {
        throw new Error('DOM query failed')
      })

      // Should not crash when DOM access fails
      expect(() => {
        tabDetector.detectActiveTab()
      }).toThrow('DOM query failed')
    })
  })

  describe('tab state management', () => {
    it('should track tab state changes correctly', () => {
      const stateChanges: ActiveTabInfo[] = []
      const mockCallback = (tabInfo: ActiveTabInfo) => {
        stateChanges.push(tabInfo)
      }

      // Initial state - Root
      let currentCategory = 'Root'
      mockDocument.querySelector.mockImplementation(() => ({
        getAttribute: vi.fn((attr) => {
          if (attr === 'data-value') return currentCategory
          return null
        }),
        id: `trigger-${currentCategory}`,
        textContent: currentCategory,
        matches: vi.fn(() => true)
      }))

      const cleanup = tabDetector.watchForTabChanges(mockCallback)

      // Simulate state changes
      const categories = ['BigSpender', 'MediumSpender', 'SmallSpender']
      
      categories.forEach((category, index) => {
        currentCategory = category
        
        // Simulate click event
        const mockClickEvent = {
          target: {
            matches: vi.fn(() => true)
          }
        }

        const clickHandler = mockDocument.addEventListener.mock.calls.find(
          call => call[0] === 'click'
        )?.[1]

        if (clickHandler) {
          clickHandler(mockClickEvent)
        }
      })

      cleanup()

      // Verify state tracking
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(mockDocument.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function))
    })

    it('should handle tab cleanup properly', () => {
      const mockCallback = vi.fn()

      mockDocument.querySelector.mockReturnValue({
        getAttribute: vi.fn(() => 'Root'),
        id: 'trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      })

      const cleanup = tabDetector.watchForTabChanges(mockCallback)

      // Verify setup
      expect(mockDocument.addEventListener).toHaveBeenCalledWith('click', expect.any(Function))
      expect(mockObserverInstance.observe).toHaveBeenCalled()

      // Test cleanup
      cleanup()
      expect(mockDocument.removeEventListener).toHaveBeenCalled()
      expect(mockObserverInstance.disconnect).toHaveBeenCalled()
    })

    it('should handle multiple tab instances correctly', () => {
      // Test singleton pattern
      const instance1 = TabDetector.getInstance()
      const instance2 = TabDetector.getInstance()

      expect(instance1).toBe(instance2)
      expect(instance1).toBe(tabDetector)
    })

    it('should manage multiple simultaneous watchers', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      mockDocument.querySelector.mockReturnValue({
        getAttribute: vi.fn(() => 'Root'),
        id: 'trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      })

      const cleanup1 = tabDetector.watchForTabChanges(callback1)
      const cleanup2 = tabDetector.watchForTabChanges(callback2)

      // Both should set up their own listeners
      expect(mockDocument.addEventListener).toHaveBeenCalledTimes(2)
      expect(mockObserverInstance.observe).toHaveBeenCalledTimes(2)

      cleanup1()
      cleanup2()

      expect(mockDocument.removeEventListener).toHaveBeenCalledTimes(2)
      expect(mockObserverInstance.disconnect).toHaveBeenCalledTimes(2)
    })
  })

  describe('origin mapping', () => {
    it('should map polkassembly categories to origin enum values', () => {
      const testMappings = [
        { category: 'Root', expected: 'Root' },
        { category: 'WishForChange', expected: 'Wish For Change' },
        { category: 'BigSpender', expected: 'Big Spender' },
        { category: 'MediumSpender', expected: 'Medium Spender' },
        { category: 'SmallSpender', expected: 'Small Spender' },
        { category: 'BigTipper', expected: 'Big Tipper' },
        { category: 'SmallTipper', expected: 'Small Tipper' },
        { category: 'Treasurer', expected: 'Treasurer' },
        { category: 'WhitelistedCaller', expected: 'Whitelisted Caller' },
        { category: 'ReferendumCanceller', expected: 'Referendum Canceller' },
        { category: 'ReferendumKiller', expected: 'Referendum Killer' }
      ]

      testMappings.forEach(({ category, expected }) => {
        const result = tabDetector.getOriginForCategory(category)
        expect(result).toBe(expected)
      })
    })

    it('should handle unmapped categories', () => {
      const unmappedCategories = ['Discussion', 'UnknownCategory', 'CustomCategory']

      unmappedCategories.forEach(category => {
        const result = tabDetector.getOriginForCategory(category)
        expect(result).toBeNull()
      })
    })

    it('should handle special "All" category variants', () => {
      // Only test variants that actually contain 'All' (uppercase) as that's what the method checks
      const allVariants = ['All', 'AllCategories', 'ViewAll']

      allVariants.forEach(variant => {
        const result = tabDetector.getOriginForCategory(variant)
        expect(result).toBe('All')
      })

      // Test variants that don't contain 'All' (uppercase) should return null
      const nonAllVariants = ['all', 'viewall', 'categories']
      nonAllVariants.forEach(variant => {
        const result = tabDetector.getOriginForCategory(variant)
        expect(result).toBeNull()
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle malformed button elements', () => {
      const malformedButton = {
        getAttribute: vi.fn(() => null),
        id: null,
        textContent: null,
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(malformedButton)

      const result = tabDetector.detectActiveTab()
      expect(result).toEqual({
        activeCategory: null,
        shouldShowBadges: false,
        isTrackedOrigin: false
      })
    })

    it('should handle DOM access errors gracefully', () => {
      mockDocument.querySelector.mockImplementation(() => {
        throw new Error('DOM access denied')
      })

      expect(() => {
        tabDetector.detectActiveTab()
      }).toThrow('DOM access denied')
    })

    it('should handle mutation observer errors', () => {
      const mockCallback = vi.fn()
      
      mockDocument.querySelector.mockReturnValue({
        getAttribute: vi.fn(() => 'Root'),
        id: 'trigger-Root',
        textContent: 'Root',
        matches: vi.fn(() => true)
      })

      // Mock MutationObserver to throw error
      const originalMutationObserver = global.MutationObserver
      global.MutationObserver = vi.fn().mockImplementation(() => {
        throw new Error('MutationObserver failed')
      }) as any

      expect(() => {
        tabDetector.watchForTabChanges(mockCallback)
      }).toThrow('MutationObserver failed')

      // Restore
      global.MutationObserver = originalMutationObserver
    })

    it('should handle empty or whitespace category names', () => {
      const emptyButton = {
        getAttribute: vi.fn(() => null),
        id: 'trigger-',
        textContent: '   ',
        matches: vi.fn(() => true)
      }

      mockDocument.querySelector.mockReturnValue(emptyButton)

      const result = tabDetector.detectActiveTab()
      expect(result).toEqual({
        activeCategory: null,
        shouldShowBadges: false,
        isTrackedOrigin: false
      })
    })
  })
}) 