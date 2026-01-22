<template>
  <div class="fill">
    <PendulumWave :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import PendulumWave from "../buttonAnimations/PendulumWave.vue";

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
