<template>
  <div class="fill">
    <RadiatingLineScan :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import RadiatingLineScan from "../buttonAnimations/RadiatingLineScan.vue";

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
