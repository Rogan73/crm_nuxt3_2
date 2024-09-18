<script setup lang="ts">
  const props = defineProps({
    size: { type: String, default: "size-6" },
    fill: { type: String, default: 'none' },
    stroke: { type: String, default: 'currentColor' }
  })
</script>
<template>

<svg xmlns="http://www.w3.org/2000/svg" :fill="fill" viewBox="0 0 24 24" stroke-width="1.5" :stroke="stroke" :class="size">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>

</template>