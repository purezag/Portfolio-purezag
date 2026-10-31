'use strict';

const measureContext = document.createElement('canvas').getContext('2d');
let toastTimer;

function showToast(msg, icon = 'check') {
  const t = $('#toast');
  $('#toastTx').innerHTML = iconSvg(icon, 's') + '<span>' + escapeHtml(msg) + '</span>';
  measureContext.font = '600 14px Figtree, system-ui, sans-serif';
  t.style.setProperty(
    '--tw',
    Math.min(340, Math.max(160, Math.ceil(measureContext.measureText(msg).width) + 70)) + 'px'
  );
  t.classList.remove('on');
  void t.offsetWidth;
  t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
}

function copyText(txt, msg) {
  const ok = () => showToast(msg || 'Copiado', 'copy');
  try {
    navigator.clipboard.writeText(txt).then(ok, () => showToast('Não deu pra copiar: ' + txt, 'info'));
  } catch {
    showToast('Não deu pra copiar: ' + txt, 'info');
  }
}
