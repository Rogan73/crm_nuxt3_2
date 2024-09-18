import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfirmStore = defineStore('confirm', () => {   
  const dialog = ref({
    open: false,
    type: 'info',
    title: 'Warning.',
    message: '',
    onConfirm: null,
    onCancel: null
  })

  const showConfirm = (type,title,message, onConfirm, onCancel) => {
    dialog.value = { 
      open: true, 
      type,
      title,
      message, 
      onConfirm, 
      onCancel 
    }

  }

  const handleConfirm = (result) => {
    dialog.value.open = false
    if (result) {
      dialog.value.onConfirm?.()
    } else {
      dialog.value.onCancel?.()
    }
  }

  return { dialog, showConfirm, handleConfirm }

})
