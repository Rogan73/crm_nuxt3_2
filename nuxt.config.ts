
import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  alias: {
    '@': resolve(__dirname, './'),
  },

  // TypeScript конфигурация
  // typescript: {
  //   strict: true,
  //   typeCheck: true,
  // },  
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  nitro: {

    plugins: [
      '@/server/plugins/initWebSocket.plugin.ts',
    ],
    experimental: {
      database: true
    },
    database:{
      DBKanban: {
        connector: 'sqlite',
        options: { name: 'dbkanban' }
      },
    },
    devProxy: {
      host: '127.0.0.1',
    },


  }

})