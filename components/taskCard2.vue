<script setup lang="ts">
import {computed} from 'vue'
import badge from "@/components/badge2.vue";

interface Task {
  type?: string;
  title: string;
  date: string;

}

const props = defineProps<{
  task: Task;
}>()


  const badgeColor= computed(()=>{
    
      const mappings:  { [key: string]: string }  = {
        Design: "purple",
        "Feature Request": "teal",
        Backend: "blue",
        QA: "green",
        default: "teal"
      }

      return mappings[props.task?.type as string] || mappings.default;

      })

</script>

<template>
    <div class="bg-white shadow rounded px-3 pt-3 pb-5 border border-white">
      <div class="flex justify-between">
        <p class="text-gray-700 font-semibold font-sans tracking-wide text-sm">{{task.title}}</p>
  
        <!-- <img
          class="w-6 h-6 rounded-full ml-3"
          src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
          alt="Avatar"
        > -->

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>

      </div>
      <div class="flex mt-4 justify-between items-center">
        <span class="text-sm text-gray-600">{{task.date}}</span>
        <badge v-if="task.type" :color="badgeColor">{{task.type}}</badge>
      </div>
    </div>
  </template>