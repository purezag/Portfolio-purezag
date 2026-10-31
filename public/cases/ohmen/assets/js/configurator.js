const { gsap } = window;

export const MODELS = [
  {
    id: 'arc',
    name: 'ARC',
    kicker: 'The hypercar',
    line: 'Glass canopy, central driving seat, four motors.',
    file: 'assets/garage/arc.wasm',
    shadow: 'assets/garage/arc-shadow.png',
    still: 'assets/media/config-arc.jpg',
    wheelRadius: 0.384,
    wheel: [0.98, 0.4, 1.4],
    cabin: [0, 0.78, 0.2],
    rig: [3.0, 6.2],
    accent: 'gloss',
    specs: [['Power', '1,020 kW'], ['0–100 km/h', '1.9 s'], ['Range', '520 km']],
    defaults: { paint: 'puro-sangue', wheels: 'diamond', calipers: 'signal', interior: 'nero-rosso' }
  },
  {
    id: 'umbra',
    name: 'UMBRA',
    kicker: 'The SUV',
    line: 'The same line of light, room for five, our longest range.',
    file: 'assets/garage/umbra.wasm',
    shadow: 'assets/garage/umbra-shadow.png',
    still: 'assets/media/config-umbra.jpg',
    wheelRadius: 0.449,
    wheel: [1.0, 0.46, 1.58],
    cabin: [0, 1.02, 0.25],
    rig: [3.3, 6.8],
    accent: 'satin',
    specs: [['Power', '640 kW'], ['0–100 km/h', '3.4 s'], ['Range', '640 km']],
    defaults: { paint: 'obsidian', wheels: 'gunmetal', calipers: 'graphite', interior: 'nero' }
  }
];

