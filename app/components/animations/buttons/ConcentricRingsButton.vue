<template>
  <div class="fill">
    <ConcentricRings :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import ConcentricRings from "../buttonAnimations/ConcentricRings.vue";

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
