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
    ctx.arc(cx, cy, 1.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = F(0.7);
    ctx.fill();

    const dotRings = [
      { radius: 15 * s, count: 8 },
      { radius: 30 * s, count: 12 },
      { radius: 45 * s, count: 16 },
      { radius: 60 * s, count: 20 },
      { radius: 75 * s, count: 24 }
    ];

    const numBands = 3;
    const bandWidth = (180 / 2.5) * s; // original CANVAS_WIDTH/2.5
    const bandSpeed = 25 * s;
    const totalPath = (180 * s) + bandWidth;

    dotRings.forEach((ring, ringIndex) => {
      for (let i = 0; i < ring.count; i++) {
        const angle =
            (i / ring.count) * Math.PI * 2 +
            t * 0.03 * (ringIndex % 2 === 0 ? 1 : -1);

        const x = cx + Math.cos(angle) * ring.radius;
        const y = cy + Math.sin(angle) * ring.radius;

        let maxInfluence = 0;
        for (let b = 0; b < numBands; b++) {
          const bandCenterY =
              ((t * bandSpeed + b * (totalPath / numBands)) % totalPath) - bandWidth / 2;

          const dist = Math.abs(y - bandCenterY);
          let influence = 0;

          if (dist < bandWidth / 2) {
            influence = Math.cos((dist / (bandWidth / 2)) * (Math.PI / 2));
            influence = Math.max(0, influence);
          }

          maxInfluence = Math.max(maxInfluence, influence);
        }

        const dotSize = (1.5 + maxInfluence * 2.0) * s;
        const opacity = 0.2 + maxInfluence * 0.7;

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
