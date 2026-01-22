<template>
  <div class="fill">
    <CrystallineCubeRefraction :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import CrystallineCubeRefraction from "../buttonAnimations/CrystallineCubeRefraction.vue";

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
