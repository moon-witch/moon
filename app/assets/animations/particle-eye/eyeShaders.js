// assets/animations/particle-heart/heartShaders.js
// Enhanced version with a clearly visible pupil and speed scaling support.

export const vertexShader = /* glsl */`
attribute vec3 aJitter;
attribute float aSizeVar;

uniform float uTime;
uniform float uDuration;
uniform float uAmplitude;
uniform float uHover;
uniform float uClickPulse;
uniform float uJitterAmp;
uniform float uBaseSize;
uniform float uSpeed;  // <-- new uniform for animation speed scaling

varying vec3 vPos;

void main() {
  // Scaled time for global animation speed
  float time = uTime * uSpeed;

  // Pulse oscillation
  float phase = mod(time, uDuration) / uDuration;
  float amp = sin(phase * 6.2831) * 0.5 + 0.5;
  amp *= uAmplitude;

  // Organic jitter
  vec3 displaced = position + aJitter * uJitterAmp * 0.4;

  // Apply pulsation scaling and click impulse
  displaced *= (1.0 + amp + uClickPulse * 0.1);

  vPos = displaced;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_PointSize = uBaseSize * aSizeVar * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = /* glsl */`
precision highp float;

uniform vec3 uCoreColor;
uniform vec3 uEdgeColor;
uniform float uIntensity;

varying vec3 vPos;

float rand(vec2 co){
  // cheap hash noise for particle sparkle variation
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  // keep circular particle mask
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  // sharper edge falloff for distinct dots
  float alpha = smoothstep(0.5, 0.35, 0.5 - r);
  alpha *= 1.5; // stronger brightness core

  // base radial gradient for body color
  float d = length(vPos);
  float t = smoothstep(0.0, 1.5, d);
  vec3 color = mix(uCoreColor, uEdgeColor, t);

  // pupil mask – dark center region
  float radial = length(vPos.xy);
  float front = smoothstep(0.6, 0.0, abs(vPos.z));
  float pupilMask = smoothstep(0.25, 0.08, radial);
  color = mix(color, vec3(0.0), pupilMask * front * 2.0);

  // introduce micro sparkle per particle (pseudo-random intensity)
  float grain = rand(vPos.xy * 100.0) * 0.6 + 0.7;
  color *= grain;

  // slightly emphasize edges of points
  color *= smoothstep(0.5, 0.2, r);

  gl_FragColor = vec4(color * uIntensity, alpha);
}
`;
