// Choreography of the film, ported from the Blender scenes the stills were rendered from.
// Blender (x, y, z) maps to three.js (x, z, -y); the cars face +z and roll forward along it.

const b = (x, y, z) => [x, z, -y];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (a, c, x) => {
  const t = clamp((x - a) / (c - a));
  return t * t * (3 - 2 * t);
};
const mix = (a, c, t) => a + (c - a) * t;
const lerp3 = (a, c, t) => [mix(a[0], c[0], t), mix(a[1], c[1], t), mix(a[2], c[2], t)];

export const ORDER = ['arrive', 'signature', 'motion', 'arc360', 'umbra360', 'leave'];
export const COUNTS = { arrive: 128, signature: 48, motion: 80, arc360: 48, umbra360: 48, leave: 48 };
export const INTRO_TIME = 92 / 24;

export const BASE = {
  arc: { x: 0, z: 0 },
  umbraL: { x: -3.25, z: -0.85 },
  umbraR: { x: 3.25, z: -0.85 }
};

export const LIT = { beam: 0.2, led: 0.4, tail: 1, top: [1, 1, 1], side: 1, amb: 1 };
const DARK = { beam: 1, led: 1, tail: 1, top: [0.04, 0.04, 0.04], side: 0, amb: 0.15 };
const SIGNATURE = { beam: 1, led: 1, tail: 1, top: [0.22, 0.03, 0.03], side: 0.25, amb: 0.2 };
const MOTION_LIGHT = { beam: 0.1, led: 0.55, tail: 1, top: [0, 0, 0], side: 0, amb: 0.35 };

const KEYS = [
  [0.00, b(0.0, -12.5, 1.10), b(0.0, 0.5, 0.60), 45],
  [0.13, b(-0.30, -7.6, 0.88), b(-0.15, -1.2, 0.62), 45],
  [0.27, b(-0.95, -4.3, 0.74), b(-0.58, -2.2, 0.64), 50],
  [0.36, b(-1.30, -3.25, 0.70), b(-0.64, -2.15, 0.65), 55],
  [0.47, b(-2.05, -2.55, 0.60), b(-1.00, -1.45, 0.42), 40],
  [0.59, b(-1.85, -1.75, 1.50), b(-0.35, -0.95, 0.80), 32],
  [0.74, b(-0.55, -0.6, 2.4), b(0.0, -0.45, 0.75), 28],
  [0.87, b(0.0, -0.5, 2.25), b(0.0, -0.75, 0.6), 28],
  [1.00, b(0.0, -0.62, 1.55), b(0.0, -1.0, 0.62), 26]
];

const SIG_KEYS = [
  [0.0, b(-2.7, -3.55, 0.56), b(-0.72, -2.1, 0.63), 55],
  [0.5, b(0.0, -3.95, 0.68), b(0.0, -2.1, 0.64), 48],
  [1.0, b(2.7, -3.55, 0.56), b(0.72, -2.1, 0.63), 55]
];

const MOTION = { gap: 5.6, travel: 23.7, from: -4.8, to: 4.8, lead: -1.6, camZ: 6.3, camY: 0.8, targetY: 0.6, lens: 33 };
const LEAVE = { distance: 19, delay: 0.1, camera: b(0, 12.2, 1.28), end: b(0, 10.6, 1.5), target: b(0, 0.2, 0.62), lens: 42 };
const ORBIT = {
  arc360: { radius: 7.9, height: 1.38, targetY: 0.52, lens: 45, centre: [0, 0.2], car: 'arc', top: [1, 0, 0] },
  umbra360: { radius: 8.8, height: 1.58, targetY: 0.8, lens: 45, centre: [-3.25, -0.85], car: 'umbraL', top: [0, 1, 0] }
};

function hermite(keys, t) {
  const n = keys.length;
  let i = 0;
  while (i < n - 2 && keys[i + 1][0] <= t) i += 1;
  const t0 = keys[i][0];
  const t1 = keys[i + 1][0];
  const u = (t - t0) / (t1 - t0);
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
  const h10 = u ** 3 - 2 * u ** 2 + u;
  const h01 = -2 * u ** 3 + 3 * u ** 2;
  const h11 = u ** 3 - u ** 2;
  const value = (j, idx, k) => (idx === 3 ? keys[j][3] : keys[j][idx][k]);
  const tangent = (j, idx, k) => {
    if (j === 0 || j === n - 1) return 0;
    return (value(j + 1, idx, k) - value(j - 1, idx, k)) / (keys[j + 1][0] - keys[j - 1][0]);
  };
  const chan = (idx, k) => {
    const m0 = tangent(i, idx, k) * (t1 - t0);
    const m1 = tangent(i + 1, idx, k) * (t1 - t0);
    return h00 * value(i, idx, k) + h10 * m0 + h01 * value(i + 1, idx, k) + h11 * m1;
  };
  return {
    pos: [chan(1, 0), chan(1, 1), chan(1, 2)],
    target: [chan(2, 0), chan(2, 1), chan(2, 2)],
    lens: chan(3, 0)
  };
}

const parked = () => ({
  arc: { ...BASE.arc, yaw: 0, spin: 0, show: true },
  umbraL: { ...BASE.umbraL, yaw: 0, spin: 0, show: true },
  umbraR: { ...BASE.umbraR, yaw: 0, spin: 0, show: true }
});

function arrive(p) {
  return { cam: hermite(KEYS, p), cars: parked(), light: LIT, set: 'studio', fog: [18, 48] };
}

