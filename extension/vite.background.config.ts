import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2017',
    outDir: 'dist-temp',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/background.ts',
      output: {
        entryFileNames: 'background.js',
        chunkFileNames: 'background-[name].js',
        assetFileNames: 'background-[name].[ext]',
        format: 'iife'
      }
    },
    minify: false,
    sourcemap: false
  },
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}) 