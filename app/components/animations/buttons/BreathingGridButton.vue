<template>
  <div class="fill">
    <BreathingGrid :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import BreathingGrid from "../buttonAnimations/BreathingGrid.vue";

defineProps({
  speed: {
    type: Number, default: 1
  }
});
</script>

<style scoped>
.fill {
  width: 100%;
  height: 100%;
}
</style>
