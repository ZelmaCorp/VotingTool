// Environment configuration for the extension
export const config = {
  // API configuration
  api: {
    baseUrl: 'http://localhost:3000', // Change this to your backend URL
    timeout: 10000,
  },
  
  // Polkadot network configuration
  networks: {
    polkadot: {
      name: 'Polkadot',
      ss58Prefix: 0,
      wsEndpoint: 'wss://rpc.polkadot.io',
    },
    kusama: {
      name: 'Kusama',
      ss58Prefix: 2,
      wsEndpoint: 'wss://kusama-rpc.polkadot.io',
    },
  },
  
  // Feature flags
  features: {
    enableVoting: true,
    enableProposals: true,
    enableSettings: true,
  },
} 