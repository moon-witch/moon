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

type ArmDot = { baseRadius: number; size: number };
type Arm = { baseAngle: number; dots: ArmDot[] };

let arms: Arm[] = [];
let seededM = 0;

function seed(m: number) {
  const s = m / 180;

  const numArms = 8;
  const dotsPerArm = 15;
  const minRadius = 10 * s;
  const maxRadius = (180 / 2) * 0.85 * s; // original
  const radiusStep = (maxRadius - minRadius) / (dotsPerArm - 1);

  const next: Arm[] = [];
  for (let i = 0; i < numArms; i++) {
    const arm: Arm = { baseAngle: (i / numArms) * Math.PI * 2, dots: [] };
    for (let j = 0; j < dotsPerArm; j++) {
      arm.dots.push({ baseRadius: minRadius + j * radiusStep, size: 1.0 * s });
    }
    next.push(arm);
  }

  arms = next;
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
    if (arms.length === 0 || Math.abs(m - seededM) > 2) seed(m);

    ctx.clearRect(0, 0, W, H);

    const s = m / 180;
    const cx = W / 2;
    const cy = H / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, 1.5 * s, 0, Math.PI * 2);
    ctx.fillStyle = F(0.7);
    ctx.fill();

    const maxRadius = (180 / 2) * 0.85 * s;
    const twistFactor = 0.025;          // angle offset per radius unit
    const armRotationSpeed = 0.03;
    const pulseWaveSpeed = 25 * s;      // radius units per second
    const pulseWaveLength = (maxRadius / 2);

    const globalRot = t * armRotationSpeed;
    const pulsePeak =
        ((t * pulseWaveSpeed) % (maxRadius + pulseWaveLength)) - pulseWaveLength / 2;

    for (const arm of arms) {
      for (const dot of arm.dots) {
        const baseAngle = arm.baseAngle + globalRot;
        const spiralOffset = dot.baseRadius * twistFactor;
        const angle = baseAngle + spiralOffset;

        const x = cx + Math.cos(angle) * dot.baseRadius;
        const y = cy + Math.sin(angle) * dot.baseRadius;

        let infl = 0;
        const dist = Math.abs(dot.baseRadius - pulsePeak);
        if (dist < pulseWaveLength / 2) {
          infl = Math.cos((dist / (pulseWaveLength / 2)) * (Math.PI / 2));
          infl = Math.max(0, infl);
        }

        const size = dot.size + infl * (1.2 * s);
        const opacity = 0.15 + infl * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = F(opacity);
        ctx.fill();
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
