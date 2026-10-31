import { Soundscape } from './sound.js';
import { Configurator, MODELS, lookOf } from './configurator.js';
import { I18n } from './i18n.js';
import { COUNTS } from './choreo.js';

const { gsap, ScrollTrigger, Lenis } = window;
gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const pad = (n, size) => String(n).padStart(size, '0');

const INTRO = { arrival: 2.0, lights: [2.12, 2.48, 2.76, 3.02], title: 3.05, fallback: 0.6 };
const HOLD = { arrive: 0.9 };
const MOTION = { lead: -1.6, gap: 5.6, travel: 14.1 };
const ORBIT = { start: -38 };

const sound = new Soundscape();
const i18n = new I18n();
const state = {
  film: null,
  lenis: null,
  entered: false,
  unlocked: false,
  menuOpen: false,
  menuBusy: false,
  pendingClose: null,
  dialog: null,
  chapters: [],
  active: null,
  interlude: false,
  direction: 1
};

const STILLS = {
  arrive: 'assets/film/poster.jpg',
  signature: 'assets/media/notes-light.jpg',
  motion: 'assets/media/notes-motion.jpg',
  arc360: 'assets/media/config-arc.jpg',
  umbra360: 'assets/media/config-umbra.jpg',
  leave: 'assets/film/poster.jpg'
};

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
root.classList.add('is-locked');
if (reduced) root.classList.add('no-motion');

function splitWords(el) {
  const label = el.textContent.replace(/\s+/g, ' ').trim();
  const words = [];
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.append(' ');
            return;
          }
          const word = document.createElement('span');
          word.className = 'w';
          word.setAttribute('aria-hidden', 'true');
          word.textContent = part;
          fragment.append(word);
          words.push(word);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  el.setAttribute('aria-label', label);
  return words;
}

function splitChars(el) {
  const chars = [];
  splitWords(el).forEach(word => {
    const value = word.textContent;
    word.textContent = '';
    [...value].forEach(letter => {
      const char = document.createElement('span');
      char.className = 'c';
      char.textContent = letter;
      word.append(char);
      chars.push(char);
    });
  });
  return chars;
}

function splitLines(el) {
  const words = splitWords(el);
  const rows = [];
  let top = null;
  words.forEach(word => {
    if (word.offsetTop !== top) {
      top = word.offsetTop;
      rows.push([]);
    }
    rows[rows.length - 1].push(word);
  });
  el.textContent = '';
  return rows.map(row => {
    const line = document.createElement('span');
    line.className = 'ln';
    line.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    row.forEach((word, i) => {
      inner.append(word);
      if (i < row.length - 1) inner.append(' ');
    });
    line.append(inner);
    el.append(line);
    return inner;
  });
}

function prepareButtons() {
  $$('[data-roll]').forEach(label => {
    const value = label.textContent.trim();
    label.parentElement.setAttribute('aria-label', value);
    label.textContent = '';
    [...value].forEach((letter, i) => {
      const char = document.createElement('span');
      char.className = 'btn__char';
      char.style.setProperty('--i', i);
      char.setAttribute('aria-hidden', 'true');
      const face = document.createElement('span');
      face.textContent = letter === ' ' ? '\u00a0' : letter;
      char.append(face, face.cloneNode(true));
      label.append(char);
    });
  });
}

const text = {};

function prepareText() {
  text.loader = splitWords($('[data-loader-line]'));
  text.title = splitChars($('[data-hero-title]'));
  text.sub = splitLines($('[data-hero-sub]'));
  text.claim = splitChars($('[data-claim]'));
  text.finale = splitChars($('[data-finale-title]'));
  text.openers = $$('[data-fit-one]').map(el => splitChars(el));
  text.manifesto = splitLines($('[data-lines-title]'));
  text.statement = $$('[data-statement] .ln:not([data-scrub]) > span');
  text.scrub = $$('[data-scrub] > span').flatMap(line => splitChars(line));
  const statement = $('[data-statement]');
  statement.setAttribute('aria-label', statement.textContent.replace(/\s+/g, ' ').trim());
  text.flares = $$('[data-flare]').map(el => splitChars(el));
  text.notesTitle = splitChars($('[data-notes-title]'));
  prepareButtons();
}

function fit(el) {
  el.classList.remove('is-stacked', 'is-wrapped');
  const lines = $$('.fl', el);
  const targets = lines.length ? lines : [el];
  const measure = items => {
    const range = document.createRange();
    let widest = 1;
    items.forEach(item => {
      range.selectNodeContents(item);
      widest = Math.max(widest, range.getBoundingClientRect().width);
    });
    return widest;
  };
  el.classList.add('is-measuring');
  el.style.fontSize = '100px';
  const widest = measure(targets);
  el.classList.remove('is-measuring');
  const width = el.getBoundingClientRect().width;
  const byWidth = (100 * width) / widest * 0.98;
  const byHeight = window.innerHeight * Number(el.dataset.fitH || 0.15);
  const cap = Number(el.dataset.fitMax || 180);
  const min = Number(el.dataset.fitMin || 0);
  let size = Math.min(cap, byHeight, byWidth);
  if (min && byWidth < min) {
    if (el.dataset.fitMode === 'wrap') {
      el.classList.add('is-wrapped');
      size = min;
    } else {
      el.classList.add('is-stacked', 'is-measuring');
      const word = measure($$('.w', el));
      el.classList.remove('is-measuring');
      size = Math.min(cap, byHeight, (100 * width) / word * 0.98);
    }
  }
  el.style.fontSize = `${Math.max(16, size).toFixed(2)}px`;
}

