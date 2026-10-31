'use strict';

let destinationView = { code: 'SSA', promo: null, miles: false, start: null, sel: null };

function openDestination(code, o = {}) {
  destinationView = { code, promo: o.promo ?? null, miles: !!o.miles };
  if (o.promo != null) markTourStep('promo');
  if (o.miles) markTourStep('miles');
  navigate('dest');
}

screenRenderers.dest = function () {
  const c = destinationView.code,
    d = DESTINATIONS[c],
    p = destinationView.promo != null ? PROMOS[destinationView.promo] : null,
    best = bestDeal(c, p);
  destinationView.sel = best.date;
  let st = addDays(best.date, -4);
  if (daysBetween(st, TODAY) < 1) st = addDays(TODAY, 1);
  destinationView.start = st;
  $('#dHero').innerHTML =
    photoMarkup(d.ph[0], 'l', '', true) +
    `<span class="d-photos">${iconSvg('photos', 's')}${d.ph.length} fotos</span>`;
  $('#dHero').style.transform = '';
  $('#dFav').innerHTML = favoriteButtonMarkup(c, true);
  $('#dTopT').textContent = d.name;
  $('#dTop').classList.remove('solid');
  $('#dScroll').scrollTop = 0;
  const r = routeInfo('POA', c),
    f = flightsFor('POA', c, best.date),
    typ = r.hub ? f.filter(x => x.via).sort((a, b) => a.dur - b.dur)[0] : f[0];
  $('#dBody').innerHTML = `
    <div class="d-title"><h1 class="h-dest">${d.name}</h1><p>${d.where}${c === 'GRU' ? '' : ' · saindo de Porto Alegre'}</p></div>
    ${p ? `<div class="d-promo">${iconSvg('spark', 's')}<span><b>${p.tag}.</b> ${p.sub}</span></div>` : ''}
    <div class="facts">
      <div><span>Voo de POA</span><b>${formatDuration(typ.dur)}</b><small>${r.hub ? '1 parada' : 'direto'}</small></div>
      <div><span>Clima em ${MONTHS[best.date.getMonth()]}</span><b>${d.temp}</b><small>${d.sky}</small></div>
      <div><span>Fuso</span><b>${d.tz[0]}</b><small>${d.tz[1]}</small></div>
    </div>
    <div class="d-sec"><h2 class="h-m">Quando você quer ir?</h2><p class="muted sm">Preço da ida por pessoa${destinationView.miles ? ', em milhas' : ''}, nos próximos 14 dias. Toque num dia.</p></div>
    <div class="chart" id="dChart" role="group" aria-label="Preços por dia"></div>
    <div class="chart-legend"><span><i style="background:var(--brand-soft)"></i>Dia mais barato</span><span><i style="background:var(--brand)"></i>Selecionado</span></div>
    <div class="d-sec"><h2 class="h-m">O que não perder</h2></div>
    <ul class="tips">${d.tips.map(t => `<li><b>${t[0]}</b><p>${t[1]}</p></li>`).join('')}</ul>
    ${d.note ? `<div class="note">${iconSvg('info', 's')}<p>${d.note}</p></div>` : ''}
    <div class="gallery">${d.ph.map((n, i) => `<button class="gal" onclick="openDestinationPhoto(${i},this)" aria-label="Ver foto ${i + 1} de ${d.ph.length} em tela cheia">${photoMarkup(n, 's')}<span class="gal-ex">${iconSvg('expand', 's')}</span></button>`).join('')}</div>
    <p class="credit">Fotos: ${[...new Set(d.ph.map(n => PHOTOS[n].a))].join(', ')} · Unsplash</p>`;
  renderChart();
  renderDestinationCta();
};

function renderChart() {
  const c = destinationView.code,
    days = [...Array(14)].map((_, i) => addDays(destinationView.start, i)),
    vals = days.map(x => cheapestFare('POA', c, x));
  const max = Math.max(...vals),
    min = Math.min(...vals);
  $('#dChart').innerHTML = days
    .map((x, i) => {
      const v = vals[i],
        sel = isSameDay(x, destinationView.sel),
        lbl = destinationView.miles ? formatNumber(toMiles(v) / 1000) + ' mil' : formatCurrency(v);
      return `<button class="bar ${v === min ? 'low' : ''} ${sel ? 'sel' : ''}" style="--h:${Math.round((v / max) * 100)};--d:${i * 28}ms" onclick="selectChartDay(${x.getTime()})" aria-label="${formatWeekdayDate(x)}: ${destinationView.miles ? formatNumber(toMiles(v)) + ' milhas' : formatCurrency(v)}" aria-pressed="${sel}">
      ${sel ? `<em>${lbl}</em>` : ''}<i></i><b>${x.getDate()}</b><span>${WEEKDAYS_SHORT[x.getDay()].charAt(0).toUpperCase()}</span></button>`;
    })
    .join('');
}

function selectChartDay(ts) {
  destinationView.sel = new Date(ts);
  renderChart();
  renderDestinationCta();
}

function renderDestinationCta() {
  const c = destinationView.code,
    o = cheapestFare('POA', c, destinationView.sel),
    b = cheapestFare(c, 'POA', addDays(destinationView.sel, 3)),
    rt = o + b;
  $('#dCta').innerHTML =
    `<div class="cta-sum"><small>Ida e volta · ${formatDayMonth(destinationView.sel)} a ${formatDayMonth(addDays(destinationView.sel, 3))}</small><b>${destinationView.miles ? formatNumber(toMiles(rt)) + ' milhas' : formatCurrency(rt)}</b></div><button class="btn" onclick="searchFromDestination()">Ver voos ${iconSvg('arrow', 's')}</button>`;
}

function searchFromDestination() {
  Object.assign(booking, {
    from: 'POA',
    to: destinationView.code,
    type: 1,
    out: new Date(destinationView.sel),
    back: addDays(destinationView.sel, 3),
    useMiles: destinationView.miles,
    leg: 'out'
  });
  booking.sel = { out: null, back: null };
  navigate('results');
}

$('#dScroll').addEventListener(
  'scroll',
  e => {
    const y = e.target.scrollTop;
    $('#dHero').style.transform = `translate3d(0,${-y * 0.35}px,0) scale(${1 + Math.max(0, -y) / 500})`;
    const solid = y > 340;
    $('#dTop').classList.toggle('solid', solid);
    if (currentScreen() === 'dest') app.dataset.sb = solid ? 'dark' : 'light';
  },
  { passive: true }
);

function openDestinationPhoto(i, el) {
  const d = DESTINATIONS[destinationView.code];
  openPhotoViewer(d.ph, i, el, d.name, () => $$('#dBody .gal'));
}

function openDestinationHero() {
  const d = DESTINATIONS[destinationView.code];
  openPhotoViewer(d.ph, 0, $('#dHero'), d.name, () => [$('#dHero'), ...$$('#dBody .gal').slice(1)]);
}
