<template>

<!-- <div class="glow-container">
  <div class="ball"></div>
  <div class="ball" style="--delay:-12s;--size:0.35;--speed:25s;"></div>
  <div class="ball" style="--delay:-10s;--size:0.3;--speed:15s;"></div>
</div> -->


<div class="flex h-screen w-screen">
    <!-- <aside
      class="hidden md:block h-full w-96 bg-charcoal border-r border-white border-opacity-10 text-marengo overflow-y-auto"
    >
      <div class="w-full p-5">
        
       ****

      </div>
    </aside> -->


    
    <topPanel /> 
    <main class="mt-20 overflow-y-auto h-[84vh] shadow-inner ">
        <slot />
    </main>

  </div>

</template>


