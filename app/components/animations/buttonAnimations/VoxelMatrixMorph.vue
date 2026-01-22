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

let points: P3[] = [];
let lastSeedW = 0;
let lastSeedH = 0;
let totalSize = 0;

function seed(W: number, H: number) {
  const m = Math.min(W, H);
  const gridSize = 5;
  const spacing = m * 0.11; // ~20 at 180
  totalSize = (gridSize - 1) * spacing;

  const next: P3[] = [];
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      for (let z = 0; z < gridSize; z++) {
        next.push({
          x: (x - (gridSize - 1) / 2) * spacing,
          y: (y - (gridSize - 1) / 2) * spacing,
          z: (z - (gridSize - 1) / 2) * spacing
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

    // original: time += deltaTime*0.0005*GLOBAL_SPEED (deltaTime ms)
    // dt seconds -> dt*1000*0.0005*0.5 = dt*0.25
    t += dt * props.speed * 0.25;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);

    const rotX = t * 0.4;
    const rotY = t * 0.6;

    const eased = easeInOutCubic((Math.sin(t * 2) + 1) / 2);
    const scanLine = (eased * 2 - 1) * (totalSize / 2 + m * 0.055);
    const scanWidth = Math.min(30, m * 0.17);

    const cY = Math.cos(rotY), sY = Math.sin(rotY);
    const cX = Math.cos(rotX), sX = Math.sin(rotX);

    for (const p0 of points) {
      let x = p0.x, y = p0.y, z = p0.z;

      // rotate Y
      let nx = x * cY - z * sY;
      let nz = x * sY + z * cY;
      x = nx; z = nz;

      // rotate X
      let ny = y * cX - z * sX;
      nz = y * sX + z * cX;
      y = ny; z = nz;

      const distToScan = Math.abs(y - scanLine);
      let scanInfluence = 0;
      let displacement = 1;

      if (distToScan < scanWidth) {
        scanInfluence = Math.cos((distToScan / scanWidth) * (Math.PI / 2));
        displacement = 1 + scanInfluence * 0.4;
      }

      const scale = (z + m * 0.44) / (m * 0.88);
      const px = cx + x * displacement;
      const py = cy + y * displacement;

      const size = Math.max(0, scale * (m * 0.011) + scanInfluence * (m * 0.011));
      const opacity = Math.max(0.1, scale * 0.7 + scanInfluence * 0.3);

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
