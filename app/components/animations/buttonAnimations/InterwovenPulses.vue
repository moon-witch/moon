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

type Ring = {
  radius: number;
  count: number;
  pulseSpeed: number;
  phaseOffset: number;
  maxAmplitude: number;
  rotationSpeed: number;
};

let rings: Ring[] = [];
let seededM = 0;

function seed(m: number) {
  const s = m / 180;
  const numRings = 5;
  const baseRadiusStep = 15 * s;
  const baseDotCount = 8;

  const next: Ring[] = [];
  for (let i = 0; i < numRings; i++) {
    next.push({
      radius: (i + 1) * baseRadiusStep,
      count: baseDotCount + i * 4,
      pulseSpeed: 0.8 + i * 0.1,
      phaseOffset: (i * Math.PI) / 3,
      maxAmplitude: (2 + i * 0.5) * s,
      rotationSpeed: (i % 2 === 0 ? 0.02 : -0.02) * (1 + i * 0.1)
    });
  }

  rings = next;
  seededM = m;
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

    const m = Math.min(W, H);
    if (rings.length === 0 || Math.abs(m - seededM) > 2) seed(m);

    ctx.clearRect(0, 0, W, H);

    const s = m / 180;
    const cx = W / 2;
    const cy = H / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = F(0.8);
    ctx.fill();

    rings.forEach((ring) => {
      const pulseSignal = Math.sin(t * ring.pulseSpeed + ring.phaseOffset);
      const normalized = (pulseSignal + 1) / 2;

      const dotSize = (1.5 * s) + normalized * ring.maxAmplitude * 0.5;
      const opacity = 0.2 + normalized * 0.6;

      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2 + t * ring.rotationSpeed;
        const x = cx + Math.cos(angle) * ring.radius;
        const y = cy + Math.sin(angle) * ring.radius;

        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fillStyle = F(opacity);
        ctx.fill();
      }
    });

    rafId = requestAnimationFrame(animate);
  };

  rafId = requestAnimationFrame(animate);
});

onBeforeUnmount(() => { if (rafId) cancelAnimationFrame(rafId); });
</script>

<style scoped>
.stage { width: 100%; height: 100%; }
</style>
