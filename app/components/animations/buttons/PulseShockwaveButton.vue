<template>
  <div class="fill">
    <PulseShockwave :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import PulseShockwave from "../buttonAnimations/PulseShockwave.vue";

defineProps({
  speed: {
    type: Number, default: 1
  }
});
</script>

<style scoped>
.fill {
  width: 100%;
  height: 100%;
}
</style>
