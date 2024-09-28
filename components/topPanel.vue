<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref,computed } from 'vue' 
//import { useKanbanStore } from '@/stores/kanban' 
//import InitWebSocket from '@/utils/WebSocket'
import iLight from '@/components/icons/iLight.vue'
import iDark from '@/components/icons/iDark.vue'
import {useFirestoreStore } from '@/stores/firestore'
import { useKanban2Store } from '@/stores/kanban2'





//const kanbanStore = useKanbanStore() 
const FirestoreStore = useFirestoreStore()
const Kanban2Store = useKanban2Store()

//let socket: WebSocket | null = null;
//const messages = ref<string[]>([]);

const pkg = await import('@/package.json')

const colorMode =useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const title=computed(()=>{
  //const name=kanbanStore.state.boards.length > 0 ? kanbanStore.state.boards[kanbanStore.state.selected_board_row].name : ''
 return  Kanban2Store.selectedBoard.boardName//`${kanbanStore.state.title}`
})





onMounted(() => {



  //FirestoreStore.fetchBoardData('boardId1') 
  





// const webSocketInstance = InitWebSocket();
// messages.value = webSocketInstance.messages.value;
// socket = webSocketInstance.socket;
// console.log('🟢 WebSocket initialized in onMounted');


}) 




onBeforeUnmount(() => {

// if (socket) {
//   socket.close();
//   console.log('WebSocket connection closed');
// }


})


</script>

<template>
<div class="fixed top-2 left-0 right-0 mx-8 px-8 py-2 flex items-center justify-between rounded-full 
          border border-slate-700/20  dark:border-slate-400/20
        bg-black/10  backdrop-blur-lg text-slate-800  
          dark:bg-slate-500/20 dark:backdrop-blur-lg dark:text-slate-300  
          ">
    <!-- Левая часть -->
    <div class="flex items-center space-x-8">
      <!-- Логотип -->
      <div class="text-2xl font-bold"><span>CRM </span> <span class="text-sm text-normal opacity-50">v.{{ pkg.version }}</span></div>
      
      
      <button class="text-xl hover:text-yellow-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
      
      
      <!-- <select class="bg-transparent border border-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white">
        <option value="" disabled selected>Select board</option>
        <option value="board1">Board 1</option>
        <option value="board2">Board 2</option>
        <option value="board3">Board 3</option>
      </select> -->
    </div>
    
  <div class="uppercase text-2xl pr-2 text-slate-800 dark:text-slate-200">{{ title }}
  </div> 


    <!-- Правая часть (можно добавить дополнительные элементы) -->
    <div class="flex items-center space-x-4">
      <!-- Здесь можно разместить дополнительные элементы, если потребуется -->


      <div>{{ FirestoreStore.authUser?.displayName }}</div>

      <btn-r    @click="toggleColorMode" class="px-[10px]">
         <div class="flex items-center justify-between gap-1">
                <iLight /><div>/</div><iDark  class="pt-1" />
         </div>
      </btn-r>

      <btn-r @click="FirestoreStore.logout">Logout</btn-r>

    </div>
  </div>
</template>

