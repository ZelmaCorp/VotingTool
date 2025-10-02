// Type declarations for browser APIs

declare global {
  interface Window {
    chrome?: any;
    browser?: any;
  }
}

// Vue component declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
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
  const runtime: {
    id: string;
    getURL: (path: string) => string;
    getManifest: () => any;
    sendMessage: (message: any) => Promise<any>;
    onMessage: {
      addListener: (callback: (message: any, sender: any) => void) => void;
      removeListener: (callback: (message: any, sender: any) => void) => void;
    };
  };
  
  const storage: {
    local: {
      get: (keys: string | string[] | null) => Promise<any>;
      set: (items: { [key: string]: any }) => Promise<void>;
      remove: (keys: string | string[]) => Promise<void>;
    };
  };
}

export {}; 