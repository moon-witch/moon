<template>
  <div class="fill">
    <OscillatingDots :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import OscillatingDots from "../buttonAnimations/OscillatingDots.vue";

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
