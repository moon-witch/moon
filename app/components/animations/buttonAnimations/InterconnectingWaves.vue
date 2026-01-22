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

function fill(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
}
function stroke(opacity: number) {
  const o = Math.max(0, Math.min(1, opacity));
  return `rgba(255,255,255,${o})`;
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

    t += dt * props.speed * 0.5;

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const m = Math.min(W, H);

    const dotRings = [
      { radius: m * 0.11, count: 12 },
      { radius: m * 0.25, count: 24 },
      { radius: m * 0.39, count: 36 }
    ];

    // lines between rings
    for (let ringIndex = 0; ringIndex < dotRings.length - 1; ringIndex++) {
      const ring = dotRings[ringIndex];
      const nextRing = dotRings[ringIndex + 1];

      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2;
        const radiusPulse1 = Math.sin(t * 2 - ringIndex * 0.4) * (m * 0.017);

        const x1 = cx + Math.cos(angle) * (ring.radius + radiusPulse1);
        const y1 = cy + Math.sin(angle) * (ring.radius + radiusPulse1);

        const nextRingRatio = nextRing.count / ring.count;

        for (let j = 0; j < nextRingRatio; j++) {
          const nextAngle = ((i * nextRingRatio + j) / nextRing.count) * Math.PI * 2;
          const radiusPulse2 = Math.sin(t * 2 - (ringIndex + 1) * 0.4) * (m * 0.017);

          const x2 = cx + Math.cos(nextAngle) * (nextRing.radius + radiusPulse2);
          const y2 = cy + Math.sin(nextAngle) * (nextRing.radius + radiusPulse2);

          const lineOpacity = 0.1 + ((Math.sin(t * 3 - ringIndex * 0.5 + i * 0.3) + 1) / 2) * 0.4;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineWidth = Math.max(0.6, m * 0.004);
          ctx.strokeStyle = stroke(lineOpacity);
          ctx.stroke();
        }
      }
    }

    // dots
    dotRings.forEach((ring, ringIndex) => {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2;
        const radiusPulse = Math.sin(t * 2 - ringIndex * 0.4) * (m * 0.017);

        const x = cx + Math.cos(angle) * (ring.radius + radiusPulse);
        const y = cy + Math.sin(angle) * (ring.radius + radiusPulse);

        const dotOpacity = 0.4 + Math.sin(t * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, m * 0.008), 0, Math.PI * 2);
        ctx.fillStyle = fill(dotOpacity);
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
