<template>
  <div ref="containerRef" class="stage">
    <canvas ref="canvasRef" />
    <div class="ref-line" :style="refLineStyle" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "@/composables/useHiDPICanvas";

const props = defineProps({
  speed: { type: Number, default: 1 }
});

const { containerRef, canvasRef, ctxRef, sizeRef } = useHiDPICanvas();

let rafId = null;
let time = 0;
let last = 0;

const pendulumCount = 15;

const refLineStyle = computed(() => {
  const { width: W, height: H } = sizeRef.value;
  const centerX = W / 2;
  const centerY = H / 2;
  const pendulumLength = Math.min(W, H) * 0.5;

  return {
    width: `${pendulumCount * (Math.min(W, H) * 0.045)}px`,
    left: `${centerX - (pendulumCount * (Math.min(W, H) * 0.045)) / 2}px`,
    top: `${centerY - pendulumLength}px`
  };
});

onMounted(() => {
  const animate = (ts) => {
    if (!last) last = ts;
    const dt = ts - last;
    last = ts;

    time += dt * 0.001 * props.speed;

    const ctx = ctxRef.value;
    const { width: W, height: H } = sizeRef.value;

    if (!ctx || W <= 0 || H <= 0) {
      rafId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;

    const baseFrequency = 0.5;
    const pendulumLength = Math.min(W, H) * 0.5;
    const maxAngle = Math.PI / 12;

    const spacing = Math.min(W, H) * 0.045; // scales like original ~8px at 180
    const anchorY = centerY - pendulumLength;

    const angle = Math.sin(time * baseFrequency * Math.PI) * maxAngle;

    for (let i = 0; i < pendulumCount; i++) {
      const pendulumX = centerX - (pendulumCount - 1) * (spacing / 2) + i * spacing;
      const pendulumY = anchorY;

      const bobX = pendulumX + Math.sin(angle) * pendulumLength;
      const bobY = pendulumY + Math.cos(angle) * pendulumLength;

      ctx.beginPath();
      ctx.moveTo(pendulumX, pendulumY);
      ctx.lineTo(bobX, bobY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = Math.max(1, Math.min(W, H) * 0.005);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(bobX, bobY, Math.max(2, Math.min(W, H) * 0.016), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pendulumX, pendulumY, Math.max(1, Math.min(W, H) * 0.006), 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
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
.stage {
  position: relative;
  width: 100%;
  height: 100%;
}
.ref-line {
  position: absolute;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.15);
  pointer-events: none;
}
</style>
