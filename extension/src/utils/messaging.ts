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
const isFirefox = typeof (window as any).browser !== 'undefined' && (window as any).browser.runtime?.id;
const isChrome = typeof chrome !== 'undefined' && chrome.runtime?.id;

// Get the appropriate runtime API
const getRuntimeAPI = () => {
  if (isFirefox) {
    return (window as any).browser.runtime;
  } else if (isChrome) {
    return chrome.runtime;
  } else {
    throw new Error('No supported browser runtime API found');
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
  }
}; 