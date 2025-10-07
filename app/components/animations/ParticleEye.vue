<template>
  <ClientOnly>
    <div
        ref="container"
        class="particle-eye-canvas"
        :style="{
        width: typeof width === 'number' ? width + 'px' : width,
        height: typeof height === 'number' ? height + 'px' : height,
        cursor: 'pointer'
      }"
        @pointerenter="onHover(true)"
        @pointerleave="onHover(false)"
        @click="onClick"
        aria-label="Particle eye"
        role="img"
    />
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

// Reuse the heart shaders & utils for consistent particle appearance
import { vertexShader, fragmentShader } from '~/assets/animations/particle-cell/cellShaders'
import { hexToLinearColor } from '~/assets/animations/particle-eye/eyeUtils'

// Continuous gaze controller
import { GazeController } from '~/assets/animations/particle-eye/gazeController'

/*───────────────────────────────────────────
  Props
───────────────────────────────────────────*/
const props = defineProps({
  width: { type: [Number, String], default: 300 },
  height: { type: [Number, String], default: 300 },

  // Model
  modelPath: { type: String, default: '/glb-models/lowpoly_human_eye.glb' },
  particleCount: { type: Number, default: 14000 },

  // Visuals
  amplitude: { type: Number, default: 0.06 },
  hoverBoost: { type: Number, default: 0.02 },
  basePointSize: { type: Number, default: 2.2 },
  jitterAmplitude: { type: Number, default: 0.05 },
  intensity: { type: Number, default: 1.0 },
  coreColor: { type: String, default: '#7CF8FF' },
  edgeColor: { type: String, default: '#7A0014' },
  duration: { type: Number, default: 1.0 },
  animated: { type: Boolean, default: true },
  animationSpeed: { type: Number, default: 1.0 },   // NEW: speed control

  // Gaze motion
  gazeMoveFactor: { type: Number, default: 0.35 },
  saccadeCount: { type: Number, default: 3 },
  saccadeMoveTime: { type: Number, default: 0.12 },
  saccadeDwellTime: { type: Number, default: 0.08 },
  saccadeSettleTime: { type: Number, default: 0.25 },

  // Base orientation
  rotationX: { type: Number, default: 90 },
  rotationY: { type: Number, default: 0 },
  rotationZ: { type: Number, default: 0 },
})

/*───────────────────────────────────────────
  Internal State
───────────────────────────────────────────*/
const container = ref(null)
let renderer, scene, camera, points, material, animationId
let startTime = 0, hoverState = 0, hoverTarget = 0, clickPulseStart = -1
let disposed = false
let gaze
let basePosition = new THREE.Vector3()
let boundsRadius = 1

