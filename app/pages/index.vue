<script setup lang="ts">
definePageMeta({
  title: 'Moonwitch Web Developer'
})

const {t} = useI18n()


const nameText = computed(() => t('landing.name', "I am Joshua Langenbach."));
const tagText = computed(() => t('landing.tag', "I create things for the Web."));
const productText = computed(() => t('landing.product', "Design - Development - Hosting"));
const infoText = computed(() => t('landing.info', "My passion lies in custom, artful websites. I specialize in clean, unique designs where you feel intuitively at home."));
const stackText = computed(() => t('landing.stack', "My stack includes"));
</script>

<template>
  <div class="landing-container">
    <div class="name"> {{ nameText }}</div>
    <section class="hero">
      <div class="text">
        <div>{{ tagText }}</div>
      </div>
      <img src="/images/profilepicsmol.jpg" alt="Photo of Joshua aka moonwitch, the web developer, wearing a casual outfit, looking into the distance."
           class="photo"/>
    </section>
    <section class="product">
      <div>{{ productText }}</div>
      <div>{{ infoText }}</div>
    </section>
    <section class="tools">
      <div>{{ stackText }}</div>
      <Icons />
    </section>
    <section class="contact">
      <ContactButton/>
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
      font-size: 1.3rem;
    }

    .photo {
      width: 7rem;
      height: 7rem;
      border: 1px solid $active;
      border-radius: 5px;
    }
  }

  .product {
    margin-top: 1rem;
    text-align: center;

    @media (min-width: 1024px) {
      margin-top: 2rem;
    }

    > div {
      &:first-child {
        font-weight: bold;
        color: $active;
        margin: 2rem;
      }
    }
  }

  .tools {
    text-align: center;
    font-weight: bold;
    margin-top: 2rem;
    font-size: 1.3rem;

    @media (min-width: 1024px) {
      padding-top: 2rem;
    }
  }

  .contact {
    text-align: center;
    margin-top: 2rem;

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
        font-size: 1.5rem;
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