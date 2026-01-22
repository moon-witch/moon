<template>
  <div class="fill">
    <PulseWave :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import PulseWave from "../buttonAnimations/PulseWave.vue";

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
