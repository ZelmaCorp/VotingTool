// Browser-agnostic storage utilities for the extension

// Detect browser and use appropriate API
const isFirefox = typeof browser !== 'undefined' && browser.runtime?.id;
const isChrome = typeof chrome !== 'undefined' && chrome.runtime?.id;

// Get the appropriate storage API
const getStorageAPI = () => {
  if (isFirefox) {
    return browser.storage.local;
  } else if (isChrome) {
    return chrome.storage.local;
  } else {
    throw new Error('No supported browser storage API found');
  }
};

export const storage = {
  async get(key: string): Promise<any> {
    try {
      const storageAPI = getStorageAPI();
      const result = await storageAPI.get([key]);
      return result[key];
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key: string, value: any): Promise<void> {
    try {
      const storageAPI = getStorageAPI();
      await storageAPI.set({ [key]: value });
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      const storageAPI = getStorageAPI();
      await storageAPI.remove([key]);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  async getAll(): Promise<Record<string, any>> {
    try {
      const storageAPI = getStorageAPI();
      return await storageAPI.get();
    } catch (error) {
      console.error('Storage getAll error:', error);
      return {};
    }
  }
}; 