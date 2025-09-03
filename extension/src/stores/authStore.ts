import { reactive, readonly } from 'vue'
import { AuthState, AuthenticatedUser, Web3AuthRequest, AuthResponse } from '../types'
import { config } from '../config/environment'
import axios from 'axios'

// Create reactive state
const state = reactive<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false
})

// Create axios instance with auth interceptor
const api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`
    }
    return config
})

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

            const response = await api.post<AuthResponse>('/auth/web3-login', authRequest)
            
            if (response.data.success && response.data.token && response.data.user) {
                state.token = response.data.token
                state.user = response.data.user
                state.isAuthenticated = true
                
                // Store token in localStorage for persistence
                localStorage.setItem('auth_token', response.data.token)
                localStorage.setItem('auth_user', JSON.stringify(response.data.user))
                
                return true
            } else {
                console.error('Login failed:', response.data.error)
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
                await api.post('/auth/logout')
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
            
            const response = await api.get<AuthResponse>('/auth/verify')
            
            if (response.data.success && response.data.valid) {
                // Update user info if needed
                if (response.data.user) {
                    state.user = response.data.user
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