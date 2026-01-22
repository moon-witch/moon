<template>
  <div class="fill">
    <CrystallineRefraction :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import CrystallineRefraction from "../buttonAnimations/CrystallineRefraction.vue";

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
