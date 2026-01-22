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

const F = (o: number) => `rgba(255,255,255,${Math.max(0, Math.min(1, o))})`;

type P = { x: number; y: number; };

let dots: P[] = [];
let seededW = 0;
let seededH = 0;

function seed(W: number, H: number) {
  const m = Math.min(W, H);
  const s = m / 180;
  const cx = W / 2;
  const cy = H / 2;

  const gridSize = 9;
  const spacing = 18 * s;
  const gridOffsetX = cx - ((gridSize - 1) * spacing) / 2;
  const gridOffsetY = cy - ((gridSize - 1) * spacing) / 2;

  const next: P[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      next.push({ x: gridOffsetX + c * spacing, y: gridOffsetY + r * spacing });
    }
  }

  dots = next;
  seededW = W;
  seededH = H;
}

onMounted(() => {
  const animate = (ts: number) => {
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;
    t += dt * props.speed;

    const ctx = ctxRef.value;
    const { width: W, height: H } = sizeRef.value;
    if (!ctx || W <= 0 || H <= 0) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    if (dots.length === 0 || Math.abs(W - seededW) > 2 || Math.abs(H - seededH) > 2) {
      seed(W, H);
    }

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);
    const s = m / 180;

    const waveSpeed = 60 * s;
    const waveThickness = 40 * s;
    const maxDist = Math.hypot(cx, cy) + waveThickness;

    const currentWave = (t * waveSpeed) % maxDist;

    for (const d of dots) {
      const distFromCenter = Math.hypot(d.x - cx, d.y - cy);
      const distToWave = Math.abs(distFromCenter - currentWave);

      let pulse = 0;
      if (distToWave < waveThickness / 2) {
        pulse = 1 - distToWave / (waveThickness / 2);
        pulse = Math.sin((pulse * Math.PI) / 2);
      }

      const dotSize = (1.5 + pulse * 2.5) * s;
      const opacity = 0.2 + pulse * 0.8;

      ctx.beginPath();
      ctx.arc(d.x, d.y, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = F(opacity);
      ctx.fill();
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
