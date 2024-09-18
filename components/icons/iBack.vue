<script setup lang="ts">
  const props = defineProps({
    size: { type: String, default: "size-6" },
    fill: { type: String, default: 'none' },
    stroke: { type: String, default: 'currentColor' }
  })
</script>
<template>

<svg xmlns="http://www.w3.org/2000/svg" :fill="fill" viewBox="0 0 24 24" stroke-width="1.5" :stroke="stroke" :class="size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>




</template>