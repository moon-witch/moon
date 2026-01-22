<template>
  <div class="fill">
    <RadialPulse :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import RadialPulse from "../buttonAnimations/RadialPulse.vue";

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
