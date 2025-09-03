import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { stringToHex, hexToString } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class Web3AuthService {
    constructor() {
        this.currentAccount = null;
        this.authToken = localStorage.getItem('authToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    /**
     * Enable Web3 extensions and get available accounts
     */
    async enableWeb3() {
        try {
            // Enable all available extensions (Talisman, Subwallet, etc.)
            const extensions = await web3Enable('OpenGov Voting Tool');
            console.log('Enabled extensions:', extensions);

            if (extensions.length === 0) {
                throw new Error('No Web3 extensions found. Please install Talisman, Subwallet, or another Polkadot wallet extension.');
            }

            // Get all available accounts
            const accounts = await web3Accounts();
            console.log('Available accounts:', accounts);

            return accounts;
        } catch (error) {
            console.error('Error enabling Web3:', error);
            throw error;
        }
    }

    /**
     * Authenticate with a specific account
     */
    async authenticate(account) {
        try {
            this.currentAccount = account;
            
            // Create a message to sign
            const timestamp = Date.now();
            const message = `Authenticate with OpenGov Voting Tool\nTimestamp: ${timestamp}\nAddress: ${account.address}`;
            
            // Request signature from the wallet
            const signature = await account.signRaw({
                address: account.address,
                data: stringToHex(message),
                type: 'bytes'
            });

            // Verify signature locally
            const isValid = signatureVerify(message, signature.signature, account.address);
            if (!isValid.isValid) {
                throw new Error('Invalid signature');
            }

            // Send authentication request to backend
            const response = await axios.post(`${API_BASE_URL}/auth/web3-login`, {
                address: account.address,
                signature: signature.signature,
                message: message,
                timestamp: timestamp
            });

            if (response.data.success) {
                this.authToken = response.data.token;
                this.user = response.data.user;
                
                // Store in localStorage
                localStorage.setItem('authToken', this.authToken);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                // Set default authorization header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
                
                return {
                    success: true,
                    user: this.user,
                    token: this.authToken
                };
            } else {
                throw new Error(response.data.error || 'Authentication failed');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (this.authToken) {
                // Call logout endpoint
                await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${this.authToken}` }
                });
            }
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            // Clear local data
            this.currentAccount = null;
            this.authToken = null;
            this.user = null;
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            
            // Remove authorization header
            delete axios.defaults.headers.common['Authorization'];
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.authToken && !!this.user;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Get current account
     */
    getCurrentAccount() {
        return this.currentAccount;
    }

    /**
     * Get auth token
     */
    getAuthToken() {
        return this.authToken;
    }

    /**
     * Verify token validity with backend
     */
    async verifyToken() {
        try {
            if (!this.authToken) {
                return false;
            }

            const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${this.authToken}` }
            });

            return response.data.success && response.data.valid;
        } catch (error) {
            console.error('Token verification failed:', error);
            // Token is invalid, clear it
            await this.logout();
            return false;
        }
    }

    /**
     * Initialize authentication state
     */
    async initialize() {
        if (this.authToken && this.user) {
            // Verify token is still valid
            const isValid = await this.verifyToken();
            if (isValid) {
                // Set authorization header
                axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
                return true;
            }
        }
        return false;
    }
}

// Create singleton instance
const web3AuthService = new Web3AuthService();

export default web3AuthService; 