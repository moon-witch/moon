<template>
  <div class="fill">
    <SphereScan :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import SphereScan from "../buttonAnimations/SphereScan.vue";

defineProps({
  speed: {
    type: Number,
    default: 1
  }
});
</script>

<style scoped>
  .fill {
    width:100%;
    height:100%;
  }
</style>
