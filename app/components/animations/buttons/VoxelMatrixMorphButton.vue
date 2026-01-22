<template>
  <div class="fill">
    <VoxelMatrixMorph :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import VoxelMatrixMorph from "../buttonAnimations/VoxelMatrixMorph.vue";

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
