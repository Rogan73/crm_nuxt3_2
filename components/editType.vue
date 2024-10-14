<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFirestoreStore } from '@/stores/firestore'
import { useRouter } from 'vue-router';
const FirestoreStore = useFirestoreStore()

const router = useRouter()

const d_types = computed({
  get() {
    return FirestoreStore.d_types as any
  },
  set(value) {
    FirestoreStore.d_types = value
  }
})


const title=ref<String>('')

const Save=()=>{
    d_types.value[FirestoreStore.EditRowNom].title=title.value
    router.push('/types')
}

onMounted(async () => {
    title.value=d_types.value[FirestoreStore.EditRowNom].title
})


</script>

<template>
    <div  :class="['flex flex-col gap-4  p-8 max-w-[600px] rounded-lg relative',glass]">
      <BtnR @click="Save()"
      class="absolute top-4 right-8 flex gap-2"><IconsISave />SAVE</BtnR>

      <label for="">Name</label>
      <input type="text" v-model="title" 
      class="dark:bg-gray-800/50 bg-white/50 rounded-lg p-2 "
      >
    </div>
</template>