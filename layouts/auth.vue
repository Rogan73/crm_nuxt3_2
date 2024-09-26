<script setup>
import {glass } from '@/utils/ClassList'  
</script>
<template>
    <div :class="[glass,'flex flex-col  items-center justify-center max-w-[400px] mx-auto mt-10 p-10 rounded-xl']">
      <main>
        <slot />
      </main>
    </div>
  </template>