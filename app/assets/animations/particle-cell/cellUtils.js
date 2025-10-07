// assets/animations/particle-cell/cellUtils.js
import * as THREE from 'three'

export function hexToLinearColor(hex) {
    const c = new THREE.Color(hex)
    // convert sRGB -> linear
    c.convertSRGBToLinear?.()
    return { r: c.r, g: c.g, b: c.b }
}
