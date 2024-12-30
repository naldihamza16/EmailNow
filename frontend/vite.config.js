import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Exposes the server to the network
    port: 5173,         // Ensures it uses the correct port
    strictPort: true,   // If port 5173 is busy, Vite will fail instead of switching ports
    open: true,         // Automatically opens the browser on start
  },
})
