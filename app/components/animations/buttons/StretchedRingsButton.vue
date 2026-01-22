<template>
  <div class="fill">
    <StretchedRings :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import StretchedRings from "../buttonAnimations/StretchedRings.vue";

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
