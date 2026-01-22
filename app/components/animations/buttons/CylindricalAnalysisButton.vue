<template>
  <div class="fill">
    <CylindricalAnalysis :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import CylindricalAnalysis from "../buttonAnimations/CylindricalAnalysis.vue";

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
