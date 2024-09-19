<script setup lang="ts">
import { useKanbanStore } from '@/stores/kanban'
import iBack from '@/components/icons/iBack.vue'
import iSave from '@/components/icons/iSave.vue'
import { Input,glass } from '@/utils/ClassList'
import textareaAuto from '@/components/textareaAuto.vue'

definePageMeta({
  middleware: ['redirect-on-reload']
});

const kanbanStore = useKanbanStore()

</script>
<template>
    
<section class=" w-[100vw]">
  <div class="max-w-[600px] mx-auto">

    <div class="flex  justify-between">

    <btn-r @click="kanbanStore.cancelTask()" 
    class="flex gap-2 max-w-max mb-4"
    >
        <iBack />
        Back
    </btn-r>
    <!-- <div class="text-center uppercase text-2xl pr-2 text-slate-800 dark:text-slate-200">EDIT TASK</div> -->
    
    <btn-r @click="kanbanStore.saveTask()" 
    class="flex gap-2 max-w-max mb-4"
    >
        <iSave />
        Save
    </btn-r>

    </div>

                <div class="flex flex-col gap-3 text-gray-500 dark:text-gray-300">
    

                    <div :class="[glass,'shadow-lg p-8 flex gap-6 flex-col justify-between rounded-lg']" >
                    <!-- bg-white/80 backdrop-blur-sm dark:bg-slate-800/70 dark:border dark:border-slate-700/50 -->

                        <div class ="flex gap-2 items-center ">
                            <label class="w-24 flex-shrink-0 font-bold" for="">Task Name</label>
                            <input :class="[Input,'flex-grow text-slate-900']" type="text" v-model="kanbanStore.state.selected_task.name">
                        </div> 


                        <div class ="flex gap-2 items-start ">
                            <label class="w-24 flex-shrink-0 font-bold" for="">Description</label>
                            <textareaAuto :externalClass ="[Input,'flex-grow text-slate-900']" type="text" v-model="kanbanStore.state.selected_task.description   "/>
                        </div> 


                    </div>

                </div>
  </div>  
</section>        

</template>