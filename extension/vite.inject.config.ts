import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2017',
    outDir: 'dist-temp',
    emptyOutDir: false,
    rollupOptions: {
      input: 'src/inject.ts',
      output: {
        entryFileNames: 'inject.js',
        chunkFileNames: 'inject-[name].js',
        assetFileNames: 'inject-[name].[ext]',
        format: 'iife',
        globals: {}
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