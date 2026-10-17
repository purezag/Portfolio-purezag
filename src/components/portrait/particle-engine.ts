import {
  DPR_CAP,
  containBottom,
  coord,
  drawReticle,
  observeTheme,
  observeVisibility,
  readInk,
  trackPointer,
  type Fit,
  type Pointer,
} from "./canvas-kit";

type Options = {
  image: HTMLImageElement;
  reveal: HTMLImageElement | null;
  reduced: boolean;
  isCovered: () => boolean;
};

const LEVELS = [0.22, 0.45, 0.7, 1];

export class ParticleEngine {
  private ctx: CanvasRenderingContext2D;
  private mask: HTMLCanvasElement = document.createElement("canvas");
  private maskCtx = this.mask.getContext("2d")!;
  private pointer: Pointer = { x: 0, y: 0, inside: false, lastMove: 0 };
  private width = 0;
  private height = 0;
  private dpr = 1;
  private step = 6;
  private fit: Fit = { x: 0, y: 0, w: 0, h: 0 };
  private count = 0;
  private hx = new Float32Array(0);
  private hy = new Float32Array(0);
  private px = new Float32Array(0);
  private py = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private lum = new Float32Array(0);
  private alpha = new Float32Array(0);
  private seed = new Float32Array(0);
  private level = new Uint8Array(0);
  private size = new Float32Array(0);
  private range = { low: 0, high: 1 };
  private dust: { x: number; y: number; s: number; v: number; p: number }[] = [];
  private ink = { fg: "#1c1d20", muted: "#66686e", mono: "monospace", dark: false };
  private reveal = 0;
  private focus = { x: 0, y: 0 };
  private intro = 0;
  private introStart = 0;
  private started = false;
  private last = 0;
  private follow = 0.03;
  private tracking = false;
  private wander = { x: 0, y: 0, heading: 0 };
  private visible = true;
  private frame = 0;
  private cleanups: (() => void)[] = [];

  constructor(
    private canvas: HTMLCanvasElement,
    private options: Options,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.ink = readInk(canvas);
    this.cleanups.push(
      trackPointer(canvas, this.pointer),
      observeTheme(() => {
        this.ink = readInk(canvas);
        this.paintLevels();
      }),
      observeVisibility(canvas, (visible) => {
        this.visible = visible;
        if (visible) this.loop();
      }),
    );
    const resize = new ResizeObserver(() => this.layout());
    resize.observe(canvas);
    this.cleanups.push(() => resize.disconnect());
    this.layout();
    this.loop();
  }

  setReveal(image: HTMLImageElement) {
    this.options.reveal = image;
  }

  start() {
    if (this.started) return;
    this.started = true;
    this.introStart = performance.now();
  }

  destroy() {
    cancelAnimationFrame(this.frame);
    this.cleanups.forEach((cleanup) => cleanup());
  }

