<template>
  <div class="fill">
    <PulsingGrid :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import PulsingGrid from "../buttonAnimations/PulsingGrid.vue";

defineProps({
  speed: { type: Number, default: 1 }
});
</script>

<style scoped>
.fill {
  width: 100%;
  height: 100%;
}
</style>
