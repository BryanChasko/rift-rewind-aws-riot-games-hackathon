import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/learning/api/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          cloudscape: ['@cloudscape-design/components'],
          utils: ['./src/utils/accessibility', './src/utils/responsive']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
