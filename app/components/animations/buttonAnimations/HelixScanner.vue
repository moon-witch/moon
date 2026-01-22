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

function fill(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
}

type Dot = { angle: number; y: number };

let dots: Dot[] = [];
let lastSeedW = 0;
let lastSeedH = 0;

function seed(W: number, H: number) {
  const numDots = 100;
  const height = Math.min(W, H) * 0.67; // ~120 at 180
  const next: Dot[] = [];
  for (let i = 0; i < numDots; i++) {
    next.push({
      angle: i * 0.3,
      y: (i / numDots) * height - height / 2
    });
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

    t += dt * props.speed * 0.5; // GLOBAL_SPEED

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);

    const radius = m * 0.195; // ~35 at 180
    const height = m * 0.67;
    const loopDuration = 8;
    const seamlessProgress = Math.sin((t / loopDuration) * Math.PI * 2);
    const scanY = seamlessProgress * (height / 2);
    const scanWidth = Math.min(25, m * 0.14);
    const trailLength = height * 0.3;

    const isMovingUp = Math.cos((t / loopDuration) * Math.PI * 2) > 0;

    for (const d of dots) {
      const rotation = t;

      const x = radius * Math.cos(d.angle + rotation);
      const z = radius * Math.sin(d.angle + rotation);

      const px = cx + x;
      const py = cy + d.y;

      const scale = (z + radius) / (radius * 2);

      const distToScan = Math.abs(d.y - scanY);
      const leading =
          distToScan < scanWidth ? Math.cos((distToScan / scanWidth) * (Math.PI / 2)) : 0;

      let trail = 0;
      const distBehind = d.y - scanY;

      if (isMovingUp && distBehind < 0 && Math.abs(distBehind) < trailLength) {
        trail = Math.pow(1 - Math.abs(distBehind) / trailLength, 2) * 0.4;
      } else if (!isMovingUp && distBehind > 0 && Math.abs(distBehind) < trailLength) {
        trail = Math.pow(1 - Math.abs(distBehind) / trailLength, 2) * 0.4;
      }

      const influence = Math.max(leading, trail);

      const size = Math.max(0, scale * (m * 0.01) + influence * (m * 0.015));
      const opacity = Math.max(0, scale * 0.4 + influence * 0.6);

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
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
