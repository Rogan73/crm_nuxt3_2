<script setup lang="ts">
import { glass } from '@/utils/ClassList';
import { useKanban2Store } from '@/stores/kanban2';
const kanban2Store = useKanban2Store()


const props = defineProps({
  backpath:{
    type:String,
    default:'main'
  }
})

const back=()=>{
  kanban2Store.goTo(props.backpath)
}

</script>

<template>
  
  <div class="flex flex-col gap-4  p-8 ">
  
    <BtnR @click="back()"
    class="flex gap-2">
         <IconsIBack/> Back
    </BtnR>


  
    

  </div>
  
</template>
