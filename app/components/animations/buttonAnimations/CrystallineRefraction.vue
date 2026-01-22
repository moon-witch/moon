<template>
  <div ref="containerRef" class="stage"><canvas ref="canvasRef" /></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "~/composables/useHiDPICanvas";

const props = defineProps({ speed: { type: Number, default: 1 } });
const { containerRef, canvasRef, ctxRef, sizeRef } = useHiDPICanvas();

let rafId: number | null = null;
let t = 0; // seconds
let last = 0;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function fill(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
}

type P2 = { x: number; y: number };
let dots: P2[] = [];
let lastSeedW = 0;
let lastSeedH = 0;

function seed(W: number, H: number) {
  const gridSize = 15;
  const spacingX = W / (gridSize - 1);
  const spacingY = H / (gridSize - 1);

  const next: P2[] = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      next.push({ x: c * spacingX, y: r * spacingY });
    }
  }
  dots = next;
  lastSeedW = W;
  lastSeedH = H;
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

    if (dots.length === 0 || Math.abs(W - lastSeedW) > 4 || Math.abs(H - lastSeedH) > 4) {
      seed(W, H);
    }

    // original: time += deltaTime * 0.16 * GLOBAL_SPEED (ms-based)
    // convert: dt seconds => dt*1000*0.16*0.5 = dt*80
    t += dt * props.speed * 80;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;

    const waveRadius = (t % (Math.min(W, H) * 1.2));
    const waveWidth = Math.min(60, Math.min(W, H) * 0.33);

    for (const d of dots) {
      const dist = Math.hypot(d.x - cx, d.y - cy);
      const distToWave = Math.abs(dist - waveRadius);

      let displacement = 0;
      if (distToWave < waveWidth / 2) {
        const wavePhase = (distToWave / (waveWidth / 2)) * Math.PI;
        displacement = easeInOutCubic(Math.sin(wavePhase)) * (Math.min(W, H) * 0.055);
      }

      const angleToCenter = Math.atan2(d.y - cy, d.x - cx);
      const dx = Math.cos(angleToCenter) * displacement;
      const dy = Math.sin(angleToCenter) * displacement;

      const opacity = 0.2 + (Math.abs(displacement) / (Math.min(W, H) * 0.055)) * 0.8;
      const size = (Math.min(W, H) * 0.0065) + (Math.abs(displacement) / (Math.min(W, H) * 0.055)) * (Math.min(W, H) * 0.011);

      ctx.beginPath();
      ctx.arc(d.x + dx, d.y + dy, size, 0, Math.PI * 2);
      ctx.fillStyle = fill(opacity);
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
