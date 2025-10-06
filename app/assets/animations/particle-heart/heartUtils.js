import * as THREE from 'three'

export function hexToLinearColor(hex) {
    const c = new THREE.Color(hex)
    c.convertSRGBToLinear()
    return c
}
