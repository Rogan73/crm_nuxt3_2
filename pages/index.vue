<script setup>
definePageMeta({
  middleware: 'auth' 
});

</script>

<template>
   <transition name="fade">
     <kanban2 />
   </transition>

   <transition name="fade">
     <ConfirmDialog/>
   </transition>

</template>

