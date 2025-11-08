// OpenGov VotingTool Extension - Background Script
// This will be the main entry point for the extension

import packageJson from '../package.json'

// Build identifier for debugging (version from package.json)
const BUILD_ID = 'v' + packageJson.version + '-' + Date.now()

// Message counter for debugging
let messageCounter = 0

// API configuration - now loaded dynamically from storage
let API_CONFIG = {
  baseURL: 'http://localhost:3000', // Default fallback
  timeout: 60000 // 60 seconds timeout for API calls
}

let configLoaded = false

// Load API configuration from storage - synchronous approach
function loadApiConfigSync() {
  if (configLoaded) return
  
  try {
    // Use sync get without await for immediate availability
    chrome.storage.sync.get(['backendUrl'], (result) => {
      if (chrome.runtime.lastError) {
        console.warn('⚠️ Error loading config:', chrome.runtime.lastError.message)
        configLoaded = true
        return
      }
      
      if (result && result.backendUrl) {
        API_CONFIG.baseURL = result.backendUrl
        console.log('✅ API config loaded:', result.backendUrl)
      }
      configLoaded = true
    })
  } catch (error) {
    console.warn('⚠️ Failed to load API config:', error)
    configLoaded = true
  }
}

// Initialize immediately
loadApiConfigSync()

// Listen for config changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes && changes.backendUrl && changes.backendUrl.newValue) {
    API_CONFIG.baseURL = changes.backendUrl.newValue
    console.log('✅ API config updated:', changes.backendUrl.newValue)
  }
})

// Function to make API calls from background script context (bypasses CSP)
/**
 * Validates that the fetch API is available in the current context
 */
function validateFetchEnvironment(debugInfo: any): { success: boolean; error?: string } {
  debugInfo.step = 'fetch_available_check'
  
  if (typeof fetch === 'undefined') {
    debugInfo.error = 'Fetch API is not available in this context'
    debugInfo.step = 'fetch_not_available'
    return {
      success: false,
      error: 'Fetch API is not available in this context'
    }
  }
  
  return { success: true }
}

/**
 * Constructs and validates the API URL
 */
function constructApiUrl(endpoint: string, testUrl: string | undefined, debugInfo: any): { 
  success: boolean; 
  url?: string; 
  error?: string 
} {
  debugInfo.step = 'url_construction'
  
  const baseUrl = testUrl || API_CONFIG.baseURL
  const url = `${baseUrl}${endpoint}`
  
  debugInfo.fullUrl = url
  debugInfo.baseUrl = baseUrl
  debugInfo.usingTestUrl = !!testUrl
  
  // Validate URL construction
  try {
    new URL(url)
    debugInfo.urlConstructionSuccess = true
    return { success: true, url }
  } catch (urlError) {
    debugInfo.urlConstructionError = urlError instanceof Error ? urlError.message : 'Unknown URL error'
    return {
      success: false,
      error: `Invalid URL: ${url}`
    }
  }
}

/**
 * Prepares fetch options including headers and body
 */
function prepareFetchOptions(method: string, data: any, headers: any, debugInfo: any): RequestInit {
  debugInfo.step = 'prepare_fetch_options'
  
  const options: RequestInit = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      // Add ngrok bypass header if using ngrok
      ...(API_CONFIG.baseURL.includes('ngrok') && { 'ngrok-skip-browser-warning': 'true' }),
      ...headers
    },
    body: data ? JSON.stringify(data) : undefined
  }
  
  debugInfo.fetchOptions = options
  debugInfo.step = 'about_to_fetch'
  
  return options
}

/**
 * Handles error responses from the API
 */
async function handleErrorResponse(response: Response, debugInfo: any): Promise<Error> {
  debugInfo.step = 'response_not_ok'
  
  // Try to extract structured error from response body
  try {
    const errorResponse = await response.json()
    debugInfo.errorResponseBody = errorResponse
    
    if (errorResponse.error) {
      const error = new Error(errorResponse.error)
      
      // Attach additional details for 403 errors (multisig access denied)
      if (response.status === 403 && errorResponse.details) {
        ;(error as any).details = errorResponse.details
        ;(error as any).status = response.status
      }
      
      return error
    }
  } catch (jsonError) {
    // If we can't parse JSON, fall back to status text
    debugInfo.jsonParseError = jsonError instanceof Error ? jsonError.message : 'Unknown JSON error'
  }
  
  return new Error(`HTTP ${response.status}: ${response.statusText}`)
}

