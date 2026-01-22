<template>
  <div class="fill">
    <InterconnectingWaves :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import InterconnectingWaves from "../buttonAnimations/InterconnectingWaves.vue";

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
