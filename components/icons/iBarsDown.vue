<script setup lang="ts">
  const props = defineProps({
    size: { type: String, default: "size-6" },
    fill: { type: String, default: 'none' },
    stroke: { type: String, default: 'currentColor' }
  })
</script>
<template>

<svg xmlns="http://www.w3.org/2000/svg" :fill="fill" viewBox="0 0 24 24" stroke-width="1.5" :stroke="stroke" :class="size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
</svg>







</template>