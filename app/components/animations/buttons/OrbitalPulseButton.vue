<template>
  <div class="fill">
    <OrbitalPulse :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import OrbitalPulse from "../buttonAnimations/OrbitalPulse.vue";

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
