'use strict';

let themePreference = 'light';
try {
  themePreference = localStorage.getItem('gol-theme') || 'light';
} catch {}

function systemPrefersDark() {
  const r = document.documentElement.dataset.theme;
  if (r === 'dark') return true;
  if (r === 'light') return false;
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(animate) {
  const dark = themePreference === 'dark' || (themePreference === 'auto' && systemPrefersDark());
  if (animate && !prefersReducedMotion) {
    app.classList.add('theming');
    setTimeout(() => app.classList.remove('theming'), 520);
  }
  app.dataset.theme = dark ? 'dark' : 'light';
  if (dark) markTourStep('dark');
  $$('#pTheme button').forEach(b => b.classList.toggle('on', b.dataset.t === themePreference));
  const s = $('#accTheme');
  if (s) {
    const i = ['auto', 'light', 'dark'].indexOf(themePreference);
    s.style.setProperty('--i', i);
    $$('button', s).forEach((b, k) => b.classList.toggle('on', k === i));
  }
}

function setTheme(m) {
  themePreference = m;
  try {
    localStorage.setItem('gol-theme', m);
  } catch {}
  applyTheme(true);
  showToast(
    m === 'dark'
      ? 'Tema escuro ligado'
      : m === 'light'
        ? 'Tema claro ligado'
        : 'O tema segue o do seu aparelho',
    'moon'
  );
}

try {
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(true));
} catch {}

new MutationObserver(() => applyTheme(true)).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});
