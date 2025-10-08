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

// Load API configuration from storage
async function loadApiConfig() {
  try {
    const result = await chrome.storage.sync.get(['backendUrl'])
    if (result.backendUrl) {
      API_CONFIG.baseURL = result.backendUrl
    }
  } catch (error) {
    console.warn('Failed to load API config, using defaults:', error)
  }
}

// Initialize API config on startup
loadApiConfig()

// Listen for config changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.backendUrl) {
    API_CONFIG.baseURL = changes.backendUrl.newValue
  }
})

// Function to make API calls from background script context (bypasses CSP)
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
    debugInfo.step = 'fetch_available_check'
    
    // Test if fetch is available
    if (typeof fetch === 'undefined') {
      debugInfo.error = 'Fetch API is not available in this context'
      debugInfo.step = 'fetch_not_available'
      return {
        success: false,
        error: 'Fetch API is not available in this context',
        debugInfo
      }
    }
    
    debugInfo.step = 'url_construction'
    // Use testUrl if provided (for connection testing), otherwise use configured baseURL
    const baseUrl = testUrl || API_CONFIG.baseURL
    const url = `${baseUrl}${endpoint}`
    debugInfo.fullUrl = url
    debugInfo.baseUrl = baseUrl
    debugInfo.usingTestUrl = !!testUrl
    
    // Test if we can construct a URL
    try {
      new URL(url)
      debugInfo.urlConstructionSuccess = true
    } catch (urlError) {
      debugInfo.urlConstructionError = urlError instanceof Error ? urlError.message : 'Unknown URL error'
      return {
        success: false,
        error: `Invalid URL: ${url}`,
        debugInfo
      }
    }
    
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
    
    // Add timeout handling
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
      
      if (!response.ok) {
        debugInfo.step = 'response_not_ok'
        
        // For HTTP errors, try to extract the error response body for better error messages
        try {
          const errorResponse = await response.json()
          debugInfo.errorResponseBody = errorResponse
          
          // If there's a structured error response, use it
          if (errorResponse.error) {
            const error = new Error(errorResponse.error)
            // Attach additional details for 403 errors (multisig access denied)
            if (response.status === 403 && errorResponse.details) {
              ;(error as any).details = errorResponse.details
              ;(error as any).status = response.status
            }
            throw error
          }
        } catch (jsonError) {
          // If we can't parse JSON, fall back to status text
          debugInfo.jsonParseError = jsonError instanceof Error ? jsonError.message : 'Unknown JSON error'
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      debugInfo.step = 'parsing_response'
      const responseData = await response.json()
      debugInfo.step = 'success'
      
      return {
        success: true,
        data: responseData,
        status: response.status,
        debugInfo
      }
      
    } catch (fetchError) {
      clearTimeout(timeoutId)
      debugInfo.step = 'fetch_error'
      debugInfo.fetchError = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error'
      debugInfo.fetchErrorName = fetchError instanceof Error ? fetchError.name : 'Unknown'
      
      return {
        success: false,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        debugInfo
      }
    }
    
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

// Message handler for content script communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  messageCounter++
  const currentCount = messageCounter
  
  try {
    // Add immediate response for connection testing
    if (message?.type === 'PING') {
      sendResponse({ 
        success: true, 
        message: 'Background script is alive and responding!',
        messageCount: currentCount,
        timestamp: Date.now(),
        buildId: BUILD_ID
      })
      return false // Synchronous response
    }
    
    if (message?.type === 'TEST') {
      sendResponse({ 
        success: true, 
        message: 'Background script is working!',
        messageCount: currentCount,
        timestamp: Date.now(),
        buildId: BUILD_ID
      })
      return false // Synchronous response
    }

    if (message?.type === 'REQUEST_PERMISSION') {
      chrome.permissions.request({
        origins: [message.origin + '/*']
      }).then(granted => {
        sendResponse({ success: true, granted })
      }).catch(error => {
        sendResponse({ success: false, error: error.message })
      })
      
      return true // Asynchronous response
    }

    if (message?.type === 'CHECK_PERMISSION') {
      chrome.permissions.contains({
        origins: [message.origin + '/*']
      }).then(hasPermission => {
        sendResponse({ success: true, hasPermission })
      }).catch(error => {
        sendResponse({ success: false, error: error.message })
      })
      
      return true // Asynchronous response
    }
    
    if (message?.type === 'VOTING_TOOL_API_CALL') {
      // Handle API calls from content script asynchronously
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
      
      // Return true to indicate we'll send response asynchronously
      return true
    }
    
    // Send a default error response for unknown message types
    sendResponse({
      success: false,
      error: `Unknown message type: ${message?.type || 'undefined'}`,
      messageCount: currentCount
    })
    
    return false // Synchronous response
    
  } catch (outerError) {
    console.error(`💥 Background: Critical error in message handler for message #${currentCount}:`, outerError)
    
    // Try to send error response even if everything else failed
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

// Listen for extension installation/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 OpenGov VotingTool Extension installed/updated')
  console.log('📋 Content scripts will be automatically injected on supported sites')
}) 