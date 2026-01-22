<!-- CircleAnimationsCollection.vue -->
<template>
  <section class="page">
    <h1 class="title">CIRCLE ANIMATIONS COLLECTION N°2</h1>

    <div class="grid">
      <AnimationCard title="Radial Pulse">
        <RadialPulse />
      </AnimationCard>

      <AnimationCard title="Orbital Pulse">
        <OrbitalPulse />
      </AnimationCard>

      <AnimationCard title="Pendulum Wave">
        <PendulumWave />
      </AnimationCard>

      <AnimationCard title="Pulse Wave">
        <PulseWave />
      </AnimationCard>

      <AnimationCard title="Concentric Rings">
        <ConcentricRings />
      </AnimationCard>

      <AnimationCard title="Sequential Pulse">
        <SequentialPulse />
      </AnimationCard>

      <AnimationCard title="Oscillating Dots">
        <OscillatingDots />
      </AnimationCard>

      <AnimationCard title="Pulsing Grid">
        <PulsingGrid />
      </AnimationCard>

      <AnimationCard title="Spiral Galaxy">
        <SpiralGalaxy />
      </AnimationCard>
    </div>
  </section>
</template>

<script setup>
import AnimationCard from "./components/AnimationCard.vue";

import RadialPulse from "./components/RadialPulse.vue";
import OrbitalPulse from "./components/OrbitalPulse.vue";
import PendulumWave from "./components/PendulumWave.vue";
import PulseWave from "./components/PulseWave.vue";
import ConcentricRings from "./components/ConcentricRings.vue";
import SequentialPulse from "./components/SequentialPulse.vue";
import OscillatingDots from "./components/OscillatingDots.vue";
import PulsingGrid from "./components/PulsingGrid.vue";
import SpiralGalaxy from "./components/SpiralGalaxy.vue";
</script>

<style scoped>
@import url("https://fonts.cdnfonts.com/css/thegoodmonolith");

.page {
  background: #000;
  color: #f0f0f0;
  min-height: 100vh;
  padding: 20px;
  font-family: "TheGoodMonolith", monospace;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  margin-bottom: 30px;
  font-size: 24px;
  letter-spacing: 1px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 500px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
