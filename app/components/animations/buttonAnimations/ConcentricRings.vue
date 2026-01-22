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

    const ringCount = 5;
    const maxRadius = Math.min(W, H) * 0.42;

    // center
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.015), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    for (let r = 0; r < ringCount; r++) {
      const radius = ((r + 1) / ringCount) * maxRadius;
      const dotCount = 6 + r * 6;

      const phaseOffset = r % 2 === 0 ? time * 0.2 : -time * 0.2;
      const ringPhase = time + r * 0.7;

      for (let i = 0; i < dotCount; i++) {
        const angle = (i / dotCount) * Math.PI * 2 + phaseOffset;

        const radiusPulse = Math.sin(ringPhase) * (Math.min(W, H) * 0.017);
        const finalRadius = radius + radiusPulse;

        const x = centerX + Math.cos(angle) * finalRadius;
        const y = centerY + Math.sin(angle) * finalRadius;

        const baseSize = Math.min(W, H) * (0.011 + (r / (ringCount - 1)) * 0.006);
        const sizePulse = Math.sin(ringPhase) * baseSize * 0.7 + baseSize;
        const opacityPulse = 0.6 + Math.sin(ringPhase) * 0.4;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, sizePulse), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacityPulse})`;
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
