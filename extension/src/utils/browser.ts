// Browser detection utility for Web Extension APIs

export interface BrowserAPI {
  storage: {
    local: {
      get(keys: string[]): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
      remove(keys: string[]): Promise<void>;
    };
  };
  runtime: {
    id: string;
    sendMessage(message: any): Promise<any>;
    onMessage: {
      addListener(callback: (message: any, sender: any) => void): void;
      removeListener(callback: (message: any, sender: any) => void): void;
    };
  };
}

// Detect available browser APIs
export const detectBrowser = (): 'firefox' | 'chrome' | 'unknown' => {
  if (typeof (window as any).browser !== 'undefined' && (window as any).browser?.runtime?.id) {
    return 'firefox';
  } else if (typeof chrome !== 'undefined' && chrome?.runtime?.id) {
    return 'chrome';
  }
  return 'unknown';
};

// Get the appropriate browser API
export const getBrowserAPI = (): BrowserAPI => {
  const browserType = detectBrowser();
  
  if (browserType === 'firefox') {
    return (window as any).browser as unknown as BrowserAPI;
  } else if (browserType === 'chrome') {
    return chrome as unknown as BrowserAPI;
  }
  
  throw new Error(`Unsupported browser: ${browserType}`);
};

// Check if we're in a supported browser environment
export const isSupportedBrowser = (): boolean => {
  return detectBrowser() !== 'unknown';
}; 