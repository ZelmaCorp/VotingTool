import { reactive, readonly } from 'vue'
import { AuthState, AuthenticatedUser, Web3AuthRequest, AuthResponse } from '../types'
import { config } from '../config/environment'

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
        
        console.log('📤 Content script: Sending API call message to background script...')
        console.log('📤 Content script: Message details:', {
            type: 'VOTING_TOOL_API_CALL',
            endpoint,
            method,
            data,
            headers: requestHeaders
        })
        
        // First, let's test if the background script is working at all
        chrome.runtime.sendMessage({ type: 'TEST' }, (testResponse) => {
            console.log('🧪 Content script: Test message response:', testResponse)
            if (chrome.runtime.lastError) {
                console.error('❌ Content script: Test message error:', chrome.runtime.lastError)
            }
        })
        
        // Wait a bit before sending the actual API call to ensure test message is processed
        setTimeout(() => {
            console.log('📤 Content script: Sending actual API call message...')
            
            const messageId = Date.now().toString()
            console.log('📤 Content script: Message ID:', messageId)
            
            chrome.runtime.sendMessage({
                type: 'VOTING_TOOL_API_CALL',
                messageId,
                endpoint,
                method,
                data,
                headers: requestHeaders
            }, (response) => {
                console.log('📥 Content script: Received response from background script:', response)
                console.log('📥 Content script: Response for message ID:', messageId)
                
                if (chrome.runtime.lastError) {
                    console.error('❌ Content script: Chrome runtime error:', chrome.runtime.lastError)
                    reject(new Error(chrome.runtime.lastError.message))
                    return
                }
                
                if (response && response.success) {
                    console.log('✅ Content script: API call successful, resolving with data:', response.data)
                    resolve(response.data)
                } else {
                    console.error('❌ Content script: API call failed, response:', response)
                    reject(new Error(response?.error || 'API call failed'))
                }
            })
        }, 100) // Small delay to ensure test message is processed first
    })
}

export const authStore = {
    // State
    state: readonly(state),

    // Actions
    async login(address: string, signature: string, message: string): Promise<boolean> {
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
                localStorage.setItem('auth_token', response.token)
                localStorage.setItem('auth_user', JSON.stringify(response.user))
                
                return true
            } else {
                console.error('Login failed:', response.error)
                return false
            }
        } catch (error) {
            console.error('Login error:', error)
            return false
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
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
    },

    async verifyToken(): Promise<boolean> {
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
                // Token invalid, clear state
                this.logout()
                return false
            }
        } catch (error) {
            console.error('Token verification error:', error)
            // Token verification failed, clear state
            this.logout()
            return false
        }
    },

    // Initialize auth state from localStorage
    initializeFromStorage(): void {
        const token = localStorage.getItem('auth_token')
        const userStr = localStorage.getItem('auth_user')
        
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr) as AuthenticatedUser
                state.token = token
                state.user = user
                state.isAuthenticated = true
                
                // Verify token is still valid
                this.verifyToken()
            } catch (error) {
                console.error('Error parsing stored auth data:', error)
                this.logout()
            }
        }
    }
}

// Initialize auth state when store is imported
authStore.initializeFromStorage() 