  private layout() {
    const { canvas, options } = this;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    canvas.width = Math.round(width * this.dpr);
    canvas.height = Math.round(height * this.dpr);
    this.mask.width = canvas.width;
    this.mask.height = canvas.height;
    this.step = width < 520 ? 4.2 : width < 900 ? 5 : 5.6;
    this.fit = containBottom(width, height, options.image, 0.98);
    this.sample();
    if (!this.tracking) {
      this.wander.x = this.focus.x = this.fit.x + this.fit.w * 0.5;
      this.wander.y = this.focus.y = this.fit.y + this.fit.h * 0.36;
      this.wander.heading = Math.random() * Math.PI * 2;
    }
    this.dust = Array.from({ length: width < 520 ? 22 : 44 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      s: Math.random() * 1.4 + 0.6,
      v: Math.random() * 0.25 + 0.08,
      p: Math.random() * Math.PI * 2,
    }));
  }

  private sample() {
    const { fit, step, options } = this;
    const cols = Math.max(1, Math.floor(fit.w / step));
    const rows = Math.max(1, Math.floor(fit.h / step));
    const probe = document.createElement("canvas");
    probe.width = cols;
    probe.height = rows;
    const probeCtx = probe.getContext("2d", { willReadFrequently: true })!;
    probeCtx.drawImage(options.image, 0, 0, cols, rows);
    const data = probeCtx.getImageData(0, 0, cols, rows).data;

    const hx: number[] = [];
    const hy: number[] = [];
    const lum: number[] = [];
    const alpha: number[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 4;
        const a = data[i + 3]! / 255;
        if (a < 0.03 || Math.random() > Math.pow(a, 0.8)) continue;
        hx.push(fit.x + (col + 0.5) * (fit.w / cols));
        hy.push(fit.y + (row + 0.5) * (fit.h / rows));
        lum.push((0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!) / 255);
        alpha.push(0.35 + 0.65 * a);
      }
    }

    const count = hx.length;
    const previous = this.count;
    this.count = count;
    this.hx = Float32Array.from(hx);
    this.hy = Float32Array.from(hy);
    this.lum = Float32Array.from(lum);
    this.alpha = Float32Array.from(alpha);
    this.seed = Float32Array.from({ length: count }, () => Math.random());
    this.vx = new Float32Array(count);
    this.vy = new Float32Array(count);
    this.px = new Float32Array(count);
    this.py = new Float32Array(count);
    this.level = new Uint8Array(count);
    this.size = new Float32Array(count);

    const scatter = !this.started && !options.reduced && previous === 0;
    for (let i = 0; i < count; i++) {
      if (scatter) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.max(this.width, this.height) * (0.35 + Math.random() * 0.5);
        this.px[i] = this.width / 2 + Math.cos(angle) * distance;
        this.py[i] = this.height * 0.55 + Math.sin(angle) * distance;
      } else {
        this.px[i] = this.hx[i]!;
        this.py[i] = this.hy[i]!;
      }
    }
    const sorted = Array.from(this.lum).sort((a, b) => a - b);
    this.range = {
      low: sorted[Math.floor(count * 0.04)] ?? 0,
      high: sorted[Math.floor(count * 0.97)] ?? 1,
    };
    this.paintLevels();
  }

  private paintLevels() {
    const dark = this.ink.dark;
    const { low, high } = this.range;
    const span = Math.max(0.05, high - low);
    for (let i = 0; i < this.count; i++) {
      const l = Math.min(1, Math.max(0, (this.lum[i]! - low) / span));
      const a = this.alpha[i]!;
      const ink = (dark ? 0.1 + 0.9 * Math.pow(l, 1.1) : 0.14 + 0.86 * Math.pow(1 - l, 1.25)) * a;
      this.level[i] = Math.min(LEVELS.length - 1, Math.floor(ink * LEVELS.length));
      this.size[i] = this.step * (0.12 + 0.6 * ink);
    }
  }

  private loop = () => {
    cancelAnimationFrame(this.frame);
    if (!this.visible) return;
    this.frame = requestAnimationFrame(this.loop);
    if (this.options.isCovered()) return;
    this.tick(performance.now());
  };

  private tick(now: number) {
    const { ctx, dpr, width, height, options, pointer } = this;
    const time = now / 1000;
    const reduced = options.reduced;

    if (this.started) this.intro = Math.min(1, (now - this.introStart) / 2200);

    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    const target = this.steer(time, dt);
    const radius = Math.min(190, Math.max(96, Math.min(width, height) * 0.25));
    const active = this.started && (pointer.inside || (!reduced && this.intro > 0.55));
    this.reveal += ((active ? 1 : 0) - this.reveal) * 0.025;
    this.focus.x += (target.x - this.focus.x) * this.follow;
    this.focus.y += (target.y - this.focus.y) * this.follow;
    const fx = this.focus.x;
    const fy = this.focus.y;
    const force = this.reveal;
    const r2 = radius * radius;
    const wave = ((time * 0.16) % 1.4) - 0.2;
    const waveY = this.fit.y + this.fit.h * wave;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (force > 0.02 && options.reveal) this.drawReveal(fx, fy, radius * 1.05 * force);

    const paths = LEVELS.map(() => new Path2D());
    const { hx, hy, px, py, vx, vy, seed, size, level } = this;
    const intro = this.intro;

    for (let i = 0; i < this.count; i++) {
      const s = seed[i]!;
      const arrival = Math.min(1, Math.max(0, (intro - s * 0.45) / 0.55));
      const stiffness = reduced ? 1 : 0.012 + 0.05 * arrival * arrival;
      const drift = reduced ? 0 : 0.7 + s * 1.3;
      const band = reduced ? 0 : Math.exp(-Math.pow((hy[i]! - waveY) / 12, 2));
      const tx = hx[i]! + Math.sin(time * (0.8 + s) + s * 40) * drift + band * Math.sin(hy[i]! * 0.35 + time * 6) * 2.4;
      const ty = hy[i]! + Math.cos(time * (0.6 + s * 0.8) + s * 25) * drift;

      let ax = (tx - px[i]!) * stiffness;
      let ay = (ty - py[i]!) * stiffness;

      if (force > 0.02) {
        const dx = px[i]! - fx;
        const dy = py[i]! - fy;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const push = Math.pow(1 - d / radius, 2) * 6 * force;
          ax += (dx / d) * push;
          ay += (dy / d) * push;
        }
      }

      if (reduced && force <= 0.02) {
        px[i] = tx;
        py[i] = ty;
      } else {
        vx[i] = (vx[i]! + ax) * 0.8;
        vy[i] = (vy[i]! + ay) * 0.8;
        px[i] = px[i]! + vx[i]!;
        py[i] = py[i]! + vy[i]!;
      }

      const dot = size[i]! * (1 + band * 0.25);
      paths[level[i]!]!.rect(px[i]! - dot / 2, py[i]! - dot / 2, dot, dot);
    }

    ctx.fillStyle = this.ink.fg;
    LEVELS.forEach((alpha, index) => {
      ctx.globalAlpha = alpha * (0.35 + 0.65 * Math.min(1, intro * 1.6 + (reduced ? 1 : 0)));
      ctx.fill(paths[index]!);
    });

    ctx.globalAlpha = 0.32;
    for (const mote of this.dust) {
      if (!reduced) {
        mote.y -= mote.v;
        mote.x += Math.sin(time + mote.p) * 0.15;
        if (mote.y < -4) {
          mote.y = height + 4;
          mote.x = Math.random() * width;
        }
      }
      ctx.fillRect(mote.x, mote.y, mote.s, mote.s);
    }
    ctx.globalAlpha = 1;

    if (force > 0.05) {
      ctx.globalAlpha = force * 0.7;
      drawReticle(ctx, fx, fy, radius * force, this.ink.fg, this.ink.mono, `x:${coord(fx)} y:${coord(fy)}`);
      ctx.globalAlpha = 1;
    }
  }

  private steer(time: number, dt: number) {
    const { pointer, fit, wander } = this;
    if (pointer.inside) {
      if (!this.tracking) {
        this.tracking = true;
        this.follow = 0.01;
      }
      this.follow = Math.min(0.2, this.follow * 1.035 + 0.0006);
      return pointer;
    }

    if (this.tracking) {
      this.tracking = false;
      wander.x = this.focus.x;
      wander.y = this.focus.y;
      wander.heading = Math.random() * Math.PI * 2;
    }
    this.follow += (0.035 - this.follow) * 0.04;
    if (this.options.reduced) return wander;

    const cx = fit.x + fit.w * 0.5;
    const cy = fit.y + fit.h * 0.4;
    const rx = fit.w * 0.26;
    const ry = fit.h * 0.22;
    const nx = (wander.x - cx) / rx;
    const ny = (wander.y - cy) / ry;
    const reach = Math.sqrt(nx * nx + ny * ny);
    const home = Math.atan2(cy - wander.y, cx - wander.x);
    let turn = home - wander.heading;
    turn = Math.atan2(Math.sin(turn), Math.cos(turn));
    wander.heading += (Math.sin(time * 0.31 + 1.7) * 0.7 + Math.sin(time * 0.11) * 0.5) * dt;
    wander.heading += turn * dt * 1.6 * Math.min(1, Math.max(0, reach - 0.45));
    const speed = Math.min(this.width, this.height) * 0.055;
    wander.x += Math.cos(wander.heading) * speed * dt;
    wander.y += Math.sin(wander.heading) * speed * dt;
    return wander;
  }

  private drawReveal(x: number, y: number, radius: number) {
    const { maskCtx, mask, dpr, fit, options } = this;
    const image = options.reveal!;
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskCtx.globalCompositeOperation = "source-over";
    maskCtx.clearRect(0, 0, this.width, this.height);
    maskCtx.drawImage(image, fit.x, fit.y, fit.w, fit.h);
    maskCtx.globalCompositeOperation = "destination-in";
    const gradient = maskCtx.createRadialGradient(x, y, radius * 0.5, x, y, radius);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    maskCtx.fillStyle = gradient;
    maskCtx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.drawImage(mask, 0, 0);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
}
