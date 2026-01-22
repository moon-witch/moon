<template>
  <div ref="containerRef" class="stage">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "@/composables/useHiDPICanvas";

const props = defineProps({
  speed: { type: Number, default: 1 }
});

const { containerRef, canvasRef, ctxRef, sizeRef } = useHiDPICanvas();

let rafId = null;
let time = 0;
let last = 0;

onMounted(() => {
  const animate = (ts) => {
    if (!last) last = ts;
    const dt = ts - last;
    last = ts;

    time += dt * 0.001 * props.speed;

    const ctx = ctxRef.value;
    const { width: W, height: H } = sizeRef.value;

    if (!ctx || W <= 0 || H <= 0) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;
    const maxRadius = Math.min(W, H) * 0.42;

    // center
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.015), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    // orbit radii as fractions of max
    const orbitFracs = [0.2, 0.33, 0.47, 0.6, 0.73, 0.87];
    const dotCounts = [6, 10, 14, 18, 22, 26];

    const pulseFrequency = 0.5;
    const pulseAmplitude = Math.min(W, H) * 0.012;

    orbitFracs.forEach((f, idx) => {
      const radius = f * maxRadius;
      const dotCount = dotCounts[idx];

      // faint orbit circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const normalizedRadius = radius / maxRadius;
      const pulseDelay = normalizedRadius * 1.5;
      const pulsePhase = (time * pulseFrequency - pulseDelay) % 1;

      const pulseEffect = Math.sin(pulsePhase * Math.PI) * pulseAmplitude;
      const finalPulseEffect = pulseEffect > 0 ? pulseEffect : 0;

      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2;
        const pulsedRadius = radius + finalPulseEffect;

        const x = centerX + Math.cos(angle) * pulsedRadius;
        const y = centerY + Math.sin(angle) * pulsedRadius;

        const dotSize = Math.max(1, Math.min(W, H) * 0.011 + (finalPulseEffect / pulseAmplitude) * Math.min(W, H) * 0.008);
        const opacity = 0.7 + (finalPulseEffect / pulseAmplitude) * 0.3;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
    });

    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.stage {
  width: 100%;
  height: 100%;
}
</style>
