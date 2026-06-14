// Shared tilt store: unifies mouse position (desktop) and device orientation
// (mobile gyroscope) into a single smoothed signal in the range [-1, 1] on each
// axis. Consumers subscribe for per-frame smoothed values, or read getTilt()
// directly inside their own animation loop.

type TiltListener = (x: number, y: number) => void;

let tx = 0;
let ty = 0; // raw target
let sx = 0;
let sy = 0; // smoothed
const listeners = new Set<TiltListener>();
let started = false;
let gestureBound = false;
let rafId = 0;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

function onMouse(e: MouseEvent) {
  tx = clamp((e.clientX / window.innerWidth - 0.5) * 2);
  ty = clamp((e.clientY / window.innerHeight - 0.5) * 2);
}

function onOrient(e: DeviceOrientationEvent) {
  if (e.gamma == null || e.beta == null) return;
  // gamma: left/right tilt [-90,90]; beta: front/back tilt [-180,180].
  // ~45° is a natural holding angle, treated as neutral on the vertical axis.
  tx = clamp(e.gamma / 35);
  ty = clamp((e.beta - 45) / 35);
}

function loop() {
  sx += (tx - sx) * 0.08;
  sy += (ty - sy) * 0.08;
  listeners.forEach((l) => l(sx, sy));
  rafId = requestAnimationFrame(loop);
}

// iOS 13+ requires an explicit permission grant from within a user gesture.
async function enableDeviceMotion() {
  const D = window.DeviceOrientationEvent as unknown as {
    requestPermission?: () => Promise<'granted' | 'denied'>;
  };
  if (D && typeof D.requestPermission === 'function') {
    try {
      const res = await D.requestPermission();
      if (res === 'granted') {
        window.addEventListener('deviceorientation', onOrient, { passive: true });
      }
    } catch {
      /* permission denied or unavailable — silently fall back to mouse only */
    }
  }
}

function bindGesture() {
  if (gestureBound) return;
  gestureBound = true;
  const handler = () => {
    enableDeviceMotion();
    window.removeEventListener('touchend', handler);
    window.removeEventListener('pointerdown', handler);
  };
  window.addEventListener('touchend', handler, { passive: true });
  window.addEventListener('pointerdown', handler, { passive: true });
}

function ensureStarted() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('mousemove', onMouse, { passive: true });
  // Non-iOS (Android) delivers deviceorientation without a permission prompt.
  window.addEventListener('deviceorientation', onOrient, { passive: true });
  bindGesture(); // request iOS permission on first user gesture
  rafId = requestAnimationFrame(loop);
}

export function getTilt(): { x: number; y: number } {
  return { x: sx, y: sy };
}

export function subscribeTilt(cb: TiltListener): () => void {
  ensureStarted();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      cancelAnimationFrame(rafId);
      started = false;
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', onOrient);
    }
  };
}
