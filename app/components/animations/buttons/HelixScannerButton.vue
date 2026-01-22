<template>
  <div class="fill">
    <HelixScanner :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import HelixScanner from "../buttonAnimations//HelixScanner.vue";

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
