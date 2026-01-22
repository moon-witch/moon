<template>
  <div ref="containerRef" class="stage"><canvas ref="canvasRef" /></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "~/composables/useHiDPICanvas";

const props = defineProps({ speed: { type: Number, default: 1 } });
const { containerRef, canvasRef, ctxRef, sizeRef } = useHiDPICanvas();

let rafId: number | null = null;
let last = 0;
let timeMs = 0;

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function fill(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
}
function stroke(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
}

type Dot = { r: number; angle: number; lastSeen: number };

let rings: Dot[] = [];
let lastSeedW = 0;
let lastSeedH = 0;

function seed(W: number, H: number) {
  const m = Math.min(W, H);
  const maxR = m * 0.47;

  const rs = [0.11, 0.2, 0.29, 0.38, 0.47].map(f => f * m); // similar to 20..80 at 180
  const fadeTime = 2500;

  const next: Dot[] = [];
  for (const r of rs) {
    const count = Math.max(6, Math.floor(r / (m * 0.022))); // roughly r/2 at 180
    for (let i = 0; i < count; i++) {
      next.push({ r, angle: (i / count) * Math.PI * 2, lastSeen: -fadeTime });
    }
  }

  rings = next;
  lastSeedW = W;
  lastSeedH = H;
}

onMounted(() => {
  const animate = (ts: number) => {
    if (!last) last = ts;
    const dtMs = ts - last;
    last = ts;

    const ctx = ctxRef.value;
    const { width: W, height: H } = sizeRef.value;

    if (!ctx || W <= 0 || H <= 0) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    if (rings.length === 0 || Math.abs(W - lastSeedW) > 4 || Math.abs(H - lastSeedH) > 4) {
      seed(W, H);
    }

    timeMs += dtMs * props.speed;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);
    const fadeTime = 2500;

    const scanAngle = ((timeMs * 0.001 * (Math.PI / 2) * 0.5) % (Math.PI * 2)); // GLOBAL_SPEED=0.5

    // scan line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + (m * 0.47) * Math.cos(scanAngle), cy + (m * 0.47) * Math.sin(scanAngle));
    ctx.strokeStyle = stroke(0.5);
    ctx.lineWidth = Math.max(1, m * 0.006);
    ctx.stroke();

    for (const d of rings) {
      let angleDiff = Math.abs(d.angle - scanAngle);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;

      if (angleDiff < 0.05) d.lastSeen = timeMs;

      const since = timeMs - d.lastSeen;
      if (since < fadeTime) {
        const tt = since / fadeTime;
        const opacity = 1 - easeInOutCubic(tt);
        const size = (m * 0.006) + opacity * (m * 0.01);

        const x = cx + d.r * Math.cos(d.angle);
        const y = cy + d.r * Math.sin(d.angle);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
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
