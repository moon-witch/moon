import * as THREE from 'three'

export function generateHeartPoints(count, pointSizeJitter = 0.9) {
    const positions = new Float32Array(count * 3)
    const jitter = new Float32Array(count * 3)
    const sizeVar = new Float32Array(count)
    let i = 0
    const rnd = Math.random

    const XMIN = -1.4, XMAX = 1.4
    const YMIN = -1.6, YMAX = 1.2

    const sdHeart = (x, y) => {
        const x2 = x * x, y2 = y * y
        return Math.pow(x2 + y2 - 1.0, 3.0) - x2 * y2 * y
    }

    while (i < count) {
        const x = XMIN + (XMAX - XMIN) * rnd()
        const y = YMIN + (YMAX - YMIN) * rnd()
        if (sdHeart(x, y) <= 0.0) {
            positions[3*i+0] = x
            positions[3*i+1] = y
            positions[3*i+2] = (rnd() - 0.5) * 0.25
            jitter[3*i+0] = (rnd() - 0.5) * 2.0
            jitter[3*i+1] = (rnd() - 0.5) * 2.0
            jitter[3*i+2] = (rnd() - 0.5) * 2.0
            sizeVar[i] = 0.5 + rnd() * pointSizeJitter
            i++
        }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aJitter', new THREE.BufferAttribute(jitter, 3))
    geometry.setAttribute('aSizeVar', new THREE.BufferAttribute(sizeVar, 1))
    return geometry
}
