<script setup>
  import { useRouter } from 'vue-router';
  import { useNuxtApp } from 'nuxt/app';
  import iAuth from '@/components/icons/iAuth.vue'
  import iLight from '@/components/icons/iLight.vue'
  import iDark from '@/components/icons/iDark.vue'

  definePageMeta({ layout: 'auth' });
  
  const router = useRouter();
  const { $authFB, $providerFB } = useNuxtApp(); // Получаем auth и provider через плагин
  
  const loginWithGoogle = async () => {
    try {
      if ($authFB && $providerFB) {
        await $authFB.signInWithPopup($providerFB); // Авторизация через Google
        router.push('/'); // После успешного входа перенаправляем на главную страницу
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };


  const colorMode =useColorMode()

    const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
    }

  </script>


  <template>

      <div>


      <header class="flex flex-col justify-center ">

            <btn-r  @click="toggleColorMode" class="px-[10px]  fixed top-6 right-6">
                    <div class="flex items-center justify-between gap-1">
                    <iLight /><div>/</div><iDark  class="pt-1" />
                    </div>
            </btn-r>

        <div class="flex flex-col items-center ">
            <iAuth size="size-20" class="opacity-70" />
            <div class="text-2xl dark:text-violet-500  ">Authentication</div>
        </div>
      </header>

    </div>

    <div class="flex flex-col gap-4 justify-center items-center  mt-10 text-white bg-slate-600/30 p-6 rounded-xl ">
      <h1 class="">Login with Google</h1>
      <btn-r @click="loginWithGoogle()">Sign in with Google</btn-r>
    </div>

  </template>
  

  