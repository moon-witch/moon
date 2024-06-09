<script setup lang="ts">
const { t } = useI18n()
const artButtonText = computed(() => t('base.artCTA', 'I am also an artist!'));
</script>

<template>
  <div>
    <LocLink to="/art" class="art-button"><span class="arrow">←</span> {{ artButtonText }}</LocLink>
  </div>
</template>

<style scoped lang="scss">
.art-button {
  background: transparent;
  position: relative;

    @media (max-width: 1023px) {
      color: $primary;
    }

  &:hover {
    cursor: pointer;

    .arrow {
      left: -22%;
    }

    .link {
      color: $alt;
    }
  }

  .arrow {
    font-size: 1.7rem;
    position: absolute;
    top: 43%;
    left: -20%;
    transform: translateY(-50%);
    transition: left .1s ease;
  }
}
</style>