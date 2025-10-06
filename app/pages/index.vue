<script setup lang="ts">
import ParticleHeart from "~/components/animations/ParticleHeart.vue";
import ContactButton from "~/components/buttons/ContactButton.vue";
import ParticleEye from "~/components/animations/ParticleEye.vue";

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
    <section class="animated-button">
      <ParticleHeart
          :width="120"
          :height="120"
          :particleCount="8000"
          :duration="2.5"
          :amplitude="0.03"
          :hoverBoost="0.055"
          :rotation-z="0"
      />
    </section>
    <section class="animated-button">
      <ParticleEye
          :width="360"
          :height="360"
          modelPath="/glb-models/lowpoly_human_eye.glb"
          :particleCount="16000"
          :amplitude="0.06"
          :animationSpeed="0.8"
        :gazeMoveFactor="0.35"
        coreColor="#FF3B3B"
        edgeColor="#7A0014"
      />
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

  .animated-button {
    border: 1px solid $active;
    width: 250px;
    height: 250px;

    &:hover {
      border: 1px solid $secondary;
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