<template>
  <div class="fill">
    <SpiralGalaxy :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import SpiralGalaxy from "../buttonAnimations/SpiralGalaxy.vue";

defineProps({
  speed: { type: Number, default: 1 }
});
</script>

<style scoped>
.fill {
  width: 100%;
  height: 100%;
}
</style>
