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

    const dotRings = [
      { frac: 0.2, count: 6 },
      { frac: 0.4, count: 12 },
      { frac: 0.6, count: 18 },
      { frac: 0.8, count: 24 },
      { frac: 1.0, count: 30 }
    ];

    // center
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.012), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    dotRings.forEach((ring, ringIndex) => {
      const radius = ring.frac * maxRadius;

      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2;
        const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * (Math.min(W, H) * 0.017);

        const x = centerX + Math.cos(angle) * (radius + radiusPulse);
        const y = centerY + Math.sin(angle) * (radius + radiusPulse);

        const opacityWave =
            0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, Math.min(W, H) * 0.011), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacityWave})`;
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
