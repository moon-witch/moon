<template>
  <ClientOnly>
    <div
        ref="container"
        :style="{
        width: typeof width === 'number' ? width + 'px' : width,
        height: typeof height === 'number' ? height + 'px' : height,
        position: 'relative',
        display: 'inline-block',
        cursor: 'pointer'
      }"
        @pointerenter="onHover(true)"
        @pointerleave="onHover(false)"
        @click="onClick"
        aria-label="Animated particle heart"
        role="img"
    />
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import { vertexShader, fragmentShader } from '~/assets/animations/particle-heart/heartShaders'
import { hexToLinearColor } from '~/assets/animations/particle-heart/heartUtils'

/*──────────────────────────────
  Props
──────────────────────────────*/
const props = defineProps({
  width: { type: [Number, String], default: 240 },
  height: { type: [Number, String], default: 240 },
  particleCount: { type: Number, default: 10000 },
  rotationX: { type: Number, default: 90 },
  rotationY: { type: Number, default: 0 },
  rotationZ: { type: Number, default: 0 },
  duration: { type: Number, default: 1.0 },
  amplitude: { type: Number, default: 0.10 },
  hoverBoost: { type: Number, default: 0.035 },
  basePointSize: { type: Number, default: 2.2 },
  jitterAmplitude: { type: Number, default: 0.06 },
  intensity: { type: Number, default: 1.0 },
  coreColor: { type: String, default: '#cd0101' },
  edgeColor: { type: String, default: '#7A0014' },
  animated: { type: Boolean, default: true },
  modelPath: { type: String, default: '/glb-models/lowpoly_human_heart.glb' }
})

/*──────────────────────────────
  Internal state
──────────────────────────────*/
const container = ref(null)
let renderer, scene, camera, points, material, animationId
let startTime = 0
let hoverState = 0
let hoverTarget = 0
let clickPulseStart = -1
let disposed = false

const reduceMotion = computed(() =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

/*──────────────────────────────
  Helper: load model and sample surface
──────────────────────────────*/
async function generateHeartGeometryFromMesh(url, count) {
  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(url)
  // Find first Mesh in the model
  const mesh = gltf.scene.getObjectByProperty('type', 'Mesh') || gltf.scene.children.find(c => c.isMesh)
  mesh.geometry.computeVertexNormals()

  const sampler = new MeshSurfaceSampler(mesh).build()
  const positions = new Float32Array(count * 3)
  const jitter = new Float32Array(count * 3)
  const sizeVar = new Float32Array(count)

  const temp = new THREE.Vector3()
  for (let i = 0; i < count; i++) {
    sampler.sample(temp)
    positions.set([temp.x, temp.y, temp.z], i * 3)
    // random micro-jitter for breathing texture
    jitter.set([(Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2], i*3)
    sizeVar[i] = 0.5 + Math.random() * 0.9
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aJitter', new THREE.BufferAttribute(jitter, 3))
  geometry.setAttribute('aSizeVar', new THREE.BufferAttribute(sizeVar, 1))
  geometry.computeBoundingSphere()
  return geometry
}

/*──────────────────────────────
  Initialize Three.js scene
──────────────────────────────*/
async function init() {
  const el = container.value
  if (!el) return
  const w = el.clientWidth
  const h = el.clientHeight

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(w, h, false)
  el.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
  camera.position.set(-0.125, 0.35, 2.4)

  // Load and build geometry from model
  const geometry = await generateHeartGeometryFromMesh(props.modelPath, props.particleCount)

  const core = hexToLinearColor(props.coreColor)
  const edge = hexToLinearColor(props.edgeColor)

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0.0 },
      uDuration: { value: props.duration },
      uAmplitude: { value: props.amplitude },
      uHover: { value: 0.0 },
      uClickPulse: { value: 0.0 },
      uJitterAmp: { value: props.jitterAmplitude },
      uBaseSize: { value: props.basePointSize },
      uIntensity: { value: props.intensity },
      uCoreColor: { value: new THREE.Vector3(core.r, core.g, core.b) },
      uEdgeColor: { value: new THREE.Vector3(edge.r, edge.g, edge.b) }
    }
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  // Optional ambient orientation adjustment (center & rotate)
  const box = new THREE.Box3().setFromObject(points)
  const center = box.getCenter(new THREE.Vector3())
  points.position.sub(center)
  points.rotation.set(
      THREE.MathUtils.degToRad(props.rotationX),
      THREE.MathUtils.degToRad(props.rotationY),
      THREE.MathUtils.degToRad(props.rotationZ)
  )
  // upright orientation adjustment

  window.addEventListener('resize', onResize, { passive: true })
}

/*──────────────────────────────
  Resize
──────────────────────────────*/
function onResize() {
  if (!renderer || !camera || !container.value) return
  const w = container.value.clientWidth
  const h = container.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

/*──────────────────────────────
  Interactions
──────────────────────────────*/
function onHover(isIn) { hoverTarget = isIn ? 1.0 : 0.0 }
function onClick() { clickPulseStart = performance.now() / 1000.0 }

/*──────────────────────────────
  Animation loop
──────────────────────────────*/
function animate() {
  if (disposed) return
  const now = performance.now() / 1000.0
  if (!startTime) startTime = now
  const elapsed = now - startTime
  hoverState += (hoverTarget - hoverState) * 0.15

  let clickEnv = 0.0
  if (clickPulseStart > 0) {
    const dt = now - clickPulseStart
    clickEnv = Math.max(0, Math.exp(-12.0 * dt) * Math.sin(40.0 * dt))
    if (dt > 0.35) clickEnv = 0.0
  }

  const active = props.animated && !reduceMotion.value
  if (material) {
    material.uniforms.uTime.value = active ? elapsed : 0.0
    material.uniforms.uAmplitude.value = active
        ? props.amplitude + hoverState * props.hoverBoost
        : 0.0
    material.uniforms.uHover.value = hoverState
    material.uniforms.uClickPulse.value = clickEnv
  }

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

/*──────────────────────────────
  Lifecycle
──────────────────────────────*/
onMounted(async () => {
  if (typeof window === 'undefined' || !window.WebGLRenderingContext) return
  await nextTick()
  if (!container.value) return
  await init()
  animate()
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  if (scene && points) {
    scene.remove(points)
    points.geometry.dispose()
    material.dispose()
  }
  renderer?.dispose()
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
})
</script>
