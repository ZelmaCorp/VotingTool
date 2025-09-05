(function() {
  "use strict";
  console.log("🚀 OpenGov VotingTool: Page context injector loaded");
  window.opengovVotingTool = {
    // Check if wallet extensions are available
    checkWalletExtension: function() {
      console.log("🔍 Page context: checking for wallet extensions...");
      console.log("🔍 Page context: window.injectedWeb3 =", window.injectedWeb3);
      const availableWallets = [];
      if (!window.injectedWeb3) {
        console.log("❌ Page context: window.injectedWeb3 is not available");
        return {
          hasPolkadotExtension: false,
          availableWallets: [],
          timestamp: Date.now(),
          debug: "window.injectedWeb3 not found"
        };
      }
      console.log("🔍 Page context: Available injected wallets:", Object.keys(window.injectedWeb3));
      if (window.injectedWeb3["polkadot-js"]) {
        console.log("✅ Page context: Found polkadot-js");
        availableWallets.push({
          name: "Polkadot Extension",
          key: "polkadot-js"
        });
      }
      if (window.injectedWeb3.talisman) {
        console.log("✅ Page context: Found talisman");
        availableWallets.push({
          name: "Talisman",
          key: "talisman"
        });
      }
      const subwalletKeys = ["subwallet-js", "SubWallet", "subwallet"];
      for (const key of subwalletKeys) {
        if (window.injectedWeb3[key]) {
          console.log("✅ Page context: Found subwallet with key:", key);
          availableWallets.push({
            name: "SubWallet",
            key
          });
          break;
        }
      }
      console.log("🔍 Page context: available wallets =", availableWallets);
      return {
        hasPolkadotExtension: availableWallets.length > 0,
        availableWallets,
        timestamp: Date.now(),
        debug: `Found ${availableWallets.length} wallets from keys: ${Object.keys(window.injectedWeb3).join(", ")}`
      };
    },
    // Get accounts from a specific wallet
    getWalletAccounts: async function(walletKey) {
      var _a;
      try {
        console.log("📋 Page context: getting accounts from wallet:", walletKey);
        if (!((_a = window.injectedWeb3) == null ? void 0 : _a[walletKey])) {
          throw new Error(`Wallet ${walletKey} not available`);
        }
        console.log("🔗 Page context: enabling wallet:", walletKey);
        const enabledWallet = await window.injectedWeb3[walletKey].enable();
        console.log("✅ Page context: wallet enabled:", enabledWallet);
        console.log("📋 Page context: getting accounts...");
        const walletAccounts = await enabledWallet.accounts.get();
        console.log("📋 Page context: raw wallet accounts =", walletAccounts);
        console.log("📋 Page context: got", walletAccounts.length, "accounts");
        if (walletAccounts.length === 0) {
          throw new Error(`No accounts found in ${walletKey}`);
        }
        const accounts = walletAccounts.map((acc) => ({
          address: acc.address,
          name: acc.name || "Unnamed Account",
          wallet: walletKey
        }));
        console.log("📋 Page context: transformed accounts =", accounts);
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
      var _a;
      try {
        console.log("✍️ Page context: signing message for address:", address);
        const wallets = ["polkadot-js", "talisman", "subwallet", "subwallet-js", "SubWallet"];
        for (const walletKey of wallets) {
          try {
            console.log("🔗 Page context: trying to enable wallet for signing:", walletKey);
            if (!((_a = window.injectedWeb3) == null ? void 0 : _a[walletKey])) {
              continue;
            }
            const enabledWallet = await window.injectedWeb3[walletKey].enable();
            console.log("✅ Page context: wallet enabled for signing:", walletKey);
            const accounts = await enabledWallet.accounts.get();
            const hasAddress = accounts.some((acc) => acc.address === address);
            if (hasAddress) {
              console.log("✅ Page context: found address in wallet:", walletKey);
              const { signature } = await enabledWallet.signer.signRaw({
                address,
                data: message,
                type: "bytes"
              });
              console.log("✅ Page context: message signed successfully");
              return {
                success: true,
                signature,
                message: "Message signed successfully",
                wallet: walletKey
              };
            }
          } catch (walletError) {
            console.log("⚠️ Page context: failed to use wallet:", walletKey, walletError);
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
      var _a;
      try {
        console.log("✍️ Page context: signing transaction for address:", address);
        const wallets = ["polkadot-js", "talisman", "subwallet", "subwallet-js", "SubWallet"];
        for (const walletKey of wallets) {
          try {
            if (!((_a = window.injectedWeb3) == null ? void 0 : _a[walletKey])) {
              continue;
            }
            const enabledWallet = await window.injectedWeb3[walletKey].enable();
            const accounts = await enabledWallet.accounts.get();
            const hasAddress = accounts.some((acc) => acc.address === address);
            if (hasAddress) {
              console.log("✅ Page context: found address in wallet:", walletKey);
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
            console.log("⚠️ Page context: failed to use wallet:", walletKey, walletError);
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
    console.log("📡 Page context: received message:", event.data.type);
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
    console.log("🚀 Page context: Performing wallet check");
    const result = window.opengovVotingTool.checkWalletExtension();
    window.opengovVotingToolResult = {
      hasPolkadotExtension: result.hasPolkadotExtension,
      availableWallets: result.availableWallets,
      timestamp: result.timestamp,
      debug: result.debug
    };
    if (result.hasPolkadotExtension) {
      console.log("🎉 Page context: Wallet extensions found!");
      window.postMessage({
        type: "WALLET_EXTENSION_DETECTED",
        data: result
      }, "*");
    } else {
      console.log("❌ Page context: No wallet extensions found yet");
      console.log("🔍 Page context: Debug info:", result.debug);
    }
    return result;
  }
  console.log("🚀 Page context script loaded");
  performWalletCheck();
  setTimeout(() => {
    console.log("🔄 Page context: 500ms delayed check");
    performWalletCheck();
  }, 500);
  setTimeout(() => {
    console.log("🔄 Page context: 1000ms delayed check");
    performWalletCheck();
  }, 1e3);
  setTimeout(() => {
    console.log("🔄 Page context: 2000ms delayed check");
    performWalletCheck();
  }, 2e3);
  window.postMessage({
    type: "INJECTOR_READY",
    data: { timestamp: Date.now() }
  }, "*");
})();
