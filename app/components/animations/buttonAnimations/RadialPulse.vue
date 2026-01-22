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

    // center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.015), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    const ringCount = 8;
    const dotsPerRing = 12;
    const pulseSpeed = 0.35;

    for (let i = 0; i < ringCount; i++) {
      const pulsePhase = (time * pulseSpeed + i / ringCount) % 1;
      const ringRadius = pulsePhase * maxRadius;
      if (ringRadius < Math.min(W, H) * 0.03) continue;

      const opacity = 1 - pulsePhase;
      const dotBase = Math.min(W, H) * 0.014;

      for (let j = 0; j < dotsPerRing; j++) {
        const angle = (j / dotsPerRing) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * ringRadius;
        const y = centerY + Math.sin(angle) * ringRadius;
        const dotSize = dotBase * (1 - pulsePhase * 0.5);

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, dotSize), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      }
    }

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
