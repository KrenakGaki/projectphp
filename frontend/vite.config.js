import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    server: {
      '/api':{
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/sanctum':{
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
