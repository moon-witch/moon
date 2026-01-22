<template>
  <div class="fill">
    <SpiralRadiatingPulse :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import SpiralRadiatingPulse from "../buttonAnimations/SpiralRadiatingPulse.vue";

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
