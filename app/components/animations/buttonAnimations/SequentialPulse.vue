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

    const radius = Math.min(W, H) * 0.39;
    const dotCount = 16;

    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.015), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;

      const pulsePhase = (time * 0.5 + i / dotCount) % 1;
      const pulseFactor = Math.sin(pulsePhase * Math.PI * 2);

      const size = Math.max(1, Math.min(W, H) * 0.012 + pulseFactor * Math.min(W, H) * 0.012);
      const finalRadius = radius + pulseFactor * (Math.min(W, H) * 0.028);

      const x = centerX + Math.cos(angle) * finalRadius;
      const y = centerY + Math.sin(angle) * finalRadius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + pulseFactor * 0.2})`;
      ctx.lineWidth = Math.max(0.8, Math.min(W, H) * 0.004);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
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
