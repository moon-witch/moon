<template>
  <div class="fill">
    <SequentialPulse :speed="speed" />
  </div>
</template>

<script setup lang="ts">
import SequentialPulse from "../buttonAnimations/SequentialPulse.vue";

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
