// assets/animations/particle-cell/cellShaders.js
// Particle-based neuron/cell shader with organic noise displacement
// and granular 'sparkle' to preserve the particulate look.

export const vertexShader = /* glsl */`
attribute vec3 aJitter;
attribute float aSizeVar;

uniform float uTime;          // seconds
uniform float uMotionSpeed;   // global tempo multiplier
uniform float uMotionScale;   // noise displacement amplitude
uniform float uJitterAmp;     // micro jitter amount
uniform float uBaseSize;      // base gl_PointSize
uniform float uTwinkle;       // point-size flicker strength (0..1)

varying vec3 vPos;            // displaced local position (for coloring)
varying float vGrainSeed;     // per-particle seed for sparkle

// --- Simplex Noise 3D (compact) ---
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec3 v){
  const vec2  C = vec2(1.0/6.0, 1.0/3.0);
  const vec4  D = vec4(0.0,0.5,1.0,2.0);
  // First corner
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  // Other corners
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  //  x0 = x0 - 0. + 0.0 * C
  vec3 x1 = x0 - i1 + 1.0*C.xxx;
  vec3 x2 = x0 - i2 + 2.0*C.xxx;
  vec3 x3 = x0 - 1. + 3.0*C.xxx;
  // Permutations
  i = mod(i, 289.0);
  vec4 p = permute( permute( permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  float n_ = 1.0/7.0; //  N=7
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4  j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)
  vec4  x_ = floor(j * ns.z);
  vec4  y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  vec4  x = x_ *ns.x + ns.y;
  vec4  y = y_ *ns.x + ns.y;
  vec4  h = 1.0 - abs(x) - abs(y);
  vec4  b0 = vec4( x.xy, y.xy );
  vec4  b1 = vec4( x.zw, y.zw );
  vec4  s0 = floor(b0)*2.0 + 1.0;
  vec4  s1 = floor(b1)*2.0 + 1.0;
  vec4  sh = -step(h, vec4(0.0));
  vec4  a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4  a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3  g0 = vec3(a0.xy,h.x);
  vec3  g1 = vec3(a0.zw,h.y);
  vec3  g2 = vec3(a1.xy,h.z);
  vec3  g3 = vec3(a1.zw,h.w);
  // Normalise gradients
  vec4 norm = inversesqrt(vec4(dot(g0,g0), dot(g1,g1), dot(g2,g2), dot(g3,g3)));
  g0 *= norm.x; g1 *= norm.y; g2 *= norm.z; g3 *= norm.w;
  // Mix contributions from the four corners
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot( m*m, vec4( dot(g0,x0), dot(g1,x1),
                                dot(g2,x2), dot(g3,x3) ) );
}

void main() {
  float t = uTime * uMotionSpeed;

  // Base organic displacement driven by low-frequency noise
  // Use normalized position as an approximate normal direction.
  vec3 dir = normalize(position + 1e-5);
  float n1 = snoise(position * 0.6 + vec3(t*0.15, t*0.12, t*0.1));
  float n2 = snoise(position * 1.2 + vec3(-t*0.07, t*0.09, -t*0.05));
  float organic = (n1*0.65 + n2*0.35);   // mixed bands for irregular motion

  vec3 displaced = position
                 + dir * (organic * uMotionScale)     // outward/inward breathing
                 + aJitter * uJitterAmp * 0.35;       // micro jitter

  // Twinkle: tiny per-particle size oscillation from noise
  float tw = snoise(position * 2.5 + vec3(t*0.9, -t*0.8, t*0.6));
  float twinkleScale = 1.0 + uTwinkle * tw * 0.25;

  vPos = displaced;
  vGrainSeed = fract((position.x + position.y*3.17 + position.z*5.13) * 173.0);

  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  gl_PointSize = uBaseSize * aSizeVar * twinkleScale * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

export const fragmentShader = /* glsl */`
precision highp float;

uniform vec3 uCoreColor;
uniform vec3 uEdgeColor;
uniform float uIntensity;

varying vec3 vPos;
varying float vGrainSeed;

// Simple pseudo-random based on seed
float rand(float n){ return fract(sin(n) * 43758.5453123); }

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  if (r > 0.5) discard;

  // Sharper alpha falloff for distinct points
  float alpha = smoothstep(0.48, 0.30, 0.5 - r);
  alpha *= 1.5;

  // Core → edge color blend
  float d = length(vPos);
  float t = smoothstep(0.0, 1.8, d);
  vec3 color = mix(uCoreColor, uEdgeColor, t);

  // Grain sparkle
  float grain = mix(0.6, 1.3, rand(vGrainSeed * 10.0));
  color *= grain;

  // Bright center and slight ring emphasis
  color *= smoothstep(0.55, 0.25, r) * 1.2;

  // Tone down additive glow by modulating alpha (avoid total merge)
  gl_FragColor = vec4(color * uIntensity, alpha * 0.8);
}

`;
