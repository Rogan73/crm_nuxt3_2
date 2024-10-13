<script setup lang="ts">
import { glass } from '@/utils/ClassList';
import { useKanban2Store } from '@/stores/kanban2';
const kanban2Store = useKanban2Store()
</script>

<template>
  
  <div class="flex flex-col gap-4  p-8 ">
  
    <BtnR @click="kanban2Store.goTo('main')"
    class="flex gap-2">
         <IconsIBack/> Back
    </BtnR>


  
    

  </div>
  
</template>