/**
 * Executes the fetch request with timeout handling
 */
async function executeFetchWithTimeout(
  url: string, 
  options: RequestInit, 
  debugInfo: any
): Promise<{ success: boolean; data?: any; status?: number; error?: string }> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    debugInfo.timeout = true
    controller.abort()
  }, API_CONFIG.timeout)
  
  try {
    debugInfo.step = 'executing_fetch'
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    debugInfo.step = 'fetch_completed'
    debugInfo.responseStatus = response.status
    debugInfo.responseStatusText = response.statusText
    
    // Handle error responses
    if (!response.ok) {
      const error = await handleErrorResponse(response, debugInfo)
      throw error
    }
    
    // Parse successful response
    debugInfo.step = 'parsing_response'
    const responseData = await response.json()
    debugInfo.step = 'success'
    
    return {
      success: true,
      data: responseData,
      status: response.status
    }
    
  } catch (fetchError) {
    clearTimeout(timeoutId)
    debugInfo.step = 'fetch_error'
    debugInfo.fetchError = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
    debugInfo.fetchErrorName = fetchError instanceof Error ? fetchError.name : 'Unknown'
    
    return {
      success: false,
      error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
    }
  }
}

/**
 * Main API call orchestrator - delegates to smaller helper functions
 */
async function makeApiCall(endpoint: string, method: string, data?: any, headers?: any, testUrl?: string) {
  const debugInfo: any = {
    step: 'starting',
    timestamp: Date.now(),
    endpoint,
    method,
    data,
    headers,
    testUrl
  }
  
  try {
    const envCheck = validateFetchEnvironment(debugInfo)
    if (!envCheck.success) {
      return { success: false, error: envCheck.error, debugInfo }
    }
    
    const urlResult = constructApiUrl(endpoint, testUrl, debugInfo)
    if (!urlResult.success) {
      return { success: false, error: urlResult.error, debugInfo }
    }
    
    const options = prepareFetchOptions(method, data, headers, debugInfo)
    
    const result = await executeFetchWithTimeout(urlResult.url!, options, debugInfo)
    
    return { ...result, debugInfo }
    
  } catch (outerError) {
    debugInfo.step = 'outer_error'
    debugInfo.outerError = outerError instanceof Error ? outerError.message : 'Unknown outer error'
    
    return {
      success: false,
      error: outerError instanceof Error ? outerError.message : 'Unknown outer error',
      debugInfo
    }
  }
}

// ============================================================================
// Message Handler Routing Pattern
// ============================================================================

/**
 * Handler for PING messages - health check
 */
function handlePing(message: any, currentCount: number, sendResponse: Function): boolean {
  sendResponse({ 
    success: true, 
    message: 'Background script is alive and responding!',
    messageCount: currentCount,
    timestamp: Date.now(),
    buildId: BUILD_ID
  })
  return false // Synchronous response
}

/**
 * Handler for TEST messages - basic connectivity test
 */
function handleTest(message: any, currentCount: number, sendResponse: Function): boolean {
  sendResponse({ 
    success: true, 
    message: 'Background script is working!',
    messageCount: currentCount,
    timestamp: Date.now(),
    buildId: BUILD_ID
  })
  return false // Synchronous response
}

/**
 * Handler for REQUEST_PERMISSION messages
 */
function handleRequestPermission(message: any, currentCount: number, sendResponse: Function): boolean {
  // Check if permissions API is available
  if (!chrome.permissions || !chrome.permissions.request) {
    console.warn('⚠️ Permissions API not available in this browser')
    sendResponse({ success: true, granted: true }) // Assume granted if API not available
    return false
  }
  
  const permissionRequest = chrome.permissions.request({
    origins: [message.origin + '/*']
  })
  
  // Check if request returned a Promise
  if (!permissionRequest || typeof permissionRequest.then !== 'function') {
    console.warn('⚠️ Permissions request did not return a Promise')
    sendResponse({ success: true, granted: true }) // Assume granted
    return false
  }
  
  permissionRequest
    .then(granted => sendResponse({ success: true, granted }))
    .catch(error => sendResponse({ success: false, error: error.message }))
  
  return true // Asynchronous response
}

