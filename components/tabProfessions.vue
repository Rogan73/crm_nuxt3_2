<script setup lang="ts">
import {useFirestoreStore} from '@/stores/firestore'
const FirestoreStore=useFirestoreStore()

const d_professions = FirestoreStore.d_professions as any[];

</script>
<template>
  
<div class="max-w-[600px] ">


    <div :class="['flex  justify-start font-bold opacity-90 items-center gap-2 border py-2 px-5 rounded-t-lg',glass]">
            <div class="w-4/5">Name</div>
            <div class="w-1/5 ">
                <BtnR class="flex gap-2 justify-center">
                <IconsIPlus />
                <span>Add</span>
                </BtnR>
            </div>
    </div>
    
    <div class="dark:bg-gray-800/50 bg-white/50 rounded-b-lg p-4 pt-2">
        <div v-for="(type,i) in d_professions" :key="i" 
        class="group flex justify-start gap-2  py-3 px-3 border-b border-gray-500/50 dark:border-gray-500/50   cursor-pointer hover:bg-gray-700/50 hover:text-white dark:hover:bg-gray-700/50">
                <div class="w-4/5">{{type.title}}</div>
                <div class="w-1/5  gap-4 justify-center hidden group-hover:flex"> 
                    <IconsIEdit class="hover:text-orange-200  dark:hover:text-orange-300" />
                    <IconsIDelete class="hover:text-red-300 dark:hover:text-red-400" />
                </div>
            
        </div>
    </div>   
</div>  


</template>
