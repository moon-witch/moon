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

    // center
    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = F(0.8);
    ctx.fill();

    const dotRings = [
      { radius: 15 * s, count: 6 },
      { radius: 30 * s, count: 12 },
      { radius: 45 * s, count: 18 },
      { radius: 60 * s, count: 24 },
      { radius: 75 * s, count: 30 }
    ];

    const waveSpeed = 30 * s;
    const waveThickness = 40 * s;
    const maxDotRadius = dotRings[dotRings.length - 1].radius;
    const maxAnimatedRadius = maxDotRadius + waveThickness;

    const rotationMagnitude = 0.15;
    const rotationSpeedFactor = 3;

    const waveFront = (t * waveSpeed) % maxAnimatedRadius;

    dotRings.forEach((ring) => {
      for (let i = 0; i < ring.count; i++) {
        const baseAngle = (i / ring.count) * Math.PI * 2;
        const baseRadius = ring.radius;

        const distToWaveFront = baseRadius - waveFront;
        let pulseFactor = 0;

        if (Math.abs(distToWaveFront) < waveThickness / 2) {
          pulseFactor = Math.cos((distToWaveFront / (waveThickness / 2)) * (Math.PI / 2));
          pulseFactor = Math.max(0, pulseFactor);
        }

        let angle = baseAngle;
        if (pulseFactor > 0.01) {
          angle += pulseFactor * Math.sin(t * rotationSpeedFactor + i * 0.5) * rotationMagnitude;
        }

        const dotSize = (1.5 + pulseFactor * 1.8) * s;
        const x = cx + Math.cos(angle) * baseRadius;
        const y = cy + Math.sin(angle) * baseRadius;
        const opacity = 0.2 + pulseFactor * 0.7;

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
