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

    ctx.clearRect(0, 0, W, H);

    const m = Math.min(W, H);
    const s = m / 180;
    const cx = W / 2;
    const cy = H / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, 2 * s, 0, Math.PI * 2);
    ctx.fillStyle = F(0.9);
    ctx.fill();

    const dotRings = [
      { radius: 15 * s, count: 6 },
      { radius: 30 * s, count: 12 },
      { radius: 45 * s, count: 18 },
      { radius: 60 * s, count: 24 },
      { radius: 75 * s, count: 30 }
    ];

    dotRings.forEach((ring, ringIndex) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2;
        const waveProgress = t * 1.5 - ringIndex * 0.5;

        const pulseFactor = Math.sin(waveProgress);
        const positivePulse = (pulseFactor + 1) / 2;

        const baseDotRadius = 2 * s;
        const stretchAmount = pulseFactor * (2 * s);

        const radiusX = baseDotRadius + Math.abs(stretchAmount);
        const radiusY = baseDotRadius;

        const x = cx + Math.cos(angle) * ring.radius;
        const y = cy + Math.sin(angle) * ring.radius;
        const opacity = 0.3 + positivePulse * 0.7;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = F(opacity);
        ctx.fill();
        ctx.restore();
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
