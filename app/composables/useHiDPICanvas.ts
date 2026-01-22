// composables/useHiDPICanvas.ts
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

export type HiDPICanvasSize = {
    /** CSS pixels */
    width: number;
    /** CSS pixels */
    height: number;
    /** devicePixelRatio used for backing store */
    dpr: number;
};

export type UseHiDPICanvasOptions = {
    /**
     * If true: ctx.setTransform(dpr,0,0,dpr,0,0) so drawing uses CSS pixels.
     * Keep true for ergonomics.
     */
    autoScale?: boolean;
    /**
     * Passed to canvas.getContext("2d", ...).
     * Example: { alpha: true }
     */
    contextAttributes?: CanvasRenderingContext2DSettings;
};

/**
 * HiDPI + ResizeObserver canvas composable.
 *
 * - Canvas CSS size follows its container (100%/100%).
 * - Backing store size is set to CSS pixels * devicePixelRatio.
 * - A scale transform is applied so you can draw in CSS pixel coordinates.
 */
export function useHiDPICanvas(options: UseHiDPICanvasOptions = {}) {
    const {
        autoScale = true,
        contextAttributes = { alpha: true }
    } = options;

    const containerRef: Ref<HTMLElement | null> = ref(null);
    const canvasRef: Ref<HTMLCanvasElement | null> = ref(null);
    const ctxRef: Ref<CanvasRenderingContext2D | null> = ref(null);

    const sizeRef: Ref<HiDPICanvasSize> = ref({
        width: 0,
        height: 0,
        dpr: 1
    });

    let ro: ResizeObserver | null = null;
    let mq: MediaQueryList | null = null;
    let onDprChange: (() => void) | null = null;

    function applySizeFromRect(rect: DOMRectReadOnly) {
        const canvas = canvasRef.value;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;

        // CSS pixel size (avoid 0 to prevent invalid canvas state)
        const cssW = Math.max(1, Math.round(rect.width));
        const cssH = Math.max(1, Math.round(rect.height));

        // Backing store size
        const pxW = Math.max(1, Math.round(cssW * dpr));
        const pxH = Math.max(1, Math.round(cssH * dpr));

        // Update canvas backing store only when needed
        if (canvas.width !== pxW || canvas.height !== pxH) {
            canvas.width = pxW;
            canvas.height = pxH;
        }

        // Ensure the canvas visually fills the container
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";

        sizeRef.value = { width: cssW, height: cssH, dpr };

        const ctx = ctxRef.value;
        if (ctx && autoScale) {
            // Draw in CSS pixels (0..cssW, 0..cssH)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
    }

    function resizeNow() {
        const el = containerRef.value;
        if (!el) return;
        applySizeFromRect(el.getBoundingClientRect());
    }

    onMounted(() => {
        const canvas = canvasRef.value;
        if (!canvas) return;

        ctxRef.value = canvas.getContext("2d", contextAttributes);

        // Observe container size, not window size
        ro = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            applySizeFromRect(entry.contentRect);
        });

        if (containerRef.value) ro.observe(containerRef.value);

        // Initial sizing
        resizeNow();

        // Handle DPR changes (browser zoom / moving between displays)
        mq = window.matchMedia?.(`(resolution: ${window.devicePixelRatio}dppx)`) ?? null;
        onDprChange = () => resizeNow();
        mq?.addEventListener?.("change", onDprChange);
    });

    onBeforeUnmount(() => {
        if (ro) ro.disconnect();
        ro = null;

        if (mq && onDprChange) {
            mq.removeEventListener?.("change", onDprChange);
        }
        mq = null;
        onDprChange = null;
    });

    return { containerRef, canvasRef, ctxRef, sizeRef, resizeNow };
}
