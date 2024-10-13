<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref,computed } from 'vue' 
//import { useKanbanStore } from '@/stores/kanban' 
//import InitWebSocket from '@/utils/WebSocket'
import iLight from '@/components/icons/iLight.vue'
import iDark from '@/components/icons/iDark.vue'
import iBarsDown from '@/components/icons/iBarsDown.vue'
import {useFirestoreStore } from '@/stores/firestore'
import { useKanban2Store } from '@/stores/kanban2'
import iBoards from '@/components/icons/iBoards.vue'
import IShevronR from './icons/iShevronR.vue'





//const kanbanStore = useKanbanStore() 
const FirestoreStore = useFirestoreStore()
const Kanban2Store = useKanban2Store()

const boardIsOpen =ref(false)

//let socket: WebSocket | null = null;
//const messages = ref<string[]>([]);

const pkg = await import('@/package.json')

const colorMode =useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const show_btn_update=ref(false)

const title=computed(()=>{
  //const name=kanbanStore.state.boards.length > 0 ? kanbanStore.state.boards[kanbanStore.state.selected_board_row].name : ''
 return  FirestoreStore.currentBoard.boardName//`${kanbanStore.state.title}`
})


const changeBoard = (id:string) => {
  FirestoreStore.changeBoard(id); 
  boardIsOpen.value=false;
}


const stop_update = () => {
  Kanban2Store.stop_update5s()
  show_btn_update.value=true;
}

const go_update=()=>{
  Kanban2Store.go_update_board()
  show_btn_update.value=false;
  Kanban2Store.flag_update5s=false;
}

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
<div class="fixed top-3 left-0 right-0 mx-4 px-8 py-2 flex items-center justify-between rounded-full 
          border border-slate-700/20  dark:border-slate-400/20
        bg-black/10  backdrop-blur-lg text-slate-800  
          dark:bg-slate-500/20 dark:backdrop-blur-lg dark:text-slate-300  
          ">
    <!-- Левая часть -->
    
    <div class="flex items-center space-x-8">
      <!-- rotate button on 180 degrees if Kanban2Store.showLeftPanel==true -->
      <div
      :class="[Kanban2Store.showLeftPanel ? 'rotate-180' : '','transition-transform duration-300 cursor-pointer p-2 rounded-full hover:bg-slate-400 dark:hover:text-slate-800']"
      @click="Kanban2Store.showLeftPanel=!Kanban2Store.showLeftPanel" 
      >
      <IShevronR size="size-5"  />
      </div>

      <!-- Логотип -->
      <div class="text-2xl font-bold">
        
        <span>CRM </span> 
        <span class="text-sm text-normal opacity-50">v.{{ pkg.version }}</span>
      </div>
      
      
      <!-- <button class="text-xl hover:text-yellow-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button> -->
      
      
      <!-- <select class="bg-transparent border border-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white">
        <option value="" disabled selected>Select board</option>
        <option value="board1">Board 1</option>
        <option value="board2">Board 2</option>
        <option value="board3">Board 3</option>
      </select> -->
    </div>


    <!-- центральная часть -->
    <div v-if="Kanban2Store.current_page=='main'"
      class="flex items-center space-x-2 relative">
      <div class="uppercase text-2xl pr-2 text-slate-800 dark:text-slate-200">{{ title }}
      </div> 
      <iBoards @click="boardIsOpen=!boardIsOpen"
      class="rounded-full w-8 h-8 p-1 cursor-pointer hover:text-slate-200 dark:hover:bg-violet-700 hover:bg-violet-500" />
      
      <div v-if="boardIsOpen"
      class="absolute right-0 top-8  bg-slate-200  dark:bg-gray-700 p-2 rounded-lg border dark:border-slate-500/50  border-slate-700/20">

       

        <div class="px-3 py-1 w-48 text-center rounded-full cursor-pointer hover:text-slate-100 dark:hover:bg-violet-700 hover:bg-violet-500"
        v-for="(board,i) in FirestoreStore.boards" :key="i"
        @click="changeBoard(String((board as any).id))"
        >
          {{(board as any).title }}
        </div>

      </div>

      <div v-if="Kanban2Store.flag_update5s">

        <BtnR v-if="show_btn_update"
        @click="go_update()">Update</BtnR>
        <BtnR v-if="!show_btn_update" @click="stop_update()"
        > update({{ 5-Kanban2Store.btn_timer_count }}) Stop</BtnR>

      </div>

    </div> 
    <div v-else>
          <div class="uppercase text-2xl pr-2 text-slate-800 dark:text-slate-200">{{ Kanban2Store.current_page }}</div>
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

