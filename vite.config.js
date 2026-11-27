import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Fixed port: the backend redirects here after payment. If the port is taken,
  // fail loudly instead of silently drifting to 5174+.
  server: {
    port: 5173,
    strictPort: true,
  },
})
