<script setup lang="ts">
const { t } = useI18n()

const contactText = computed(() => t('landing.contact', "Contact me"));
</script>

<template>
  <div class="contact-link">
    <LocLink to="/contact" class="link">{{ contactText }}</LocLink>
  </div>
</template>

<style scoped lang="scss">
.contact-link {
  .link {
    color: $secondary;
    font-weight: bold;
    font-size: 1.3rem;
    border: 2px solid $secondary;
    padding: .5rem 2rem;

    @media (min-width: 1024px) {
      transition: all .2s ease-in-out;
      &:hover {
        color: $active;
        box-shadow: 0 0 3px 0 $active;
      }
    }
  }
}
</style>