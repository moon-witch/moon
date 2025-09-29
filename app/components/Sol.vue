<script setup lang="ts">
</script>

<template>
    <div class="overlay"></div>
</template>

<style scoped lang="scss">
.overlay {
  width: 25rem;
  height: 25rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  user-select: none;
  background-image: url("/logos/sol.svg");
  background-repeat: no-repeat;
  filter: blur(2px);

  @media (min-width: 1024px) {
    width: 45rem;
    height: 45rem;
  }

  @media (max-width: 1023px) {
    display: none;
  }
}
</style>