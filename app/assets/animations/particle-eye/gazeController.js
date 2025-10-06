// assets/animations/particle-eye/gazeController.js
import * as THREE from 'three'

/**
 * Controls continuous saccadic + focus motion for the particle eye.
 * Produces repeating cycles of:
 *   - several fast erratic moves,
 *   - settle to center,
 *   - small micro "focus" motions for a few seconds,
 *   - repeat.
 */
export class GazeController {
    constructor({
                    saccades = 3,
                    moveTime = 0.12,
                    dwellTime = 0.08,
                    settleTime = 0.25,
                    focusDuration = 2.5,    // time (s) to stay centered while twitching
                    focusAmplitude = 0.15,  // magnitude of micro eye movements during focus
                    seed = Math.random()
                } = {}) {
        this.params = { saccades, moveTime, dwellTime, settleTime, focusDuration, focusAmplitude }
        this.rng = mulberry32((seed * 1e9) >>> 0)
        this.offset = new THREE.Vector2(0, 0)

        this._sequence = []
        this._phase = 0
        this._phaseTime = 0
        this._cycleTimer = 0
        this._inFocus = false

        this._newCycle()
    }

    _newCycle() {
        const { saccades, moveTime, dwellTime, settleTime } = this.params
        const randDir = () => {
            const theta = this.rng() * Math.PI * 2
            const r = 0.6 + 0.4 * this.rng()
            return new THREE.Vector2(Math.cos(theta) * r, Math.sin(theta) * r)
        }

        this._sequence = []
        let cur = new THREE.Vector2(0, 0)
        for (let i = 0; i < saccades; i++) {
            const nxt = randDir()
            this._sequence.push({ kind: 'move', from: cur, to: nxt, dur: moveTime, t: 0 })
            this._sequence.push({ kind: 'dwell', at: nxt, dur: dwellTime, t: 0 })
            cur = nxt
        }
        this._sequence.push({ kind: 'move', from: cur, to: new THREE.Vector2(0, 0), dur: settleTime, t: 0 })
        this._phase = 0
        this._phaseTime = 0
        this._inFocus = false
        this._cycleTimer = 0
    }

    _ease(t) {
        return t < 0.5 ? 4.0 * t * t * t : 1.0 - Math.pow(-2.0 * t + 2.0, 3.0) / 2.0
    }

    update(dt) {
        const { focusDuration, focusAmplitude } = this.params

        // if in focus (centered) state
        if (this._inFocus) {
            this._cycleTimer += dt
            // micro random motion around center
            this.offset.x = (this.rng() * 2 - 1) * focusAmplitude * 0.3
            this.offset.y = (this.rng() * 2 - 1) * focusAmplitude * 0.3
            if (this._cycleTimer >= focusDuration) {
                this._newCycle() // restart erratic saccades
            }
            return
        }

        // else: playing through erratic saccades
        if (this._phase >= this._sequence.length) {
            // finished saccades: enter focus mode
            this._inFocus = true
            this._cycleTimer = 0
            this.offset.set(0, 0)
            return
        }

        const p = this._sequence[this._phase]
        p.t += dt
        const done = p.t >= p.dur

        if (p.kind === 'move') {
            const a = this._ease(Math.min(1.0, p.t / p.dur))
            this.offset.x = THREE.MathUtils.lerp(p.from.x, p.to.x, a)
            this.offset.y = THREE.MathUtils.lerp(p.from.y, p.to.y, a)
        } else {
            this.offset.copy(p.at)
        }

        if (done) this._phase++
    }

    restart() {
        this._newCycle()
    }
}

/* ────────────────────────────── utility PRNG ────────────────────────────── */
function mulberry32(a) {
    return function () {
        let t = a += 0x6D2B79F5
        t = Math.imul(t ^ (t >>> 15), t | 1)
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}
