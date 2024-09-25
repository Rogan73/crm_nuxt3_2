<script setup lang="ts">
import {computed } from 'vue'
import { useKanban2Store } from '@/stores/kanban2'
import iBack from '@/components/icons/iBack.vue'
import iSave from '@/components/icons/iSave.vue'
import { Input,glass } from '@/utils/ClassList'
import textareaAuto from '@/components/textareaAuto.vue'



const kanban2Store = useKanban2Store()

const taskDescription=computed( {
  
    get() {
      return kanban2Store.selectedTask.description || '';
    },
    set(value: string) {
      kanban2Store.selectedTask.description = value;
    }
  }
)

const taskPerson =computed( {
    get() {
            return kanban2Store.selectedTask.person?.name || '';
        },
    set(value: string) {
        if (kanban2Store.selectedTask.person) {
          kanban2Store.selectedTask.person.name = value;
         }

        }
    }
)


</script>
<template>
    
<section class=" w-[100vw]">
  <div class="max-w-[600px] mx-auto">

    <div class="flex  justify-between">

    <btn-r @click="kanban2Store.cancelTask()" 
    class="flex gap-2 max-w-max mb-4"
    >
        <iBack />
        Back
    </btn-r>
    
    <btn-r @click="kanban2Store.saveTask()" 
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
                            <input :class="[Input,'flex-grow text-slate-900']" type="text" v-model="kanban2Store.selectedTask.title">
                        </div> 


                        <div class ="flex gap-2 items-start ">
                            <label class="w-24 flex-shrink-0 font-bold" for="">Description</label>
                            <textareaAuto :externalClass ="[Input,'flex-grow text-slate-900']" type="text" v-model="taskDescription"/>
                        </div> 

                        <div class ="flex gap-2 items-start ">
                            <label class="w-24 flex-shrink-0 font-bold" for="">Person</label>
                            <input :class="[Input,'flex-grow text-slate-900']" type="text" v-model="taskPerson">
                        </div>
                        


                    </div>

                </div>
  </div>  
</section>        

</template>