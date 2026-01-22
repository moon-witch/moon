<template>
  <div class="fill">
    <SonarSweep :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import SonarSweep from "../buttonAnimations/SonarSweep.vue";

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
