<script setup lang="ts">
import type {Component} from "vue";
import ContactButton from "~/components/buttons/ContactButton.vue";
import RadialPulseButton from "~/components/animations/buttons/RadialPulseButton.vue";
import OrbitalPulseButton from "~/components/animations/buttons/OrbitalPulseButton.vue";
import PendulumWaveButton from "~/components/animations/buttons/PendulumWaveButton.vue";
import PulseWaveButton from "~/components/animations/buttons/PulseWaveButton.vue";
import ConcentricRingsButton from "~/components/animations/buttons/ConcentricRingsButton.vue";
import SequentialPulseButton from "~/components/animations/buttons/SequentialPulseButton.vue";
import OscillatingDotsButton from "~/components/animations/buttons/OscillatingDotsButton.vue";
import PulsingGridButton from "~/components/animations/buttons/PulsingGridButton.vue";
import SpiralGalaxyButton from "~/components/animations/buttons/SpiralGalaxyButton.vue";
import CrystallineCubeRefractionButton from "~/components/animations/buttons/CrystallineCubeRefractionButton.vue";
import CrystallineRefractionButton from "~/components/animations/buttons/CrystallineRefractionButton.vue";
import CylindricalAnalysisButton from "~/components/animations/buttons/CylindricalAnalysisButton.vue";
import HelixScannerButton from "~/components/animations/buttons/HelixScannerButton.vue";
import InterconnectingWavesButton from "~/components/animations/buttons/InterconnectingWavesButton.vue";
import PhasedArrayEmitterButton from "~/components/animations/buttons/PhasedArrayEmitterButton.vue";
import SonarSweepButton from "~/components/animations/buttons/SonarSweepButton.vue";
import SphereScanButton from "~/components/animations/buttons/SphereScanButton.vue";
import VoxelMatrixMorphButton from "~/components/animations/buttons/VoxelMatrixMorphButton.vue";
import PulseShockwaveButton from "~/components/animations/buttons/PulseShockwaveButton.vue";
import PulseWaveSpiralButton from "~/components/animations/buttons/PulseWaveSpiralButton.vue";
import BreathingGridButton from "~/components/animations/buttons/BreathingGridButton.vue";
import FlowingEnergyBandsButton from "~/components/animations/buttons/FlowingEnergyBandsButton.vue";
import StretchedRingsButton from "~/components/animations/buttons/StretchedRingsButton.vue";
import InterwovenPulsesButton from "~/components/animations/buttons/InterwovenPulsesButton.vue";
import SpiralRadiatingPulseButton from "~/components/animations/buttons/SpiralRadiatingPulseButton.vue";
import RadiatingLineScanButton from "~/components/animations/buttons/RadiatingLineScanButton.vue";

definePageMeta({
  title: 'Moonwitch Web Developer'
})

const {t} = useI18n()

const tagText = computed(() => t('landing.tag', "I create things for the Web."));
const stackText = computed(() => t('landing.stack', "My stack includes"));

const transitionKey = ref(0)

const animationPool = [
  RadialPulseButton,
  OrbitalPulseButton,
  PendulumWaveButton,
  PulseWaveButton,
  ConcentricRingsButton,
  SequentialPulseButton,
  OscillatingDotsButton,
  PulsingGridButton,
  SpiralGalaxyButton,
  CrystallineCubeRefractionButton,
  CrystallineRefractionButton,
  CylindricalAnalysisButton,
  HelixScannerButton,
  InterconnectingWavesButton,
  PhasedArrayEmitterButton,
  SonarSweepButton,
  SphereScanButton,
  VoxelMatrixMorphButton,
  PulseShockwaveButton,
  PulseWaveSpiralButton,
  BreathingGridButton,
  FlowingEnergyBandsButton,
  StretchedRingsButton,
  InterwovenPulsesButton,
  SpiralRadiatingPulseButton,
  RadiatingLineScanButton
] as const satisfies readonly Component[];

type Pool = typeof animationPool;
type PoolItem = Pool[number];
type Pick3 = readonly [PoolItem, PoolItem, PoolItem];

const selectedAnimations = shallowRef<Pick3>([
  animationPool[0],
  animationPool[1],
  animationPool[2]
]);

function pickThreeRandom(): Pick3 {
  const idx: number[] = Array.from({length: animationPool.length}, (_, i) => i);

  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    const tmp = idx[i]!;
    idx[i] = idx[j]!;
    idx[j] = tmp;
  }

  const a = idx[0]!;
  const b = idx[1]!;
  const c = idx[2]!;

  return [animationPool[a]!, animationPool[b]!, animationPool[c]!];
}

onMounted(() => {
  selectedAnimations.value = pickThreeRandom();
  transitionKey.value++
})
</script>

<template>
  <div class="landing-container">
    <section class="hero">
      <div class="text">{{ tagText }}</div>
    </section>
    <section class="contact">
      <ContactButton/>
    </section>
    <section>
      <TransitionGroup appear :key="transitionKey" name="fade" tag="div" class="route-buttons" mode="out-in">
        <div key="projects">
          <h4>Projects</h4>
          <LocLink to="/projects">
            <div class="animated-button">
              <ClientOnly>
                <component :is="selectedAnimations[0]"/>
              </ClientOnly>
            </div>
          </LocLink>
        </div>
        <div key="art">
          <h4>Art</h4>
          <LocLink to="/art">
            <div class="animated-button">
              <ClientOnly>
                <component :is="selectedAnimations[1]"/>
              </ClientOnly>
            </div>
          </LocLink>
        </div>
        <div key="blog">
          <h4>Blog</h4>
          <LocLink to="/blog">
            <div class="animated-button">
              <ClientOnly>
                <component :is="selectedAnimations[2]"/>
              </ClientOnly>
            </div>
          </LocLink>
        </div>
      </TransitionGroup>
    </section>
    <section class="tools">
      <div class="stack-text">{{ stackText }}</div>
      <Icons/>
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

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 3s ease;
}

.fade-enter-to {
  opacity: 1;
}

.route-buttons > div:nth-child(1).fade-enter-active {
  transition-delay: 0ms;
}

.route-buttons > div:nth-child(2).fade-enter-active {
  transition-delay: 200ms;
}

.route-buttons > div:nth-child(3).fade-enter-active {
  transition-delay: 400ms;
}
</style>