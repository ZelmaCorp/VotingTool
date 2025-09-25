(function() {
  "use strict";
  window.opengovVotingTool = {
    // Check if wallet extensions are available
    checkWalletExtension: function() {
      const injectedWeb3 = window.injectedWeb3;
      const availableWallets = [];
      if (injectedWeb3) {
        if (injectedWeb3["polkadot-js"]) {
          availableWallets.push({
            name: "Polkadot Developer Signer",
            key: "polkadot-js"
          });
        }
        if (injectedWeb3.talisman) {
          availableWallets.push({
            name: "Talisman",
            key: "talisman"
          });
        }
        if (injectedWeb3.subwallet || injectedWeb3["subwallet-js"] || injectedWeb3.SubWallet) {
          availableWallets.push({
            name: "SubWallet",
            key: injectedWeb3["subwallet-js"] ? "subwallet-js" : injectedWeb3.SubWallet ? "SubWallet" : "subwallet"
          });
        }
        if (injectedWeb3["nova-wallet"]) {
          availableWallets.push({
            name: "Nova Wallet",
            key: "nova-wallet"
          });
        }
      }
      return {
        hasPolkadotExtension: availableWallets.length > 0,
        availableWallets,
        timestamp: Date.now(),
        debug: `Found ${availableWallets.length} installed Tier 1 wallets`
      };
    },
    // Get accounts from a specific wallet
    getWalletAccounts: async function(walletKey) {
      try {
        const injectedWeb3 = window.injectedWeb3;
        if (!(injectedWeb3 == null ? void 0 : injectedWeb3[walletKey])) {
          throw new Error(`Wallet ${walletKey} not available`);
        }
        const enabledWallet = await injectedWeb3[walletKey].enable();
        const walletAccounts = await enabledWallet.accounts.get();
        if (walletAccounts.length === 0) {
          throw new Error(`No accounts found in ${walletKey}`);
        }
        const accounts = walletAccounts.map((acc) => ({
          address: acc.address,
          name: acc.name || "Unnamed Account",
          wallet: walletKey
        }));
        return {
          success: true,
          accounts,
          wallet: walletKey,
          message: `Connected to ${walletKey} successfully`
        };
      } catch (error) {
        console.error(`❌ Page context: Failed to get accounts from ${walletKey}:`, error);
        return {
          success: false,
          error: error.message,
          wallet: walletKey
        };
      }
    },
    // Sign a message
    signMessage: async function(address, message) {
      try {
        const wallets = [
          "polkadot-js",
          "talisman",
          "subwallet",
          "subwallet-js",
          "SubWallet",
          "nova-wallet"
        ];
        const injectedWeb3 = window.injectedWeb3;
        for (const walletKey of wallets) {
          try {
            if (!(injectedWeb3 == null ? void 0 : injectedWeb3[walletKey])) {
              continue;
            }
            const enabledWallet = await injectedWeb3[walletKey].enable();
            const accounts = await enabledWallet.accounts.get();
            const hasAddress = accounts.some((acc) => acc.address === address);
            if (hasAddress) {
              const { signature } = await enabledWallet.signer.signRaw({
                address,
                data: message,
                type: "bytes"
              });
              return {
                success: true,
                signature,
                message: "Message signed successfully",
                wallet: walletKey
              };
            }
          } catch (walletError) {
            continue;
          }
        }
        throw new Error("Could not find or enable wallet for this address");
      } catch (error) {
        console.error("❌ Page context: Failed to sign message:", error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    // Sign a transaction (for future use)
    signTransaction: async function(address, transaction) {
      try {
        const wallets = ["polkadot-js", "talisman", "subwallet", "subwallet-js", "SubWallet"];
        const injectedWeb3 = window.injectedWeb3;
        for (const walletKey of wallets) {
          try {
            if (!(injectedWeb3 == null ? void 0 : injectedWeb3[walletKey])) {
              continue;
            }
            const enabledWallet = await injectedWeb3[walletKey].enable();
            const accounts = await enabledWallet.accounts.get();
            const hasAddress = accounts.some((acc) => acc.address === address);
            if (hasAddress) {
              const { signature } = await enabledWallet.signer.signRaw({
                address,
                data: transaction,
                type: "bytes"
              });
              return {
                success: true,
                signature,
                message: "Transaction signed successfully",
                wallet: walletKey
              };
            }
          } catch (walletError) {
            continue;
          }
        }
        throw new Error("Could not find or enable wallet for this address");
      } catch (error) {
        console.error("❌ Page context: Failed to sign transaction:", error);
        return {
          success: false,
          error: error.message
        };
      }
    }
  };
  window.addEventListener("message", function(event) {
    if (event.source !== window) return;
    if (event.data.type === "CHECK_WALLET_EXTENSION") {
      const result = window.opengovVotingTool.checkWalletExtension();
      window.postMessage({
        type: "WALLET_EXTENSION_RESULT",
        data: result
      }, "*");
    }
    if (event.data.type === "CONNECT_WALLET") {
      const { walletKey } = event.data;
      window.opengovVotingTool.getWalletAccounts(walletKey).then((result) => {
        window.postMessage({
          type: "WALLET_CONNECTION_RESULT",
          data: result
        }, "*");
      });
    }
    if (event.data.type === "SIGN_MESSAGE") {
      const { address, message } = event.data;
      window.opengovVotingTool.signMessage(address, message).then((result) => {
        window.postMessage({
          type: "SIGNATURE_RESULT",
          data: result
        }, "*");
      });
    }
    if (event.data.type === "SIGN_TRANSACTION") {
      const { address, transaction } = event.data;
      window.opengovVotingTool.signTransaction(address, transaction).then((result) => {
        window.postMessage({
          type: "TRANSACTION_SIGNATURE_RESULT",
          data: result
        }, "*");
      });
    }
  });
  function performWalletCheck() {
    const result = window.opengovVotingTool.checkWalletExtension();
    window.opengovVotingToolResult = {
      hasPolkadotExtension: result.hasPolkadotExtension,
      availableWallets: result.availableWallets,
      timestamp: result.timestamp,
      debug: result.debug
    };
    if (result.hasPolkadotExtension) {
      window.postMessage({
        type: "WALLET_EXTENSION_DETECTED",
        data: result
      }, "*");
    }
    return result;
  }
  performWalletCheck();
  setTimeout(() => {
    performWalletCheck();
  }, 500);
  setTimeout(() => {
    performWalletCheck();
  }, 1e3);
  setTimeout(() => {
    performWalletCheck();
  }, 2e3);
  window.postMessage({
    type: "INJECTOR_READY",
    data: { timestamp: Date.now() }
  }, "*");
})();
