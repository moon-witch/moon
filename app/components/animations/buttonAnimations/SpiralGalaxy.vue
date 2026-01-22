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

// Particles are regenerated when the canvas size changes meaningfully.
// This avoids stretching artifacts and keeps density consistent.
let particles = [];
let lastSeedW = 0;
let lastSeedH = 0;

function seedParticles(W, H) {
  const maxRadius = Math.min(W, H) * 0.42;

  const particleCount = Math.max(120, Math.floor((W * H) / 200)); // scale with area
  const spiralArms = 3;

  const next = [];
  for (let i = 0; i < particleCount; i++) {
    const distanceFactor = Math.pow(Math.random(), 0.5);
    const distance = distanceFactor * maxRadius;

    const armIndex = Math.floor(Math.random() * spiralArms);
    const armOffset = (armIndex / spiralArms) * Math.PI * 2;

    const spiralTightness = 0.2;
    const safeDistance = Math.max(6, distance);
    const spiralAngle = Math.log(safeDistance / 5) / spiralTightness;

    next.push({
      distance,
      angle: spiralAngle + armOffset,
      armIndex,
      size: (Math.min(W, H) * 0.004) + Math.random() * (Math.min(W, H) * 0.006),
      opacity: 0.3 + Math.random() * 0.7,
      speedFactor: 0.8 + Math.random() * 0.4,
      color: {
        r: 220 + Math.floor(Math.random() * 35),
        g: 220 + Math.floor(Math.random() * 35),
        b: 255
      }
    });
  }

  particles = next;
  lastSeedW = W;
  lastSeedH = H;
}

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

    // Reseed if size changed a lot (keeps pattern consistent)
    const needsReseed =
        particles.length === 0 ||
        Math.abs(W - lastSeedW) > 4 ||
        Math.abs(H - lastSeedH) > 4;

    if (needsReseed) seedParticles(W, H);

    ctx.clearRect(0, 0, W, H);

    const centerX = W / 2;
    const centerY = H / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, Math.max(2, Math.min(W, H) * 0.015), 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();

    const spiralArms = 3;
    const rotationSpeed = 0.1;

    for (const p of particles) {
      const rotationFactor = 1 / Math.sqrt(Math.max(1, p.distance / 10));
      p.angle += rotationSpeed * rotationFactor * p.speedFactor * dt * 0.05 * props.speed;

      const x = centerX + Math.cos(p.angle) * p.distance;
      const y = centerY + Math.sin(p.angle) * p.distance;

      const armPhase = (time * 0.5 + p.armIndex / spiralArms) % 1;
      const pulseFactor = Math.sin(armPhase * Math.PI * 2) * 0.3 + 0.7;

      const radius = Math.max(0.6, p.size * pulseFactor);
      const finalOpacity = p.opacity * pulseFactor;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${finalOpacity})`;
      ctx.fill();

      if (radius > Math.min(W, H) * 0.01) {
        const trailLength = p.distance * 0.15;
        const trailAngle = p.angle - 0.1 * rotationFactor;

        const trailX =
            centerX + Math.cos(trailAngle) * (p.distance - trailLength);
        const trailY =
            centerY + Math.sin(trailAngle) * (p.distance - trailLength);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(trailX, trailY);
        ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${
            finalOpacity * 0.3
        })`;
        ctx.lineWidth = Math.max(0.5, radius * 0.6);
        ctx.stroke();
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
