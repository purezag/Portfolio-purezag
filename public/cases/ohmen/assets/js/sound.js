const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function noiseBuffer(ctx, seconds, brown) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    } else {
      data[i] = white;
    }
  }
  return buffer;
}

// A deep, soft electric drivetrain: low sine partials (each doubled and slightly detuned
// for body), rounded off by a low-pass, plus tyres as a low rumble chopped by the tread.
// It only plays when cars are moving on screen.
const PARTIALS = [[0.5, 0.14], [1, 0.5], [2, 0.26], [3, 0.11], [4, 0.04]];
const DETUNE = [-5, 5];

export class Soundscape {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.lastUi = 0;
  }

  build(context) {
    let ctx = context;
    if (!ctx) {
      const Context = window.AudioContext || window.webkitAudioContext;
      if (!Context) return false;
      ctx = new Context();
    }
    this.ctx = ctx;
    this.brown = noiseBuffer(ctx, 4, true);
    this.white = noiseBuffer(ctx, 1, false);
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -16;
    compressor.ratio.value = 3;
    compressor.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(compressor);
    return true;
  }

  start() {
    if (!this.ctx && !this.build()) return false;
    if (this.ctx.resume) this.ctx.resume();
    this.enabled = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(0.9, t, 0.3);
    return true;
  }

  stop() {
    if (!this.ctx) return;
    this.enabled = false;
    const t = this.ctx.currentTime;
    if (this.passVoice) this.passVoice.out.gain.setTargetAtTime(0, t, 0.05);
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(0, t, 0.2);
  }

  toggle() {
    if (this.enabled) this.stop();
    else this.start();
    return this.enabled;
  }

  pan(out) {
    const ctx = this.ctx;
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) out.connect(panner).connect(this.master);
    else out.connect(this.master);
    return panner;
  }

  // A motor + tyre voice whose speed is steered from outside (0 = rolling, 1 = flat out).
  drivetrain(dest, at = 0) {
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0;
    if (dest) out.connect(dest);
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.Q.value = 0.5;
    tone.frequency.value = 400;
    tone.connect(out);
    const oscs = [];
    PARTIALS.forEach(([ratio, level]) => {
      DETUNE.forEach(cents => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 50 * ratio;
        osc.detune.value = cents + (Math.random() - 0.5) * 2;
        const gain = ctx.createGain();
        gain.gain.value = level / DETUNE.length;
        osc.connect(gain).connect(tone);
        osc.start(at);
        oscs.push({ osc, ratio });
      });
    });
    const roll = ctx.createBufferSource();
    roll.buffer = this.brown;
    roll.loop = true;
    const body = ctx.createBiquadFilter();
    body.type = 'lowpass';
    body.frequency.value = 200;
    body.Q.value = 0.3;
    const tread = ctx.createGain();
    tread.gain.value = 0.65;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 10;
    const depth = ctx.createGain();
    depth.gain.value = 0.35;
    lfo.connect(depth).connect(tread.gain);
    const tyre = ctx.createGain();
    tyre.gain.value = 0;
    roll.connect(body).connect(tread).connect(tyre).connect(out);
    roll.start(at, Math.random() * 3);
    lfo.start(at);
    return { out, tone, oscs, tyre, body, lfo, roll };
  }

  steer(voice, speed, t, lag = 0.12) {
    const s = clamp(speed);
    const f = 55 + 125 * Math.pow(s, 0.9);
    voice.oscs.forEach(({ osc, ratio }) => osc.frequency.setTargetAtTime(f * ratio, t, lag));
    voice.tone.frequency.setTargetAtTime(320 + 760 * s, t, lag);
    voice.tyre.gain.setTargetAtTime(0.7 * Math.pow(s, 0.6), t, lag);
    voice.lfo.frequency.setTargetAtTime(7 + 34 * s, t, lag * 1.5);
    voice.body.frequency.setTargetAtTime(170 + 280 * s, t, lag * 1.5);
  }

  // One car rolling in, past or away, its speed moving from one value to another.
  voice(t, duration, from, to, level, pan = 0) {
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.value = 0.0001;
    out.gain.setValueAtTime(0.0001, t);
    const peak = from > to ? 0.3 : 0.65;
    out.gain.exponentialRampToValueAtTime(level, t + duration * peak);
    out.gain.exponentialRampToValueAtTime(level * 0.45, t + duration * 0.95);
    out.gain.exponentialRampToValueAtTime(0.0001, t + duration + 0.6);
    const panner = this.pan(out);
    if (panner) panner.pan.value = pan;
    const v = this.drivetrain(null, t);
    v.out.gain.value = 1;
    v.out.connect(out);
    this.steer(v, from, t, 0.01);
    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      const ease = from > to ? 1 - (1 - k) * (1 - k) : k * k;
      this.steer(v, from + (to - from) * ease, t + duration * k, duration / steps / 2);
    }
    const end = t + duration + 0.7;
    v.oscs.forEach(({ osc }) => osc.stop(end));
    v.lfo.stop(end);
    v.roll.stop(end);
    setTimeout(() => out.disconnect(), Math.max(0, (end - ctx.currentTime + 0.3) * 1000));
  }

  buildPass() {
    const out = this.ctx.createGain();
    out.gain.value = 0;
    const panner = this.pan(out);
    const v = this.drivetrain(out);
    v.out.gain.value = 1;
    this.passVoice = { out, panner, v };
  }

  // Cars moving on screen while the visitor scrolls (the pass-by and the departure).
  pass(level, pan = 0, speed = 0) {
    if (!this.ctx || !this.enabled) return;
    if (!this.passVoice) this.buildPass();
    const p = this.passVoice;
    const t = this.ctx.currentTime;
    p.out.gain.setTargetAtTime(clamp(level * 0.42, 0, 0.42), t, level > 0 ? 0.08 : 0.25);
    if (p.panner) p.panner.pan.setTargetAtTime(clamp(pan, -1, 1), t, 0.06);
    this.steer(p.v, clamp(speed), t, 0.12);
  }

  arrival(duration, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime + delay;
    this.voice(t, duration, 0.8, 0.04, 0.34, 0);
    this.voice(t + 0.2, duration + 0.15, 0.72, 0.03, 0.2, -0.55);
    this.voice(t + 0.26, duration + 0.2, 0.74, 0.03, 0.2, 0.55);
  }

  arrive(duration = 2.3, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    this.voice(this.ctx.currentTime + delay, duration, 0.78, 0.04, 0.34, 0);
  }

  depart(duration = 1.7, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    this.voice(this.ctx.currentTime + delay, duration, 0.08, 0.95, 0.34, 0);
  }

  // A contactor closing: the studio lights strike.
  clack(delay = 0, level = 1) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime + delay;
    this.burst(t, 0.22 * level, 1900, 0.04);
    this.thump(t, 92, 38, 0.4 * level, 0.45);
  }

  impact(delay = 0) {
    if (!this.ctx || !this.enabled) return;
    this.thump(this.ctx.currentTime + delay, 58, 31, 0.38, 2.4);
  }

  burst(t, level, cutoff, length) {
    const ctx = this.ctx;
    const click = ctx.createBufferSource();
    click.buffer = this.white;
    const high = ctx.createBiquadFilter();
    high.type = 'bandpass';
    high.frequency.value = cutoff;
    high.Q.value = 0.9;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setValueAtTime(level, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    click.connect(high).connect(gain).connect(this.master);
    click.start(t, Math.random() * 0.8);
    click.stop(t + length + 0.02);
  }

  thump(t, from, to, level, length) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + Math.min(length, 2));
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(level, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(gain).connect(this.master);
    osc.start(t);
    osc.stop(t + length + 0.05);
  }

  // Interface sounds: soft clicks and low thumps, no whine.
  ui(kind, delay = 0) {
    if (!this.ctx || !this.enabled) return;
    const now = performance.now();
    if (kind === 'hover' && now - this.lastUi < 90) return;
    this.lastUi = now;
    const t = this.ctx.currentTime + 0.005 + delay;
    switch (kind) {
      case 'hover':
        this.burst(t, 0.035, 2600, 0.008);
        break;
      case 'click':
        this.burst(t, 0.1, 2400, 0.012);
        this.thump(t, 120, 60, 0.12, 0.16);
        break;
      case 'select':
        this.burst(t, 0.08, 2800, 0.01);
        this.thump(t, 95, 70, 0.1, 0.2);
        break;
      case 'open':
        this.thump(t, 52, 88, 0.13, 0.5);
        break;
      case 'close':
        this.thump(t, 88, 50, 0.12, 0.45);
        break;
      case 'switch':
        this.thump(t, 48, 96, 0.12, 0.9);
        this.burst(t + 0.85, 0.08, 2600, 0.015);
        break;
      default:
        break;
    }
  }
}
