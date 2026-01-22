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

type P3 = { x: number; y: number; z: number };
type DrawP = { x: number; y: number; z: number; size: number; opacity: number };

let points: P3[] = [];
let lastSeedW = 0;
let lastSeedH = 0;
let maxRadius = 0;

function seed(W: number, H: number) {
  const m = Math.min(W, H);
  const ringRadii = [0.11, 0.22, 0.33, 0.44].map(f => f * m);
  const pointsPerRing = [12, 18, 24, 30];

  maxRadius = ringRadii[ringRadii.length - 1];
  const next: P3[] = [];

  ringRadii.forEach((radius, i) => {
    const count = pointsPerRing[i];
    for (let j = 0; j < count; j++) {
      const angle = (j / count) * Math.PI * 2;
      next.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0
      });
    }
  });

  points = next;
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

    if (points.length === 0 || Math.abs(W - lastSeedW) > 4 || Math.abs(H - lastSeedH) > 4) {
      seed(W, H);
    }

    t += dt * props.speed * 0.5;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);

    const fov = m * 1.67; // ~300 at 180
    const rotX = 1.0;
    const rotY = t * 0.2;

    const waveRadius = (t * (m * 0.67)) % (maxRadius * 1.8);
    const waveWidth = Math.min(50, m * 0.28);
    const waveHeight = m * 0.1;

    const cY = Math.cos(rotY), sY = Math.sin(rotY);
    const cX = Math.cos(rotX), sX = Math.sin(rotX);

    const draw: DrawP[] = [];

    for (const p0 of points) {
      let x = p0.x, y = p0.y, z = p0.z;

      const dist = Math.hypot(x, y);
      const distToWave = Math.abs(dist - waveRadius);

      let waveInfluence = 0;
      if (distToWave < waveWidth / 2) {
        const wavePhase = (1 - distToWave / (waveWidth / 2)) * Math.PI;
        z = easeInOutCubic(Math.sin(wavePhase)) * waveHeight;
        waveInfluence = z / waveHeight;
      }

      // rotate Y
      let tx = x * cY - z * sY;
      let tz = x * sY + z * cY;
      x = tx; z = tz;

      // rotate X
      let ty = y * cX - z * sX;
      tz = y * sX + z * cX;
      y = ty; z = tz;

      const scale = fov / (fov + z + m * 0.55);
      const px = cx + x * scale;
      const py = cy + y * scale;

      const size = (m * 0.008 + waveInfluence * (m * 0.014)) * scale;
      const opacity = 0.4 + waveInfluence * 0.6;

      draw.push({ x: px, y: py, z, size, opacity });
    }

    draw.sort((a, b) => a.z - b.z);

    for (const p of draw) {
      if (p.size < 0.1) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = fill(p.opacity);
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
