<template>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>   

</template>

<style>

body {
  background-color: #d4d1d1;
  color: rgba(0,0,0,0.8);
  background-image: url('/images/background.jpg') ;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
.dark-mode body {
  background-color: #091a28;
  color: #ababab;
  /* background-image: none;*/ /* radial-gradient(circle at 54% 50%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 8%,transparent 8%, transparent 92%),radial-gradient(circle at 14% 71%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 8%,transparent 8%, transparent 92%),radial-gradient(circle at 42% 48%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 6%,transparent 6%, transparent 94%),radial-gradient(circle at 97% 84%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 6%,transparent 6%, transparent 94%),radial-gradient(circle at 74% 70%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 6%,transparent 6%, transparent 94%),radial-gradient(circle at 65% 42%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 6%,transparent 6%, transparent 94%),radial-gradient(circle at 59% 88%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 4%,transparent 4%, transparent 96%),radial-gradient(circle at 10% 69%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 4%,transparent 4%, transparent 96%),radial-gradient(circle at 41% 72%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 4%,transparent 4%, transparent 96%),radial-gradient(circle at 59% 78%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.04) 4%,transparent 4%, transparent 96%),linear-gradient(187deg, rgb(65, 65, 65),rgb(58,56,87));*/
  background-image: linear-gradient(to right, #0f172a, #374151);
}


.fade-enter-active,
.fade-leave-active {
    transition: all .2s ease-out;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.tasks-enter-from {
  opacity: 0;
  transform: scale(0.75);
}
.tasks-enter-to {
  opacity: 1;
  transform: scale(1);
}
.tasks-enter-active {
  transition: all 0.5s ease;
}


</style>