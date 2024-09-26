import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr:false,
  alias: {
    '@': resolve(__dirname, './'),
  },
  css: [
    '@/assets/css/global.css',
   
  ],


  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
   // 'nuxt-vuefire'
  ],
  app:{
    head:{
      title: 'Kanban',
      htmlAttrs: {
        
      },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [        
      ]

    }
  },
  // vuefire: {
  //     auth:{
  //       enabled: true,
  //       sessionCookie: false
  //     },
  //     // config: {
  //     //   apiKey: "AIzaSyAXokJhImVcXzFuuoBsZYf-iM2mrVG3omE",
  //     //   authDomain: "crm-r-3db0b.firebaseapp.com",
  //     //   projectId: "crm-r-3db0b",
  //     //   storageBucket: "crm-r-3db0b.appspot.com",
  //     //   messagingSenderId: "153603750389",
  //     //   appId: "1:153603750389:web:9d1628bb9ac87821e948bc",
       
  //     // }
  // },

  runtimeConfig: {
    public: {
      FB_API_KEY: process.env.FB_API_KEY,
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN,
      FB_PROJECT_ID: process.env.FB_PROJECT_ID,
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET,
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID,
      FB_APP_ID: process.env.FB_APP_ID,
      FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID
    }
  },


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