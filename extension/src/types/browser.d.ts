// Type declarations for browser APIs

declare global {
  interface Window {
    chrome?: any;
    browser?: any;
  }
}

// Chrome extension API types
declare namespace chrome {
  const storage: {
    local: {
      get(keys: string[]): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
      remove(keys: string[]): Promise<void>;
    };
  };
  
  const tabs: {
    query(queryInfo: any): Promise<any[]>;
    sendMessage(tabId: number, message: any): Promise<any>;
  };
  
  const scripting: {
    executeScript(injection: any): Promise<any>;
  };
  
  const runtime: {
    id: string;
    sendMessage(message: any): Promise<any>;
    onMessage: {
      addListener(callback: (message: any, sender: any) => void): void;
      removeListener(callback: (message: any, sender: any) => void): void;
    };
  };
}

// Firefox WebExtension API types
declare namespace browser {
  const storage: {
    local: {
      get(keys: string[]): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
      remove(keys: string[]): Promise<void>;
    };
  };
  
  const tabs: {
    query(queryInfo: any): Promise<any[]>;
    sendMessage(tabId: number, message: any): Promise<any>;
  };
  
  const scripting: {
    executeScript(injection: any): Promise<any>;
  };
  
  const runtime: {
    id: string;
    sendMessage(message: any): Promise<any>;
    onMessage: {
      addListener(callback: (message: any, sender: any) => void): void;
      removeListener(callback: (message: any, sender: any) => void): void;
    };
  };
}

export {}; 