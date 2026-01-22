<template>
  <div ref="containerRef" class="stage">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from "vue";
import { useHiDPICanvas } from "@/composables/useHiDPICanvas";

const props = defineProps({
  speed: { type: Number, default: 1 }
});

const { containerRef, canvasRef, ctxRef, sizeRef } = useHiDPICanvas();

let rafId = null;
let time = 0;
let last = 0;

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

    const gridSize = 5;
    const spacing = Math.min(W, H) * 0.083; // ~15 at 180

    const breathingSpeed = 0.5;
    const colorPulseSpeed = 1.0;

    const breathingFactor = Math.sin(time * breathingSpeed) * 0.2 + 1.0;

    // center
    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.015), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    const mid = Math.floor(gridSize / 2);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (row === mid && col === mid) continue;

        const baseX = (col - (gridSize - 1) / 2) * spacing;
        const baseY = (row - (gridSize - 1) / 2) * spacing;

        const distance = Math.sqrt(baseX * baseX + baseY * baseY);
        const maxDistance = (spacing * Math.sqrt(2) * (gridSize - 1)) / 2;
        const normalizedDistance = distance / maxDistance;
        const angle = Math.atan2(baseY, baseX);

        const radialPhase = (time - normalizedDistance) % 1;
        const radialWave = Math.sin(radialPhase * Math.PI * 2) * (Math.min(W, H) * 0.022);

        const breathingX = baseX * breathingFactor;
        const breathingY = baseY * breathingFactor;

        const waveX = centerX + breathingX + Math.cos(angle) * radialWave;
        const waveY = centerY + breathingY + Math.sin(angle) * radialWave;

        const baseSize = (Math.min(W, H) * 0.008) + (1 - normalizedDistance) * (Math.min(W, H) * 0.008);
        const pulseFactor = Math.sin(time * 2 + normalizedDistance * 5) * 0.6 + 1;
        const size = Math.max(0.8, baseSize * pulseFactor);

        const blueAmount =
            Math.sin(time * colorPulseSpeed + normalizedDistance * 3) * 0.3 + 0.3;
        const whiteness = 1 - blueAmount;

        const r = Math.floor(255 * whiteness + 200 * blueAmount);
        const g = Math.floor(255 * whiteness + 220 * blueAmount);
        const b = 255;

        const opacity =
            0.5 + Math.sin(time * 1.5 + angle * 3) * 0.2 + normalizedDistance * 0.3;

        // adjacency lines
        if (row > 0 && col > 0 && row < gridSize - 1 && col < gridSize - 1) {
          const neighbors = [
            { r: row - 1, c: col },
            { r: row, c: col + 1 },
            { r: row + 1, c: col },
            { r: row, c: col - 1 }
          ];

          for (const nb of neighbors) {
            if (nb.r === mid && nb.c === mid) continue;

            const nBaseX = (nb.c - (gridSize - 1) / 2) * spacing;
            const nBaseY = (nb.r - (gridSize - 1) / 2) * spacing;
            const nBreathingX = nBaseX * breathingFactor;
            const nBreathingY = nBaseY * breathingFactor;

            const lineDistance = Math.sqrt(
                Math.pow(col - nb.c, 2) + Math.pow(row - nb.r, 2)
            );

            const lineOpacity = 0.1 + Math.sin(time * 1.5 + lineDistance * 2) * 0.05;

            ctx.beginPath();
            ctx.moveTo(waveX, waveY);
            ctx.lineTo(centerX + nBreathingX, centerY + nBreathingY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
            ctx.lineWidth = Math.max(0.4, Math.min(W, H) * 0.0025);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(waveX, waveY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      }
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
  width: 100%;
  height: 100%;
}
</style>
