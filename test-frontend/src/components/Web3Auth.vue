<template>
  <div class="web3-auth">
    <!-- Not authenticated state -->
    <div v-if="!isAuthenticated" class="auth-not-authenticated">
      <h3>Connect Your Polkadot Wallet</h3>
      <p>Connect with Talisman, Subwallet, or another Polkadot wallet extension to access the voting tool.</p>
      
      <div v-if="availableAccounts.length > 0" class="accounts-list">
        <h4>Available Accounts:</h4>
        <div class="account-item" v-for="account in availableAccounts" :key="account.address">
          <div class="account-info">
            <span class="account-name">{{ account.meta?.name || 'Unnamed Account' }}</span>
            <span class="account-address">{{ formatAddress(account.address) }}</span>
          </div>
          <button 
            @click="connectAccount(account)" 
            :disabled="connecting"
            class="connect-btn"
          >
            {{ connecting ? 'Connecting...' : 'Connect' }}
          </button>
        </div>
      </div>
      
      <div v-else-if="!walletEnabled" class="wallet-setup">
        <button @click="enableWallet" :disabled="enabling" class="enable-wallet-btn">
          {{ enabling ? 'Enabling...' : 'Enable Wallet Extensions' }}
        </button>
        <button @click="refreshAccounts" :disabled="refreshing" class="refresh-btn">
          {{ refreshing ? 'Refreshing...' : 'Refresh Wallet Connection' }}
        </button>
        <button @click="reconnectWallet" :disabled="reconnecting" class="reconnect-btn">
          {{ reconnecting ? 'Reconnecting...' : 'Reconnect Wallet' }}
        </button>
        <button @click="checkWalletStatus" class="check-btn">
          Check Wallet Status
        </button>
        <p class="wallet-help">
          Make sure you have a Polkadot wallet extension installed (Talisman, Subwallet, etc.)
        </p>
        <p v-if="walletStatus && walletStatus.includes('locked')" class="wallet-locked-help">
          <strong>Wallet Locked:</strong> Your wallet extensions are detected but locked. Please unlock them in your browser extension and try again.
        </p>
        <div v-if="walletStatus" class="wallet-status">
          <h5>Wallet Status:</h5>
          <pre>{{ walletStatus }}</pre>
        </div>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <!-- Authenticated state -->
    <div v-else class="auth-authenticated">
      <div class="user-info">
        <h4>Connected as:</h4>
        <div class="user-details">
          <span class="user-name">{{ currentUser?.name || 'Unknown' }}</span>
          <span class="user-address">{{ formatAddress(currentUser?.address || '') }}</span>
        </div>
        <button @click="logout" class="logout-btn">Disconnect</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import web3AuthService from '../services/web3Auth.js';

