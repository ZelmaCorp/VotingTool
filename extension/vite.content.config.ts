import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'es2017',
    outDir: 'dist-temp',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/content.ts',
      output: {
        entryFileNames: 'content.js',
        chunkFileNames: 'content-[name].js',
        assetFileNames: 'content-[name].[ext]',
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