<template>
  <div class="fill">
    <PulseWaveSpiral :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import PulseWaveSpiral from "../buttonAnimations/PulseWaveSpiral.vue";

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
