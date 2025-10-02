import { vi } from 'vitest'

// Mock Chrome APIs
global.chrome = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    },
  },
  runtime: {
    id: 'test-extension-id',
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    lastError: null,
  },
} as any

// Mock Firefox browser APIs
global.window = {
  ...global.window,
  browser: {
    storage: {
      local: {
        get: vi.fn(),
        set: vi.fn(),
        remove: vi.fn(),
      },
    },
    runtime: {
      id: 'test-extension-id',
      sendMessage: vi.fn(),
      onMessage: {
        addListener: vi.fn(),
        removeListener: vi.fn(),
      },
    },
  },
} as any

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'polkadot.polkassembly.io',
    pathname: '/referendum/123',
    href: 'https://polkadot.polkassembly.io/referendum/123',
  },
  writable: true,
})

// Mock window event listeners
Object.defineProperty(window, 'addEventListener', {
  value: vi.fn(),
  writable: true,
})

Object.defineProperty(window, 'removeEventListener', {
  value: vi.fn(),
  writable: true,
})

// Mock document.body
Object.defineProperty(document, 'body', {
  value: {
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(),
  },
  writable: true,
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
} 