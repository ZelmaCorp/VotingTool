// OpenGov VotingTool Extension - Background Script
// This will be the main entry point for the extension

console.log('OpenGov VotingTool Background script loaded!')

// Build identifier for debugging
const BUILD_ID = 'v1.1.0-' + Date.now()
console.log('🏗️ Background: Build ID:', BUILD_ID)

// Message counter for debugging
let messageCounter = 0

// API configuration
const API_CONFIG = {
  // For development, you can use ngrok: ngrok http 3000
  // baseURL: 'https://abc123.ngrok.io',
  //baseURL: 'http://localhost:3000',
  baseURL: 'https://f194c85000f7.ngrok-free.app',
  timeout: 10000
}

// Function to make API calls from background script context (bypasses CSP)
async function makeApiCall(endpoint: string, method: string, data?: any, headers?: any) {
  const debugInfo: any = {
    step: 'starting',
    timestamp: Date.now(),
    endpoint,
    method,
    data,
    headers
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
    const url = `${API_CONFIG.baseURL}${endpoint}`
    debugInfo.fullUrl = url
    
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
    
    debugInfo.step = 'test_fetch'
    // Test if fetch works with a simple URL first
    try {
      const testResponse = await fetch('https://httpbin.org/get')
      debugInfo.testFetchSuccess = true
      debugInfo.testFetchStatus = testResponse.status
    } catch (testError) {
      debugInfo.testFetchError = testError instanceof Error ? testError.message : 'Unknown test error'
      debugInfo.testFetchErrorName = testError instanceof Error ? testError.name : 'Unknown'
    }
    
    debugInfo.step = 'prepare_fetch_options'
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
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
      debugInfo.fetchErrorStack = fetchError instanceof Error ? fetchError.stack : undefined
      
      return {
        success: false,
        error: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        debugInfo
      }
    }
    
  } catch (outerError) {
    debugInfo.step = 'outer_error'
    debugInfo.outerError = outerError instanceof Error ? outerError.message : 'Unknown outer error'
    debugInfo.outerErrorName = outerError instanceof Error ? outerError.name : 'Unknown'
    debugInfo.outerErrorStack = outerError instanceof Error ? outerError.stack : undefined
    
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
    console.log(`📨 Background: Received message #${currentCount}:`, message)
    console.log(`📨 Background: Message type: ${message?.type}`)
    console.log(`📨 Background: Sender:`, sender)
    console.log(`📨 Background: Full message object:`, JSON.stringify(message, null, 2))
    
    if (message?.type === 'TEST') {
      console.log(`🧪 Background: Processing test message #${currentCount}`)
      sendResponse({ 
        success: true, 
        message: 'Background script is working!',
        messageCount: currentCount,
        timestamp: Date.now(),
        buildId: BUILD_ID
      })
      return false // Synchronous response
    }
    
    if (message?.type === 'VOTING_TOOL_API_CALL') {
      console.log(`🌐 Background: Processing voting tool API call request #${currentCount}:`, {
        messageId: message.messageId,
        endpoint: message.endpoint,
        method: message.method,
        data: message.data,
        headers: message.headers
      })
      
      // Handle API calls from content script asynchronously
      makeApiCall(message.endpoint, message.method, message.data, message.headers)
        .then(result => {
          console.log(`📤 Background: Sending API result back to content script for message #${currentCount}:`, result)
          try {
            sendResponse({
              ...result,
              messageCount: currentCount,
              messageId: message.messageId
            })
          } catch (error) {
            console.error(`❌ Background: Failed to send response for message #${currentCount}:`, error)
            // Try to send error response
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
            // Try one more time with minimal data
            try {
              sendResponse({
                success: false,
                error: 'Failed to send error response',
                messageCount: currentCount,
                messageId: message.messageId,
                criticalError: true
              })
            } catch (finalError) {
              console.error(`❌ Background: Final attempt to send response failed for message #${currentCount}:`, finalError)
            }
          }
        })
      
      // Return true to indicate we'll send response asynchronously
      return true
    }
    
    console.log(`⚠️ Background: Unknown message type #${currentCount}: ${message?.type}`)
    console.log(`⚠️ Background: Sending default error response`)
    
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
        criticalError: true,
        stack: outerError instanceof Error ? outerError.stack : undefined
      })
    } catch (sendError) {
      console.error(`💥 Background: Failed to send critical error response for message #${currentCount}:`, sendError)
    }
    
    return false
  }
})

// Function to inject content script
function injectContentScript(tabId: number, url: string) {
  console.log('🎯 Attempting to inject content script into tab:', tabId, 'URL:', url)
  
  // Check if this is a supported site
  const isPolkassembly = url.includes('polkassembly.io')
  const isSubsquare = url.includes('subsquare.io')
  
  if (!isPolkassembly && !isSubsquare) {
    console.log('❌ Not a supported site, skipping injection')
    return
  }
  
  console.log('✅ Supported site detected, injecting content script...')
  
  try {
    // Try to execute the content script
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).then(() => {
      console.log('✅ Content script injected successfully!')
    }).catch((error) => {
      console.error('❌ Failed to inject content script:', error)
      
      // Fallback: try to inject the script content directly
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          console.log('🧪 FALLBACK CONTENT SCRIPT INJECTED!')
          console.log('📍 Current URL:', window.location.href)
          
          // Create a very visible test element
          const testDiv = document.createElement('div')
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
          `
          testDiv.innerHTML = '🧪 FALLBACK INJECTION - EXTENSION WORKS! 🧪'
          
          // Add to page
          document.body.appendChild(testDiv)
          console.log('✅ Fallback test element added to page')
        }
      }).then(() => {
        console.log('✅ Fallback script injected successfully!')
      }).catch((fallbackError) => {
        console.error('❌ Fallback injection also failed:', fallbackError)
      })
    })
  } catch (error) {
    console.error('❌ Error in injection attempt:', error)
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('🔄 Tab updated:', tabId, 'URL:', tab.url)
    injectContentScript(tabId, tab.url)
  }
})

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('🎯 Tab activated:', activeInfo.tabId)
  
  // Get the active tab info
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      console.log('📍 Active tab URL:', tab.url)
      injectContentScript(tab.id!, tab.url)
    }
  })
})

// Listen for extension installation/update
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 Extension installed/updated, checking current tabs...')
  
  // Inject into all existing tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && tab.id) {
        console.log('🔍 Checking existing tab:', tab.id, tab.url)
        injectContentScript(tab.id, tab.url)
      }
    })
  })
})

// TODO: Set up background script functionality
// TODO: Handle extension lifecycle events
// TODO: Manage content script injection 