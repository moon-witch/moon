<script setup lang="ts">
definePageMeta({
  title: 'Moonwitch Web Developer'
})

const {t} = useI18n()

const tagText = computed(() => t('landing.tag', "I create things for the Web."));
const stackText = computed(() => t('landing.stack', "My stack includes"));
</script>

<template>
  <div class="landing-container">
    <section class="hero">
        <div class="text">{{ tagText }}</div>
    </section>
    <section class="contact">
      <ContactButton/>
    </section>
    <section class="tools">
      <div class="stack-text">{{ stackText }}</div>
      <Icons />
    </section>
  </div>
</template>

<style scoped lang="scss">
.landing-container {
  margin-top: 1rem;
  padding: 0 1rem;

  @media (min-width: 1024px) {
    margin-top: 0;
  }

  .hero {
    text-align: center;
    margin-top: 2rem;

    @media (min-width: 1024px) {
      margin-top: 3rem;
      flex-direction: row;
    }

    .text {
      font-size: 2rem;
    }
  }

  .contact {
    text-align: center;
    margin-top: 4rem;

    @media (min-width: 1024px) {
      margin-top: 5rem;
    }
  }

  .tools {
    text-align: center;
    margin-top: 2rem;
    font-size: 1.3rem;
    padding-top: 2rem;

    @media (min-width: 1024px) {
        margin-top: 3rem;
    }

    .stack-text {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
}
</style>