export const GROUPS = [
  {
    id: 'paint',
    label: 'Paint',
    short: 'Paint',
    view: 'front',
    kind: 'swatch',
    items: [
      { id: 'puro-sangue', code: 'PS', name: 'Puro Sangue', note: 'Three-stage candy red, polished by hand', swatch: '#a3121a', color: [0.3, 0.002, 0.003], metalness: 0.85, roughness: 0.3 },
      { id: 'obsidian', code: 'OB', name: 'Obsidian', note: 'Gloss black with no colour of its own', swatch: '#0c0c0d', color: [0.004, 0.004, 0.0045], metalness: 0.35, roughness: 0.42 },
      { id: 'argento', code: 'AR', name: 'Argento', note: 'Liquid silver over a black primer', swatch: '#b9bdc3', color: [0.55, 0.56, 0.58], metalness: 1, roughness: 0.3 },
      { id: 'bruma', code: 'BR', name: 'Bruma', note: 'Storm grey with a cold blue undertone', swatch: '#4a5562', color: [0.045, 0.055, 0.068], metalness: 0.75, roughness: 0.36 },
      { id: 'bianco', code: 'BL', name: 'Bianco Luce', note: 'Pearl white that turns warm in low light', swatch: '#e7e5e0', color: [0.72, 0.71, 0.68], metalness: 0.05, roughness: 0.32 },
      { id: 'verde', code: 'VN', name: 'Verde Notte', note: 'A green so deep it reads black indoors', swatch: '#123b2b', color: [0.006, 0.05, 0.025], metalness: 0.7, roughness: 0.34 }
    ]
  },
  {
    id: 'wheels',
    label: 'Wheels',
    short: 'Wheels',
    view: 'wheel',
    kind: 'tile',
    items: [
      { id: 'diamond', code: 'DC', name: 'Diamond cut', note: 'Machined faces, black spokes', swatch: '#c9ccd1', face: [0.62, 0.63, 0.64], faceMetal: 1, faceRough: 0.16, inner: [0.02, 0.02, 0.022], innerMetal: 0.8, innerRough: 0.28 },
      { id: 'gunmetal', code: 'GM', name: 'Gunmetal', note: 'Dark bronze, brushed', swatch: '#4b4239', face: [0.1, 0.085, 0.07], faceMetal: 1, faceRough: 0.26, inner: [0.015, 0.015, 0.016], innerMetal: 0.7, innerRough: 0.35 },
      { id: 'satin', code: 'SB', name: 'Satin black', note: 'Forged, matte finish', swatch: '#1b1c1e', face: [0.025, 0.025, 0.027], faceMetal: 0.5, faceRough: 0.48, inner: [0.012, 0.012, 0.013], innerMetal: 0.5, innerRough: 0.5 }
    ]
  },
  {
    id: 'calipers',
    label: 'Calipers',
    short: 'Brakes',
    view: 'wheel',
    kind: 'swatch',
    items: [
      { id: 'signal', code: 'SR', name: 'Signal red', note: 'The red of the tail line', swatch: '#cf1520', color: [0.55, 0.012, 0.02] },
      { id: 'graphite', code: 'GR', name: 'Graphite', note: 'Disappears behind the spokes', swatch: '#1f2125', color: [0.02, 0.02, 0.022] },
      { id: 'titanium', code: 'TI', name: 'Titanium', note: 'Raw, lightly brushed', swatch: '#8f9196', color: [0.3, 0.3, 0.31] },
      { id: 'aurum', code: 'AU', name: 'Aurum', note: 'Anodised gold', swatch: '#b88b3a', color: [0.42, 0.24, 0.05] }
    ]
  },
  {
    id: 'interior',
    label: 'Interior',
    short: 'Cabin',
    view: 'cabin',
    kind: 'duo',
    items: [
      { id: 'nero-rosso', code: 'NR', name: 'Nero / Rosso', note: 'Black nappa, red alcantara', swatch: ['#0d0c0c', '#8a1016'], leather: [0.008, 0.0075, 0.0075], insert: [0.12, 0.005, 0.007] },
      { id: 'nero', code: 'NE', name: 'Nero', note: 'Black nappa, carbon trim', swatch: ['#0d0c0c', '#26262a'], leather: [0.008, 0.0075, 0.0075], insert: [0.016, 0.016, 0.017] },
      { id: 'cuoio', code: 'CU', name: 'Cuoio', note: 'Tan nappa, dark stitching', swatch: ['#7d4523', '#26190f'], leather: [0.16, 0.06, 0.022], insert: [0.02, 0.014, 0.01] },
      { id: 'grigio', code: 'GG', name: 'Grigio', note: 'Grey alcantara, anodised details', swatch: ['#3d3e41', '#75767b'], leather: [0.05, 0.05, 0.052], insert: [0.11, 0.11, 0.115] }
    ]
  }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const pad = n => String(n).padStart(2, '0');
const STORE = 'ohmen-garage';

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    if (key === 'text') node.textContent = value;
    else if (key === 'style') node.setAttribute('style', value);
    else node.setAttribute(key, value === true ? '' : value);
  });
  children.forEach(child => child && node.append(child));
  return node;
}

function find(group, id) {
  const g = GROUPS.find(x => x.id === group);
  return g.items.find(item => item.id === id) || g.items[0];
}

export function lookOf(spec) {
  return {
    paint: find('paint', spec.paint),
    wheels: find('wheels', spec.wheels),
    calipers: find('calipers', spec.calipers),
    interior: find('interior', spec.interior)
  };
}

export class Configurator {
  constructor({ dialog, sound, reduced, onOpen, onClose, i18n, stage }) {
    this.stageRef = stage;
    this.dialog = dialog;
    this.i18n = i18n;
    this.sound = sound;
    this.reduced = reduced;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.form = $('[data-garage-form]', dialog);
    this.canvas = $('[data-garage-canvas]', dialog);
    this.stage = $('[data-garage-stage]', dialog);
    this.still = $('[data-garage-still]', dialog);
    this.load = $('[data-garage-load]', dialog);
    this.pct = $('[data-garage-pct]', dialog);
    this.loadLabel = $('[data-garage-load-label]', dialog);
    this.tubes = $$('[data-garage-load] i', dialog);
    this.title = $('[data-garage-title]', dialog);
    this.kicker = $('[data-garage-kicker]', dialog);
    this.line = $('[data-garage-line]', dialog);
    this.index = $('[data-garage-index]', dialog);
    this.deg = $('[data-garage-deg]', dialog);
    this.code = $('[data-garage-code]', dialog);
    this.specs = $('[data-garage-specs]', dialog);
    this.done = $('[data-garage-done]', dialog);
    this.final = $('[data-garage-final]', dialog);
    this.ref = $('[data-garage-ref]', dialog);
    this.fine = $('[data-garage-fine]', dialog);
    this.status = $('[data-garage-status]', dialog);
    this.garage = null;
    this.engine = null;
    this.open = false;
    this.busy = false;
    this.entered = false;
    this.state = this.restore();
    this.build();
    this.bind();
    this.sync(false);
  }

