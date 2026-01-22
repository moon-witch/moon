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
      const ringRotationSpeed = 0.2 + ringIndex * 0.03;

      for (let i = 0; i < ring.count; i++) {
        const baseAngle = (i / ring.count) * Math.PI * 2;
        const spiralArmOffset = (ring.radius / (15 * s)) * 0.4;
        const angle = baseAngle + t * ringRotationSpeed + spiralArmOffset;

        const pulseAmplitude = 3 * s;
        const pulseSpeed = 1.5;
        const pulsePhase = t * pulseSpeed - ring.radius / (20 * s) + (i / ring.count) * Math.PI;

        const radiusPulse = Math.sin(pulsePhase) * pulseAmplitude;
        const currentRadius = ring.radius + radiusPulse;

        const x = cx + Math.cos(angle) * currentRadius;
        const y = cy + Math.sin(angle) * currentRadius;

        const opacityWave = 0.3 + ((Math.sin(pulsePhase - Math.PI / 4) + 1) / 2) * 0.7;

        ctx.beginPath();
        ctx.arc(x, y, 2 * s, 0, Math.PI * 2);
        ctx.fillStyle = F(opacityWave);
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
