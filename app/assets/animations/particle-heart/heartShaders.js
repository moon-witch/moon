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
uniform float uIntensity;

varying float vRadial;
varying float vIntensity;

void main() {
  float t = mod(uTime, uDuration) / uDuration;
  float phase = 1.0 - abs(2.0 * t - 1.0);
  float localSine = sin(uTime * (1.2 + aJitter.x * 0.35) + aJitter.y * 1.7) * 0.5 + 0.5;
  float scale = 1.0 + (uAmplitude + uClickPulse * 0.08) * phase;
  vec3 localOffset = uJitterAmp * (aJitter * (localSine - 0.5));
  vec3 pos = (position + localOffset) * scale;

  vRadial = clamp(length(pos.xy) / 1.6, 0.0, 1.0);
  vIntensity = uIntensity * (0.85 + localSine * 0.3);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float dist = -mvPosition.z;
  float size = uBaseSize * aSizeVar * (1.0 + 0.3 * phase);
  gl_PointSize = size * (300.0 / max(120.0, dist * 100.0));
}
`;

export const fragmentShader = /* glsl */`
precision mediump float;
varying float vRadial;
varying float vIntensity;
uniform vec3 uCoreColor;
uniform vec3 uEdgeColor;

void main() {
  vec2 uv = gl_PointCoord.xy - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uCoreColor, uEdgeColor, smoothstep(0.0, 1.0, vRadial));
  gl_FragColor = vec4(col * vIntensity, alpha);
  if (alpha <= 0.001) discard;
}
`;
