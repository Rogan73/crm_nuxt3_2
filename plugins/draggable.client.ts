// plugins/draggable.ts
import { defineNuxtPlugin } from 'nuxt/app'
import VueDraggableNext from 'vuedraggable'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('Draggable', VueDraggableNext)
  })
