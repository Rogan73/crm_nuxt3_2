export default defineNuxtRouteMiddleware((to, from) => {

console.log("redirectOnReload",to.path, from.path);


    // Проверяем, что пользователь зашел на страницу /task
    if (to.path === '/task') {
      // Проверяем, был ли переход отправлен с помощью браузера (например, через перезагрузку)
      if (from.path === '/') {
        // Если было, то перенаправляем на главную страницу
        return navigateTo('/');
      }
    }
  });