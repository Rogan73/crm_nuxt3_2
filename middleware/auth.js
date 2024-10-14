import { useNuxtApp } from 'nuxt/app'
import { onAuthStateChanged } from 'firebase/auth';


export default defineNuxtRouteMiddleware(async (to, from) => {
  // Проверка на защищенные страницы, кроме страницы /login

  const { $authFB } = useNuxtApp(); 

  if (to.path !== '/login') {
    const user = await new Promise((resolve) => {
      onAuthStateChanged($authFB, (user) => {
        resolve(user);

          

      });
    });

    // Если пользователь не авторизован, перенаправляем его на страницу /login
    if (!user) {
      return navigateTo('/login');
    }
  }
});
