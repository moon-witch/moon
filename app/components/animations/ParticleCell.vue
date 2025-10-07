<template>
  <ClientOnly>
    <div
        ref="container"
        :style="{
        width: typeof width === 'number' ? width + 'px' : width,
        height: typeof height === 'number' ? height + 'px' : height,
        position: 'relative',    // same as your heart/eye default
        display: 'block',
        cursor: 'pointer'
      }"
        @pointerenter="onHover(true)"
        @pointerleave="onHover(false)"
        @click="onClick"
        aria-label="Particle neuron/cell"
        role="img"
    />
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { vertexShader, fragmentShader } from '~/assets/animations/particle-cell/cellShaders'
import { hexToLinearColor } from '~/assets/animations/particle-cell/cellUtils'

/*──────────── Props ────────────*/
const props = defineProps({
  width: { type: [Number, String], default: 280 },
  height: { type: [Number, String], default: 280 },

  // Model
  modelPath: { type: String, default: '/glb-models/lowpoly_cell.glb' },
  particleCount: { type: Number, default: 16000 },

  // Aesthetic (consistent with heart/eye)
  basePointSize:   { type: Number, default: 1.8 },
  jitterAmplitude: { type: Number, default: 0.05 },
  intensity:       { type: Number, default: 1.1 },
  coreColor:       { type: String, default: '#5cb8bf' }, // cyan glow
  edgeColor:       { type: String, default: '#004A5A' }, // deep teal

  // Organic motion controls
  motionSpeed: { type: Number, default: 0.8 },  // overall tempo
  motionScale: { type: Number, default: 0.08 }, // displacement amplitude
  twinkle:     { type: Number, default: 0.4 },  // per-particle flicker (0..1)

  // Base orientation (for branchy neurons you may want a tilt)
  rotationX: { type: Number, default: 90 },
  rotationY: { type: Number, default: 0 },
  rotationZ: { type: Number, default: 0 },

  animated: { type: Boolean, default: true }
})

/*──────── Internal state ───────*/
const container = ref(null)
let renderer, scene, camera, points, material, animationId
let startTime = 0
let hoverState = 0, hoverTarget = 0
let clickPulseStart = -1
let disposed = false

const reduceMotion = computed(() =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

/*──────── Geometry from mesh ───────*/
async function buildParticleGeometry(url, count) {
  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(url)

  const meshes = []
  gltf.scene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      child.updateWorldMatrix(true, false)
      const geom = child.geometry.clone()
      geom.applyMatrix4(child.matrixWorld)

      // ───────────────────────────────
      // Normalize geometry attributes
      // ───────────────────────────────
      // Remove attributes that might not exist on all meshes
      const keep = ['position', 'normal']
      for (const key of Object.keys(geom.attributes)) {
        if (!keep.includes(key)) {
          geom.deleteAttribute(key)
        }
      }
      // Ensure normals exist
      if (!geom.attributes.normal) geom.computeVertexNormals()
      meshes.push(geom)
    }
  })

  if (meshes.length === 0) {
    console.warn(`⚠️ No meshes found in model: ${url}`)
    return new THREE.BufferGeometry()
  }

  // ───────────────────────────────
  // Safe merge
  // ───────────────────────────────
  let merged
  try {
    merged = BufferGeometryUtils.mergeGeometries(meshes, false)
  } catch (err) {
    console.warn('mergeGeometries failed, using first mesh only:', err)
    merged = meshes[0]
  }

  merged.computeVertexNormals()
  merged.computeBoundingBox()
  merged.computeBoundingSphere()

  // ───────────────────────────────
  // Normalize scale and center
  // ───────────────────────────────
  const box = merged.boundingBox
  const size = new THREE.Vector3().subVectors(box.max, box.min)
  const center = new THREE.Vector3().addVectors(box.max, box.min).multiplyScalar(0.5)
  const maxDim = Math.max(size.x, size.y, size.z)
  const scaleFactor = 20 / maxDim
  merged.translate(-center.x, -center.y, -center.z)
  merged.scale(scaleFactor, scaleFactor, scaleFactor)

  // ───────────────────────────────
  // Sample surface points
  // ───────────────────────────────
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(merged)).build()
  const positions = new Float32Array(count * 3)
  const jitter = new Float32Array(count * 3)
  const sizeVar = new Float32Array(count)
  const temp = new THREE.Vector3()

  for (let i = 0; i < count; i++) {
    sampler.sample(temp)
    positions.set([temp.x, temp.y, temp.z], i * 3)
    jitter.set([(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2], i * 3)
    sizeVar[i] = 0.5 + Math.random() * 0.9
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aJitter', new THREE.BufferAttribute(jitter, 3))
  geometry.setAttribute('aSizeVar', new THREE.BufferAttribute(sizeVar, 1))
  geometry.computeBoundingSphere()

  return geometry
}

/*──────── Init ───────*/
async function init() {
  const el = container.value
  const w = el.clientWidth, h = el.clientHeight

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(w, h, false)
  renderer.domElement.style.width = w + 'px'
  renderer.domElement.style.height = h + 'px'
  el.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
  camera.position.set(1, -0.8, 5.6)

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
      uTime:        { value: 0.0 },
      uMotionSpeed: { value: props.motionSpeed },
      uMotionScale: { value: props.motionScale },
      uJitterAmp:   { value: props.jitterAmplitude },
      uBaseSize:    { value: props.basePointSize },
      uTwinkle:     { value: props.twinkle },

      uIntensity:   { value: props.intensity },
      uCoreColor:   { value: new THREE.Vector3(core.r, core.g, core.b) },
      uEdgeColor:   { value: new THREE.Vector3(edge.r, edge.g, edge.b) }
    }
  })

  points = new THREE.Points(geometry, material)
  scene.add(points)

  // Center & orient
  const box = new THREE.Box3().setFromObject(points)
  const center = box.getCenter(new THREE.Vector3())
  points.position.sub(center)

  points.rotation.set(
      THREE.MathUtils.degToRad(props.rotationX),
      THREE.MathUtils.degToRad(props.rotationY),
      THREE.MathUtils.degToRad(props.rotationZ)
  )

  window.addEventListener('resize', onResize, { passive: true })
}

/*──────── Resize ───────*/
function onResize() {
  if (!renderer || !camera || !container.value) return
  const w = container.value.clientWidth
  const h = container.value.clientHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

/*──────── Interactions ───────*/
function onHover(isIn) { hoverTarget = isIn ? 1.0 : 0.0 }
function onClick() { clickPulseStart = performance.now() / 1000.0 }

/*──────── Animate ───────*/
function animate() {
  if (disposed) return
  const now = performance.now() / 1000.0
  if (!startTime) startTime = now
  const elapsed = now - startTime

  // hover easing (if you want to tie it to motionScale later)
  hoverState += (hoverTarget - hoverState) * 0.15

  // optional click pulse could modulate intensity or motionScale (kept simple here)

  if (material) {
    material.uniforms.uTime.value = props.animated && !reduceMotion.value ? elapsed : 0.0
    material.uniforms.uMotionSpeed.value = props.motionSpeed
    material.uniforms.uMotionScale.value = props.motionScale * (1.0 + hoverState * 0.15)
    material.uniforms.uTwinkle.value = props.twinkle
  }

  renderer.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

/*──────── Lifecycle ───────*/
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