  w(value) {
    return this.i18n ? this.i18n.word(value) : value;
  }

  u(key, ...args) {
    return this.i18n ? this.i18n.ui(key, ...args) : key;
  }

  restore() {
    const state = { model: MODELS[0].id };
    MODELS.forEach(m => { state[m.id] = { ...m.defaults }; });
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved && MODELS.some(m => m.id === saved.model)) {
        state.model = saved.model;
        MODELS.forEach(m => {
          const own = saved[m.id] || {};
          GROUPS.forEach(g => {
            if (own[g.id] && g.items.some(item => item.id === own[g.id])) state[m.id][g.id] = own[g.id];
          });
        });
      }
    } catch (error) {
      return state;
    }
    return state;
  }

  get spec() {
    return { model: this.state.model, ...this.state[this.state.model] };
  }

  persist() {
    try {
      localStorage.setItem(STORE, JSON.stringify(this.state));
      return true;
    } catch (error) {
      return false;
    }
  }

  model(id = this.spec.model) {
    return MODELS.find(m => m.id === id) || MODELS[0];
  }

  look(spec = this.spec) {
    return {
      paint: find('paint', spec.paint),
      wheels: find('wheels', spec.wheels),
      calipers: find('calipers', spec.calipers),
      interior: find('interior', spec.interior)
    };
  }

  build() {
    const groups = $('[data-garage-groups]', this.dialog);
    const tabs = $('[data-garage-tabs]', this.dialog);
    const steps = [{ id: 'model', label: 'Model', short: 'Model' }, ...GROUPS.map(g => ({ id: g.id, label: g.label, short: g.short || g.label }))];
    const next = i => {
      const step = steps[i + 1];
      return step
        ? el('button', { type: 'button', class: 'opt__next', 'data-next': step.id }, [el('span', { text: this.u('next', this.w(step.label)) }), el('i', { class: 'btn__arrow', 'aria-hidden': 'true' })])
        : el('button', { type: 'button', class: 'opt__next', 'data-next': 'review' }, [el('span', { text: this.u('review') }), el('i', { class: 'btn__arrow', 'aria-hidden': 'true' })]);
    };
    steps.forEach((step, i) => {
      tabs.append(el('button', {
        type: 'button',
        role: 'tab',
        id: `garage-tab-${step.id}`,
        class: i === 0 ? 'is-active' : null,
        'aria-selected': String(i === 0),
        'aria-controls': `garage-opt-${step.id}`,
        'data-tab': step.id
      }, [el('b', { text: pad(i + 1) }), el('span', { text: this.w(step.short) })]));
    });
    const modelSet = el('fieldset', { class: 'opt opt--models is-active', id: 'garage-opt-model', role: 'tabpanel', 'aria-labelledby': 'garage-tab-model', 'data-group': 'model' });
    modelSet.append(el('legend', {}, [el('b', { text: '01' }), el('span', { text: this.w('Model') }), el('em', { 'data-value': 'model' })]));
    const list = el('div', { class: 'opt__list opt__list--models' });
    MODELS.forEach((m, i) => {
      list.append(el('label', { class: 'tile tile--model' }, [
        el('input', { type: 'radio', name: 'model', value: m.id }),
        el('span', { class: 'tile__body' }, [
          el('b', { class: 'tile__num', text: pad(i + 1) }),
          el('strong', { class: 'tile__name', text: m.name }),
          el('small', { text: this.w(m.kicker) }),
          el('span', { class: 'tile__specs' }, m.specs.map(([k, v]) => el('span', {}, [el('i', { text: this.w(k) }), el('em', { text: this.w(v) })])))
        ])
      ]));
    });
    modelSet.append(list);
    modelSet.append(next(0));
    groups.append(modelSet);
    GROUPS.forEach((g, gi) => {
      const set = el('fieldset', { class: `opt opt--${g.kind}`, id: `garage-opt-${g.id}`, role: 'tabpanel', 'aria-labelledby': `garage-tab-${g.id}`, 'data-group': g.id });
      set.append(el('legend', {}, [el('b', { text: pad(gi + 2) }), el('span', { text: this.w(g.label) }), el('em', { 'data-value': g.id })]));
      const row = el('div', { class: `opt__list opt__list--${g.kind}` });
      g.items.forEach(item => {
        const input = el('input', { type: 'radio', name: g.id, value: item.id, 'aria-label': `${this.w(item.name)}. ${this.w(item.note)}` });
        if (g.kind === 'tile') {
          row.append(el('label', { class: 'tile tile--rim', style: `--c:${item.swatch}` }, [
            input,
            el('span', { class: 'tile__body' }, [
              el('i', { class: 'tile__rim', 'aria-hidden': 'true' }),
              el('strong', { class: 'tile__name', text: this.w(item.name) }),
              el('small', { text: this.w(item.note) })
            ])
          ]));
        } else {
          const style = g.kind === 'duo' ? `--c:${item.swatch[0]};--c2:${item.swatch[1]}` : `--c:${item.swatch}`;
          row.append(el('label', { class: `swatch swatch--${g.kind}`, style }, [
            input,
            el('span', { class: 'swatch__chip', 'aria-hidden': 'true' }),
            el('span', { class: 'swatch__name', 'aria-hidden': 'true', text: this.w(item.name) })
          ]));
        }
      });
      set.append(row);
      set.append(el('p', { class: 'opt__note', 'data-note': g.id }));
      set.append(next(gi + 1));
      groups.append(set);
    });
  }

  bind() {
    this.form.addEventListener('change', event => {
      const input = event.target;
      if (!input.name) return;
      if (input.name === 'model') this.switchModel(input.value);
      else this.choose(input.name, input.value);
    });
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      this.reserve();
    });
    $$('[data-garage-step]', this.dialog).forEach(button => {
      button.addEventListener('click', () => {
        const i = MODELS.findIndex(m => m.id === this.spec.model);
        const next = MODELS[(i + Number(button.dataset.garageStep) + MODELS.length) % MODELS.length];
        this.switchModel(next.id);
      });
    });
    $$('[data-view]', this.dialog).forEach(button => {
      button.addEventListener('click', () => this.view(button.dataset.view));
    });
    const lights = $('[data-lights]', this.dialog);
    lights.addEventListener('click', () => {
      const on = lights.getAttribute('aria-pressed') !== 'true';
      lights.setAttribute('aria-pressed', String(on));
      if (this.engine) this.engine.setLights(on);
      if (on && this.sound) this.sound.clack(0, 0.5);
    });
    const tabs = $('[data-garage-tabs]', this.dialog);
    tabs.addEventListener('click', event => {
      const tab = event.target.closest('[data-tab]');
      if (tab) this.tab(tab.dataset.tab);
    });
    tabs.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-tab]');
      if (!tab || (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft')) return;
      const all = $$('[data-tab]', this.dialog);
      const i = all.indexOf(tab) + (event.key === 'ArrowRight' ? 1 : -1);
      const target = all[(i + all.length) % all.length];
      target.focus();
      this.tab(target.dataset.tab);
    });
    const groups = $('[data-garage-groups]', this.dialog);
    groups.addEventListener('click', event => {
      const button = event.target.closest('[data-next]');
      if (!button) return;
      if (button.dataset.next === 'review') {
        const submit = $('.garage__summary .btn', this.dialog);
        if (submit) {
          submit.focus({ preventScroll: true });
          gsap.fromTo(submit, { boxShadow: '0 0 0 1px rgba(255,255,255,0.9), 0 0 30px rgba(214,226,255,0.6)' }, { boxShadow: '0 0 0 0 rgba(255,255,255,0)', duration: 1.4, ease: 'power2.out', clearProps: 'boxShadow' });
        }
        this.view('front', true);
        return;
      }
      this.tab(button.dataset.next);
      const tab = $(`[data-tab="${button.dataset.next}"]`, this.dialog);
      if (tab) tab.focus({ preventScroll: true });
    });
    groups.addEventListener('pointerover', event => {
      const option = event.target.closest('.swatch, .tile');
      if (!option) return;
      const input = $('input', option);
      const value = input && $(`[data-value="${input.name}"]`, this.dialog);
      if (!value) return;
      value.textContent = input.name === 'model' ? this.model(input.value).name : this.w(find(input.name, input.value).name);
      value.classList.add('is-preview');
    });
    groups.addEventListener('pointerout', event => {
      const option = event.target.closest('.swatch, .tile');
      if (!option || option.contains(event.relatedTarget)) return;
      this.syncValues();
    });
    $('[data-garage-again]', this.dialog).addEventListener('click', () => this.again());
    $('[data-garage-copy]', this.dialog).addEventListener('click', event => this.copy(event.currentTarget));
    this.dialog.addEventListener('cancel', event => {
      event.preventDefault();
      this.close();
    });
    $$('[data-close]', this.dialog).forEach(button => button.addEventListener('click', () => this.close()));
    window.addEventListener('resize', () => {
      if (!this.open || !this.engine) return;
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.layout(), 120);
    });
  }

  tab(id) {
    $$('[data-tab]', this.dialog).forEach(tab => {
      const on = tab.dataset.tab === id;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    $$('.opt', this.dialog).forEach(set => set.classList.toggle('is-active', set.dataset.group === id));
    const group = GROUPS.find(g => g.id === id);
    if (group) this.view(group.view, true);
    else this.view('front', true);
  }

  view(name, auto = false) {
    $$('[data-view]', this.dialog).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
    this.currentView = name;
    if (!this.engine) return;
    if (auto && this.lastAuto === name && this.engineView === name) return;
    this.lastAuto = name;
    this.engineView = name;
    this.engine.view(name);
  }

  choose(group, id) {
    this.state[this.state.model][group] = id;
    this.persist();
    this.sync(true);
    const g = GROUPS.find(x => x.id === group);
    if (g && this.currentView !== g.view) this.view(g.view, true);
    if (this.engine && this.engine.current) this.engine.apply(this.engine.current, this.look());
  }

  switchModel(id) {
    if (id === this.spec.model) return;
    const model = this.model(id);
    this.state.model = id;
    this.persist();
    this.sync(true, true);
    if (!this.engine) {
      this.showStill();
      return;
    }
    this.setBusy(true);
    this.view('front', true);
    this.engine.swap(model, this.look(), p => this.progress(p, model)).then(() => {
      this.setBusy(false);
      this.hideLoad();
    }).catch(() => {
      this.setBusy(false);
      this.fail();
    });
  }

  setBusy(on) {
    this.busy = on;
    this.dialog.classList.toggle('is-swapping', on);
  }

  sync(animate, modelChanged = false) {
    const spec = this.spec;
    const model = this.model();
    $$('input[type="radio"]', this.form).forEach(input => {
      input.checked = spec[input.name] === input.value;
    });
    this.syncValues();
    this.code.textContent = this.codeOf(spec);
    this.specs.innerHTML = '';
    model.specs.forEach(([k, v]) => this.specs.append(el('div', {}, [el('dt', { text: this.w(k) }), el('dd', { text: this.w(v) })])));
    if (modelChanged || this.title.dataset.model !== model.id) this.setTitle(model, animate);
  }

  syncValues() {
    const look = this.look();
    GROUPS.forEach(g => {
      const item = look[g.id];
      const value = $(`[data-value="${g.id}"]`, this.dialog);
      if (value) {
        value.textContent = this.w(item.name);
        value.classList.remove('is-preview');
      }
      const note = $(`[data-note="${g.id}"]`, this.dialog);
      if (note) note.textContent = this.w(item.note);
    });
    const modelValue = $('[data-value="model"]', this.dialog);
    if (modelValue) {
      modelValue.textContent = this.model().name;
      modelValue.classList.remove('is-preview');
    }
  }

  setLanguage(i18n) {
    this.i18n = i18n;
    const active = this.activeTab() || 'model';
    $('[data-garage-groups]', this.dialog).replaceChildren();
    $('[data-garage-tabs]', this.dialog).replaceChildren();
    this.build();
    this.sync(false);
    const model = this.model();
    this.kicker.textContent = this.w(model.kicker);
    this.line.textContent = this.w(model.line);
    $$('[data-tab]', this.dialog).forEach(tab => {
      const on = tab.dataset.tab === active;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    $$('.opt', this.dialog).forEach(set => set.classList.toggle('is-active', set.dataset.group === active));
    if (!this.done.hidden) this.final.textContent = this.describe();
  }

  setTitle(model, animate) {
    this.title.dataset.model = model.id;
    const i = MODELS.indexOf(model);
    this.index.textContent = pad(i + 1);
    this.kicker.textContent = this.w(model.kicker);
    this.line.textContent = this.w(model.line);
    const chars = [...model.name].map(letter => el('span', { class: 'c', text: letter }));
    this.title.setAttribute('aria-label', model.name);
    this.title.replaceChildren(...chars);
    if (animate && !this.reduced) {
      gsap.fromTo(chars, { opacity: 0, '--wd': '60%' }, { opacity: 1, '--wd': '150%', duration: 1.2, stagger: { each: 0.05, from: 'center' }, ease: 'expo.out', delay: 0.9 });
      gsap.fromTo([this.kicker, this.line], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 1.1 });
    }
  }

  codeOf(spec) {
    const look = this.look(spec);
    return ['OHM', this.model(spec.model).name, look.paint.code, look.wheels.code, look.calipers.code, look.interior.code].join('·');
  }

  describe(spec = this.spec) {
    const look = this.look(spec);
    return this.u('describe', this.model(spec.model).name, this.w(look.paint.name), this.w(look.wheels.name), this.w(look.calipers.name), this.w(look.interior.name));
  }

  progress(p, model) {
    if (p >= 1) return;
    this.load.hidden = false;
    this.dialog.classList.add('is-loading');
    this.loadLabel.textContent = this.u('bringing', model.name);
    this.pct.textContent = `${Math.round(p * 100)}%`;
    const lit = Math.floor(p * this.tubes.length + 0.001);
    this.tubes.forEach((tube, i) => tube.classList.toggle('is-on', i < lit));
  }

  hideLoad() {
    this.dialog.classList.remove('is-loading');
    this.load.hidden = true;
  }

  showStill() {
    const model = this.model();
    this.still.hidden = false;
    this.still.src = model.still;
    this.still.alt = this.u('studio', model.name);
    this.dialog.classList.add('is-still');
  }

  fail() {
    this.dialog.dataset.state = 'still';
    this.hideLoad();
    this.showStill();
    if (this.status) this.status.textContent = this.u('still');
  }

  async ensureEngine() {
    if (this.engine) return this.engine;
    const engine = typeof this.stageRef === 'function' ? this.stageRef() : this.stageRef;
    if (!engine) return null;
    Object.assign(engine.options, {
      onTurn: deg => {
        const value = String(Math.round(deg) % 360).padStart(3, '0');
        if (value !== this.lastDeg) {
          this.lastDeg = value;
          this.deg.textContent = value;
        }
      },
      onInteract: () => {
        $$('[data-view]', this.dialog).forEach(button => button.setAttribute('aria-pressed', 'false'));
        this.engineView = null;
        this.dialog.classList.add('has-touched');
      }
    });
    this.engine = engine;
    window.__ohmenGarage = engine;
    return engine;
  }

  layout() {
    if (!this.engine) return;
    const panel = this.form.getBoundingClientRect();
    const stage = this.stage.getBoundingClientRect();
    const overlap = panel.left < stage.right - 2 && panel.top < stage.bottom - 2 && panel.left > stage.left + stage.width * 0.4;
    this.engine.setInset(overlap ? stage.right - panel.left : 0);
  }

  async show(trigger) {
    if (this.open) return;
    this.open = true;
    this.dialog.dataset.state = 'loading';
    const model = trigger && trigger.dataset ? trigger.dataset.model : null;
    if (model && MODELS.some(m => m.id === model)) this.state.model = model;
    this.done.hidden = true;
    this.form.hidden = false;
    this.sync(false, true);
    this.dialog.showModal();
    this.dialog.classList.add('is-open');
    if (this.onOpen) this.onOpen();
    const panel = $('.garage__panel', this.dialog);
    const head = $('.garage__head', this.dialog);
    const hud = $$('.garage__hud > *', this.dialog);
    if (!this.reduced) {
      gsap.timeline()
        .fromTo(this.dialog, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'expo.inOut' }, 0)
        .fromTo(panel, { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, 0.55)
        .fromTo(panel, { '--tube': 0 }, { '--tube': 1, duration: 0.9, ease: 'power2.out' }, 0.75)
        .fromTo(head.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, 0.6)
        .fromTo(hud, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.05 }, 0.9);
    } else {
      gsap.set(this.dialog, { clipPath: 'none' });
    }
    const close = $('.garage__close', this.dialog);
    if (close) close.focus({ preventScroll: true });
    this.tab(this.activeTab() || 'model');
    const revealed = new Promise(resolve => setTimeout(resolve, this.reduced ? 0 : 820));
    let engine = null;
    try {
      engine = await this.ensureEngine();
    } catch (error) {
      engine = null;
    }
    if (!this.open) return;
    if (!engine) {
      this.fail();
      return;
    }
    await revealed;
    if (!this.open) return;
    this.canvas.hidden = true;
    engine.enterGarage(this.stage, this.canvas);
    engine.start();
    this.layout();
    const current = engine.current;
    const target = this.model();
    try {
      if (!current) {
        this.setBusy(true);
        this.progress(0, target);
        engine.view('front', true);
        await engine.ensure(target, p => this.progress(p, target));
        this.hideLoad();
        if (!this.open) return;
        await engine.enter(target, this.look());
        this.setBusy(false);
        this.dialog.dataset.state = 'ready';
        const other = MODELS.find(m => m.id !== target.id);
        setTimeout(() => engine.ensure(other).catch(() => {}), 1200);
      } else if (current.id !== target.id) {
        this.setBusy(true);
        await engine.swap(target, this.look(), p => this.progress(p, target));
        this.hideLoad();
        this.setBusy(false);
      } else {
        engine.apply(current, this.look(), false);
        engine.powerUp();
      }
      this.dialog.dataset.state = 'ready';
    } catch (error) {
      console.error('[garage]', error);
      this.setBusy(false);
      this.fail();
    }
  }

  activeTab() {
    const tab = $('[data-tab].is-active', this.dialog);
    return tab ? tab.dataset.tab : null;
  }

  close() {
    if (!this.open) return;
    this.open = false;
    if (this.engine) this.engine.exitGarage();
    const finish = () => {
      this.dialog.close();
      this.dialog.classList.remove('is-open');
      if (this.onClose) this.onClose();
    };
    if (this.reduced) {
      finish();
      return;
    }
    gsap.timeline({ onComplete: finish })
      .to($('.garage__panel', this.dialog), { xPercent: 8, opacity: 0, duration: 0.45, ease: 'power2.in' }, 0)
      .to(this.dialog, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, 0.1);
  }

  reserve() {
    const saved = this.persist();
    const number = `OHM-27-${String(Math.floor(1000 + Math.random() * 9000))}`;
    this.ref.textContent = number;
    this.final.textContent = this.describe();
    this.fine.textContent = saved ? this.u('fineSaved') : this.u('fine');
    this.form.hidden = true;
    this.done.hidden = false;
    this.dialog.classList.add('is-done');
    if (this.engine) this.engine.view('front');
    if (this.sound) this.sound.impact();
    if (!this.reduced) gsap.fromTo(this.done.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' });
    const first = $('button', this.done);
    if (first) first.focus({ preventScroll: true });
  }

  again() {
    this.done.hidden = true;
    this.form.hidden = false;
    this.dialog.classList.remove('is-done');
    const first = $('input:checked', this.form);
    if (first) first.focus({ preventScroll: true });
  }

  async copy(button) {
    const label = button.getAttribute('aria-label');
    const value = `${this.u('copyPrefix')} ${this.code.textContent}: ${this.final.textContent}`;
    let ok = false;
    try {
      await navigator.clipboard.writeText(value);
      ok = true;
    } catch (error) {
      ok = false;
    }
    if (!ok) {
      const range = document.createRange();
      range.selectNodeContents(this.final);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
    button.setAttribute('aria-label', ok ? this.u('copyAria') : this.u('selectAria'));
    const faces = $$('.btn__char > span:first-child', button);
    const original = faces.map(face => face.textContent);
    const message = ok ? this.u('copied') : this.u('selected');
    faces.forEach((face, i) => { face.textContent = message[i] || ' '; });
    setTimeout(() => {
      faces.forEach((face, i) => { face.textContent = original[i]; });
      button.setAttribute('aria-label', label);
    }, 1800);
  }
}
