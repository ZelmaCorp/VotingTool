// OpenGov VotingTool Extension - Background Script
// This will be the main entry point for the extension

console.log('OpenGov VotingTool Background script loaded!')

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