function signature(p) {
  return { cam: hermite(SIG_KEYS, p), cars: parked(), light: SIGNATURE, set: 'studio', fog: [10, 30] };
}

function motion(p) {
  const x = mix(MOTION.from, MOTION.to, p);
  const s = MOTION.travel * p;
  const head = MOTION.from + MOTION.lead + s;
  const yaw = Math.PI / 2;
  return {
    cam: { pos: [x, MOTION.camY, MOTION.camZ], target: [x, MOTION.targetY, 0], lens: MOTION.lens },
    cars: {
      arc: { x: head - MOTION.gap, z: 0, yaw, spin: s, show: true },
      umbraL: { x: head, z: 0, yaw, spin: s, show: true },
      umbraR: { x: head - 2 * MOTION.gap, z: 0, yaw, spin: s, show: true }
    },
    light: MOTION_LIGHT,
    set: 'tunnel',
    fog: [12, 34]
  };
}

function orbit(key, p) {
  const o = ORBIT[key];
  const phi = (-38 + 360 * p * (COUNTS[key] - 1) / COUNTS[key]) * Math.PI / 180;
  const [cx, cz] = o.centre;
  const cars = parked();
  Object.keys(cars).forEach(id => { cars[id].show = id === o.car; });
  return {
    cam: { pos: [cx + o.radius * Math.sin(phi), o.height, cz + o.radius * Math.cos(phi)], target: [cx, o.targetY, cz], lens: o.lens },
    cars,
    light: { beam: 0.2, led: 0.4, tail: 1, top: o.top, side: 1, amb: 1 },
    set: 'orbit',
    hero: o.car,
    fog: [16, 44]
  };
}

function leave(p) {
  const t = p;
  const dr = LEAVE.distance * t * t;
  const ts = Math.max(0, (t - LEAVE.delay) / (1 - LEAVE.delay));
  const ds = LEAVE.distance * 1.08 * ts * ts;
  const k = smooth(0, 1, t);
  return {
    cam: { pos: lerp3(LEAVE.camera, LEAVE.end, k), target: LEAVE.target, lens: LEAVE.lens },
    cars: {
      arc: { x: BASE.arc.x, z: BASE.arc.z + dr, yaw: 0, spin: dr, show: true },
      umbraL: { x: BASE.umbraL.x, z: BASE.umbraL.z + ds, yaw: 0, spin: ds, show: true },
      umbraR: { x: BASE.umbraR.x, z: BASE.umbraR.z + ds, yaw: 0, spin: ds, show: true }
    },
    light: {
      beam: 0.2 + 0.8 * smooth(0.1, 0.5, t),
      led: 0.4 + 0.6 * smooth(0.1, 0.5, t),
      tail: 1 + 0.8 * smooth(0.2, 0.7, t),
      top: [0.3, 0.22, 0.26].map(a => 0.04 + 0.96 * (1 - smooth(a, a + 0.55, t))),
      side: 1 - smooth(0.3, 0.85, t),
      amb: 0.12 + 0.88 * (1 - smooth(0.3, 0.85, t))
    },
    set: 'studio',
    fog: [14, 40]
  };
}

const CHAPTERS = { arrive, signature, motion, arc360: p => orbit('arc360', p), umbra360: p => orbit('umbra360', p), leave };

export function shot(id, p) {
  const fn = CHAPTERS[id] || arrive;
  return fn(clamp(p));
}

const STRIKE = [0, 1, 0.1, 0, 0.75, 0.2, 1, 0.85, 1];
const STRIKES = [2.12, 2.48, 2.76];
const FPS = 24;

function strike(frame, start) {
  const k = frame - start * FPS;
  if (k < 0) return 0;
  const i = Math.floor(k);
  if (i >= STRIKE.length - 1) return 1;
  return mix(STRIKE[i], STRIKE[i + 1], k - i);
}

export function introShot(time) {
  const frame = time * FPS;
  const n = 48;
  const t = clamp(frame / (n - 1));
  const road = 15 * (1 - t) ** 2.2;
  const delay = 0.12;
  const suvSpeed = (2.2 * 17) / ((n - 1) * (1 - delay));
  const suv = t > delay ? 17 * (1 - (t - delay) / (1 - delay)) ** 2.2 : 17 + (delay - t) * (n - 1) * suvSpeed;
  const a = smooth(0, 1, (frame - 3.02 * FPS) / 14);
  const d = smooth(0, 1, (frame - 2.12 * FPS) / 26);
  return {
    cam: hermite(KEYS, 0),
    cars: {
      arc: { x: BASE.arc.x, z: BASE.arc.z - road, yaw: 0, spin: -road, show: true },
      umbraL: { x: BASE.umbraL.x, z: BASE.umbraL.z - suv, yaw: 0, spin: -suv, show: true },
      umbraR: { x: BASE.umbraR.x, z: BASE.umbraR.z - suv, yaw: 0, spin: -suv, show: true }
    },
    light: {
      beam: mix(DARK.beam, LIT.beam, d),
      led: mix(DARK.led, LIT.led, d),
      tail: 1,
      top: STRIKES.map((start, i) => mix(DARK.top[i], LIT.top[i], strike(frame, start))),
      side: mix(DARK.side, LIT.side, a),
      amb: mix(DARK.amb, LIT.amb, a)
    },
    set: 'studio',
    fog: [18, 48]
  };
}

export const STRIKE_TIMES = STRIKES;
