<script setup lang="ts">
import draggable from "vuedraggable"
import {glass } from '@/utils/ClassList'                       
import TaskCard from "@/components/taskCard2.vue"
import { useKanban2Store } from '@/stores/kanban2'


const kanban2Store = useKanban2Store()   

</script>

<template>


    
    <div class="flex justify-center px-6">
      <div class="flex w-full justify-between gap-4">
        <!-- class="bg-gray-100 rounded-lg px-3 py-3 column-width mr-4" -->
        <div
          v-for="(column, index) in kanban2Store.columns"
          :key="index"
          
          :class="[glass,'shadow-lg p-4 flex gap-2 flex-col w-1/3 justify-start   rounded-lg     ' ]"
        >
          <p class="text-2xl font-bold    dark:text-violet-400  rounded-lg p-2 pt-0">{{ column.title }}</p>
          <draggable :list="column.tasks" :itemKey="column.title"  :animation="200" ghost-class="ghost-card" group="tasks">
            <template #item="{ element }" > 
              <task-card
                
                :key="element.id"
                :task="element"
                :columnIndex="index"
                :taskIndex="0"
                class="mt-3 cursor-move"
              />
            </template>
          </draggable>
        </div>
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
  background: #F7FAFC;
  border: 1px solid #4299e1;
}
</style>