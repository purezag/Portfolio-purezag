'use strict';

function statusPillMarkup(l) {
  if (l.checked) return `<span class="pill good">${iconSvg('check', 's')}Check-in feito</span>`;
  if (canCheckIn(l)) return `<span class="pill brand"><i class="dot"></i>Check-in aberto</span>`;
  return `<span class="pill">Confirmada</span>`;
}

function legRowMarkup(l) {
  const stop = l.via ? `<em style="left:${Math.round((l.l1 / l.dur) * 100)}%"></em>` : '';
  return `<div class="leg"><div class="end"><b>${formatTime(l.dep)}</b><span>${l.o}</span></div>
    <div class="mid"><span>${formatDuration(l.dur)}</span><i class="track">${stop}${l.via ? '' : iconSvg('plane', 's')}</i><span>${l.via ? '1 parada · ' + l.via : 'Direto'}</span></div>
    <div class="end r"><b>${formatTime(l.arr)}${l.arr >= 1440 ? '<sup>+1</sup>' : ''}</b><span>${l.d}</span></div></div>`;
}