const reduceMotion = computed(() =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

/*───────────────────────────────────────────
  Geometry from Mesh
───────────────────────────────────────────*/
async function buildParticleGeometry(url, count) {
  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(url)
  const mesh = gltf.scene.getObjectByProperty('type', 'Mesh') || gltf.scene.children.find(c => c.isMesh)
  mesh.geometry.computeVertexNormals()

  const sampler = new MeshSurfaceSampler(mesh).build()
  const positions = new Float32Array(count * 3)
  const jitter = new Float32Array(count * 3)
  const sizeVar = new Float32Array(count)
  const tmp = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    sampler.sample(tmp)
    positions.set([tmp.x, tmp.y, tmp.z], i * 3)
    jitter.set([(Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*2], i*3)
    sizeVar[i] = 0.5 + Math.random() * 0.9
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('aJitter', new THREE.BufferAttribute(jitter, 3))
  geo.setAttribute('aSizeVar', new THREE.BufferAttribute(sizeVar, 1))
  geo.computeBoundingSphere()
  boundsRadius = geo.boundingSphere?.radius || 1
  return geo
}

/*───────────────────────────────────────────
  Init Scene
───────────────────────────────────────────*/
async function init() {
  const el = container.value
  const w = el.clientWidth
  const h = el.clientHeight

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(w, h, false)
  renderer.domElement.style.width = w + 'px'
  renderer.domElement.style.height = h + 'px'
  el.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
  camera.position.set(-0.025, -0.17, 4.6)

  const geometry = await buildParticleGeometry(props.modelPath, props.particleCount)
  const core = hexToLinearColor(props.coreColor)
  const edge = hexToLinearColor(props.edgeColor)

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime:       { value: 0.0 },
      uDuration:   { value: props.duration },
      uAmplitude:  { value: props.amplitude },
      uHover:      { value: 0.0 },
      uClickPulse: { value: 0.0 },
      uJitterAmp:  { value: props.jitterAmplitude },
      uBaseSize:   { value: props.basePointSize },
      uIntensity:  { value: props.intensity },
      uCoreColor:  { value: new THREE.Vector3(core.r, core.g, core.b) },
      uEdgeColor:  { value: new THREE.Vector3(edge.r, edge.g, edge.b) },
      uSpeed:      { value: props.animationSpeed }  // new speed uniform
    }
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  // Center and orient
  const box = new THREE.Box3().setFromObject(points)
  const center = box.getCenter(new THREE.Vector3())
  points.position.sub(center)
  basePosition.copy(points.position)

  points.rotation.set(
      THREE.MathUtils.degToRad(props.rotationX),
      THREE.MathUtils.degToRad(props.rotationY),
      THREE.MathUtils.degToRad(props.rotationZ)
  )

  // Gaze controller
  gaze = new GazeController({
    saccades: props.saccadeCount,
    moveTime: props.saccadeMoveTime,
    dwellTime: props.saccadeDwellTime,
    settleTime: props.saccadeSettleTime
  })

  window.addEventListener('resize', onResize, { passive: true })
}

/*───────────────────────────────────────────
  Resize Handling
───────────────────────────────────────────*/
function onResize() {
  if (!renderer || !camera || !container.value) return
  const w = container.value.clientWidth
  const h = container.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

/*───────────────────────────────────────────
  Interactions
───────────────────────────────────────────*/
function onHover(isIn) { hoverTarget = isIn ? 1.0 : 0.0 }
function onClick() {
  clickPulseStart = performance.now() / 1000.0
  gaze?.restart()
}

/*───────────────────────────────────────────
  Animation Loop
───────────────────────────────────────────*/
function animate() {
  if (disposed) return
  const now = performance.now() / 1000.0
  if (!startTime) startTime = now
  const elapsed = now - startTime

  // Hover interpolation
  hoverState += (hoverTarget - hoverState) * 0.15

  // Click pulse
  let clickEnv = 0.0
  if (clickPulseStart > 0) {
    const dt = now - clickPulseStart
    clickEnv = Math.max(0, Math.exp(-10.0 * dt) * Math.sin(35.0 * dt))
    if (dt > 0.45) clickEnv = 0.0
  }

  const active = props.animated && !reduceMotion.value
  if (material) {
    material.uniforms.uTime.value = active ? elapsed : 0.0
    material.uniforms.uAmplitude.value = active
        ? props.amplitude + hoverState * props.hoverBoost
        : 0.0
    material.uniforms.uHover.value = hoverState
    material.uniforms.uClickPulse.value = clickEnv
    material.uniforms.uSpeed.value = props.animationSpeed  // update speed
  }

  // Gaze updates
  if (active && gaze && points) {
    gaze.update(1 / 60)
    const maxShift = props.gazeMoveFactor * boundsRadius
    points.position.set(
        basePosition.x + gaze.offset.x * maxShift,
        basePosition.y + gaze.offset.y * maxShift,
        basePosition.z
    )
  }

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

/*───────────────────────────────────────────
  Lifecycle
───────────────────────────────────────────*/
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

<style scoped>
.particle-eye-canvas {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
}
</style>