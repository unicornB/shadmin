import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome86',
    minify: 'terser',
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: true
      }
    },
    chunkSizeWarningLimit: 2000,
  },
})