/**
 * Handler for CHECK_PERMISSION messages
 */
function handleCheckPermission(message: any, currentCount: number, sendResponse: Function): boolean {
  // Check if permissions API is available
  if (!chrome.permissions || !chrome.permissions.contains) {
    console.warn('⚠️ Permissions API not available in this browser')
    sendResponse({ success: true, hasPermission: true }) // Assume has permission if API not available
    return false
  }
  
  const permissionCheck = chrome.permissions.contains({
    origins: [message.origin + '/*']
  })
  
  // Check if contains returned a Promise
  if (!permissionCheck || typeof permissionCheck.then !== 'function') {
    console.warn('⚠️ Permissions check did not return a Promise')
    sendResponse({ success: true, hasPermission: true }) // Assume has permission
    return false
  }
  
  permissionCheck
    .then(hasPermission => sendResponse({ success: true, hasPermission }))
    .catch(error => sendResponse({ success: false, error: error.message }))
  
  return true // Asynchronous response
}

/**
 * Handler for API call messages
 */
function handleApiCall(message: any, currentCount: number, sendResponse: Function): boolean {
  makeApiCall(message.endpoint, message.method, message.data, message.headers, message.testUrl)
    .then(result => {
      try {
        sendResponse({
          ...result,
          messageCount: currentCount,
          messageId: message.messageId
        })
      } catch (error) {
        console.error(`❌ Background: Failed to send response for message #${currentCount}:`, error)
        try {
          sendResponse({
            success: false,
            error: 'Failed to send response',
            details: error instanceof Error ? error.message : 'Unknown error',
            messageCount: currentCount,
            messageId: message.messageId,
            responseError: true
          })
        } catch (sendError) {
          console.error(`❌ Background: Completely failed to send any response for message #${currentCount}:`, sendError)
        }
      }
    })
    .catch(error => {
      console.error(`❌ Background: Error in API call for message #${currentCount}:`, error)
      try {
        sendResponse({
          success: false,
          error: error.message || 'Unknown error',
          details: error instanceof Error ? error.stack : undefined,
          backgroundError: true,
          messageCount: currentCount,
          messageId: message.messageId
        })
      } catch (responseError) {
        console.error(`❌ Background: Failed to send error response for message #${currentCount}:`, responseError)
      }
    })
  
  return true // Asynchronous response
}

/**
 * Message type router - maps message types to handlers
 */
type MessageHandler = (message: any, currentCount: number, sendResponse: Function) => boolean

const MESSAGE_HANDLERS: Record<string, MessageHandler> = {
  'PING': handlePing,
  'TEST': handleTest,
  'REQUEST_PERMISSION': handleRequestPermission,
  'CHECK_PERMISSION': handleCheckPermission,
  'VOTING_TOOL_API_CALL': handleApiCall
}

/**
 * Main message dispatcher with routing
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  messageCounter++
  const currentCount = messageCounter
  
  try {
    const messageType = message?.type
    const handler = MESSAGE_HANDLERS[messageType]
    
    if (handler) {
      return handler(message, currentCount, sendResponse)
    }
    
    // Unknown message type
    sendResponse({
      success: false,
      error: `Unknown message type: ${messageType || 'undefined'}`,
      messageCount: currentCount
    })
    return false
    
  } catch (outerError) {
    console.error(`💥 Background: Critical error in message handler for message #${currentCount}:`, outerError)
    
    try {
      sendResponse({
        success: false,
        error: 'Critical error in message handler',
        details: outerError instanceof Error ? outerError.message : 'Unknown critical error',
        messageCount: currentCount,
        criticalError: true
      })
    } catch (sendError) {
      console.error(`💥 Background: Failed to send critical error response for message #${currentCount}:`, sendError)
    }
    
    return false
  }
})

// Content scripts are automatically injected via manifest.json
// The content scripts will be injected automatically when users visit supported pages

// Listen for extension installation/update (runs once per install/update)
let installListenerFired = false
chrome.runtime.onInstalled.addListener(() => {
  if (installListenerFired) return
  installListenerFired = true
  
  console.log('🚀 OpenGov VotingTool Extension v' + packageJson.version + ' ready')
  
  // Load config on install
  loadApiConfigSync()
}) 