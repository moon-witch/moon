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

    const dotCount = 20;
    const rowCount = 5;

    const xStep = Math.min(W, H) * 0.045; // ~8 at 180
    const rowSpacing = Math.min(W, H) * 0.083; // ~15 at 180

    for (let row = 0; row < rowCount; row++) {
      const y = centerY - ((rowCount - 1) / 2) * rowSpacing + row * rowSpacing;

      for (let i = 0; i < dotCount; i++) {
        const baseX = centerX - ((dotCount - 1) / 2) * xStep + i * xStep;

        const amplitude = (Math.min(W, H) * 0.022) + row * (Math.min(W, H) * 0.011);
        const frequency = 1 + row * 0.2;
        const phaseOffset = row * 0.5;

        const offset = Math.sin(time * frequency + i * 0.2 + phaseOffset) * amplitude;

        ctx.beginPath();
        ctx.arc(baseX, y + offset, Math.max(1, Math.min(W, H) * 0.011), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
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
