<template>
  <div class="fill">
    <InterwovenPulses :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import InterwovenPulses from "../buttonAnimations/InterwovenPulses.vue";

defineProps({
  speed: {
    type: Number,
    default: 1
  }
});
</script>

<style scoped>
.fill {
  width: 100%;
  height: 100%;
}
</style>
