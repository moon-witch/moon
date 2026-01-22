<template>
  <div ref="containerRef" class="stage"><canvas ref="canvasRef" /></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "~/composables/useHiDPICanvas";

const props = defineProps({ speed: { type: Number, default: 1 } });
const { containerRef, canvasRef, ctxRef, sizeRef } = useHiDPICanvas();

let rafId: number | null = null;
let t = 0;
let last = 0;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function fill(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
}

onMounted(() => {
  const animate = (ts: number) => {
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;

    const ctx = ctxRef.value;
    const { width: W, height: H } = sizeRef.value;
    if (!ctx || W <= 0 || H <= 0) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    t += dt * props.speed * 0.5;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);

    const radius = m * 0.33;     // ~60 at 180
    const height = m * 0.56;     // ~100 at 180
    const numLayers = 15;
    const dotsPerLayer = 25;

    const eased = easeInOutCubic((Math.sin(t * 2) + 1) / 2);
    const scanY = cy + (eased * 2 - 1) * (height / 2);
    const scanWidth = Math.min(15, m * 0.085);

    for (let i = 0; i < numLayers; i++) {
      const layerY = cy + (i / (numLayers - 1) - 0.5) * height;
      const rot = t * (0.2 + (i % 2) * 0.1);

      for (let j = 0; j < dotsPerLayer; j++) {
        const angle = (j / dotsPerLayer) * Math.PI * 2 + rot;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const scale = (z + radius) / (radius * 2);
        const px = cx + x * scale;
        const py = layerY;

        const distToScan = Math.abs(py - scanY);
        const scanInfluence =
            distToScan < scanWidth ? Math.cos((distToScan / scanWidth) * (Math.PI / 2)) : 0;

        const size = Math.max(0, scale * (m * 0.0085) + scanInfluence * (m * 0.011));
        const opacity = Math.max(0, scale * 0.5 + scanInfluence * 0.5);

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = fill(opacity);
        ctx.fill();
      }
    }

    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => { if (rafId) cancelAnimationFrame(rafId); });
</script>

<style scoped>
.stage { width: 100%; height: 100%; }
</style>
