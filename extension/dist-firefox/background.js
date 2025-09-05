var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
(function() {
  "use strict";
  console.log("OpenGov VotingTool Background script loaded!");
  const BUILD_ID = "v1.1.0-" + Date.now();
  console.log("🏗️ Background: Build ID:", BUILD_ID);
  let messageCounter = 0;
  const API_CONFIG = {
    // For development, you can use ngrok: ngrok http 3000
    // baseURL: 'https://abc123.ngrok.io',
    //baseURL: 'http://localhost:3000',
    baseURL: "https://adbd39243b76.ngrok-free.app",
    timeout: 1e4
  };
  async function makeApiCall(endpoint, method, data, headers) {
    const debugInfo = {
      step: "starting",
      timestamp: Date.now(),
      endpoint,
      method,
      data,
      headers
    };
    try {
      debugInfo.step = "fetch_available_check";
      if (typeof fetch === "undefined") {
        debugInfo.error = "Fetch API is not available in this context";
        debugInfo.step = "fetch_not_available";
        return {
          success: false,
          error: "Fetch API is not available in this context",
          debugInfo
        };
      }
      debugInfo.step = "url_construction";
      const url = `${API_CONFIG.baseURL}${endpoint}`;
      debugInfo.fullUrl = url;
      try {
        new URL(url);
        debugInfo.urlConstructionSuccess = true;
      } catch (urlError) {
        debugInfo.urlConstructionError = urlError instanceof Error ? urlError.message : "Unknown URL error";
        return {
          success: false,
          error: `Invalid URL: ${url}`,
          debugInfo
        };
      }
      debugInfo.step = "test_fetch";
      try {
        const testResponse = await fetch("https://httpbin.org/get");
        debugInfo.testFetchSuccess = true;
        debugInfo.testFetchStatus = testResponse.status;
      } catch (testError) {
        debugInfo.testFetchError = testError instanceof Error ? testError.message : "Unknown test error";
        debugInfo.testFetchErrorName = testError instanceof Error ? testError.name : "Unknown";
      }
      debugInfo.step = "prepare_fetch_options";
      const options = {
        method: method.toUpperCase(),
        headers: __spreadValues({
          "Content-Type": "application/json"
        }, headers),
        body: data ? JSON.stringify(data) : void 0
      };
      debugInfo.fetchOptions = options;
      debugInfo.step = "about_to_fetch";
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        debugInfo.timeout = true;
        controller.abort();
      }, API_CONFIG.timeout);
      try {
        debugInfo.step = "executing_fetch";
        const response = await fetch(url, __spreadProps(__spreadValues({}, options), {
          signal: controller.signal
        }));
        clearTimeout(timeoutId);
        debugInfo.step = "fetch_completed";
        debugInfo.responseStatus = response.status;
        debugInfo.responseStatusText = response.statusText;
        if (!response.ok) {
          debugInfo.step = "response_not_ok";
          try {
            const errorResponse = await response.json();
            debugInfo.errorResponseBody = errorResponse;
            if (errorResponse.error) {
              const error = new Error(errorResponse.error);
              if (response.status === 403 && errorResponse.details) {
                ;
                error.details = errorResponse.details;
                error.status = response.status;
              }
              throw error;
            }
          } catch (jsonError) {
            debugInfo.jsonParseError = jsonError instanceof Error ? jsonError.message : "Unknown JSON error";
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        debugInfo.step = "parsing_response";
        const responseData = await response.json();
        debugInfo.step = "success";
        return {
          success: true,
          data: responseData,
          status: response.status,
          debugInfo
        };
      } catch (fetchError) {
        clearTimeout(timeoutId);
        debugInfo.step = "fetch_error";
        debugInfo.fetchError = fetchError instanceof Error ? fetchError.message : "Unknown fetch error";
        debugInfo.fetchErrorName = fetchError instanceof Error ? fetchError.name : "Unknown";
        debugInfo.fetchErrorStack = fetchError instanceof Error ? fetchError.stack : void 0;
        return {
          success: false,
          error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
          debugInfo
        };
      }
    } catch (outerError) {
      debugInfo.step = "outer_error";
      debugInfo.outerError = outerError instanceof Error ? outerError.message : "Unknown outer error";
      debugInfo.outerErrorName = outerError instanceof Error ? outerError.name : "Unknown";
      debugInfo.outerErrorStack = outerError instanceof Error ? outerError.stack : void 0;
      return {
        success: false,
        error: outerError instanceof Error ? outerError.message : "Unknown outer error",
        debugInfo
      };
    }
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    messageCounter++;
    const currentCount = messageCounter;
    try {
      console.log(`📨 Background: Received message #${currentCount}:`, message);
      console.log(`📨 Background: Message type: ${message == null ? void 0 : message.type}`);
      console.log(`📨 Background: Sender:`, sender);
      console.log(`📨 Background: Full message object:`, JSON.stringify(message, null, 2));
      if ((message == null ? void 0 : message.type) === "PING") {
        console.log(`🏓 Background: Responding to PING message #${currentCount}`);
        sendResponse({
          success: true,
          message: "Background script is alive and responding!",
          messageCount: currentCount,
          timestamp: Date.now(),
          buildId: BUILD_ID
        });
        return false;
      }
      if ((message == null ? void 0 : message.type) === "TEST") {
        console.log(`🧪 Background: Processing test message #${currentCount}`);
        sendResponse({
          success: true,
          message: "Background script is working!",
          messageCount: currentCount,
          timestamp: Date.now(),
          buildId: BUILD_ID
        });
        return false;
      }
      if ((message == null ? void 0 : message.type) === "VOTING_TOOL_API_CALL") {
        console.log(`🌐 Background: Processing voting tool API call request #${currentCount}:`, {
          messageId: message.messageId,
          endpoint: message.endpoint,
          method: message.method,
          data: message.data,
          headers: message.headers
        });
        makeApiCall(message.endpoint, message.method, message.data, message.headers).then((result) => {
          console.log(`📤 Background: Sending API result back to content script for message #${currentCount}:`, result);
          try {
            sendResponse(__spreadProps(__spreadValues({}, result), {
              messageCount: currentCount,
              messageId: message.messageId
            }));
          } catch (error) {
            console.error(`❌ Background: Failed to send response for message #${currentCount}:`, error);
            try {
              sendResponse({
                success: false,
                error: "Failed to send response",
                details: error instanceof Error ? error.message : "Unknown error",
                messageCount: currentCount,
                messageId: message.messageId,
                responseError: true
              });
            } catch (sendError) {
              console.error(`❌ Background: Completely failed to send any response for message #${currentCount}:`, sendError);
            }
          }
        }).catch((error) => {
          console.error(`❌ Background: Error in API call for message #${currentCount}:`, error);
          try {
            sendResponse({
              success: false,
              error: error.message || "Unknown error",
              details: error instanceof Error ? error.stack : void 0,
              backgroundError: true,
              messageCount: currentCount,
              messageId: message.messageId
            });
          } catch (responseError) {
            console.error(`❌ Background: Failed to send error response for message #${currentCount}:`, responseError);
            try {
              sendResponse({
                success: false,
                error: "Failed to send error response",
                messageCount: currentCount,
                messageId: message.messageId,
                criticalError: true
              });
            } catch (finalError) {
              console.error(`❌ Background: Final attempt to send response failed for message #${currentCount}:`, finalError);
            }
          }
        });
        return true;
      }
      console.log(`⚠️ Background: Unknown message type #${currentCount}: ${message == null ? void 0 : message.type}`);
      console.log(`⚠️ Background: Sending default error response`);
      sendResponse({
        success: false,
        error: `Unknown message type: ${(message == null ? void 0 : message.type) || "undefined"}`,
        messageCount: currentCount
      });
      return false;
    } catch (outerError) {
      console.error(`💥 Background: Critical error in message handler for message #${currentCount}:`, outerError);
      try {
        sendResponse({
          success: false,
          error: "Critical error in message handler",
          details: outerError instanceof Error ? outerError.message : "Unknown critical error",
          messageCount: currentCount,
          criticalError: true,
          stack: outerError instanceof Error ? outerError.stack : void 0
        });
      } catch (sendError) {
        console.error(`💥 Background: Failed to send critical error response for message #${currentCount}:`, sendError);
      }
      return false;
    }
  });
  const injectedTabs = /* @__PURE__ */ new Set();
  function injectContentScript(tabId, url) {
    console.log("🎯 Attempting to inject content script into tab:", tabId, "URL:", url);
    if (injectedTabs.has(tabId)) {
      console.log("✅ Tab already injected, skipping:", tabId);
      return;
    }
    const isPolkassembly = url.includes("polkassembly.io");
    const isSubsquare = url.includes("subsquare.io");
    if (!isPolkassembly && !isSubsquare) {
      console.log("❌ Not a supported site, skipping injection");
      return;
    }
    console.log("✅ Supported site detected, injecting content script...");
    try {
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["content.js"]
      }).then(() => {
        console.log("✅ Content script injected successfully!");
        injectedTabs.add(tabId);
      }).catch((error) => {
        console.error("❌ Failed to inject content script:", error);
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            console.log("🧪 FALLBACK CONTENT SCRIPT INJECTED!");
            console.log("📍 Current URL:", window.location.href);
            const testDiv = document.createElement("div");
            testDiv.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50px;
            z-index: 999999;
            background: #00ff00;
            color: black;
            border: 5px solid #000000;
            border-radius: 10px;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
          `;
            testDiv.innerHTML = "🧪 FALLBACK INJECTION - EXTENSION WORKS! 🧪";
            document.body.appendChild(testDiv);
            console.log("✅ Fallback test element added to page");
          }
        }).then(() => {
          console.log("✅ Fallback script injected successfully!");
          injectedTabs.add(tabId);
        }).catch((fallbackError) => {
          console.error("❌ Fallback injection also failed:", fallbackError);
        });
      });
    } catch (error) {
      console.error("❌ Error in injection attempt:", error);
    }
  }
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      console.log("🔄 Tab updated:", tabId, "URL:", tab.url);
      injectContentScript(tabId, tab.url);
    }
  });
  chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("🎯 Tab activated:", activeInfo.tabId);
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url) {
        console.log("📍 Active tab URL:", tab.url);
        injectContentScript(tab.id, tab.url);
      }
    });
  });
  chrome.tabs.onRemoved.addListener((tabId) => {
    if (injectedTabs.has(tabId)) {
      console.log("🧹 Cleaning up injected tab tracking:", tabId);
      injectedTabs.delete(tabId);
    }
  });
  chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Extension installed/updated, checking current tabs...");
    injectedTabs.clear();
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.url && tab.id) {
          console.log("🔍 Checking existing tab:", tab.id, tab.url);
          injectContentScript(tab.id, tab.url);
        }
      });
    });
  });
})();
