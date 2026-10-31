'use strict';

const keyboard = { t: null, layer: 'abc', shift: false };

const LAYOUT_LETTERS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫'],
  ['123', 'space', 'ret']
];

const LAYOUT_SYMBOLS = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['#+=', '.', ',', '?', '!', "'", '⌫'],
  ['ABC', 'space', 'ret']
];

const LAYOUT_NUMPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫']
];

const NUMPAD_LETTERS = { 2: 'ABC', 3: 'DEF', 4: 'GHI', 5: 'JKL', 6: 'MNO', 7: 'PQRS', 8: 'TUV', 9: 'WXYZ' };

const isTextInput = a =>
  !!a &&
  a.tagName === 'INPUT' &&
  !['checkbox', 'radio', 'button', 'submit', 'range'].includes(a.type) &&
  !a.readOnly;

function renderKeyboard() {
  const t = keyboard.t,
    pad = keyboard.layer === 'pad',
    mode = t ? t.dataset.mode || t.inputMode : '',
    email = mode === 'email',
    ret = (t && t.dataset.ret) || 'retorno';
  let h = '';
  if (pad) {
    h = LAYOUT_NUMPAD.map(
      r =>
        `<div class="kb-row">${r.map(k => (k === '' ? '<span class="key ghost"></span>' : k === '⌫' ? `<button type="button" class="key ghost" data-k="⌫" aria-label="Apagar">${iconSvg('back')}</button>` : `<button type="button" class="key" data-k="${k}"><b>${k}</b><small>${NUMPAD_LETTERS[k] || '&nbsp;'}</small></button>`)).join('')}</div>`
    ).join('');
  } else {
    const L = keyboard.layer === 'abc' ? LAYOUT_LETTERS : LAYOUT_SYMBOLS;
    h = L.map(
      (r, ri) =>
        `<div class="kb-row r${ri}">${r
          .map(k => {
            if (k === '⇧')
              return `<button type="button" class="key fn wide ${keyboard.shift ? 'shift-on' : ''}" data-k="shift" aria-label="Maiúsculas">⇧</button>`;
            if (k === '⌫')
              return `<button type="button" class="key fn wide" data-k="⌫" aria-label="Apagar">${iconSvg('back')}</button>`;
            if (k === '#+=') return `<button type="button" class="key fn wide" data-k="noop">#+=</button>`;
            if (k === '123' || k === 'ABC')
              return `<button type="button" class="key fn mode" data-k="${k}">${k}</button>`;
            if (k === 'space')
              return email
                ? `<button type="button" class="key" data-k="@" data-pop="@">@</button><button type="button" class="key space" data-k=" ">espaço</button><button type="button" class="key" data-k="." data-pop=".">.</button>`
                : `<button type="button" class="key space" data-k=" ">espaço</button>`;
            if (k === 'ret')
              return `<button type="button" class="key fn ret ${ret !== 'retorno' ? 'go' : ''}" data-k="ret">${ret}</button>`;
            const ch = keyboard.layer === 'abc' && keyboard.shift ? k.toUpperCase() : k;
            return `<button type="button" class="key" data-k="${escapeHtml(ch)}" data-pop="${escapeHtml(ch)}">${escapeHtml(ch)}</button>`;
          })
          .join('')}</div>`
    ).join('');
  }
  h += `<div class="kb-foot"><span>${iconSvg('globe')}</span><span>${iconSvg('mic')}</span></div>`;
  if (t && t.closest('.inp')) {
    const ins = $$('input', t.closest('.screen,.sheet')).filter(isTextInput),
      i = ins.indexOf(t);
    h =
      `<div class="kb-acc"><button type="button" class="key acc ${i > 0 ? '' : 'off'}" data-k="prev" aria-label="Campo anterior">${iconSvg('back', 'up')}</button><button type="button" class="key acc ${i < ins.length - 1 ? '' : 'off'}" data-k="next" aria-label="Próximo campo">${iconSvg('back', 'dn')}</button><span class="sp"></span><button type="button" class="key acc ok" data-k="done">OK</button></div>` +
      h;
  }
  const kb = $('#kb');
  kb.innerHTML = h;
  kb.classList.toggle('padmode', pad);
}

function showKeyboard(t) {
  const mode = t.dataset.mode || t.inputMode;
  keyboard.t = t;
  keyboard.layer = mode === 'numeric' || mode === 'tel' ? 'pad' : 'abc';
  const capz = t.getAttribute('autocapitalize');
  keyboard.shift = keyboard.layer === 'abc' && !t.value && (capz === 'words' || capz === 'sentences');
  renderKeyboard();
  const kb = $('#kb');
  app.style.setProperty('--kbh', kb.offsetHeight + 'px');
  kb.classList.add('on');
  kb.setAttribute('aria-hidden', 'false');
  app.classList.add('kb-on');
  setTimeout(() => revealFocusedInput(t), 420);
}

function hideKeyboard() {
  const kb = $('#kb');
  kb.classList.remove('on');
  kb.setAttribute('aria-hidden', 'true');
  app.classList.remove('kb-on');
  keyboard.t = null;
}

function revealFocusedInput(t) {
  if (!keyboard.t || keyboard.t !== t) return;
  if (t.id === 'chatIn') {
    scrollChatToEnd();
    return;
  }
  const sc = t.closest('.scroll,.sh-body');
  if (!sc) return;
  const k = phoneScale(),
    kbTop = $('#kb').getBoundingClientRect().top,
    r = t.getBoundingClientRect(),
    st = sc.getBoundingClientRect().top;
  if (r.bottom > kbTop - 16 * k) sc.scrollBy({ top: (r.bottom - kbTop) / k + 40, behavior: 'smooth' });
  else if (r.top < st) sc.scrollBy({ top: (r.top - st) / k - 20, behavior: 'smooth' });
}

function insertFromKeyboard(ch) {
  const t = keyboard.t;
  if (!t || t.readOnly) return;
  let s = t.selectionStart,
    e = t.selectionEnd;
  if (s == null) {
    s = e = t.value.length;
  }
  const before = t.value;
  if (ch === null) {
    if (s === e && s > 0) s--;
    t.value = before.slice(0, s) + before.slice(e);
  } else {
    if (t.maxLength > 0 && before.length >= t.maxLength) return;
    t.value = before.slice(0, s) + ch + before.slice(e);
    s += ch.length;
  }
  const expect = t.value;
  try {
    t.setSelectionRange(s, s);
  } catch {}
  t.dispatchEvent(new Event('input', { bubbles: true }));
  if (t.value !== expect) {
    try {
      t.setSelectionRange(t.value.length, t.value.length);
    } catch {}
  }
}

function handleKeyboardReturn() {
  const t = keyboard.t;
  if (!t) return;
  if (t.id === 'chatIn') {
    sendChatMessage();
    return;
  }
  const scope = t.closest('.screen,.sheet');
  const ins = $$('input', scope).filter(isTextInput);
  const i = ins.indexOf(t);
  if (i >= 0 && i < ins.length - 1) ins[i + 1].focus();
  else t.blur();
}

function handleKeyboardKey(k) {
  if (k === 'shift') {
    keyboard.shift = !keyboard.shift;
    renderKeyboard();
    return;
  }
  if (k === '123') {
    keyboard.layer = 'num';
    renderKeyboard();
    return;
  }
  if (k === 'ABC') {
    keyboard.layer = 'abc';
    renderKeyboard();
    return;
  }
  if (k === 'noop') return;
  if (k === 'ret') {
    handleKeyboardReturn();
    return;
  }
  if (k === 'done') {
    if (keyboard.t) keyboard.t.blur();
    return;
  }
  if (k === 'prev' || k === 'next') {
    const t = keyboard.t;
    if (!t) return;
    const ins = $$('input', t.closest('.screen,.sheet')).filter(isTextInput),
      j = ins.indexOf(t) + (k === 'next' ? 1 : -1);
    if (ins[j]) ins[j].focus();
    return;
  }
  insertFromKeyboard(k === '⌫' ? null : k);
  if (keyboard.layer === 'abc' && k !== '⌫') {
    const t = keyboard.t,
      v = t ? t.value : '',
      capz = t ? t.getAttribute('autocapitalize') : '';
    const want = (capz === 'sentences' && /[.!?]\s$/.test(v)) || (capz === 'words' && /\s$/.test(v));
    if (keyboard.shift || want) {
      keyboard.shift = want;
      renderKeyboard();
    }
  }
}

(function kbEvents() {
  const kb = $('#kb');
  let down = null;
  kb.addEventListener('pointerdown', e => {
    e.preventDefault();
    const key = e.target.closest('.key');
    if (!key || !key.dataset.k) return;
    down = key;
    key.classList.add('down');
    handleKeyboardKey(key.dataset.k);
  });
  const up = () => {
    if (down) {
      down.classList.remove('down');
      down = null;
    }
    $$('#kb .key.down').forEach(k => k.classList.remove('down'));
  };
  kb.addEventListener('mousedown', e => e.preventDefault());
  kb.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
  kb.addEventListener('pointerup', up);
  kb.addEventListener('pointerleave', up);
  kb.addEventListener('pointercancel', up);
  const ci = $('#chatIn');
  ci.dataset.mode = 'text';
  if (isTouchDevice) ci.setAttribute('inputmode', 'none');
  app.addEventListener(
    'pointerdown',
    e => {
      if (keyboard.t && !e.target.closest('#kb,input,.sbox,.composer')) keyboard.t.blur();
    },
    true
  );
  app.addEventListener('focusin', e => {
    if (isTextInput(e.target)) showKeyboard(e.target);
  });
  app.addEventListener('focusout', () =>
    setTimeout(() => {
      const a = document.activeElement;
      if (!(a && app.contains(a) && isTextInput(a))) hideKeyboard();
    }, 40)
  );
})();
