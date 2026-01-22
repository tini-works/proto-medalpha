import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Business intent: keep the prototype app minimal and fast to iterate.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5195,
  },
})

