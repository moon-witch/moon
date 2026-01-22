<template>
  <div class="fill">
    <FlowingEnergyBands :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import FlowingEnergyBands from "../buttonAnimations/FlowingEnergyBands.vue";

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
