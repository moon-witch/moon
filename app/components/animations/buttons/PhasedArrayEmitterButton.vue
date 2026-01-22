<template>
  <div class="fill">
    <PhasedArrayEmitter :speed="speed"/>
  </div>
</template>

<script setup lang="ts">
import PhasedArrayEmitter from "../buttonAnimations/PhasedArrayEmitter.vue";

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
