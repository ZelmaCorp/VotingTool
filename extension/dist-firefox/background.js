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
  const version = "2.2.2";
  const packageJson = {
    version
  };
  const BUILD_ID = "v" + packageJson.version + "-" + Date.now();
  let messageCounter = 0;
  let API_CONFIG = {
    baseURL: "http://localhost:3000",
    // Default fallback
    timeout: 6e4
    // 60 seconds timeout for API calls
  };
  let configLoaded = false;
  function loadApiConfigSync() {
    if (configLoaded) return;
    try {
      chrome.storage.sync.get(["backendUrl"], (result) => {
        if (chrome.runtime.lastError) {
          console.warn("⚠️ Error loading config:", chrome.runtime.lastError.message);
          configLoaded = true;
          return;
        }
        if (result && result.backendUrl) {
          API_CONFIG.baseURL = result.backendUrl;
          console.log("✅ API config loaded:", result.backendUrl);
        }
        configLoaded = true;
      });
    } catch (error) {
      console.warn("⚠️ Failed to load API config:", error);
      configLoaded = true;
    }
  }
  loadApiConfigSync();
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes && changes.backendUrl && changes.backendUrl.newValue) {
      API_CONFIG.baseURL = changes.backendUrl.newValue;
      console.log("✅ API config updated:", changes.backendUrl.newValue);
    }
  });
  function validateFetchEnvironment(debugInfo) {
    debugInfo.step = "fetch_available_check";
    if (typeof fetch === "undefined") {
      debugInfo.error = "Fetch API is not available in this context";
      debugInfo.step = "fetch_not_available";
      return {
        success: false,
        error: "Fetch API is not available in this context"
      };
    }
    return { success: true };
  }
  function constructApiUrl(endpoint, testUrl, debugInfo) {
    debugInfo.step = "url_construction";
    const baseUrl = testUrl || API_CONFIG.baseURL;
    const url = `${baseUrl}${endpoint}`;
    debugInfo.fullUrl = url;
    debugInfo.baseUrl = baseUrl;
    debugInfo.usingTestUrl = !!testUrl;
    try {
      new URL(url);
      debugInfo.urlConstructionSuccess = true;
      return { success: true, url };
    } catch (urlError) {
      debugInfo.urlConstructionError = urlError instanceof Error ? urlError.message : "Unknown URL error";
      return {
        success: false,
        error: `Invalid URL: ${url}`
      };
    }
  }
  function prepareFetchOptions(method, data, headers, debugInfo) {
    debugInfo.step = "prepare_fetch_options";
    const options = {
      method: method.toUpperCase(),
      headers: __spreadValues(__spreadValues({
        "Content-Type": "application/json"
      }, API_CONFIG.baseURL.includes("ngrok") && { "ngrok-skip-browser-warning": "true" }), headers),
      body: data ? JSON.stringify(data) : void 0
    };
    debugInfo.fetchOptions = options;
    debugInfo.step = "about_to_fetch";
    return options;
  }
  async function handleErrorResponse(response, debugInfo) {
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
        return error;
      }
    } catch (jsonError) {
      debugInfo.jsonParseError = jsonError instanceof Error ? jsonError.message : "Unknown JSON error";
    }
    return new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  async function executeFetchWithTimeout(url, options, debugInfo) {
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
        const error = await handleErrorResponse(response, debugInfo);
        throw error;
      }
      debugInfo.step = "parsing_response";
      const responseData = await response.json();
      debugInfo.step = "success";
      return {
        success: true,
        data: responseData,
        status: response.status
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      debugInfo.step = "fetch_error";
      debugInfo.fetchError = fetchError instanceof Error ? fetchError.message : "Unknown fetch error";
      debugInfo.fetchErrorName = fetchError instanceof Error ? fetchError.name : "Unknown";
      return {
        success: false,
        error: fetchError instanceof Error ? fetchError.message : "Unknown fetch error"
      };
    }
  }
  async function makeApiCall(endpoint, method, data, headers, testUrl) {
    const debugInfo = {
      step: "starting",
      timestamp: Date.now(),
      endpoint,
      method,
      data,
      headers,
      testUrl
    };
    try {
      const envCheck = validateFetchEnvironment(debugInfo);
      if (!envCheck.success) {
        return { success: false, error: envCheck.error, debugInfo };
      }
      const urlResult = constructApiUrl(endpoint, testUrl, debugInfo);
      if (!urlResult.success) {
        return { success: false, error: urlResult.error, debugInfo };
      }
      const options = prepareFetchOptions(method, data, headers, debugInfo);
      const result = await executeFetchWithTimeout(urlResult.url, options, debugInfo);
      return __spreadProps(__spreadValues({}, result), { debugInfo });
    } catch (outerError) {
      debugInfo.step = "outer_error";
      debugInfo.outerError = outerError instanceof Error ? outerError.message : "Unknown outer error";
      return {
        success: false,
        error: outerError instanceof Error ? outerError.message : "Unknown outer error",
        debugInfo
      };
    }
  }
  function handlePing(_message, currentCount, sendResponse) {
    sendResponse({
      success: true,
      message: "Background script is alive and responding!",
      messageCount: currentCount,
      timestamp: Date.now(),
      buildId: BUILD_ID
    });
    return false;
  }
  function handleTest(_message, currentCount, sendResponse) {
    sendResponse({
      success: true,
      message: "Background script is working!",
      messageCount: currentCount,
      timestamp: Date.now(),
      buildId: BUILD_ID
    });
    return false;
  }
  function handleRequestPermission(message, _currentCount, sendResponse) {
    if (!chrome.permissions || !chrome.permissions.request) {
      console.warn("⚠️ Permissions API not available in this browser");
      sendResponse({ success: true, granted: true });
      return false;
    }
    const permissionRequest = chrome.permissions.request({
      origins: [message.origin + "/*"]
    });
    if (!permissionRequest || typeof permissionRequest.then !== "function") {
      console.warn("⚠️ Permissions request did not return a Promise");
      sendResponse({ success: true, granted: true });
      return false;
    }
    permissionRequest.then((granted) => sendResponse({ success: true, granted })).catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
  function handleCheckPermission(message, _currentCount, sendResponse) {
    if (!chrome.permissions || !chrome.permissions.contains) {
      console.warn("⚠️ Permissions API not available in this browser");
      sendResponse({ success: true, hasPermission: true });
      return false;
    }
    const permissionCheck = chrome.permissions.contains({
      origins: [message.origin + "/*"]
    });
    if (!permissionCheck || typeof permissionCheck.then !== "function") {
      console.warn("⚠️ Permissions check did not return a Promise");
      sendResponse({ success: true, hasPermission: true });
      return false;
    }
    permissionCheck.then((hasPermission) => sendResponse({ success: true, hasPermission })).catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }
  function handleApiCall(message, currentCount, sendResponse) {
    makeApiCall(message.endpoint, message.method, message.data, message.headers, message.testUrl).then((result) => {
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
      }
    });
    return true;
  }
  const MESSAGE_HANDLERS = {
    "PING": handlePing,
    "TEST": handleTest,
    "REQUEST_PERMISSION": handleRequestPermission,
    "CHECK_PERMISSION": handleCheckPermission,
    "VOTING_TOOL_API_CALL": handleApiCall
  };
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    messageCounter++;
    const currentCount = messageCounter;
    try {
      const messageType = message == null ? void 0 : message.type;
      const handler = MESSAGE_HANDLERS[messageType];
      if (handler) {
        return handler(message, currentCount, sendResponse);
      }
      sendResponse({
        success: false,
        error: `Unknown message type: ${messageType || "undefined"}`,
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
          criticalError: true
        });
      } catch (sendError) {
        console.error(`💥 Background: Failed to send critical error response for message #${currentCount}:`, sendError);
      }
      return false;
    }
  });
  let installListenerFired = false;
  chrome.runtime.onInstalled.addListener(() => {
    if (installListenerFired) return;
    installListenerFired = true;
    console.log("🚀 OpenGov VotingTool Extension v" + packageJson.version + " ready");
    loadApiConfigSync();
  });
})();
