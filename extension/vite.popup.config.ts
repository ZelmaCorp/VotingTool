import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2017',
    outDir: 'dist-temp',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/popup.ts',
      output: {
        entryFileNames: 'popup.js',
        chunkFileNames: 'popup-[name].js',
        assetFileNames: 'popup-[name].[ext]',
        format: 'iife',
        globals: {
          vue: 'Vue'
        }
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
  },
  optimizeDeps: {
    include: ['vue']
  }
}) 