function fitAll() {
  $$('[data-fit], [data-fit-one], [data-fit-solo]').forEach(fit);
  reserveLoaderLine();
}

// The loader sentence wraps differently in each language; reserve the taller of the two
// so the mark above it never moves when the language changes.
function reserveLoaderLine() {
  const line = $('[data-loader-line]');
  const snap = line && i18n.snaps.find(item => item.el === line);
  if (!snap || !line.parentElement) return;
  const style = getComputedStyle(line);
  const host = line.parentElement;
  const limit = parseFloat(style.maxWidth);
  const width = Math.min(Number.isFinite(limit) ? limit : Infinity, host.clientWidth || window.innerWidth);
  const probe = document.createElement('p');
  probe.className = line.className;
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;width:${width}px;max-width:none;margin:0;`;
  host.append(probe);
  let tallest = 0;
  ['en', 'pt'].forEach(lang => {
    probe.innerHTML = snap[lang];
    tallest = Math.max(tallest, probe.getBoundingClientRect().height);
  });
  probe.remove();
  line.style.minHeight = `${Math.ceil(tallest)}px`;
}

function hideForIntro() {
  gsap.set(text.claim, { opacity: 0, '--wd': '60%' });
  gsap.set(text.finale, { opacity: 0, '--wd': '50%' });
  gsap.set('[data-caption]', { autoAlpha: 0, '--tube': 0 });
  gsap.set('[data-shade]', { opacity: 0 });
  gsap.set('[data-opener]', { autoAlpha: 0 });
  text.openers.forEach(chars => gsap.set(chars, { opacity: 0, '--wd': '60%' }));
  gsap.set('[data-note]', { autoAlpha: 0, y: 30 });
  gsap.set('[data-pass]', { autoAlpha: 0 });
  gsap.set('[data-meter-db]', { autoAlpha: 0, y: 20 });
  gsap.set('.model', { autoAlpha: 0 });
  gsap.set('.tag', { autoAlpha: 0, x: 24 });
  gsap.set('[data-finale-item]', { autoAlpha: 0, y: 24 });
  gsap.set('[data-finale-kicker]', { autoAlpha: 0 });
  gsap.set('[data-hud]', { autoAlpha: 0 });
  if (reduced) return;
  gsap.set(text.loader, { opacity: 0 });
  gsap.set(text.title, { opacity: 0, '--wd': '50%' });
  gsap.set(text.sub, { yPercent: 110 });
  gsap.set(['[data-hero-meta] > *', '[data-hero-kicker]'], { opacity: 0 });
  gsap.set(text.manifesto, { yPercent: 110 });
  gsap.set(text.statement, { yPercent: 110 });
  gsap.set('[data-reveal]', { opacity: 0, y: 28 });
}

const loader = {
  el: $('[data-loader]'),
  count: $('[data-count]'),
  tubes: $$('[data-rig] i'),
  shown: { value: 0 },
  lit: 0,
  parts: { engine: 0, models: 0 }
};

function flicker(el, on = true) {
  const tl = gsap.timeline();
  [1, 0, 1, 0, 0, 1].forEach((v, i) => tl.call(() => el.classList.toggle('is-on', on ? !!v : !v), null, i * 0.045 + Math.random() * 0.03));
  return tl;
}

function reportProgress() {
  const target = loader.parts.engine * 0.12 + loader.parts.models * 0.88;
  gsap.to(loader.shown, {
    value: target,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: true,
    onUpdate: () => {
      const v = loader.shown.value;
      loader.count.textContent = `${Math.round(v * 100)}%`;
      const lit = Math.min(loader.tubes.length, Math.floor(v * loader.tubes.length + 0.0001));
      while (loader.lit < lit) {
        flicker(loader.tubes[loader.lit]);
        loader.lit += 1;
      }
    }
  });
}

async function importStage() {
  try {
    return await import('./stage.js');
  } catch (error) {
    return import('./stage-cdn.js');
  }
}

function webgl2() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch (error) {
    return false;
  }
}

async function loadFilm() {
  if (!webgl2()) throw new Error('WebGL 2 unavailable');
  const { Stage } = await importStage();
  loader.parts.engine = 1;
  reportProgress();
  const forced = new URLSearchParams(window.location.search).get('garage');
  const stage = new Stage($('[data-canvas]'), {
    sound,
    reduced,
    quality: forced === 'low' || forced === 'high' ? forced : undefined
  });
  const looks = { arc: lookOf(MODELS[0].defaults), umbra: lookOf(MODELS[1].defaults) };
  await stage.loadFilm(MODELS, looks, p => {
    loader.parts.models = p;
    reportProgress();
  });
  state.film = stage;
  window.__ohmenStage = stage;
}

function revealGate() {
  const gate = $('[data-gate]');
  gsap.timeline()
    .to('[data-meter]', { opacity: 0, y: 8, duration: 0.6, ease: 'power2.inOut' })
    .set(gate, { visibility: 'visible' })
    .fromTo(gate, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' });
  $$('[data-enter]').forEach(button => {
    button.addEventListener('click', () => enter(button.dataset.enter === 'sound'), { once: true });
  });
}

function setSoundButton(on) {
  $('[data-sound]').setAttribute('aria-pressed', String(on));
  $$('[data-listen]').forEach(button => button.setAttribute('aria-pressed', String(on)));
}

function showFilm() {
  if (!state.film) return;
  root.classList.add('is-film');
  state.film.resize();
  state.film.start();
}

function enter(withSound) {
  if (state.entered) return;
  state.entered = true;
  const canPlay = !!(state.film && !reduced);
  if (withSound && sound.start()) setSoundButton(true);
  let playing = Promise.resolve(false);
  showFilm();
  if (canPlay) {
    playing = state.film.playIntro();
    sound.arrival(INTRO.arrival, 0.05);
    INTRO.lights.forEach((t, i) => sound.clack(t, i === 3 ? 0.6 : 1));
  } else if (state.film) {
    state.film.setChapter('arrive', 0);
  }
  const tTitle = canPlay ? INTRO.title : INTRO.fallback;
  gsap.timeline()
    .to(text.loader, { opacity: 0, duration: 0.5, stagger: 0.012, ease: 'power2.in' }, 0)
    .to(['[data-gate]', '.loader__mark', '[data-rig]'], { autoAlpha: 0, y: -10, duration: 0.5, ease: 'power2.in' }, 0)
    .to(loader.el, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => { loader.el.style.display = 'none'; } }, 0.25)
    .fromTo('[data-bar]', { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out' }, tTitle - 0.2)
    .to('[data-hud]', { autoAlpha: 1, duration: 1.2, ease: 'power2.out' }, tTitle + 0.2)
    .to('[data-hero-kicker]', { opacity: 1, duration: 1, ease: 'power2.out' }, tTitle - 0.1)
    .to(text.title, { opacity: 1, '--wd': '150%', duration: 1.6, stagger: { each: 0.045, from: 'center' }, ease: 'expo.out' }, tTitle)
    .add(() => sound.impact(), tTitle)
    .to(text.sub, { yPercent: 0, duration: 1.3, stagger: 0.1, ease: 'expo.out' }, tTitle + 0.5)
    .to('[data-hero-meta] > *', { opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out' }, tTitle + 0.8);
  if (reduced) gsap.set(text.title, { opacity: 1, '--wd': '150%' });
  Promise.race([playing, new Promise(resolve => setTimeout(resolve, 7000))]).then(() => unlock());
}

function unlock() {
  if (state.unlocked) return;
  state.unlocked = true;
  root.classList.remove('is-locked');
  if (state.lenis) state.lenis.start();
  buildScroll();
  ScrollTrigger.refresh();
  if (state.pendingLang && state.pendingLang !== i18n.lang) {
    const lang = state.pendingLang;
    state.pendingLang = null;
    switchLanguage(lang);
  }
}

function scrollToTarget(target) {
  let el = typeof target === 'string' ? $(target) : target;
  if (el === null || el === undefined) return;
  if (el instanceof Element && el.id === 'arrival') el = 0;
  const offset = el instanceof Element && el.matches('[data-chapter]') ? 1 : 0;
  const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + offset;
  const far = Math.abs(top - window.scrollY) > window.innerHeight * 1.6;
  if (!state.lenis) {
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    return;
  }
  if (!far) {
    state.lenis.scrollTo(top, { duration: 1.6, easing: t => 1 - Math.pow(1 - t, 4) });
    return;
  }
  const cut = $('[data-cut]');
  gsap.timeline()
    .to(cut, { opacity: 1, duration: 0.4, ease: 'power2.in' })
    .add(() => {
      state.lenis.scrollTo(top, { immediate: true, force: true });
      ScrollTrigger.update();
    })
    .to(cut, { opacity: 0, duration: 0.8, ease: 'power2.out' }, '+=0.25');
}

function scrubbed(section) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: true }
  });
}

function appear(tl, targets, start, end, from = { y: 24 }, to = { y: 0 }, exit = { y: -18 }) {
  tl.fromTo(targets, { autoAlpha: 0, ...from }, { autoAlpha: 1, ...to, duration: 0.04, immediateRender: false }, start);
  if (end !== null && end !== undefined) tl.to(targets, { autoAlpha: 0, ...exit, duration: 0.035 }, end);
}

function frameProgress(chapter, p) {
  if (reduced) return 0.5;
  const hold = HOLD[chapter.id] || 1;
  return clamp(p / hold);
}

function showStill(chapter) {
  const poster = $('[data-poster]');
  const src = STILLS[chapter.id];
  if (poster && src && !poster.src.endsWith(src)) poster.src = src;
}

function activate(chapter) {
  if (!state.film) {
    state.active = chapter;
    showStill(chapter);
    hud.rail.forEach((button, i) => button.classList.toggle('is-active', i === chapter.index));
    $$('.menu__list a').forEach((link, i) => link.setAttribute('aria-current', String(i === chapter.index)));
    return;
  }
  state.active = chapter;
  state.interlude = false;
  state.film.setChapter(chapter.id, frameProgress(chapter, chapter.progress));
  state.film.setProgress(frameProgress(chapter, chapter.progress));
  hud.rail.forEach((button, i) => button.classList.toggle('is-active', i === chapter.index));
  $$('.menu__list a').forEach((link, i) => link.setAttribute('aria-current', String(i === chapter.index)));
}

function buildChapters() {
  const sections = $$('[data-chapter]');
  state.chapters = sections.map((el, index) => ({ el, index, id: el.dataset.chapter, name: el.dataset.name, progress: 0 }));
  state.chapters.forEach(chapter => {
    ScrollTrigger.create({
      trigger: chapter.el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        chapter.progress = self.progress;
        state.direction = self.direction || state.direction;
        if (state.active === chapter && state.film) state.film.setProgress(frameProgress(chapter, self.progress));
        const button = hud.rail[chapter.index];
        if (button) button.style.setProperty('--p', self.progress.toFixed(4));
      }
    });
    ScrollTrigger.create({
      trigger: chapter.el,
      start: 'top center',
      end: 'bottom center',
      onToggle: self => {
        if (self.isActive) activate(chapter);
      }
    });
  });
  $$('[data-interlude]').forEach(el => {
    const before = state.chapters.find(c => c.el === el.previousElementSibling);
    const after = state.chapters.find(c => c.el === el.nextElementSibling);
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onToggle: self => {
        if (!self.isActive || !state.film) return;
        state.interlude = true;
        const target = self.direction > 0 ? after : before;
        if (target) {
          target.progress = self.direction > 0 ? 0 : 1;
          state.film.setChapter(target.id, frameProgress(target, target.progress));
        }
      }
    });
  });
  const dip = $('[data-dip]');
  state.chapters.forEach(chapter => {
    const next = chapter.el.nextElementSibling;
    if (!next || !next.matches('[data-chapter]')) return;
    gsap.timeline({ scrollTrigger: { trigger: next, start: 'top 82%', end: 'top 18%', scrub: true } })
      .fromTo(dip, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power1.in', immediateRender: false })
      .fromTo(dip, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: 'power1.out', immediateRender: false });
  });
}

function caption(tl, el, start, end) {
  tl.fromTo(el, { autoAlpha: 0, y: 24, '--tube': 0 }, { autoAlpha: 1, y: 0, '--tube': 1, duration: 0.035, immediateRender: false }, start)
    .to(el, { autoAlpha: 0, y: -18, duration: 0.03 }, end);
}

function buildArrival() {
  const section = $('#arrival');
  const tl = scrubbed(section);
  tl.to(text.title, { opacity: 0, '--wd': '60%', duration: 0.05, stagger: { each: 0.002, from: 'edges' } }, 0)
    .to(['[data-hero-sub]', '[data-hero-meta]', '[data-hero-kicker]'], { opacity: 0, y: -18, duration: 0.04 }, 0);
  const captions = $$('[data-caption]', section);
  caption(tl, captions[0], 0.15, 0.26);
  caption(tl, captions[1], 0.31, 0.42);
  caption(tl, captions[2], 0.55, 0.66);
  tl.fromTo($('[data-shade]', section), { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, 0.72)
    .to(text.claim, { opacity: 1, '--wd': '150%', duration: 0.06, stagger: { each: 0.0025, from: 'center' } }, 0.74)
    .set({}, {}, 1);
}

function entry(section) {
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: section, start: 'top 72%', end: 'top 4%', scrub: true }
  });
}

function buildOpener(tl, section, chars, end) {
  const opener = $('[data-opener]', section);
  const kicker = $('.kicker', opener);
  entry(section)
    .fromTo(opener, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, 0)
    .fromTo(kicker, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, immediateRender: false }, 0)
    .fromTo(chars, { opacity: 0, '--wd': '60%' }, { opacity: 1, '--wd': '150%', duration: 0.6, stagger: { each: 0.03, from: 'start' }, immediateRender: false }, 0.2);
  tl.to(chars, { opacity: 0, '--wd': '60%', duration: 0.04, stagger: { each: 0.002, from: 'end' } }, end)
    .to(kicker, { opacity: 0, duration: 0.03 }, end)
    .to(opener, { autoAlpha: 0, duration: 0.01 }, end + 0.05);
}

function buildSignature() {
  const section = $('#signature');
  const tl = scrubbed(section);
  buildOpener(tl, section, text.openers[0], 0.28);
  tl.fromTo($('[data-strip] i', section), { scaleX: 0 }, { scaleX: 1, duration: 0.86, ease: 'power1.inOut', immediateRender: false }, 0.05)
    .fromTo($('[data-strip] i', section), { opacity: 0 }, { opacity: 1, duration: 0.02, immediateRender: false }, 0.05);
  appear(tl, $('[data-note]', section), 0.36, 0.93, { y: 30 });
  tl.set({}, {}, 1);
}

function buildMotion() {
  const section = $('#motion');
  const tl = scrubbed(section);
  buildOpener(tl, section, text.openers[1], 0.2);
  $$('[data-pass]', section).forEach((el, k) => {
    const centre = (-MOTION.lead + k * MOTION.gap) / MOTION.travel;
    const start = clamp(centre - 0.1, 0.006, 1);
    const end = centre + 0.1;
    tl.fromTo(el, { autoAlpha: 0, x: -60 }, { autoAlpha: 1, x: 0, duration: 0.05, ease: 'power2.out', immediateRender: false }, start);
    if (end < 0.98) tl.to(el, { autoAlpha: 0, x: 60, duration: 0.05, ease: 'power2.in' }, end);
  });
  const meter = $('[data-meter-db]', section);
  const value = $('[data-db]', meter);
  const counter = { v: 74 };
  appear(tl, meter, 0.28, 0.95, { y: 20 });
  tl.fromTo(counter, { v: 74 }, { v: 58, duration: 0.12, ease: 'power2.out', immediateRender: false, onUpdate: () => { value.textContent = Math.round(counter.v); } }, 0.29);
  tl.set({}, {}, 1);
  let last = { p: 0, t: performance.now() };
  let idle = 0;
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
      if (!sound.enabled) return;
      const now = performance.now();
      const speed = clamp(Math.abs(self.progress - last.p) / Math.max(16, now - last.t) * 900);
      last = { p: self.progress, t: now };
      let nearest = Infinity;
      for (let k = 0; k < 3; k++) {
        const x = MOTION.lead - k * MOTION.gap + MOTION.travel * self.progress;
        if (Math.abs(x) < Math.abs(nearest)) nearest = x;
      }
      const near = Math.exp(-(nearest * nearest) / 9);
      const engine = clamp(0.42 + 0.38 * speed + (nearest < 0 ? 0.06 : -0.06));
      sound.pass(near * (0.25 + speed), nearest / 5, engine);
      clearTimeout(idle);
      idle = setTimeout(() => sound.pass(0, nearest / 5, engine), 180);
    },
    onLeave: () => sound.pass(0),
    onLeaveBack: () => sound.pass(0)
  });
}

function buildModel(section, flare) {
  const tl = scrubbed(section);
  const model = $('.model', section);
  entry(section)
    .fromTo(model, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, 0)
    .fromTo($('.kicker', model), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, immediateRender: false }, 0)
    .fromTo(flare, { opacity: 0.06 }, { opacity: 1, duration: 0.4, stagger: 0.08, immediateRender: false }, 0.15)
    .fromTo([$('.model__text', model), $('.model__foot', model)], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, immediateRender: false }, 0.4);
  tl.to(model, { autoAlpha: 0, duration: 0.03 }, 0.97);
  $$('[data-at]', section).forEach(tag => {
    const at = Number(tag.dataset.at);
    tl.fromTo(tag, { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.035, immediateRender: false }, at)
      .to(tag, { autoAlpha: 0, x: -16, duration: 0.03 }, at + 0.17);
  });
  tl.set({}, {}, 1);
  const deg = $('[data-deg]', section);
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
      const value = ((ORBIT.start + 360 * self.progress) % 360 + 360) % 360;
      deg.textContent = pad(Math.round(value), 3);
    }
  });
}

function buildDeparture() {
  const section = $('#departure');
  const tl = scrubbed(section);
  entry(section).fromTo('[data-finale-kicker]', { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 1, immediateRender: false }, 0);
  tl.to('[data-finale-kicker]', { autoAlpha: 0, duration: 0.04 }, 0.3)
    .fromTo($('[data-shade]', section), { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, 0.4)
    .to(text.finale, { opacity: 1, '--wd': '150%', duration: 0.08, stagger: { each: 0.003, from: 'center' } }, 0.46)
    .fromTo('[data-finale-item]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.02, immediateRender: false }, 0.5)
    .set({}, {}, 1);
  // The cars pull away as the visitor scrolls: the motor rises while they recede.
  let last = { p: 0, t: performance.now() };
  let idle = 0;
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: self => {
      if (!sound.enabled) return;
      const now = performance.now();
      const rate = clamp(Math.abs(self.progress - last.p) / Math.max(16, now - last.t) * 900);
      last = { p: self.progress, t: now };
      const p = self.progress;
      const moving = p > 0.015 ? 1 : 0;
      const away = 1 - clamp((p - 0.45) / 0.55);
      const engine = clamp(0.18 + 0.62 * p + 0.15 * rate);
      sound.pass(moving * (0.2 + rate) * (0.25 + 0.75 * away), 0, engine);
      clearTimeout(idle);
      idle = setTimeout(() => sound.pass(0, 0, engine), 180);
    },
    onLeave: () => sound.pass(0),
    onLeaveBack: () => sound.pass(0)
  });
}

function buildInterludes() {
  gsap.to(text.manifesto, {
    yPercent: 0,
    duration: 1.3,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '[data-lines-title]', start: 'top 78%' }
  });
  const title = $('[data-statement]');
  gsap.to(text.statement, {
    yPercent: 0,
    duration: 1.3,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: title, start: 'top 75%' }
  });
  const chars = text.scrub;
  let current = -1;
  ScrollTrigger.create({
    trigger: title,
    start: 'top 62%',
    end: 'bottom 30%',
    onUpdate: self => {
      const index = Math.round(self.progress * chars.length);
      if (index === current) return;
      current = index;
      chars.forEach((char, i) => {
        char.classList.toggle('on', i < index);
        char.classList.toggle('hot', i === index);
      });
    }
  });
  if (!reduced) {
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', overwrite: true })
    });
  }
}

function buildFooter() {
  ScrollTrigger.create({
    trigger: '.foot',
    start: 'top 85%',
    onEnter: () => {
      state.hudHidden = true;
      gsap.to('[data-hud]', { autoAlpha: 0, duration: 0.5, overwrite: true });
    },
    onLeaveBack: () => {
      state.hudHidden = false;
      gsap.to('[data-hud]', { autoAlpha: 1, duration: 0.5, overwrite: true });
    }
  });
}

function buildScroll() {
  buildFooter();
  buildChapters();
  buildArrival();
  buildSignature();
  buildMotion();
  buildModel($('#arc'), text.flares[0]);
  buildModel($('#umbra'), text.flares[1]);
  buildDeparture();
  buildInterludes();
  if (!state.hudTicking) {
    state.hudTicking = true;
    gsap.ticker.add(updateHud);
  }
}

function teardownScroll() {
  ScrollTrigger.getAll().forEach(trigger => {
    const animation = trigger.animation;
    trigger.kill();
    if (animation) animation.kill();
  });
}

function showHero() {
  gsap.set(text.title, { opacity: 1, '--wd': '150%' });
  gsap.set(text.sub, { yPercent: 0 });
  gsap.set(['[data-hero-meta] > *', '[data-hero-kicker]'], { opacity: 1 });
  gsap.set('[data-hud]', { autoAlpha: state.hudHidden || state.menuOpen ? 0 : 1 });
}

function revealPassed() {
  const below = el => el.getBoundingClientRect().top > window.innerHeight * 0.92;
  const manifesto = $('[data-lines-title]');
  if (manifesto && !below(manifesto)) gsap.set(text.manifesto, { yPercent: 0 });
  const statement = $('[data-statement]');
  if (statement && !below(statement)) gsap.set(text.statement, { yPercent: 0 });
  $$('[data-reveal]').forEach(el => {
    if (!below(el)) gsap.set(el, { opacity: 1, y: 0 });
  });
}

function applyLanguage(lang) {
  const y = state.lenis ? state.lenis.scroll : window.scrollY;
  if (state.unlocked) teardownScroll();
  i18n.apply(lang);
  prepareText();
  fitAll();
  hideForIntro();
  hud.lastKey = '';
  if (garage) garage.setLanguage(i18n);
  if (!state.unlocked) {
    gsap.set(text.loader, { opacity: 1 });
    return;
  }
  showHero();
  buildScroll();
  ScrollTrigger.refresh();
  if (state.lenis) state.lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
  ScrollTrigger.update();
  revealPassed();
  if (state.active && state.film) activate(state.chapters.find(c => c.id === state.active.id) || state.chapters[0]);
}

function markToggles(lang) {
  $$('[data-lang-toggle]').forEach(button => {
    button.dataset.lang = lang;
    $$('[data-l]', button).forEach(label => label.classList.toggle('is-on', label.dataset.l === lang));
  });
}

function switchLanguage(lang) {
  if (lang === i18n.lang || state.switching) return;
  if (state.entered && !state.unlocked) {
    state.pendingLang = lang;
    markToggles(lang);
    return;
  }
  const run = () => applyLanguage(lang);
  sound.ui('switch');
  if (!document.startViewTransition || reduced) {
    run();
    return;
  }
  state.switching = true;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const radius = Math.hypot(w / 2, h);
  root.dataset.transition = 'circle';
  let ring = null;
  let transition;
  try {
    transition = document.startViewTransition(() => {
      run();
      ring = document.createElement('div');
      ring.className = 'vt-ring';
      ring.style.width = `${radius * 2}px`;
      ring.style.height = `${radius * 2}px`;
      document.body.append(ring);
    });
  } catch (error) {
    state.switching = false;
    delete root.dataset.transition;
    run();
    return;
  }
  transition.ready.then(() => {
    const timing = { duration: 950, easing: 'cubic-bezier(0.76, 0, 0.24, 1)' };
    root.animate({ clipPath: ['circle(0px at 50% 100%)', `circle(${radius}px at 50% 100%)`] }, { ...timing, pseudoElement: '::view-transition-new(root)' });
    if (ring) root.animate({ transform: ['scale(0)', 'scale(1)'], opacity: [1, 1, 0] }, { ...timing, pseudoElement: '::view-transition-new(vt-ring)' });
  }).catch(() => {});
  transition.finished.finally(() => {
    delete root.dataset.transition;
    if (ring) ring.remove();
    state.switching = false;
  });
}

function setupLanguage() {
  $$('[data-lang-toggle]').forEach(button => {
    button.addEventListener('click', () => switchLanguage(i18n.lang === 'en' ? 'pt' : 'en'));
  });
}

const hud = {
  name: $('[data-hud-name]'),
  frame: $('[data-hud-frame]'),
  total: $('[data-hud-total]'),
  pct: $('[data-hud-pct]'),
  bar: $('[data-hud-bar]'),
  rail: $$('[data-rail] button'),
  lastKey: '',
  lastFrame: -1,
  lastPct: -1
};

function setChars(span, value) {
  const chars = span.children;
  const glyphs = [...value];
  if (chars.length === glyphs.length && chars.length) {
    glyphs.forEach((glyph, index) => {
      if (chars[index].textContent !== glyph) chars[index].textContent = glyph;
    });
    return;
  }
  span.textContent = '';
  glyphs.forEach(glyph => {
    const char = document.createElement('i');
    char.textContent = glyph;
    span.append(char);
  });
}

function roll(el, value, dir = 1) {
  const children = [...el.children];
  const current = children[children.length - 1];
  if (current && current.textContent === value && !current.dataset.leaving) return;
  const next = document.createElement('span');
  setChars(next, value);
  el.append(next);
  if (reduced || !current) {
    children.forEach(child => child.remove());
    return;
  }
  children.forEach(child => {
    if (child.dataset.leaving) return;
    child.dataset.leaving = '1';
    if (!child.children.length) setChars(child, child.textContent);
    const chars = [...child.children];
    gsap.killTweensOf(chars);
    gsap.to(chars, {
      yPercent: -115 * dir,
      opacity: 0,
      duration: 0.42,
      ease: 'power2.in',
      stagger: { each: 0.022, from: dir > 0 ? 'start' : 'end' },
      onComplete: () => child.remove()
    });
  });
  gsap.fromTo(next.children, { yPercent: 115 * dir, opacity: 0 }, {
    yPercent: 0,
    opacity: 1,
    duration: 0.75,
    ease: 'expo.out',
    delay: 0.16,
    stagger: { each: 0.028, from: dir > 0 ? 'start' : 'end' }
  });
}

function updateHud() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const y = state.lenis ? state.lenis.scroll : window.scrollY;
  const progress = max > 0 ? clamp(y / max) : 0;
  const pct = Math.round(progress * 100);
  if (pct !== hud.lastPct) {
    hud.lastPct = pct;
    hud.pct.textContent = pad(pct, 3);
  }
  hud.bar.style.setProperty('--p', progress.toFixed(4));
  const film = state.film;
  let info;
  if (film) info = film.info();
  else if (state.active) {
    const count = COUNTS[state.active.id] || 48;
    info = { id: state.active.id, frame: Math.round(clamp(state.active.progress) * (count - 1)), count };
  } else return;
  const chapter = state.chapters.find(c => c.id === info.id);
  const name = state.interlude ? i18n.ui('interlude') : chapter ? chapter.name : '';
  const key = `${info.id}|${name}`;
  const dir = state.direction < 0 ? -1 : 1;
  const frame = pad(info.frame + 1, 4);
  if (key !== hud.lastKey) {
    hud.lastKey = key;
    roll(hud.name, name, dir);
    roll(hud.total, pad(info.count, 4), dir);
    roll(hud.frame, frame, dir);
  } else if (info.frame !== hud.lastFrame) {
    const span = hud.frame.lastElementChild;
    if (span) setChars(span, frame);
  }
  hud.lastFrame = info.frame;
}

const menu = {
  el: $('[data-menu]'),
  toggle: $('[data-menu-toggle]'),
  items: $$('[data-menu-item]'),
  tubes: $$('.menu__rig i')
};

function openMenu() {
  if (state.menuOpen || state.menuBusy || !state.unlocked) return;
  sound.ui('open');
  state.menuOpen = true;
  state.menuBusy = true;
  if (state.lenis) state.lenis.stop();
  root.classList.add('is-menu');
  menu.toggle.setAttribute('aria-expanded', 'true');
  menu.el.setAttribute('aria-hidden', 'false');
  gsap.set(menu.el, { visibility: 'visible' });
  const tl = gsap.timeline({
    onComplete: () => {
      state.menuBusy = false;
      if (state.pendingClose) {
        const then = state.pendingClose;
        state.pendingClose = null;
        closeMenu(typeof then === 'function' ? then : null);
      }
    }
  });
  tl.fromTo(menu.el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0.01 : 0.9, ease: 'expo.inOut' }, 0)
    .to('[data-hud]', { autoAlpha: 0, duration: 0.4 }, 0)
    .fromTo(menu.items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.06, ease: 'power3.out' }, reduced ? 0 : 0.45)
    .add(() => {
      const current = $('.menu__list a[aria-current="true"]', menu.el) || $('a', menu.el);
      if (current) current.focus({ preventScroll: true });
    });
  menu.tubes.forEach((tube, i) => {
    tl.add(() => {
      const f = gsap.timeline();
      [1, 0, 1, 0.2, 1].forEach((v, k) => f.set(tube, { opacity: v }, k * 0.05));
    }, (reduced ? 0 : 0.5) + i * 0.14);
  });
}

function closeMenu(then) {
  if (!state.menuOpen) return;
  if (state.menuBusy) {
    state.pendingClose = then || true;
    return;
  }
  state.menuBusy = true;
  sound.ui('close');
  menu.toggle.setAttribute('aria-expanded', 'false');
  menu.el.setAttribute('aria-hidden', 'true');
  root.classList.remove('is-menu');
  gsap.timeline({
    onComplete: () => {
      gsap.set(menu.el, { visibility: 'hidden' });
      gsap.set(menu.tubes, { opacity: 0 });
      state.menuOpen = false;
      state.menuBusy = false;
      if (!then || !state.dialog) resumeScroll();
      if (then) then();
    }
  })
    .to(menu.items, { opacity: 0, y: -12, duration: 0.4, stagger: 0.03, ease: 'power2.in' }, 0)
    .to(menu.tubes, { opacity: 0, duration: 0.3, stagger: 0.05 }, 0)
    .to(menu.el, { clipPath: 'inset(100% 0% 0% 0%)', duration: reduced ? 0.01 : 0.85, ease: 'expo.inOut' }, 0.15)
    .to('[data-hud]', { autoAlpha: () => (state.hudHidden ? 0 : 1), duration: 0.6 }, 0.7);
}

let garage = null;

function pauseScroll() {
  if (state.lenis) state.lenis.stop();
}

function resumeScroll() {
  if (state.lenis && state.unlocked && !state.menuOpen && !state.dialog) state.lenis.start();
}

function setupGarage() {
  garage = new Configurator({
    dialog: $('[data-garage]'),
    sound,
    reduced,
    i18n,
    stage: () => state.film,
    onOpen: () => {
      state.dialog = 'configure';
      pauseScroll();
    },
    onClose: () => {
      state.dialog = null;
      if (state.film && root.classList.contains('is-film')) state.film.start();
      resumeScroll();
      if (state.dialogTrigger && document.contains(state.dialogTrigger)) state.dialogTrigger.focus({ preventScroll: true });
    }
  });
}

const notes = {
  el: $('[data-notes]'),
  scroll: $('[data-notes-scroll]'),
  progress: $('[data-notes-progress]'),
  open: false,
  busy: false
};

function openNotes(trigger) {
  if (notes.open || notes.busy) return;
  notes.open = true;
  notes.busy = true;
  state.dialog = 'design-notes';
  state.dialogTrigger = trigger;
  pauseScroll();
  notes.el.showModal();
  notes.scroll.scrollTop = 0;
  fit($('[data-notes-title]'));
  updateNotes();
  const close = $('[data-close]', notes.el);
  if (close) close.focus({ preventScroll: true });
  if (reduced) {
    notes.busy = false;
    $$('[data-entry]', notes.el).forEach(entry => entry.classList.add('is-in'));
    return;
  }
  gsap.timeline({ onComplete: () => { notes.busy = false; } })
    .fromTo(notes.el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0)
    .fromTo($('.notes__bar', notes.el).children, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.55)
    .fromTo(text.notesTitle, { opacity: 0, '--wd': '60%' }, { opacity: 1, '--wd': '150%', duration: 1.5, stagger: { each: 0.025, from: 'start' }, ease: 'expo.out' }, 0.5)
    .fromTo('.notes__eyebrow', { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.6)
    .fromTo('[data-notes-reveal]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' }, 0.9);
}

function closeNotes(then) {
  if (!notes.open) return;
  const finish = () => {
    notes.el.close();
    notes.open = false;
    notes.busy = false;
    $$('[data-entry]', notes.el).forEach(entry => entry.classList.remove('is-in'));
    state.dialog = null;
    if (then) then();
    else {
      resumeScroll();
      if (state.dialogTrigger && document.contains(state.dialogTrigger)) state.dialogTrigger.focus({ preventScroll: true });
    }
  };
  if (reduced) {
    finish();
    return;
  }
  notes.busy = true;
  gsap.to(notes.el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut', onComplete: finish });
}

function updateNotes() {
  const max = notes.scroll.scrollHeight - notes.scroll.clientHeight;
  notes.progress.style.setProperty('--p', max > 0 ? (notes.scroll.scrollTop / max).toFixed(4) : '0');
}

function setupNotes() {
  notes.scroll.addEventListener('scroll', updateNotes, { passive: true });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-in');
    });
  }, { root: notes.scroll, threshold: 0.18 });
  $$('[data-entry]', notes.el).forEach(entry => observer.observe(entry));
  notes.el.addEventListener('cancel', event => {
    event.preventDefault();
    closeNotes();
  });
  $$('[data-close]', notes.el).forEach(button => button.addEventListener('click', () => closeNotes()));
  $$('.notes__index a', notes.el).forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const target = $(link.getAttribute('href'), notes.el);
      if (!target) return;
      const top = target.getBoundingClientRect().top - notes.scroll.getBoundingClientRect().top + notes.scroll.scrollTop - 110;
      notes.scroll.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
}

function openDialog(id, trigger) {
  if (!state.unlocked) return;
  const go = () => {
    if (id === 'configure') {
      state.dialogTrigger = trigger;
      garage.show(trigger);
    } else if (id === 'design-notes') {
      openNotes(trigger);
    }
  };
  if (state.menuOpen) {
    closeMenu(go);
    return;
  }
  if (notes.open && id !== 'design-notes') {
    closeNotes(go);
    return;
  }
  go();
}

function setupDialogs() {
  setupGarage();
  setupNotes();
  $$('[data-dialog]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      openDialog(link.dataset.dialog, state.menuOpen ? menu.toggle : link);
    });
  });
}

function setupNavigation() {
  menu.el.setAttribute('aria-hidden', 'true');
  menu.toggle.addEventListener('click', () => (state.menuOpen ? closeMenu(() => menu.toggle.focus()) : openMenu()));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && state.menuOpen && !state.dialog) closeMenu(() => menu.toggle.focus());
  });
  $$('[data-link]').forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      event.preventDefault();
      if (!state.unlocked) return;
      const go = () => scrollToTarget(hash);
      if (state.menuOpen) closeMenu(go);
      else go();
    });
  });
  $$('[data-goto]').forEach(button => {
    button.addEventListener('click', () => {
      if (state.unlocked) scrollToTarget(button.dataset.goto);
    });
  });
  $('[data-top]').addEventListener('click', () => scrollToTarget(0));
  $('[data-sound]').addEventListener('click', () => setSoundButton(sound.toggle()));
  $$('[data-listen]').forEach(button => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => setSoundButton(sound.toggle()));
  });
}

function setupSoundUi() {
  const quiet = '[data-enter], [data-sound], [data-listen], [data-lang-toggle], [data-menu-toggle]';
  document.addEventListener('click', event => {
    const el = event.target.closest('a, button, label');
    if (!el || el.matches(quiet)) return;
    sound.ui(el.matches('label, .chip, [data-tab], [data-view]') ? 'select' : 'click');
  }, true);
  if (!finePointer) return;
  let last = null;
  document.addEventListener('pointerover', event => {
    const el = event.target.closest('a, button, label');
    if (el === last) return;
    last = el;
    if (el) sound.ui('hover');
  }, { passive: true });
}

function setupPointer() {
  if (!finePointer || reduced) return;
  window.addEventListener('pointermove', event => {
    if (!state.film || state.dialog || state.menuOpen) return;
    state.film.setPointer((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2);
  }, { passive: true });
}

function setupResize() {
  let timer = 0;
  let width = window.innerWidth;
  let height = window.innerHeight;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (state.film) state.film.resize();
      const sameWidth = window.innerWidth === width;
      if (sameWidth && (!finePointer || window.innerHeight === height)) return;
      width = window.innerWidth;
      height = window.innerHeight;
      fitAll();
      if (notes.open) fit($('[data-notes-title]'));
      ScrollTrigger.refresh();
    }, 150);
  });
}

async function boot() {
  await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]);
  i18n.capture();
  i18n.apply(I18n.initial());
  prepareText();
  fitAll();
  hideForIntro();
  if (!reduced) {
    state.lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    state.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => state.lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    state.lenis.stop();
  }
  setupNavigation();
  setupDialogs();
  setupLanguage();
  setupSoundUi();
  setupPointer();
  setupResize();
  gsap.to(text.loader, { opacity: 1, duration: 1.2, stagger: 0.06, ease: 'power2.out', delay: 0.2 });
  gsap.fromTo('.loader__mark', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' });
  const film = loadFilm().catch(() => {
    root.classList.add('no-film');
    state.film = null;
  });
  await Promise.all([film, new Promise(resolve => setTimeout(resolve, reduced ? 0 : 2200))]);
  loader.parts.engine = 1;
  loader.parts.models = 1;
  reportProgress();
  gsap.delayedCall(0.8, revealGate);
}

boot();
