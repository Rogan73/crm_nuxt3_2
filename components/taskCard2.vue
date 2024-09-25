<script setup lang="ts">
import {computed} from 'vue'
import badge from "@/components/badge2.vue";
import { useKanban2Store } from '@/stores/kanban2'

const kanban2Store = useKanban2Store()   

interface Task {
  id: number;
  type?: string;
  title: string;
  date: string;
  description?: string;
  isOpen?: boolean;

}

interface SelectedTaskRow {
  columnRow: number;
  taskRow: number;
}



  const props = defineProps<{
    task: Task;
    columnIndex: number;
  }>()

  const selected_task_row = ref<SelectedTaskRow>({columnRow:-1,taskRow:-1}) 
  const selected_task_id = ref<number>(-1)

  const badgeColor= computed(()=>{
    
      const mappings:  { [key: string]: string }  = {
        Design: "bg-purple-500",
        "Feature Request": "bg-teal-600",
        Backend: "bg-blue-500",
        QA: "bg-green-500",
        default: "bg-teal-600",
      }

      return mappings[props.task?.type as string] || mappings.default;

      })

const selectTask = ()=>{
  selected_task_id.value = props.task.id

  const taskIndex=kanban2Store.columns[props.columnIndex].tasks.findIndex(task => task.id === props.task.id)
  kanban2Store.columns[props.columnIndex].tasks[taskIndex].isOpen = !kanban2Store.columns[props.columnIndex].tasks[taskIndex].isOpen

  selected_task_row.value = {
    columnRow: props.columnIndex,
    taskRow: 0
  }
  //console.log(selected_task_id.value);
  
}

</script>

<template>
    <div @click="selectTask"
    class="px-3 pt-3 pb-5  flex flex-col  justify-between  rounded-lg text-slate-700  bg-gray-300  hover:bg-gray-400 hover:text-white hover:dark:text-violet-100 hover:dark:bg-violet-700/50 cursor-pointer  dark:text-white dark:bg-slate-700">
      
      <div class="flex justify-between items-start">
        <p class="">{{task.title}}</p>
       
        <!-- аватар или иконка статуса -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8">
        <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
        </svg>


      </div>
         

      <!-- скрываемый контент -->
      <div v-if="props.task.isOpen"
      class="flex italic ">
        {{task.description}}

      </div>


      <div class="flex mt-4 justify-between items-center ">
        <span class="text-sm text-gray-600 dark:text-gray-400 ">{{task.date}}</span>
        <badge v-if="task.type" :class="[badgeColor,'text-gray-200 ']" >{{task.type}}</badge>
      </div>

    </div>
  </template>