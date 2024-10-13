<script setup>
definePageMeta({
  middleware: 'auth' 
});

</script>



<template>
    <task2 />


    <transition name="fade">
     <ConfirmDialog/>
   </transition>

 </template>