<script setup lang="ts">
import ParticleHeart from "~/components/animations/ParticleHeart.vue";
import ContactButton from "~/components/buttons/ContactButton.vue";
import ParticleEye from "~/components/animations/ParticleEye.vue";
import ParticleCell from "~/components/animations/ParticleCell.vue";

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
    <section class="route-buttons">
      <div>
        <h4>Projects</h4>
        <LocLink to="/projects">
          <div class="animated-button">
            <ParticleHeart
                :width="120"
                :height="120"
                :particleCount="3000"
                :duration="2.5"
                :amplitude="0.03"
                :hoverBoost="0.055"
                :rotation-z="0"
            />
          </div>
        </LocLink>
      </div>
      <div>
        <h4>Art</h4>
        <LocLink to="/art">
          <div class="animated-button">
            <ParticleCell
                :width="250"
                :height="250"
                modelPath="/glb-models/lowpoly_cell.glb"
                :particleCount="18000"
                :basePointSize="0.5"
                :motionSpeed="0.7"
                :motionScale="0.19"
                :twinkle="0.45"
            />
          </div>
        </LocLink>
      </div>
      <div>
        <h4>Blog</h4>
        <LocLink to="/blog">
          <div class="animated-button eye" style="position: relative;">
            <ParticleEye
                :width="250"
                :height="250"
                modelPath="/glb-models/lowpoly_human_eye.glb"
                :particleCount="9000"
                :amplitude="0.06"
                :animationSpeed="0.1"
                :gazeMoveFactor="0.05"
                :base-point-size="0.05"
                :intensity="0.7"
                class="instance-eye"
            />
            <ParticleEye
                :width="50"
                :height="50"
                modelPath="/glb-models/lowpoly_human_eye.glb"
                :particleCount="3000"
                :amplitude="0.5"
                :animationSpeed="0.1"
                :gazeMoveFactor="0.3"
                coreColor="#000555"
                edgeColor="#000333"
                :base-point-size="0.05"
                :intensity="0.7"
                class="instance-eye"
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); overflow: visible;"
            />
          </div>
        </LocLink>
      </div>
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

  .route-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 6rem;
    gap: 1rem;

    h4 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      text-align: center;
    }

    .animated-button {
      border: 1px solid $active;
      width: 250px;
      height: 250px;

      &:hover {
        border: 1px solid $secondary;
      }

      .eye {
        .instance-eye {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
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