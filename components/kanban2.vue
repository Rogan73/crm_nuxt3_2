<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import draggable from "vuedraggable"
import {glass } from '@/utils/ClassList'                       
import TaskCard from "@/components/taskCard2.vue"
import { useKanban2Store } from '@/stores/kanban2'
import iPlus from '@/components/icons/iPlus.vue'
import {useFirestoreStore} from '@/stores/firestore'

const kanban2Store = useKanban2Store()   

const getTaskIndex = (columnIndex:number,taskId:number) => {
  return kanban2Store.columns[columnIndex].tasks.findIndex( (t:{id:number}) => t.id == taskId);
};


const columnsData = ref<Array<Record<string, any>>>([])



const FirestoreStore=useFirestoreStore()







</script>

<template>


    
    
      <div class="flex w-[100vw] px-4 justify-between gap-4 mx-auto">
    
        <div
          v-for="(column, index) in kanban2Store.columns"
          :key="index"
          
          :class="[glass,'shadow-lg p-4 flex gap-2 flex-col w-1/3 justify-start   rounded-lg     ' ]"
        >
          <div class="text-2xl font-bold flex justify-between items-center   dark:text-violet-400  rounded-lg p-2 pt-0">
              <div>{{ column.title}}</div>
              <iPlus @click="kanban2Store.addTask(column.id)"
              class=" rounded-full w-8 h-8 p-1 cursor-pointer  hover:text-white hover:bg-gray-500 dark:hover:bg-violet-600 dark:hover:text-white"/>
            
          </div>
          <draggable 
          :list="column.tasks" 
          :itemKey="column.title"  
          :animation="200" 
          ghost-class="ghost-card" 
          group="tasks"
          @change="kanban2Store.seeChange($event, index)"
          >
          <!-- // @start="kanban2Store.onTaskStart($event, index)" -->

            <template #item="{ element }" > 
              <task-card
                :key="element.id"
                :task="element"
                :columnIndex="index"
                :taskIndex="getTaskIndex(index,element.id)"
                class="mt-3 cursor-move"
              />
            </template>
          </draggable>
        </div>
      </div>
    


</template>

<style scoped>
.column-width {
  min-width: 320px;
  width: 320px;
}
/* Unfortunately @apply cannot be setup in codesandbox, 
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.ghost-card {
  opacity: 0.5;
  background: #dfdfe0;
  border: 1px solid #4299e1;
  color: black;
}
</style>