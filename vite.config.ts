import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from "unplugin-vue-components/vite"
import { fileURLToPath } from "node:url";
import { PrimeVueResolver } from '@primevue/auto-import-resolver'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const isProductionServer = mode === 'production-server'

  return {
    plugins: [
      vue(),
      Components({
        resolvers: [
          PrimeVueResolver()
        ]
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    },
    server: {
      allowedHosts: ['check-in.career-seekers.ru'],
      host: '0.0.0.0',
      port: 5173,
      hmr: isProductionServer
        ? {
          host: 'check-in.career-seekers.ru',
          protocol: 'wss',
          clientPort: 443,
        }
        : {
          host: 'localhost',
          protocol: 'ws',
          port: 5173,
        },
    },
  }
})
