<script setup lang="ts">
import { glass } from '@/utils/ClassList';
import { useKanban2Store } from '@/stores/kanban2';

const kanban2Store = useKanban2Store()


</script>

<template>

<div :class="[glass,'absolute top-20 left-0 w-1/5 h-[84vh] rounded-e-lg  dark:bg-gray-800/80 shadow-right-lg'  ]">
    <div class="flex flex-col gap-4  p-8 ">
         <div class="flex items-center gap-2">
            <!-- <IconsICog size="size-6" /> -->
            <div>Params</div>
         </div>  
        
         <BtnR  >Boards</BtnR>
         <BtnR @click="kanban2Store.goTo('types')" >Types</BtnR>
         <BtnR @click="kanban2Store.goTo('personas')" >Personal</BtnR>
         <BtnR @click="kanban2Store.goTo('professions')">Professions</BtnR>
    </div>
</div>

</template>