export default {
  name: 'Web3Auth',
  props: {
    parentAuthenticated: {
      type: Boolean,
      default: false
    }
  },
  emits: ['auth-changed'],
  
  setup(props, { emit }) {
    const availableAccounts = ref([]);
    const walletEnabled = ref(false);
    const enabling = ref(false);
    const connecting = ref(false);
    const error = ref('');
    const refreshing = ref(false);
    const walletStatus = ref('');
    const reconnecting = ref(false);
    
    // Reactive authentication state
    const localAuthState = ref(web3AuthService.isAuthenticated());

    // Computed properties
    const isAuthenticated = computed(() => {
      return localAuthState.value;
    });
    const currentUser = computed(() => {
      const user = web3AuthService.getCurrentUser();
      return user || { name: '', address: '' };
                                                                                                                                                                                        });
                                                                                                                                                                                        const currentAccount = computed(() => web3AuthService.getCurrentAccount());

                                                                                                                                                                                        // Methods
                                                                                                                                                                                        const enableWallet = async () => {
                                                                                                                                                                                          try {
                                                                                                                                                                                            enabling.value = true;
                                                                                                                                                                                            error.value = '';
        
        // Check if wallet is available
        const walletStatus = await web3AuthService.checkWalletAvailability();
        
        if (!walletStatus.available) {
          if (walletStatus.error) {
            throw new Error(`Wallet check failed: ${walletStatus.error}`);
          } else {
            throw new Error('No wallet extensions found. Please install Talisman, Subwallet, or another Polkadot wallet extension.');
          }
        }
        
        if (walletStatus.locked) {
          throw new Error(`Wallet extensions detected (${walletStatus.extensions.join(', ')}) but they are locked. Please unlock your wallet in the browser extension and try again.`);
        }
        
        // Get available accounts
        const accounts = await web3AuthService.getAvailableAccounts();
        
        if (accounts.length === 0) {
          throw new Error('No accounts found in wallet. Please unlock your wallet and try again.');
        }
        
        availableAccounts.value = accounts;
        walletEnabled.value = true;
        
      } catch (err) {
        error.value = err.message || 'Failed to enable wallet extensions';
        console.error('Wallet enable error:', err);
      } finally {
        enabling.value = false;
      }
    };

    const refreshAccounts = async () => {
      try {
        refreshing.value = true;
        const accounts = await web3AuthService.getAvailableAccounts();
        availableAccounts.value = accounts;
        walletEnabled.value = accounts.length > 0;
      } catch (err) {
        console.error('Error refreshing accounts:', err);
        walletEnabled.value = false;
        availableAccounts.value = [];
      } finally {
        refreshing.value = false;
      }
    };

    const connectAccount = async (account) => {
      try {
        connecting.value = true;
        error.value = '';
        
        const result = await web3AuthService.authenticate(account);
        
        if (result.success) {
          // Update local state
          localAuthState.value = true;
          
          emit('auth-changed', { authenticated: true, user: result.user });
        }
      } catch (err) {
        console.error('Authentication error:', err);
        
        // Handle detailed error messages from backend
        if (err.response && err.response.data) {
          const errorData = err.response.data;
          if (errorData.details) {
            // Show detailed error information
            error.value = `${errorData.error}\n\nReason: ${errorData.details.reason}\n\nSuggestion: ${errorData.details.suggestion}`;
          } else {
            error.value = errorData.error || 'Authentication failed';
          }
        } else if (err.message) {
          error.value = err.message;
        } else {
          error.value = 'Authentication failed';
        }
        
        // Add more detailed error information
        if (err.message.includes('signRaw') || err.message.includes('sign')) {
          error.value = `Wallet signing failed: ${err.message}. Please check your wallet extension and try again.`;
        }
      } finally {
        connecting.value = false;
      }
    };

    const logout = async () => {
      try {
        await web3AuthService.logout();
        
        // Update local state
        localAuthState.value = false;
        
        emit('auth-changed', { authenticated: false, user: null });
        console.log('User logged out');
        
        // Reset wallet state to allow reconnection
        walletEnabled.value = false;
        availableAccounts.value = [];
        error.value = '';
      } catch (err) {
        console.error('Logout error:', err);
      }
    };

    const reconnectWallet = async () => {
      try {
        reconnecting.value = true;
        error.value = '';
        
        // Check wallet availability again
        const walletStatus = await web3AuthService.checkWalletAvailability();
        
        if (walletStatus.available && !walletStatus.locked) {
          // Get accounts again
          const accounts = await web3AuthService.getAvailableAccounts();
          availableAccounts.value = accounts;
          walletEnabled.value = accounts.length > 0;
          
          // Clear any previous error messages
          if (accounts.length > 0) {
            error.value = '';
          }
        } else if (walletStatus.locked) {
          error.value = `Wallet extensions are locked. Please unlock them and try again.`;
          walletEnabled.value = false;
          availableAccounts.value = [];
        } else {
          error.value = `Failed to reconnect wallet: ${walletStatus.error || 'Unknown error'}`;
          walletEnabled.value = false;
          availableAccounts.value = [];
        }
      } catch (err) {
        error.value = `Reconnection failed: ${err.message}`;
        console.error('Reconnection error:', err);
        walletEnabled.value = false;
        availableAccounts.value = [];
      } finally {
        reconnecting.value = false;
      }
    };

    const formatAddress = (address) => {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    const initialize = async () => {
      try {
        //                                                                                                                          et is available
        const walletStatus = await web3AuthService.checkWalletAvailability();
        if (walletStatus.available && !walletStatus.locked) {
          // Get accounts if wallet is available
          const accounts = await web3AuthService.getAvailableAccounts();
          availableAccounts.value = accounts;
          walletEnabled.value = accounts.length > 0;
        } else if (walletStatus.locked) {
          console.log('Wallet extensions are locked during initialization');
          walletEnabled.value = false;
        } else {
          console.log('Wallet not available during initialization:', walletStatus.error);
          walletEnabled.value = false;
        }
        
        const wasAuthenticated = await web3AuthService.initialize();
        if (wasAuthenticated) {
          // Update local state
          localAuthState.value = true;
          
          emit('auth-changed', { 
            authenticated: true, 
            user: web3AuthService.getCurrentUser() 
          });
        }
      } catch (err) {
        console.error('Initialization error:', err);
        walletEnabled.value = false;
      }
    };

    const checkWalletStatus = async () => {
      try {
        walletStatus.value = 'Checking wallet status...';
        
        const status = {
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          hasWindow: typeof window !== 'undefined',
          hasInjectedWeb3: typeof window !== 'undefined' && typeof window.injectedWeb3 !== 'undefined',
          injectedExtensions: typeof window !== 'undefined' && window.injectedWeb3 ? Object.keys(window.injectedWeb3) : [],
          web3EnableResult: null,
          web3AccountsResult: null
        };
        
        try {
          const walletCheck = await web3AuthService.checkWalletAvailability();
          status.web3EnableResult = walletCheck;
        } catch (err) {
          status.web3EnableError = err.message;
        }
        
        try {
          status.web3AccountsResult = await web3AuthService.getAvailableAccounts();
        } catch (err) {
          status.web3AccountsError = err.message;
        }
        
        walletStatus.value = JSON.stringify(status, null, 2);
        console.log('Detailed wallet status:', status);
      } catch (err) {
        walletStatus.value = `Error checking wallet status: ${err.message}`;
        console.error('Wallet status check error:', err);
      }
    };

    // Lifecycle
    onMounted(() => {
      initialize();
    });

    return {
      isAuthenticated,
      currentUser,
      currentAccount,
      availableAccounts,
      walletEnabled,
      enabling,
      connecting,
      error,
      enableWallet,
      refreshAccounts,
      connectAccount,
      logout,
      formatAddress,
      refreshing,
      walletStatus,
      checkWalletStatus,
      reconnectWallet,
      reconnecting
    };
  }
};
</script>

<style scoped>
.web3-auth {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.auth-not-authenticated {
  text-align: center;
}

.auth-not-authenticated h3 {
  color: #333;
  margin-bottom: 10px;
}

.auth-not-authenticated p {
  color: #666;
  margin-bottom: 20px;
}

.enable-wallet-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 15px;
}

.enable-wallet-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wallet-help {
  font-size: 14px;
  color: #888;
  margin-top: 10px;
}

.accounts-list {
  margin-top: 20px;
  text-align: left;
}

.accounts-list h4 {
  margin-bottom: 15px;
  color: #333;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 10px;
  background: #f9f9f9;
}

.account-info {
  display: flex;
  flex-direction: column;
}

.account-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.account-address {
  font-family: monospace;
  font-size: 12px;
  color: #666;
}

.connect-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.connect-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.refresh-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.reconnect-btn {
  background: #ffc107;
  color: #333;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.reconnect-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.check-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.check-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wallet-locked-help {
  background: #fff3cd;
  color: #856404;
  padding: 10px;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 14px;
}

.wallet-status {
  margin-top: 20px;
  padding: 15px;
  background: #e9ecef;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  white-space: pre-wrap; /* Preserve whitespace and newlines */
  word-wrap: break-word; /* Break long words */
}

.auth-authenticated {
  text-align: center;
}

.user-info h4 {
  color: #333;
  margin-bottom: 15px;
}

.user-details {
  margin-bottom: 15px;
}

.user-name {
  display: block;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.user-address {
  display: block;
  font-family: monospace;
  font-size: 14px;
  color: #666;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 6px;
  margin-top: 15px;
  border: 1px solid #f5c6cb;
  white-space: pre-line; /* Preserve line breaks from \n */
  font-size: 14px;
  line-height: 1.4;
}
</style> 