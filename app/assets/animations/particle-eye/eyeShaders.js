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

void main() {
  // Circular particle shape
  float r = length(gl_PointCoord - 0.5);
  if (r > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, r);

  // Radial blend core → edge
  float d = length(vPos);
  float t = smoothstep(0.0, 1.5, d);
  vec3 color = mix(uCoreColor, uEdgeColor, t);

  // ----- Pupil definition -----
  // Compute radial distance on XY plane normalized to eyeball radius (~1)
  float radial = length(vPos.xy);

  // Limit darkening to front-facing particles only
  float front = smoothstep(0.6, 0.0, abs(vPos.z));

  // Stronger pupil core (high contrast center)
  float pupilMask = smoothstep(0.25, 0.08, radial);
  vec3 pupilColor = mix(color, vec3(0.0), pupilMask * front * 2.0);

  color = pupilColor;

  gl_FragColor = vec4(color * uIntensity, alpha);
}
`;
