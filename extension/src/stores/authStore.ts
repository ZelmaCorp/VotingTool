import { reactive, readonly } from 'vue'
import { AuthState, AuthenticatedUser, Web3AuthRequest } from '../types'
import { ApiService } from '../utils/apiService'

// Create reactive state
const state = reactive<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false
})

// Function to make API calls through background script (bypasses CSP)
async function makeApiCall(endpoint: string, method: string, data?: any, headers?: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // Add authorization header if token is available
        const requestHeaders = { ...headers }
        if (state.token) {
            requestHeaders.Authorization = `Bearer ${state.token}`
        }
        
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
                console.error('❌ Content script: Chrome runtime error:', chrome.runtime.lastError)
                reject(new Error(chrome.runtime.lastError.message))
                return
            }
            
            if (response && response.success) {
                resolve(response.data)
            } else {
                console.error('❌ Content script: API call failed, response:', response)
                const error = new Error(response?.error || 'API call failed')
                // Attach additional details for better error handling
                if (response?.debugInfo?.errorResponseBody?.details) {
                    ;(error as any).details = response.debugInfo.errorResponseBody.details
                    ;(error as any).status = response?.debugInfo?.responseStatus
                }
                reject(error)
            }
        })
    })
}

export const authStore = {
    // State
    state: readonly(state),

    // Actions
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
                
                // Store token in localStorage for persistence
                localStorage.setItem('opengov-auth-token', response.token)
                localStorage.setItem('opengov-auth-user', JSON.stringify(response.user))
                localStorage.setItem('opengov-auth-last-verified', Date.now().toString())
                
                // Refresh ApiService token
                ApiService.getInstance().refreshToken()
                
                // Dispatch authentication change event
                window.dispatchEvent(new CustomEvent('authStateChanged', { 
                    detail: { isAuthenticated: true, user: response.user } 
                }))
                
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
            
            // Return detailed error information, especially for 403 multisig errors
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
            // Clear state regardless of API call success
            state.token = null
            state.user = null
            state.isAuthenticated = false
            
            // Clear localStorage
            localStorage.removeItem('opengov-auth-token')
            localStorage.removeItem('opengov-auth-user')
            localStorage.removeItem('opengov-auth-last-verified')
            
            // Refresh ApiService token
            ApiService.getInstance().refreshToken()
            
            // Dispatch authentication change event
            window.dispatchEvent(new CustomEvent('authStateChanged', { 
                detail: { isAuthenticated: false, user: null } 
            }))
        }
    },

    async verifyToken(silentFail: boolean = false): Promise<boolean> {
        try {
            if (!state.token) return false
            
            const response = await makeApiCall('/auth/verify', 'GET')
            
            if (response.success && response.valid) {
                // Update user info if needed
                if (response.user) {
                    state.user = response.user
                }
                return true
            } else {
                // Token invalid, clear state only if not silent
                if (!silentFail) {
                    console.warn('Token verification failed:', response.error)
                    this.logout()
                }
                return false
            }
        } catch (error) {
            console.error('Token verification error:', error)
            // Only logout on verification failure if not silent mode
            // Silent mode allows temporary network issues without logging out
            if (!silentFail) {
                this.logout()
            }
            return false
        }
    },

    // Initialize auth state from localStorage
    initializeFromStorage(): void {
        const token = localStorage.getItem('opengov-auth-token')
        const userStr = localStorage.getItem('opengov-auth-user')
        const lastVerifiedStr = localStorage.getItem('opengov-auth-last-verified')
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr) as AuthenticatedUser
                state.token = token
                state.user = user
                state.isAuthenticated = true
                
                // Only verify token if it hasn't been verified recently (within last hour)
                const lastVerified = lastVerifiedStr ? parseInt(lastVerifiedStr) : 0
                const hourInMs = 60 * 60 * 1000
                const shouldVerify = Date.now() - lastVerified > hourInMs
                
                if (shouldVerify) {
                    // Verify in background, but don't logout on failure (silent mode)
                    // This allows the user to stay logged in even with temporary network issues
                    this.verifyToken(true).then(valid => {
                        if (valid) {
                            localStorage.setItem('opengov-auth-last-verified', Date.now().toString())
                        }
                        // Don't logout on failure - let API calls handle 401s naturally
                    })
                }
            } catch (error) {
                console.error('Error parsing stored auth data:', error)
                this.logout()
            }
        }
    }
}

// Initialize auth state when store is imported
authStore.initializeFromStorage() 