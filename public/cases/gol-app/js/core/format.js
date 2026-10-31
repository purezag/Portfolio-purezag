'use strict';

const DAY_MS = 864e5;
const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const daysBetween = (a, b) =>
  Math.round((new Date(a).setHours(0, 0, 0, 0) - new Date(b).setHours(0, 0, 0, 0)) / DAY_MS);

const isSameDay = (a, b) => !!a && !!b && a.toDateString() === b.toDateString();
const WEEKDAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro'
];

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const formatDayMonth = d => d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()];
const formatWeekdayDate = d => WEEKDAYS_SHORT[d.getDay()] + ', ' + formatDayMonth(d);
const formatLongDate = d => WEEKDAYS[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTHS[d.getMonth()];
const formatCurrency = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');

const formatCurrencyCents = v =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatNumber = v => Math.round(v).toLocaleString('pt-BR');

const formatTime = m => {
  m = ((Math.round(m) % 1440) + 1440) % 1440;
  return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
};

const formatDuration = m => Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0');

const hashString = s => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
};

const normalizeText = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const escapeHtml = s =>
  String(s).replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

const iconSvg = (id, cls = '') => `<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;

const inputModeAttrs = mode =>
  isTouchDevice ? `inputmode="none" data-mode="${mode}"` : `inputmode="${mode}" data-mode="${mode}"`;
