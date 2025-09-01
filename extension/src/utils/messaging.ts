// Browser-agnostic messaging utilities for the extension

export interface Message {
  type: string;
  payload?: any;
  id?: string;
}

export interface MessageResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Detect browser and use appropriate API
const isFirefox = typeof browser !== 'undefined' && browser.runtime?.id;
const isChrome = typeof chrome !== 'undefined' && chrome.runtime?.id;

// Get the appropriate runtime API
const getRuntimeAPI = () => {
  if (isFirefox) {
    return browser.runtime;
  } else if (isChrome) {
    return chrome.runtime;
  } else {
    throw new Error('No supported browser runtime API found');
  }
};

// Get the appropriate tabs API
const getTabsAPI = () => {
  if (isFirefox) {
    return browser.tabs;
  } else if (isChrome) {
    return chrome.tabs;
  } else {
    throw new Error('No supported browser tabs API found');
  }
};

// Get the appropriate scripting API
const getScriptingAPI = () => {
  if (isFirefox) {
    return browser.scripting;
  } else if (isChrome) {
    return chrome.scripting;
  } else {
    throw new Error('No supported browser scripting API found');
  }
};

export const messaging = {
  // Send message to background script
  async sendMessage(message: Message): Promise<MessageResponse> {
    try {
      const runtimeAPI = getRuntimeAPI();
      return await runtimeAPI.sendMessage(message);
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  },

  // Listen for messages
  onMessage(callback: (message: Message, sender: any) => void): void {
    try {
      const runtimeAPI = getRuntimeAPI();
      runtimeAPI.onMessage.addListener(callback);
    } catch (error) {
      console.error('Add message listener error:', error);
    }
  },

  // Remove message listener
  removeMessageListener(callback: (message: Message, sender: any) => void): void {
    try {
      const runtimeAPI = getRuntimeAPI();
      runtimeAPI.onMessage.removeListener(callback);
    } catch (error) {
      console.error('Remove message listener error:', error);
    }
  },

  // Query tabs
  async queryTabs(queryInfo: any): Promise<any[]> {
    try {
      const tabsAPI = getTabsAPI();
      return await tabsAPI.query(queryInfo);
    } catch (error) {
      console.error('Query tabs error:', error);
      return [];
    }
  },

  // Send message to specific tab
  async sendMessageToTab(tabId: number, message: Message): Promise<any> {
    try {
      const tabsAPI = getTabsAPI();
      return await tabsAPI.sendMessage(tabId, message);
    } catch (error) {
      console.error('Send message to tab error:', error);
      return null;
    }
  },

  // Execute script in tab
  async executeScript(tabId: number, func: Function): Promise<any> {
    try {
      const scriptingAPI = getScriptingAPI();
      return await scriptingAPI.executeScript({
        target: { tabId },
        func: func.toString()
      });
    } catch (error) {
      console.error('Execute script error:', error);
      return null;
    }
  }
}; 