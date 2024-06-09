<script setup lang="ts">
defineProps({
  to: {
    type: String,
    required: true,
  }
})

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink :to="localePath(to)" tabindex="0"><slot /></NuxtLink>
</template>

<style scoped lang="scss">
* {
  color: $primary;
  text-decoration: none;
}
</style>