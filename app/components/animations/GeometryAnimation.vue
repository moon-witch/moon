<template>
  <div ref="containerEl" class="shader-container">
    <canvas ref="canvasEl" class="shader-canvas" />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * Props
 * speed: multiplier applied to shader time (1.0 = original speed)
 */
const props = defineProps({
  speed: {
    type: Number,
    default: 1.0
  }
});

const containerEl = ref(null);
const canvasEl = ref(null);

let gl = null;
let program = null;
let buffer = null;
let uTime = null;
let uResolution = null;
let rafId = null;
let ro = null;

const vertexSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

in vec2 position;

void main(void) {
  gl_Position = vec4(position, 0., 1.);
}
`;

const fragmentSource = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

out vec4 fragColor;

uniform vec2 resolution;
uniform float time;

#define S smoothstep
#define T .112358+time
#define TAU 6.2831853

vec3 palette(float k) {
  vec3
  a = vec3(.5),
  b = a,
  c = a+a,
  d = vec3(.3,.2,.2);

  return a+b*cos(TAU*(c*k+d));
}

void main(void) {
  float
  mx = max(resolution.x, resolution.y),
  mn = min(resolution.x, resolution.y),
  pr = mx/mn;

  vec2 uv = (gl_FragCoord.xy - .5 * resolution) / mn;
  vec2 p = uv * 4.5 / pr;

  vec3 col = vec3(0);
  const float n = 3.5;

  for (float i = 0.; i < 6.; i++) {
    p *= 2.;
    p = p - n * clamp(round(p / n), -1., 1.);
    float d = exp(-length(p * .2));

    d = log(1e-5 * d);
    d = pow(sin(d * 20. + T * 1.4), 2.) * .125;
    d = abs(d);
    d = pow(5e-3 / d, .25);

    col += d * palette(-length(uv) + i * .1 - T * .7);
    col = pow(col, vec3(1.28));
  }

  col *= exp(-125e-5 * length(uv));
  col = pow(S(0., 20., col), vec3(.4545));

  fragColor = vec4(col, 1.);
}
`;

function compileShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const err = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(err || "Shader compile failed");
  }
  return shader;
}

function createProgram(vsSource, fsSource) {
  const vs = compileShader(gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);

  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);

  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const err = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(err || "Program link failed");
  }
  return p;
}

function resizeToContainer() {
  if (!gl || !canvasEl.value || !containerEl.value) return;

  const rect = containerEl.value.getBoundingClientRect();
  const cssW = Math.max(1, Math.floor(rect.width));
  const cssH = Math.max(1, Math.floor(rect.height));

  const dpr = window.devicePixelRatio || 1;
  const pxW = Math.max(1, Math.floor(cssW * dpr));
  const pxH = Math.max(1, Math.floor(cssH * dpr));

  const canvas = canvasEl.value;
  if (canvas.width !== pxW || canvas.height !== pxH) {
    canvas.width = pxW;
    canvas.height = pxH;
    gl.viewport(0, 0, pxW, pxH);
  }
}

function draw(nowMs) {
  if (!gl) return;

  resizeToContainer();

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // Apply speed multiplier here
  gl.uniform1f(uTime, nowMs * 0.001 * props.speed);
  gl.uniform2f(uResolution, canvasEl.value.width, canvasEl.value.height);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  rafId = requestAnimationFrame(draw);
}

function cleanup() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  if (ro) ro.disconnect();
  ro = null;

  if (gl) {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  }

  buffer = null;
  program = null;
  gl = null;
}

onMounted(() => {
  const canvas = canvasEl.value;
  gl = canvas.getContext("webgl2", { antialias: false, alpha: true });

  if (!gl) {
    console.error("WebGL2 not supported.");
    return;
  }

  program = createProgram(vertexSource, fragmentSource);

  const vertices = new Float32Array([
    -1, -1,
    1, -1,
    -1,  1,
    -1,  1,
    1, -1,
    1,  1
  ]);

  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const positionLoc = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

  uTime = gl.getUniformLocation(program, "time");
  uResolution = gl.getUniformLocation(program, "resolution");

  ro = new ResizeObserver(resizeToContainer);
  ro.observe(containerEl.value);

  resizeToContainer();
  rafId = requestAnimationFrame(draw);
});

onBeforeUnmount(cleanup);
</script>

<style scoped>
.shader-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  background: repeating-radial-gradient(
      circle at center,
      #444 0%,
      #444 10%,
      #111 10%,
      #111 20%
  );

  touch-action: none;
}

.shader-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
