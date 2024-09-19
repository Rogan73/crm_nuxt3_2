<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  modelValue: string;
  minRows?: number;
  maxRows?: number;
  placeholder?: string;
  externalClass?: string | string[] | object;
}

const props = withDefaults(defineProps<Props>(), {
  minRows: 3,
  maxRows: 10,
  placeholder: '',
  externalClass : '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const adjustHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    const newHeight = Math.min(
      Math.max(textareaRef.value.scrollHeight, props.minRows * 20),
      props.maxRows * 20
    );
    textareaRef.value.style.height = `${newHeight}px`;
  }
};

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

watch(() => props.modelValue, adjustHeight);

onMounted(adjustHeight);
</script>

<template>
    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      :rows="minRows"
      :style="{
        minHeight: `${minRows * 20}px`,
        maxHeight: `${maxRows * 20}px`,
        resize: 'none',
        overflow: 'auto',
      }"
      :class=externalClass
    ></textarea>
  </template>
  
