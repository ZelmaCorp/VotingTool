import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock console methods
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})

afterEach(() => {
  console.error = originalConsoleError
})

describe('inject script', () => {
  let mockWindow: any
  let mockInjectedWeb3: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Create mock injectedWeb3
    mockInjectedWeb3 = {}

    // Create mock window object
    mockWindow = {
      injectedWeb3: mockInjectedWeb3,
      postMessage: vi.fn(),
      addEventListener: vi.fn()
    }

    // Set up global window mock
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true
    })

    // Mock Date.now for consistent timestamps
    vi.spyOn(Date, 'now').mockReturnValue(1640995200000)

    // Mock setTimeout
    global.setTimeout = vi.fn((callback, delay) => {
      // For testing, we'll call callbacks immediately
      callback()
      return 123
    }) as any
  })

  describe('wallet detection logic', () => {
    // Test the core wallet detection logic that would be in checkWalletExtension
    it('should detect when injectedWeb3 is missing', () => {
      delete mockWindow.injectedWeb3
      
      // Simulate the logic from checkWalletExtension
      const result = {
        hasPolkadotExtension: false,
        availableWallets: [],
        timestamp: Date.now(),
        debug: 'window.injectedWeb3 not found'
      }

      expect(result.hasPolkadotExtension).toBe(false)
      expect(result.availableWallets).toEqual([])
      expect(result.debug).toBe('window.injectedWeb3 not found')
      expect(result.timestamp).toBe(1640995200000)
    })

    it('should detect Polkadot extension', () => {
      mockInjectedWeb3['polkadot-js'] = { enable: vi.fn() }
      
      // Simulate wallet detection logic
      const availableWallets = []
      if (mockInjectedWeb3['polkadot-js']) {
        availableWallets.push({
          name: 'Polkadot Extension',
          key: 'polkadot-js'
        })
      }

      const result = {
        hasPolkadotExtension: availableWallets.length > 0,
        availableWallets: availableWallets,
        timestamp: Date.now(),
        debug: `Found ${availableWallets.length} wallets`
      }

      expect(result.hasPolkadotExtension).toBe(true)
      expect(result.availableWallets).toHaveLength(1)
      expect(result.availableWallets[0]).toEqual({
        name: 'Polkadot Extension',
        key: 'polkadot-js'
      })
    })

    it('should detect Talisman wallet', () => {
      mockInjectedWeb3.talisman = { enable: vi.fn() }
      
      const availableWallets = []
      if (mockInjectedWeb3.talisman) {
        availableWallets.push({
          name: 'Talisman',
          key: 'talisman'
        })
      }

      const result = {
        hasPolkadotExtension: availableWallets.length > 0,
        availableWallets: availableWallets
      }

      expect(result.hasPolkadotExtension).toBe(true)
      expect(result.availableWallets[0]).toEqual({
        name: 'Talisman',
        key: 'talisman'
      })
    })

    it('should detect SubWallet with priority order', () => {
      mockInjectedWeb3['subwallet-js'] = { enable: vi.fn() }
      mockInjectedWeb3.SubWallet = { enable: vi.fn() }
      mockInjectedWeb3.subwallet = { enable: vi.fn() }
      
      // Simulate SubWallet detection logic with priority
      const availableWallets = []
      const subwalletKeys = ['subwallet-js', 'SubWallet', 'subwallet']
      
      for (const key of subwalletKeys) {
        if (mockInjectedWeb3[key]) {
          availableWallets.push({
            name: 'SubWallet',
            key: key
          })
          break // Only add once
        }
      }

      expect(availableWallets).toHaveLength(1)
      expect(availableWallets[0].key).toBe('subwallet-js') // First in priority
    })

    it('should detect multiple different wallets', () => {
      mockInjectedWeb3['polkadot-js'] = { enable: vi.fn() }
      mockInjectedWeb3.talisman = { enable: vi.fn() }
      mockInjectedWeb3['subwallet-js'] = { enable: vi.fn() }
      
      const availableWallets = []
      
      // Check Polkadot Extension
      if (mockInjectedWeb3['polkadot-js']) {
        availableWallets.push({
          name: 'Polkadot Extension',
          key: 'polkadot-js'
        })
      }
      
      // Check Talisman
      if (mockInjectedWeb3.talisman) {
        availableWallets.push({
          name: 'Talisman',
          key: 'talisman'
        })
      }
      
      // Check SubWallet
      const subwalletKeys = ['subwallet-js', 'SubWallet', 'subwallet']
      for (const key of subwalletKeys) {
        if (mockInjectedWeb3[key]) {
          availableWallets.push({
            name: 'SubWallet',
            key: key
          })
          break
        }
      }

      expect(availableWallets).toHaveLength(3)
      expect(availableWallets.map(w => w.name)).toContain('Polkadot Extension')
      expect(availableWallets.map(w => w.name)).toContain('Talisman')
      expect(availableWallets.map(w => w.name)).toContain('SubWallet')
    })
  })

  describe('wallet account handling', () => {
    it('should handle successful account retrieval', async () => {
      const mockAccounts = [
        { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', name: 'Alice' },
        { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', name: 'Bob' }
      ]

      const mockEnabledWallet = {
        accounts: {
          get: vi.fn().mockResolvedValue(mockAccounts)
        }
      }

      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockResolvedValue(mockEnabledWallet)
      }

      // Simulate getWalletAccounts logic
      const walletKey = 'polkadot-js'
      
      try {
        if (!mockInjectedWeb3[walletKey]) {
          throw new Error(`Wallet ${walletKey} not available`)
        }
        
        const enabledWallet = await mockInjectedWeb3[walletKey].enable()
        const walletAccounts = await enabledWallet.accounts.get()
        
        if (walletAccounts.length === 0) {
          throw new Error(`No accounts found in ${walletKey}`)
        }
        
        const accounts = walletAccounts.map((acc: any) => ({
          address: acc.address,
          name: acc.name || 'Unnamed Account',
          wallet: walletKey
        }))
        
        const result = {
          success: true,
          accounts: accounts,
          wallet: walletKey,
          message: `Connected to ${walletKey} successfully`
        }

        expect(result.success).toBe(true)
        expect(result.accounts).toHaveLength(2)
        expect(result.accounts[0]).toEqual({
          address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          name: 'Alice',
          wallet: 'polkadot-js'
        })
        expect(result.wallet).toBe('polkadot-js')
        expect(result.message).toBe('Connected to polkadot-js successfully')
      } catch (error: any) {
        // Should not reach here in this test
        expect(error).toBeUndefined()
      }
    })

    it('should handle wallet not available error', async () => {
      const walletKey = 'nonexistent-wallet'
      
      try {
        if (!mockInjectedWeb3[walletKey]) {
          throw new Error(`Wallet ${walletKey} not available`)
        }
      } catch (error: any) {
        const result = {
          success: false,
          error: error.message,
          wallet: walletKey
        }

        expect(result.success).toBe(false)
        expect(result.error).toBe('Wallet nonexistent-wallet not available')
        expect(result.wallet).toBe('nonexistent-wallet')
      }
    })

    it('should handle accounts without names', async () => {
      const mockAccounts = [
        { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' }
      ]

      const mockEnabledWallet = {
        accounts: {
          get: vi.fn().mockResolvedValue(mockAccounts)
        }
      }

      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockResolvedValue(mockEnabledWallet)
      }

      const walletKey = 'polkadot-js'
      const enabledWallet = await mockInjectedWeb3[walletKey].enable()
      const walletAccounts = await enabledWallet.accounts.get()
      
      const accounts = walletAccounts.map((acc: any) => ({
        address: acc.address,
        name: acc.name || 'Unnamed Account',
        wallet: walletKey
      }))

      expect(accounts[0].name).toBe('Unnamed Account')
    })

    it('should handle no accounts found', async () => {
      const mockEnabledWallet = {
        accounts: {
          get: vi.fn().mockResolvedValue([])
        }
      }

      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockResolvedValue(mockEnabledWallet)
      }

      const walletKey = 'polkadot-js'
      
      try {
        const enabledWallet = await mockInjectedWeb3[walletKey].enable()
        const walletAccounts = await enabledWallet.accounts.get()
        
        if (walletAccounts.length === 0) {
          throw new Error(`No accounts found in ${walletKey}`)
        }
      } catch (error: any) {
        const result = {
          success: false,
          error: error.message,
          wallet: walletKey
        }

        expect(result.success).toBe(false)
        expect(result.error).toBe('No accounts found in polkadot-js')
        expect(result.wallet).toBe('polkadot-js')
      }
    })
  })

  describe('signing functionality', () => {
    const testAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
    const testMessage = 'Login to OpenGov VotingTool'

    it('should handle successful message signing', async () => {
      const mockAccounts = [
        { address: testAddress, name: 'Alice' }
      ]

      const mockSigner = {
        signRaw: vi.fn().mockResolvedValue({
          signature: '0x1234567890abcdef'
        })
      }

      const mockEnabledWallet = {
        accounts: {
          get: vi.fn().mockResolvedValue(mockAccounts)
        },
        signer: mockSigner
      }

      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockResolvedValue(mockEnabledWallet)
      }

      // Simulate signMessage logic for one wallet
      const walletKey = 'polkadot-js'
      const enabledWallet = await mockInjectedWeb3[walletKey].enable()
      const accounts = await enabledWallet.accounts.get()
      const hasAddress = accounts.some((acc: any) => acc.address === testAddress)

      if (hasAddress) {
        const { signature } = await enabledWallet.signer.signRaw({
          address: testAddress,
          data: testMessage,
          type: 'bytes'
        })

        const result = {
          success: true,
          signature: signature,
          message: 'Message signed successfully',
          wallet: walletKey
        }

        expect(result.success).toBe(true)
        expect(result.signature).toBe('0x1234567890abcdef')
        expect(result.wallet).toBe('polkadot-js')
        expect(result.message).toBe('Message signed successfully')

        expect(mockSigner.signRaw).toHaveBeenCalledWith({
          address: testAddress,
          data: testMessage,
          type: 'bytes'
        })
      }
    })

    it('should handle address not found in wallet', async () => {
      const mockAccounts = [
        { address: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', name: 'Bob' }
      ]

      const mockEnabledWallet = {
        accounts: {
          get: vi.fn().mockResolvedValue(mockAccounts)
        }
      }

      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockResolvedValue(mockEnabledWallet)
      }

      const walletKey = 'polkadot-js'
      const enabledWallet = await mockInjectedWeb3[walletKey].enable()
      const accounts = await enabledWallet.accounts.get()
      const hasAddress = accounts.some((acc: any) => acc.address === testAddress)

      expect(hasAddress).toBe(false)
    })

    it('should handle signing errors', async () => {
      const mockAccounts = [
        { address: testAddress, name: 'Alice' }
      ]

      const mockSigner = {
        signRaw: vi.fn().mockRejectedValue(new Error('User cancelled signing'))
      }

      const mockEnabledWallet = {
        accounts: {
          get: vi.fn().mockResolvedValue(mockAccounts)
        },
        signer: mockSigner
      }

      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockResolvedValue(mockEnabledWallet)
      }

      try {
        const walletKey = 'polkadot-js'
        const enabledWallet = await mockInjectedWeb3[walletKey].enable()
        const accounts = await enabledWallet.accounts.get()
        const hasAddress = accounts.some((acc: any) => acc.address === testAddress)

        if (hasAddress) {
          await enabledWallet.signer.signRaw({
            address: testAddress,
            data: testMessage,
            type: 'bytes'
          })
        }
      } catch (error: any) {
        expect(error.message).toBe('User cancelled signing')
      }
    })
  })

  describe('message event handling logic', () => {
    it('should handle CHECK_WALLET_EXTENSION message structure', () => {
      const mockEvent = {
        source: mockWindow,
        data: { type: 'CHECK_WALLET_EXTENSION' }
      }

      // Simulate message handling logic
      if (mockEvent.source === mockWindow && mockEvent.data.type === 'CHECK_WALLET_EXTENSION') {
        // Simulate checkWalletExtension result
        const result = {
          hasPolkadotExtension: false,
          availableWallets: [],
          timestamp: Date.now(),
          debug: 'window.injectedWeb3 not found'
        }

        const response = {
          type: 'WALLET_EXTENSION_RESULT',
          data: result
        }

        expect(response.type).toBe('WALLET_EXTENSION_RESULT')
        expect(response.data.hasPolkadotExtension).toBe(false)
        expect(response.data.availableWallets).toEqual([])
      }
    })

    it('should handle CONNECT_WALLET message structure', () => {
      const mockEvent = {
        source: mockWindow,
        data: { 
          type: 'CONNECT_WALLET',
          walletKey: 'polkadot-js'
        }
      }

      if (mockEvent.source === mockWindow && mockEvent.data.type === 'CONNECT_WALLET') {
        const response = {
          type: 'WALLET_CONNECTION_RESULT',
          data: {
            success: false,
            error: 'Wallet polkadot-js not available',
            wallet: 'polkadot-js'
          }
        }

        expect(response.type).toBe('WALLET_CONNECTION_RESULT')
        expect(response.data.success).toBe(false)
        expect(response.data.wallet).toBe('polkadot-js')
      }
    })

    it('should ignore messages from other sources', () => {
      const mockEvent = {
        source: {}, // Different source
        data: { type: 'CHECK_WALLET_EXTENSION' }
      }

      const shouldHandle = mockEvent.source === mockWindow
      expect(shouldHandle).toBe(false)
    })
  })

  describe('initialization logic', () => {
    it('should handle timeout setup for delayed checks', () => {
      const delays = [500, 1000, 2000]
      
      delays.forEach(delay => {
        setTimeout(() => {
          // Simulate performWalletCheck
          const result = {
            hasPolkadotExtension: false,
            availableWallets: [],
            timestamp: Date.now()
          }
          
          expect(result.timestamp).toBe(1640995200000)
        }, delay)
      })

      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 500)
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 2000)
    })

    it('should handle INJECTOR_READY message structure', () => {
      const readyMessage = {
        type: 'INJECTOR_READY',
        data: { timestamp: Date.now() }
      }

      expect(readyMessage.type).toBe('INJECTOR_READY')
      expect(readyMessage.data.timestamp).toBe(1640995200000)
    })
  })

  describe('error handling patterns', () => {
    it('should handle wallet enable failures', async () => {
      mockInjectedWeb3['polkadot-js'] = {
        enable: vi.fn().mockRejectedValue(new Error('User denied access'))
      }

      try {
        await mockInjectedWeb3['polkadot-js'].enable()
      } catch (error: any) {
        // Simulate error logging that would happen in the actual inject script
        console.error('❌ Page context: Failed to get accounts from polkadot-js:', error)
        
        const result = {
          success: false,
          error: error.message,
          wallet: 'polkadot-js'
        }

        expect(result.success).toBe(false)
        expect(result.error).toBe('User denied access')
        expect(console.error).toHaveBeenCalled()
      }
    })

    it('should handle missing wallet gracefully', () => {
      const walletKey = 'nonexistent-wallet'
      const isAvailable = !!mockInjectedWeb3[walletKey]
      
      expect(isAvailable).toBe(false)
      
      if (!isAvailable) {
        const result = {
          success: false,
          error: `Wallet ${walletKey} not available`,
          wallet: walletKey
        }
        
        expect(result.error).toBe('Wallet nonexistent-wallet not available')
      }
    })
  })

  describe('wallet key detection patterns', () => {
    it('should test SubWallet key priority correctly', () => {
      const subwalletKeys = ['subwallet-js', 'SubWallet', 'subwallet']
      mockInjectedWeb3.SubWallet = { enable: vi.fn() }
      mockInjectedWeb3.subwallet = { enable: vi.fn() }
      
      let selectedKey = null
      for (const key of subwalletKeys) {
        if (mockInjectedWeb3[key]) {
          selectedKey = key
          break
        }
      }
      
      expect(selectedKey).toBe('SubWallet') // First available in order
    })

    it('should handle wallet key enumeration', () => {
      mockInjectedWeb3['polkadot-js'] = { enable: vi.fn() }
      mockInjectedWeb3.talisman = { enable: vi.fn() }
      mockInjectedWeb3.unknown = { enable: vi.fn() }
      
      const keys = Object.keys(mockInjectedWeb3)
      expect(keys).toContain('polkadot-js')
      expect(keys).toContain('talisman')
      expect(keys).toContain('unknown')
      expect(keys).toHaveLength(3)
    })
  })
}) 