<script setup lang="ts">
  const props = defineProps({
    size: { type: String, default: "size-6" },
    fill: { type: String, default: 'none' },
    stroke: { type: String, default: 'currentColor' }
  })
</script>
<template>

<svg xmlns="http://www.w3.org/2000/svg" :fill="fill" viewBox="0 0 24 24" stroke-width="1.5" :stroke="stroke" :class="size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
</svg>






</template>