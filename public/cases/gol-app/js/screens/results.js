'use strict';

let resultsFilter = 0,
  resultsSort = 0,
  selectedFare = 0,
  pendingFlight = null;

function progressMarkup(i) {
  const L = ['Voos', 'Passageiros', 'Extras', 'Assentos', 'Pagamento'];
  return `<div class="bars">${L.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'cur' : ''}"></i>`).join('')}</div><div class="lbl"><span>Etapa ${i + 1} de 5</span><b>${L[i]}</b></div>`;
}

function currentLegContext() {
  const b = booking.leg === 'back';
  return {
    b,
    o: b ? booking.to : booking.from,
    d: b ? booking.from : booking.to,
    date: b ? booking.back : booking.out
  };
}

let resultsLoadTimer = null;

screenRenderers.results = function () {
  const { b, o, d, date } = currentLegContext();
  $('#rTitle').innerHTML =
    `<b>${AIRPORTS[o].c} → ${AIRPORTS[d].c}</b><small>${b ? 'Volta' : 'Ida'} · ${formatWeekdayDate(date)} · ${booking.pax} adulto${booking.pax > 1 ? 's' : ''}</small>`;
  $('#prog-results').innerHTML = progressMarkup(0);
  const days = [-3, -2, -1, 0, 1, 2, 3].map(i => addDays(date, i));
  const prices = days.map(x =>
    daysBetween(x, TODAY) >= 1 && !(b && x < booking.out) ? cheapestFare(o, d, x) : null
  );
  const vmin = Math.min(...prices.filter(Boolean));
  $('#rBody').innerHTML = `
    ${booking.type ? `<div class="legsteps"><span class="${b ? 'done' : 'on'}">${b ? '✓ ' : ''}Ida</span><i></i><span class="${b ? 'on' : ''}">Volta</span></div>` : ''}
    ${b && booking.sel.out ? `<div class="picked">${iconSvg('check', 's')}<span>Ida: <b>${booking.sel.out.num} · ${formatTime(booking.sel.out.dep)}</b> · ${FARES[booking.fare.out].n}</span></div>` : ''}
    <div class="datebar" id="rDates">${days.map((x, i) => `<button class="dbtn ${i === 3 ? 'on' : ''} ${prices[i] === vmin ? 'low' : ''}" ${prices[i] ? '' : 'disabled'} onclick="shiftSearchDate(${i - 3})"><span>${WEEKDAYS_SHORT[x.getDay()]}</span><b>${formatDayMonth(x)}</b><em>${prices[i] ? (booking.useMiles ? formatNumber(toMiles(prices[i]) / 1000) + ' mil' : formatCurrency(prices[i])) : '—'}</em></button>`).join('')}</div>
    <div class="chips" id="rChips">${['Todos', 'Diretos', 'Manhã', 'Tarde', 'Noite'].map((c, i) => `<button class="chip ${i === resultsFilter ? 'on' : ''}" onclick="resultsFilter=${i};$$('#rChips .chip').forEach((x,k)=>x.classList.toggle('on',k===${i}));renderFlightList(true)">${c}</button>`).join('')}</div>
    <div class="rlist" id="rList">${'<div class="sk"></div>'.repeat(3)}</div>`;
  requestAnimationFrame(() => {
    const db = $('#rDates');
    if (db) db.scrollLeft = (db.scrollWidth - db.clientWidth) / 2;
  });
  clearTimeout(resultsLoadTimer);
  resultsLoadTimer = setTimeout(() => renderFlightList(), prefersReducedMotion ? 0 : 750);
};

function shiftSearchDate(n) {
  if (!n) return;
  const { b } = currentLegContext();
  if (b) booking.back = addDays(booking.back, n);
  else {
    booking.out = addDays(booking.out, n);
    if (booking.type && booking.back <= booking.out) booking.back = addDays(booking.out, 3);
  }
  screenRenderers.results();
}

function renderFlightList() {
  const { o, d, date } = currentLegContext(),
    all = flightsFor(o, d, date);
  let list = all.filter(
    f =>
      resultsFilter === 0 ||
      (resultsFilter === 1 && !f.via) ||
      (resultsFilter === 2 && f.dep < 720) ||
      (resultsFilter === 3 && f.dep >= 720 && f.dep < 1080) ||
      (resultsFilter === 4 && f.dep >= 1080)
  );
  list = [...list].sort((a, b) =>
    resultsSort === 0 ? a.price - b.price : resultsSort === 1 ? a.dep - b.dep : a.dur - b.dur
  );
  const minP = Math.min(...all.map(f => f.price)),
    fast = Math.min(...all.map(f => f.dur));
  const el = $('#rList');
  if (!el) return;
  el.classList.remove('rise');
  void el.offsetWidth;
  el.classList.add('rise');
  el.innerHTML = list.length
    ? list
        .map(f => {
          const tags =
            (f.price === minP ? '<span class="pill brand">Menor preço</span>' : '') +
            (f.dur === fast && f.price !== minP ? '<span class="pill">Mais rápido</span>' : '') +
            (f.left ? `<span class="pill warn">Últimos ${f.left} lugares nesse preço</span>` : '');
          return `<button class="fcard" onclick="openFarePicker(${f.i})">${tags ? `<div class="fc-tags">${tags}</div>` : ''}${legRowMarkup(f)}
      <div class="fc-foot"><span>${f.num} · ${f.ac.replace('Boeing ', '')}</span><span class="fc-price"><small>por pessoa</small><b>${booking.useMiles ? formatNumber(toMiles(f.price)) + ' mi' : formatCurrency(f.price)}</b></span></div></button>`;
        })
        .join('')
    : `<div class="empty">Nenhum voo com esse filtro nesse dia. Tente outro horário ou outra data.</div>`;
}

function goBackFromResults() {
  if (booking.leg === 'back') {
    booking.leg = 'out';
    screenRenderers.results();
    $('#rBody').animate(
      [
        { opacity: 0, transform: 'translateX(-30px)' },
        { opacity: 1, transform: 'none' }
      ],
      { duration: 350, easing: 'ease-out' }
    );
  } else goBack();
}

function openFarePicker(i) {
  const { o, d, date } = currentLegContext();
  pendingFlight = flightsFor(o, d, date)[i];
  selectedFare = 0;
  openSheet('fare');
}

function fareButtonLabel() {
  return 'Continuar com ' + FARES[selectedFare].n;
}

function confirmFare() {
  booking.sel[booking.leg] = pendingFlight;
  booking.fare[booking.leg] = selectedFare;
  closeSheet();
  if (booking.leg === 'out' && booking.type === 1) {
    booking.leg = 'back';
    setTimeout(() => {
      screenRenderers.results();
      $('#rBody').animate(
        [
          { opacity: 0, transform: 'translateX(40px)' },
          { opacity: 1, transform: 'none' }
        ],
        { duration: 380, easing: 'ease-out' }
      );
      $('#rBody').scrollTop = 0;
      showToast('Ida escolhida. Agora, a volta.', 'check');
    }, 180);
  } else setTimeout(openPassengers, 180);
}
