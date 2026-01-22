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
let maxDist = 1;
let cubeHalf = 1;

function seed(W: number, H: number) {
  const m = Math.min(W, H);

  const gridSize = 7;
  const spacing = m * 0.083; // ~15 at 180
  cubeHalf = ((gridSize - 1) * spacing) / 2;
  maxDist = Math.hypot(cubeHalf, cubeHalf, cubeHalf);

  const next: P3[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        next.push({
          x: x * spacing - cubeHalf,
          y: y * spacing - cubeHalf,
          z: z * spacing - cubeHalf
        });
      }
    }
  }

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

    // original: time += deltaTime * 0.0003 * GLOBAL_SPEED (ms)
    // dt seconds -> dt*1000*0.0003*0.5 = dt*0.15
    t += dt * props.speed * 0.15;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);

    const fov = m * 1.39; // ~250 at 180
    const rotX = t * 2;
    const rotY = t * 3;

    // original: waveRadius = (timestamp*0.04*GLOBAL_SPEED) % (maxDist*1.5)
    // use ts (ms) scaled by speed:
    const waveRadius = ((ts * 0.04 * 0.5 * props.speed) % (maxDist * 1.5));
    const waveWidth = Math.min(40, m * 0.22);
    const displacementMagnitude = m * 0.055;

    const cY = Math.cos(rotY), sY = Math.sin(rotY);
    const cX = Math.cos(rotX), sX = Math.sin(rotX);

    const draw: DrawP[] = [];

    for (const p0 of points) {
      let x = p0.x, y = p0.y, z = p0.z;

      const dist = Math.hypot(x, y, z);
      const distToWave = Math.abs(dist - waveRadius);

      let disp = 0;
      if (distToWave < waveWidth / 2) {
        const wavePhase = (distToWave / (waveWidth / 2)) * (Math.PI / 2);
        disp = easeInOutCubic(Math.cos(wavePhase)) * displacementMagnitude;
      }

      if (disp > 0 && dist > 0) {
        const ratio = (dist + disp) / dist;
        x *= ratio; y *= ratio; z *= ratio;
      }

      // rotate Y
      let tx = x * cY - z * sY;
      let tz = x * sY + z * cY;
      x = tx; z = tz;

      // rotate X
      let ty = y * cX - z * sX;
      tz = y * sX + z * cX;
      y = ty; z = tz;

      const scale = fov / (fov + z);
      const px = cx + x * scale;
      const py = cy + y * scale;

      const waveInfluence = displacementMagnitude > 0 ? (disp / displacementMagnitude) : 0;
      const size = (m * 0.008 + waveInfluence * (m * 0.014)) * scale;
      const opacity = Math.max(0.1, scale * 0.7 + waveInfluence * 0.4);

      if (size > 0.1) draw.push({ x: px, y: py, z, size, opacity });
    }

    draw.sort((a, b) => a.z - b.z);

    for (const p of draw) {
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
