<template>
  <div ref="containerRef" class="stage">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "~/composables/useHiDPICanvas";

const props = defineProps({
  speed: { type: Number, default: 1 }
});

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

type Dot3 = { x: number; y: number; z: number };

let dots: Dot3[] = [];
let lastSeedW = 0;
let lastSeedH = 0;

function seedDots(W: number, H: number) {
  const m = Math.min(W, H);
  const radius = m * 0.4;
  const numDots = Math.max(200, Math.floor((W * H) / 140)); // scale with area

  const next: Dot3[] = [];
  for (let i = 0; i < numDots; i++) {
    const theta = Math.acos(1 - 2 * (i / numDots));
    const phi = Math.sqrt(numDots * Math.PI) * theta;
    next.push({
      x: radius * Math.sin(theta) * Math.cos(phi),
      remind: 0
    } as any);
  }

  // Fix: compute y,z too (avoid extra loops)
  for (let i = 0; i < numDots; i++) {
    const theta = Math.acos(1 - 2 * (i / numDots));
    const phi = Math.sqrt(numDots * Math.PI) * theta;
    next[i] = {
      x: radius * Math.sin(theta) * Math.cos(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(theta)
    };
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

    // reseed on resize
    if (dots.length === 0 || Math.abs(W - lastSeedW) > 4 || Math.abs(H - lastSeedH) > 4) {
      seedDots(W, H);
    }

    // original GLOBAL_SPEED = 0.5
    t += dt * props.speed * 0.5;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.4;

    const rotX = Math.sin(t * 0.3) * 0.5;
    const rotY = t * 0.5;

    const eased = easeInOutCubic((Math.sin(t * 2.5) + 1) / 2);
    const scanLine = (eased * 2 - 1) * radius;
    const scanWidth = Math.min(25, Math.min(W, H) * 0.14);

    const cY = Math.cos(rotY), sY = Math.sin(rotY);
    const cX = Math.cos(rotX), sX = Math.sin(rotX);

    for (const d of dots) {
      let x = d.x, y = d.y, z = d.z;

      // rotate around Y
      let nx = x * cY - z * sY;
      let nz = x * sY + z * cY;
      x = nx; z = nz;

      // rotate around X
      let ny = y * cX - z * sX;
      nz = y * sX + z * cX;
      y = ny; z = nz;

      const scale = (z + radius * 1.5) / (radius * 2.5);
      const px = cx + x;
      const py = cy + y;

      const distToScan = Math.abs(y - scanLine);
      const scanInfluence =
          distToScan < scanWidth
              ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
              : 0;

      const size = Math.max(0, scale * (Math.min(W, H) * 0.01) + scanInfluence * (Math.min(W, H) * 0.014));
      const opacity = Math.max(0, scale * 0.6 + scanInfluence * 0.4);

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = fill(opacity);
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
.stage { width: 100%; height: 100%; }
</style>
