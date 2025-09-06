import { reactive, readonly } from 'vue'
import { AuthState, AuthenticatedUser, Web3AuthRequest, AuthResponse } from '../types'
import { config } from '../config/environment'

const state = reactive<AuthState>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false
})

// Function to make API calls through background script (bypasses CSP)
async function makeApiCall(endpoint: string, method: string, data?: any, headers?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const requestHeaders = { ...headers }
    if (state.token) {
      requestHeaders.Authorization = `Bearer ${state.token}`
    }
    
    chrome.runtime.sendMessage({ type: 'TEST' }, (testResponse) => {
      if (chrome.runtime.lastError) {
        console.error('Test message error:', chrome.runtime.lastError)
      }
    })
    
    setTimeout(() => {
      const messageId = Date.now().toString()
      
      chrome.runtime.sendMessage({
        type: 'VOTING_TOOL_API_CALL',
        messageId,
        endpoint,
        method,
        data,
        headers: requestHeaders
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Chrome runtime error:', chrome.runtime.lastError)
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        
        if (response && response.success) {
          resolve(response.data)
        } else {
          console.error('API call failed:', response)
          const error = new Error(response?.error || 'API call failed')
          if (response?.debugInfo?.errorResponseBody?.details) {
            ;(error as any).details = response.debugInfo.errorResponseBody.details
            ;(error as any).status = response?.debugInfo?.responseStatus
          }
          reject(error)
        }
      })
    }, 100)
  })
}

export const authStore = {
  state: readonly(state),

  async login(address: string, signature: string, message: string): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      state.isLoading = true
      
      const authRequest: Web3AuthRequest = {
        address,
        signature,
        message,
        timestamp: Date.now()
      }

      const response = await makeApiCall('/auth/web3-login', 'POST', authRequest)
      
      if (response.success && response.token && response.user) {
        state.token = response.token
        state.user = response.user
        state.isAuthenticated = true
        
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        
        return { success: true }
      } else {
        console.error('Login failed:', response.error)
        return { 
          success: false, 
          error: response.error || 'Login failed'
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      return {
        success: false,
        error: error.message || 'Login failed',
        details: error.details || null
      }
    } finally {
      state.isLoading = false
    }
  },

  async logout(): Promise<void> {
    try {
      if (state.token) {
        await makeApiCall('/auth/logout', 'POST')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      state.token = null
      state.user = null
      state.isAuthenticated = false
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      if (!state.token) return false
      
      const response = await makeApiCall('/auth/verify', 'GET')
      
      if (response.success && response.valid) {
        if (response.user) {
          state.user = response.user
        }
        return true
      } else {
        this.logout()
        return false
      }
    } catch (error) {
      console.error('Token verification error:', error)
      this.logout()
      return false
    }
  },

  initializeFromStorage(): void {
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AuthenticatedUser
        state.token = token
        state.user = user
        state.isAuthenticated = true
        
        this.verifyToken()
      } catch (error) {
        console.error('Error parsing stored auth data:', error)
        this.logout()
      }
    }
  }
}

authStore.initializeFromStorage() 