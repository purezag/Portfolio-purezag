import {
  DPR_CAP,
  coverCenter,
  coord,
  drawReticle,
  observeTheme,
  observeVisibility,
  readInk,
  trackPointer,
  type Pointer,
} from "./canvas-kit";

type Options = {
  image: HTMLImageElement;
  reduced: boolean;
  isCovered: () => boolean;
};

export class PixelEngine {
  private ctx: CanvasRenderingContext2D;
  private source: HTMLCanvasElement = document.createElement("canvas");
  private pointer: Pointer = { x: 0, y: 0, inside: false, lastMove: 0 };
  private width = 0;
  private height = 0;
  private dpr = 1;
  private cell = 8;
  private count = 0;
  private hx = new Float32Array(0);
  private hy = new Float32Array(0);
  private ox = new Float32Array(0);
  private oy = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private sc = new Float32Array(0);
  private seed = new Float32Array(0);
  private moved = new Int32Array(0);
  private ink = { fg: "#1c1d20", muted: "#66686e", mono: "monospace", dark: false };
  private energy = 0;
  private presence = 0;
  private focus = { x: 0, y: 0 };
  private settled = false;
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
        this.settled = false;
      }),
      observeVisibility(canvas, (visible) => {
        this.visible = visible;
        if (visible) {
          this.settled = false;
          this.loop();
        }
      }),
    );
    const resize = new ResizeObserver(() => this.layout());
    resize.observe(canvas);
    this.cleanups.push(() => resize.disconnect());
    this.layout();
    this.loop();
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
    this.source.width = canvas.width;
    this.source.height = canvas.height;
    const fit = coverCenter(width, height, options.image);
    const sourceCtx = this.source.getContext("2d", { willReadFrequently: true })!;
    sourceCtx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    sourceCtx.drawImage(options.image, fit.x, fit.y, fit.w, fit.h);

    this.cell = width < 480 ? 9 : 8;
    const cols = Math.ceil(width / this.cell);
    const rows = Math.ceil(height / this.cell);
    const sw = this.source.width;
    const sh = this.source.height;
    const pixels = sourceCtx.getImageData(0, 0, sw, sh).data;
    const span = this.cell * this.dpr;
    const covered = (col: number, row: number) => {
      for (let iy = 0; iy < 4; iy++) {
        for (let ix = 0; ix < 4; ix++) {
          const x = Math.min(sw - 1, Math.floor(col * span + ((ix + 0.5) * span) / 4));
          const y = Math.min(sh - 1, Math.floor(row * span + ((iy + 0.5) * span) / 4));
          if (pixels[(y * sw + x) * 4 + 3]! > 0) return true;
        }
      }
      return false;
    };

    const hx: number[] = [];
    const hy: number[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!covered(col, row)) continue;
        hx.push(col * this.cell);
        hy.push(row * this.cell);
      }
    }
    this.count = hx.length;
    this.hx = Float32Array.from(hx);
    this.hy = Float32Array.from(hy);
    this.ox = new Float32Array(this.count);
    this.oy = new Float32Array(this.count);
    this.vx = new Float32Array(this.count);
    this.vy = new Float32Array(this.count);
    this.sc = new Float32Array(this.count).fill(1);
    this.seed = Float32Array.from({ length: this.count }, () => Math.random());
    this.settled = false;
  }

  private loop = () => {
    cancelAnimationFrame(this.frame);
    if (!this.visible) return;
    this.frame = requestAnimationFrame(this.loop);
    if (this.options.isCovered()) return;
    this.tick();
  };

  private tick() {
    const { ctx, dpr, width, pointer, cell, source } = this;
    const active = pointer.inside;
    if (!active && this.energy < 0.02 && this.presence < 0.02) {
      if (this.settled) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.drawImage(source, 0, 0);
      this.settled = true;
      return;
    }
    this.settled = false;

    const radius = Math.min(170, Math.max(90, width * 0.26));
    const r2 = radius * radius;
    this.presence += ((active ? 1 : 0) - this.presence) * 0.12;
    const snap = this.presence < 0.05 ? 1 : 0.3;
    this.focus.x += (pointer.x - this.focus.x) * snap;
    this.focus.y += (pointer.y - this.focus.y) * snap;
    const fx = this.focus.x;
    const fy = this.focus.y;
    const force = this.presence;
    const half = cell / 2;
    let energy = 0;

    const { hx, hy, ox, oy, vx, vy, sc, seed } = this;
    if (this.moved.length < this.count) this.moved = new Int32Array(this.count);
    let movedCount = 0;
    for (let i = 0; i < this.count; i++) {
      const cx = hx[i]! + half;
      const cy = hy[i]! + half;
      let ax = -ox[i]! * 0.07;
      let ay = -oy[i]! * 0.07;
      let shrink = 1;

      if (force > 0.02) {
        const dx = cx + ox[i]! - fx;
        const dy = cy + oy[i]! - fy;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const falloff = 1 - d / radius;
          const push = falloff * falloff * 3.2 * force;
          const swirl = falloff * 1.4 * force * (seed[i]! - 0.3);
          ax += (dx / d) * push - (dy / d) * swirl;
          ay += (dy / d) * push + (dx / d) * swirl;
          shrink = 1 - falloff * 0.6 * force;
        }
      }

      vx[i] = (vx[i]! + ax) * 0.82;
      vy[i] = (vy[i]! + ay) * 0.82;
      ox[i] = ox[i]! + vx[i]!;
      oy[i] = oy[i]! + vy[i]!;
      sc[i] = sc[i]! + (shrink - sc[i]!) * 0.2;
      energy += Math.abs(ox[i]!) + Math.abs(oy[i]!) + (1 - sc[i]!) * 10;

      if (Math.abs(ox[i]!) + Math.abs(oy[i]!) > 0.15 || sc[i]! < 0.985) this.moved[movedCount++] = i;
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(source, 0, 0);
    const span = cell * dpr;
    for (let k = 0; k < movedCount; k++) {
      const i = this.moved[k]!;
      ctx.clearRect(Math.floor(hx[i]! * dpr), Math.floor(hy[i]! * dpr), Math.ceil(span), Math.ceil(span));
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let k = 0; k < movedCount; k++) {
      const i = this.moved[k]!;
      const size = cell * sc[i]!;
      const x = Math.round((hx[i]! + half + ox[i]! - size / 2) * dpr) / dpr;
      const y = Math.round((hy[i]! + half + oy[i]! - size / 2) * dpr) / dpr;
      ctx.drawImage(source, hx[i]! * dpr, hy[i]! * dpr, span, span, x, y, size, size);
    }

    this.energy = energy / Math.max(1, this.count);

    if (force > 0.05) {
      ctx.globalAlpha = force;
      drawReticle(ctx, fx, fy, radius * 0.5, this.ink.fg, this.ink.mono, `x:${coord(fx)} y:${coord(fy)}`);
      ctx.globalAlpha = 1;
    }
  }
}
