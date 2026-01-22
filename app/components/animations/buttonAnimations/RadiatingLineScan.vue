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
    ctx.fillStyle = F(0.7);
    ctx.fill();

    const numLines = 16;
    const maxLen = (180 / 2) * 0.9 * s;
    const scanWidth = 25 * s;
    const scanSpeed = 35 * s;
    const rotSpeed = 0.05;
    const baseLW = Math.max(0.5 * s, 0.5);
    const scanLW = Math.max(1.5 * s, 1);

    const scanPos = ((t * scanSpeed) % (maxLen + scanWidth * 1.5)) - scanWidth * 0.75;

    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2 + t * rotSpeed;

      const endX = cx + Math.cos(angle) * maxLen;
      const endY = cy + Math.sin(angle) * maxLen;

      // base line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = F(0.1);
      ctx.lineWidth = baseLW;
      ctx.stroke();

      const scanStart = Math.max(0, scanPos - scanWidth / 2);
      const scanEnd = Math.min(maxLen, scanPos + scanWidth / 2);

      if (scanStart < scanEnd) {
        const sx = cx + Math.cos(angle) * scanStart;
        const sy = cy + Math.sin(angle) * scanStart;
        const ex = cx + Math.cos(angle) * scanEnd;
        const ey = cy + Math.sin(angle) * scanEnd;

        const grad = ctx.createLinearGradient(sx, sy, ex, ey);
        const pulse = 0.6 + ((Math.sin(t * 1.5 + i * 0.4) + 1) / 2) * 0.4;

        grad.addColorStop(0, F(0));
        grad.addColorStop(0.5, F(0.85 * pulse));
        grad.addColorStop(1, F(0));

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = grad;
        ctx.lineWidth = scanLW;
        ctx.stroke();
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
