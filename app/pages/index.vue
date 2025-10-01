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

  .name {
    text-align: center;
    margin-bottom: 1rem;
    font-weight: bold;
    color: $active;
    font-size: 1.5rem;
  }

  .hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    text-align: center;

    @media (min-width: 1024px) {
      gap: 2rem;
    }

    .text {
      font-size: 3.5rem;
    }
  }

  .tools {
    text-align: center;
    font-weight: bold;
    margin-top: 2rem;
    font-size: 1.3rem;

    .stack-text {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    @media (min-width: 1024px) {
      padding-top: 2rem;
    }
  }

  .contact {
    text-align: center;
    margin-top: 6rem;

    @media (min-width: 1024px) {
      margin-top: 5rem;
    }
  }

  @media (min-width: 1024px) {
    .name {
      margin-top: 6rem;
      text-align: center;
      margin-bottom: 1rem;
      font-weight: bold;
      color: $active;
      font-size: 2rem;
    }

    .hero {
      gap: 3rem;
      margin-top: 3rem;
      flex-direction: row;

      .text {
        font-size: 2rem;
      }

      .photo {
        width: 9rem;
        height: 9rem;
      }
    }

    .product {
      margin-top: 2rem;
      font-size: 1.5rem;

      > div {
        &:first-child {
          font-weight: bold;
          color: $active;
          margin-bottom: 1rem;
        }
      }
    }

    .tools {
      text-align: center;
      font-weight: bold;
      margin-top: 3rem;
    }
  }
}
</style>