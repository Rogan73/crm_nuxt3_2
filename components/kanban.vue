<script setup lang="ts">
import { useKanbanStore } from '@/stores/kanban' 
import {  ref,onMounted } from 'vue' 
import type { Task } from '@/types'

import iPlus  from "@/components/icons/iPlus.vue"
import iTrash from "@/components/icons/iTrash.vue"
import iEdit from "~/components/icons/iEdit.vue"

import {glass } from '@/utils/ClassList'




const boardId = ref('1')  // ID доски из маршрута

const kanbanStore = useKanbanStore() 






const startDrag = (
  event: DragEvent,
  item: Task,
  fromColumnId: number
): void => {
  event.dataTransfer!.dropEffect = "move";
  event.dataTransfer!.effectAllowed = "move";
  event.dataTransfer!.setData("fromTaskID", String(item.id) );
  event.dataTransfer!.setData("fromColumnId", String(fromColumnId));
};


const onDrop = (event: DragEvent, toColumnId: number): void => {
  const fromTaskID = event.dataTransfer!.getData("fromTaskID");
  const fromColumnId = event.dataTransfer!.getData("fromColumnId");
  kanbanStore.moveTask(fromTaskID, fromColumnId, String(toColumnId) )
};


const newBoardName = ref('') 

const addNewBoard = () => {
} 

const removeBoard = (boardId: number) => {
  kanbanStore.removeBoard(boardId) 
} 


const BoardColumns = computed(() => {
  return kanbanStore.state.boards[kanbanStore.state.selected_board_row]?.columns ?? []
})


onMounted(() => {
kanbanStore.getBoard() 
})

</script>


<template>

 <div class="flex ">
    <!-- левая часть -->
    <div class="w-[12vw] px-2  flex flex-col gap-2">
      <btn-r @click=" kanbanStore.getBoard() " :disabled="kanbanStore.state.isLoading">
        {{ kanbanStore.state.isLoading ? 'Loading...' : 'Load boards' }}
      </btn-r>
      
      <!-- <div v-if="kanbanStore.state.error">
        Error: {{ kanbanStore.state.error }}
      </div> 
      
      <ul v-else class="my-5">
        <li v-for="board in kanbanStore.state.boards" :key="board.id">
          {{ board.name }}
          <btn-r @click="removeBoard(board.id)">Delete</btn-r>
        </li>
      </ul>-->
  
      <div>
        <!-- <input v-model="newBoardName" placeholder="New board name" /> -->
        <btn-r @click="addNewBoard"
        >Add board</btn-r>
      </div>
    </div>


     <!-- основная панель 
     bg-white/60 backdrop-blur-sm dark:bg-slate-800/70 dark:border dark:border-slate-700/50 
     -->
    <div class="w-[78vw] px-6 ">
      <div class="flex w-full justify-between gap-2" >
        <div v-for="(column, i) in BoardColumns" :key="i"
        :class="[glass,'shadow-lg p-4 flex gap-2 flex-col w-1/3 justify-between rounded-lg' ]"
        @drop="onDrop($event, column.id)"
        @dragenter.prevent
        @dragover.prevent
        >
         <div class="flex justify-between w-full">
            <div class="text-2xl font-bold    dark:text-violet-400  rounded-lg p-2 pt-0"
            >{{ column.name}}</div>
            <div v-if="i==0" @click="kanbanStore.addNewTask(String(column.id))"
            class="rounded-full  p-2 cursor-pointer hover:bg-slate-300 dark:hover:bg-violet-700 dark:hover:text-white">
              <iPlus />
            </div>
         </div>  
       
        <div  class="flex flex-col gap-2">
        <TransitionGroup tag="div" name="tasks" class="flex flex-col gap-2">
              <div
                class=" px-3 py-2 flex  justify-between  rounded-lg text-slate-700  bg-gray-300  hover:bg-gray-400 hover:text-white hover:dark:text-violet-100 hover:dark:bg-violet-700/50 cursor-pointer  dark:text-white dark:bg-slate-700"
                v-for="(task, index) in column.tasks"
                :key="task.id"
                draggable="true"
                @dragstart="startDrag($event, task, column.id)"
                @click="task.isOpen=!task.isOpen"
              >
                <div class="flex flex-col" >
                       
                    <div > {{ task.name }} </div>
                    <Transition name="sizing">
                      <div v-if="task.isOpen">
                        <div>{{ task.description }}</div>
                        <!-- другие данные -->
                        <!-- <div>lorem ipsum dolor sit amet consectetur adipisicing elit. </div> -->
                      </div>
                    </Transition>


                </div>
                
                <div v-if="task.isOpen"
                class="flex flex-col justify-between h-full ">
                    <div  @click.stop="kanbanStore.editTask(i,index)"
                    class="rounded-full  p-2 cursor-pointer hover:bg-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-white">
                      <iEdit size="size-4" />
                    </div>  

                    <div @click.stop="kanbanStore.deleteTask(String(task.id))"
                    class="rounded-full  p-2 cursor-pointer hover:bg-red-700/70 dark:hover:bg-red-700/80 dark:hover:text-white">
                      <iTrash size="size-4" />
                    </div>    
                </div>

              </div>
        </TransitionGroup>
        </div>


        </div>
      </div>
    </div> 

   



  
   

<!-- {{ kanbanStore.state.boards[0] }} -->


  </div>

  </template>
  
