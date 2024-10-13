<script setup>
import { useKanban2Store } from '@/stores/kanban2'


const Kanban2Store = useKanban2Store()

definePageMeta({
  middleware: 'auth' 
});

</script>

<template>

 <div class="flex">


  
   <transition name="fade">
     <kanban2 />
   </transition>

   <transition name="slide-from-left">
     <LeftPanel v-if="Kanban2Store.showLeftPanel"  />
   </transition>

  </div>

   <transition name="fade">
     <ConfirmDialog/>
   </transition>

</template>

