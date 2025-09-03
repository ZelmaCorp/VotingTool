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
     * Check if wallet extensions are available
     */
    async checkWalletAvailability() {
        try {
            console.log('Checking wallet availability...');
            
            // Check if we're in a browser environment
            if (typeof window === 'undefined') {
                console.log('Not in browser environment');
                return { available: false, locked: false, error: 'Not in browser environment' };
            }
            
            // Check if the polkadot extension object exists
            if (typeof window.injectedWeb3 === 'undefined') {
                console.log('No injectedWeb3 found');
                return { available: false, locked: false, error: 'No wallet extensions detected' };
            }
            
            console.log('Available injected extensions:', Object.keys(window.injectedWeb3));
            
            // Try to enable extensions
            const extensions = await web3Enable('OpenGov Voting Tool');
            console.log('web3Enable result:', extensions);
            
            // If extensions array is empty but we have injectedWeb3, the extensions might be locked
            if (extensions.length === 0 && Object.keys(window.injectedWeb3).length > 0) {
                console.log('Extensions detected but not enabled - likely locked');
                return { available: true, locked: true, extensions: Object.keys(window.injectedWeb3) };
            }
            
            return { available: extensions.length > 0, locked: false, extensions: extensions };
        } catch (error) {
            console.error('Error checking wallet availability:', error);
            return { available: false, locked: false, error: error.message };
        }
    }

    /**
     * Get available accounts if wallet is enabled
     */
    async getAvailableAccounts() {
        try {
            console.log('Getting available accounts...');
            const accounts = await web3Accounts();
            console.log('Retrieved accounts:', accounts);
            return accounts;
        } catch (error) {
            console.error('Error getting accounts:', error);
            return [];
        }
    }

    /**
     * Authenticate with a specific account
     */
    async authenticate(account) {
        try {
            this.currentAccount = account;
            
            console.log('Account object:', account);
            console.log('Account methods:', Object.getOwnPropertyNames(account));
            console.log('Account prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(account)));
            console.log('Account address:', account.address);
            console.log('Account type:', account.type);
            console.log('Account meta:', account.meta);
            
            // Create a message to sign
            const timestamp = Date.now();
            const message = `Authenticate with OpenGov Voting Tool\nTimestamp: ${timestamp}\nAddress: ${account.address}`;
            
            // Verify account is accessible
            if (!account.address) {
                throw new Error('Account address is missing. Please select a valid account in your wallet extension.');
            }
            
            console.log('Message to sign:', message);
            console.log('Message length:', message.length);
            
            // Request signature from the wallet
            let signature;
            try {
                // Get the enabled extensions (these have the signing interfaces)
                console.log('Getting signing interface from enabled extensions...');
                const enabledExtensions = await web3Enable('OpenGov Voting Tool');
                console.log('Enabled extensions for signing:', enabledExtensions);
                
                // Try to find a signing interface
                for (const extension of enabledExtensions) {
                    console.log('Checking extension:', extension.name, 'methods:', Object.getOwnPropertyNames(extension));
                    console.log('Extension signer:', extension.signer);
                    console.log('Extension provider:', extension.provider);
                    
                    // Prioritize Talisman since we know it's working
                    if (extension.name === 'talisman') {
                        console.log('Prioritizing Talisman extension...');
                        
                        // Check if the extension has a signer with signing methods
                        if (extension.signer && extension.signer.signRaw && typeof extension.signer.signRaw === 'function') {
                            console.log('Using Talisman signer interface');
                            try {
                                signature = await extension.signer.signRaw({
                                    address: account.address,
                                    data: stringToHex(message),
                                    type: 'bytes'
                                });
                                if (signature) break;
                            } catch (signError) {
                                console.log(`Talisman signer interface failed:`, signError.message);
                                continue;
                            }
                        }
                        
                        // Check if the extension itself has signing methods
                        if (extension.signRaw && typeof extension.signRaw === 'function') {
                            console.log('Using Talisman direct signing interface');
                            try {
                                signature = await extension.signRaw({
                                    address: account.address,
                                    data: stringToHex(message),
                                    type: 'bytes'
                                });
                                if (signature) break;
                            } catch (signError) {
                                console.log(`Talisman direct interface failed:`, signError.message);
                                continue;
                            }
                        }
                        
                        // Check if the provider has signing methods
                        if (extension.provider && extension.provider.signRaw && typeof extension.provider.signRaw === 'function') {
                            console.log('Using Talisman provider interface');
                            try {
                                signature = await extension.provider.signRaw({
                                    address: account.address,
                                    data: stringToHex(message),
                                    type: 'bytes'
                                });
                                if (signature) break;
                            } catch (signError) {
                                console.log(`Talisman provider interface failed:`, signError.message);
                                continue;
                            }
                        }
                    }
                }
                
                // If Talisman didn't work, try other extensions
                if (!signature) {
                    for (const extension of enabledExtensions) {
                        if (extension.name === 'talisman') continue; // Skip Talisman, already tried
                        
                        console.log('Trying extension:', extension.name);
                        
                        // Check if the extension has a signer with signing methods
                        if (extension.signer && extension.signer.signRaw && typeof extension.signer.signRaw === 'function') {
                            console.log('Using extension signer interface:', extension.name);
                            try {
                                signature = await extension.signer.signRaw({
                                    address: account.address,
                                    data: stringToHex(message),
                                    type: 'bytes'
                                });
                                if (signature) break;
                            } catch (signError) {
                                console.log(`Extension signer interface failed:`, signError.message);
                                continue;
                            }
                        }
                        
                        // Check if the extension itself has signing methods
                        if (extension.signRaw && typeof extension.signRaw === 'function') {
                            console.log('Using extension direct signing interface:', extension.name);
                            try {
                                signature = await extension.signRaw({
                                    address: account.address,
                                    data: stringToHex(message),
                                    type: 'bytes'
                                });
                                if (signature) break;
                            } catch (signError) {
                                console.log(`Extension direct interface failed:`, signError.message);
                                continue;
                            }
                        }
                        
                        // Check if the provider has signing methods
                        if (extension.provider && extension.provider.signRaw && typeof extension.provider.signRaw === 'function') {
                            console.log('Using extension provider interface:', extension.name);
                            try {
                                signature = await extension.provider.signRaw({
                address: account.address,
                data: stringToHex(message),
                type: 'bytes'
            });
                                if (signature) break;
                            } catch (signError) {
                                console.log(`Extension provider interface failed:`, signError.message);
                                continue;
                            }
                        }
                    }
                }
                
                if (!signature) {
                    throw new Error(`No signing method found in enabled extensions. Available extensions: ${enabledExtensions.map(e => e.name).join(', ')}`);
                }
                
            } catch (signError) {
                console.error('Signing error:', signError);
                
                // Provide more specific error messages
                if (signError.message.includes('Unable to retrieve keypair')) {
                    throw new Error(`Account not accessible: ${signError.message}. Please ensure the account is unlocked and accessible in your wallet extension.`);
                } else if (signError.message.includes('User rejected')) {
                    throw new Error('Signing was rejected by the user. Please approve the signing request in your wallet extension.');
                } else if (signError.message.includes('No signing method found')) {
                    throw new Error(`No signing method found. Available extensions: ${enabledExtensions?.map(e => e.name).join(', ') || 'none'}`);
                } else {
                    throw new Error(`Failed to sign message: ${signError.message}`);
                }
            }

            // Extract signature from response
            const signatureData = signature.signature || signature || signature.message;
            if (!signatureData) {
                throw new Error('No signature received from wallet');
            }

            console.log('Signature received:', signatureData);

            // Verify signature locally
            const isValid = signatureVerify(message, signatureData, account.address);
            if (!isValid.isValid) {
                throw new Error('Invalid signature verification');
            }

            console.log('Signature verified successfully');

            // Send authentication request to backend
            const response = await axios.post(`${API_BASE_URL}/auth/web3-login`, {
                address: account.address,
                signature: signatureData,
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