'use strict';

let passFocus = null;

function openBoardingPass(id, li) {
  closeSheet();
  passFocus = { id, li, unlock: true };
  if (currentScreen() === 'pass') screenRenderers.pass();
  else switchTab('pass');
}

screenRenderers.pass = function () {
  const items = [];
  upcomingLegs().forEach(({ t, l, li }) => t.pax.forEach((p, pi) => items.push({ t, l, li, pi })));
  if (!items.length) {
    $('#bpBg').innerHTML = photoMarkup('air-3', 'l', '', true);
    $('#passBody').innerHTML =
      `<div class="bp-empty rise">${photoMarkup('air-3', 'l')}<h1 class="h-l">Nenhuma viagem por aqui</h1>
      <p>Quando você comprar uma passagem, o cartão de embarque aparece nesta aba.</p><button class="btn" onclick="openSearch()">Comprar passagem</button></div>`;
    return;
  }
  const ready = items.filter(x => x.l.checked).length;
  $('#passBody').innerHTML =
    `<div class="bp-head"><h1 class="h-xl">Cartões de embarque</h1><p>${ready ? `${ready} pronto${ready > 1 ? 's' : ''} pro embarque · deslize pro lado` : 'Faça o check-in pra liberar o QR Code'}</p></div>
    <div class="bp-mid">
      <div class="passes" id="passes">${items.map(boardingPassMarkup).join('')}</div>
      <div class="bp-dots" id="bpDots">${items.length > 1 ? items.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('') : ''}</div>
      <div class="bp-actions"><button class="btn glassbtn" onclick="showToast('Cartão salvo na Carteira','wallet')">${iconSvg('wallet', 's')}Carteira</button><button class="btn glassbtn" onclick="showToast('Cartão pronto pra compartilhar','share')">${iconSvg('share', 's')}Compartilhar</button></div>
    </div>`;
  $$('#passes canvas').forEach(drawQrCode);
  const row = $('#passes');
  let cur = -1;
  const stepW = () => {
    const c = row.children;
    return c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : row.clientWidth;
  };
  const setBg = i => {
    if (i === cur || !items[i]) return;
    cur = i;
    const it = items[i],
      d = DESTINATIONS[it.l.d];
    $('#bpBg').innerHTML = photoMarkup(d ? d.ph[0] : 'air-1', 'l', '', true);
    $$('#bpDots i').forEach((x, k) => x.classList.toggle('on', k === i));
    if (it.l.checked) markTourStep('pass');
  };
  row.addEventListener('scroll', () => setBg(Math.round(row.scrollLeft / stepW())), { passive: true });
  let start = 0;
  if (passFocus) {
    const k = items.findIndex(x => x.t.id === passFocus.id && x.li === passFocus.li);
    if (k >= 0) {
      start = k;
      if (passFocus.unlock && items[k].l.checked)
        $$('#passes .bp').forEach((el, j) => {
          if (items[j].t.id === passFocus.id && items[j].li === passFocus.li) el.classList.add('unlock');
        });
    }
    passFocus = null;
  }
  setBg(start);
  if (start) requestAnimationFrame(() => (row.scrollLeft = start * stepW()));
};

function boardingPassMarkup({ t, l, li, pi }) {
  const p = t.pax[pi],
    ok = l.checked,
    open = canCheckIn(l),
    n = daysBetween(l.date, TODAY);
  const v = x => (ok ? `<b>${x}</b>` : '<b class="na">—</b>');
  const bottom = ok
    ? `<canvas width="33" height="33" data-seed="${t.id + pi + l.num}" aria-label="Código de embarque ilustrativo"></canvas><span class="cap">Portão fecha às ${formatTime(l.dep - 15)}</span>`
    : `<div class="bp-lock"><canvas width="33" height="33" data-seed="${t.id + pi + l.num}" aria-hidden="true"></canvas>
      <div class="lk-c"><span class="lk">${iconSvg('lock', 's')}</span>
      <p class="lock-tx">${open ? 'Faça o check-in pra liberar o QR Code deste cartão.' : `O check-in abre em ${n - 2} dia${n - 2 > 1 ? 's' : ''}, em ${formatDayMonth(addDays(l.date, -2))}. A gente te avisa.`}</p>
      ${open ? `<button class="btn sm" onclick="startCheckIn('${t.id}',${li})">Fazer check-in</button>` : ''}</div></div>`;
  return `<article class="bp"><div class="bp-a">
      <div class="bp-top"><img src="assets/brand/gol-logo.png" alt="GOL"><span>${l.num}</span></div>
      <div class="bp-route"><div><b>${l.o}</b><span>${AIRPORTS[l.o].c}</span></div><span class="pl">${iconSvg('plane', 'rot')}</span><div class="r"><b>${l.d}</b><span>${AIRPORTS[l.d].c}</span></div></div>
      <div class="bp-grid">
        <div class="w2"><label>Passageiro</label><b>${escapeHtml((p.first + ' ' + p.last).toUpperCase())}</b></div><div><label>Assento</label><b>${l.seats[pi] || '—'}</b></div>
        <div><label>Data</label><b>${formatDayMonth(l.date).toUpperCase()}</b></div><div><label>Embarque</label>${v(formatTime(l.board))}</div><div><label>Portão</label>${v(l.gate)}</div>
        <div><label>Grupo</label>${v(l.group)}</div><div><label>Partida</label><b>${formatTime(l.dep)}</b></div><div><label>Localizador</label><b>${t.id}</b></div>
      </div></div>
    <div class="bp-b">${bottom}</div></article>`;
}

function drawQrCode(cv) {
  const ctx = cv.getContext('2d'),
    N = cv.width;
  let seed = Math.floor(hashString(cv.dataset.seed || 'x') * 1e9) || 7;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, N, N);
  ctx.fillStyle = '#18181a';
  for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) if (rnd() > 0.53) ctx.fillRect(x, y, 1, 1);
  const f = (x, y) => {
    ctx.fillStyle = '#18181a';
    ctx.fillRect(x, y, 7, 7);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 1, y + 1, 5, 5);
    ctx.fillStyle = '#18181a';
    ctx.fillRect(x + 2, y + 2, 3, 3);
  };
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 9, 9);
  ctx.fillRect(N - 9, 0, 9, 9);
  ctx.fillRect(0, N - 9, 9, 9);
  f(1, 1);
  f(N - 8, 1);
  f(1, N - 8);
}
