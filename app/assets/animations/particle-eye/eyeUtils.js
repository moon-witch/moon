// assets/animations/particle-eye/eyeUtils.js
import * as THREE from 'three'

export function hexToLinearColor(hex) {
    const c = new THREE.Color(hex)
    return { r: Math.pow(c.r, 2.2), g: Math.pow(c.g, 2.2), b: Math.pow(c.b, 2.2) }
}
