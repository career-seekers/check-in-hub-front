import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    allowedHosts: [
      'check-in.career-seekers.ru',
    ],
    host: '0.0.0.0',
    port: 5173,
    hmr: {
      host: 'check-in.career-seekers.ru',
      protocol: 'wss',
      clientPort: 443,
    }
  },
})
