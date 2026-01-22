<script setup lang="ts">
import "/assets/main.scss";
import GeometryAnimation from "~/components/animations/GeometryAnimation.vue";
</script>

<template>
  <div class="app-container">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@import "../public/fonts/stylesheet.css";

.app-container {
  background: $primary;
  min-height: 100dvh;
  font-family: 'EB Garamond', serif;
  font-size: $font-size;
  overflow-x: hidden;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  //filter: blur(1rem);
  transform: translateY(-20px);
}
</style>
