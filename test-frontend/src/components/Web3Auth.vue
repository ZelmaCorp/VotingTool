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
        <p class="wallet-help">
          Make sure you have a Polkadot wallet extension installed (Talisman, Subwallet, etc.)
        </p>
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
          <span class="user-name">{{ currentUser.name }}</span>
          <span class="user-address">{{ formatAddress(currentUser.wallet_address) }}</span>
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
  emits: ['auth-changed'],
  
  setup(props, { emit }) {
    const availableAccounts = ref([]);
    const walletEnabled = ref(false);
    const enabling = ref(false);
    const connecting = ref(false);
    const error = ref('');

    // Computed properties
    const isAuthenticated = computed(() => web3AuthService.isAuthenticated());
    const currentUser = computed(() => web3AuthService.getCurrentUser());
    const currentAccount = computed(() => web3AuthService.getCurrentAccount());

    // Methods
    const enableWallet = async () => {
      try {
        enabling.value = true;
        error.value = '';
        
        const accounts = await web3AuthService.enableWeb3();
        availableAccounts.value = accounts;
        walletEnabled.value = true;
        
        console.log('Wallet enabled, found accounts:', accounts.length);
      } catch (err) {
        error.value = err.message || 'Failed to enable wallet extensions';
        console.error('Wallet enable error:', err);
      } finally {
        enabling.value = false;
      }
    };

    const connectAccount = async (account) => {
      try {
        connecting.value = true;
        error.value = '';
        
        const result = await web3AuthService.authenticate(account);
        
        if (result.success) {
          emit('auth-changed', { authenticated: true, user: result.user });
          console.log('Successfully authenticated:', result.user);
        }
      } catch (err) {
        error.value = err.message || 'Authentication failed';
        console.error('Authentication error:', err);
      } finally {
        connecting.value = false;
      }
    };

    const logout = async () => {
      try {
        await web3AuthService.logout();
        emit('auth-changed', { authenticated: false, user: null });
        console.log('User logged out');
      } catch (err) {
        console.error('Logout error:', err);
      }
    };

    const formatAddress = (address) => {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    };

    const initialize = async () => {
      try {
        const wasAuthenticated = await web3AuthService.initialize();
        if (wasAuthenticated) {
          emit('auth-changed', { 
            authenticated: true, 
            user: web3AuthService.getCurrentUser() 
          });
        }
      } catch (err) {
        console.error('Initialization error:', err);
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
      connectAccount,
      logout,
      formatAddress
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
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
  border: 1px solid #f5c6cb;
}
</style> 