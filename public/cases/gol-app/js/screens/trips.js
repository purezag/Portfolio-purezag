'use strict';

let tripsTab = 0,
  activeTripId = null;

screenRenderers.trips = function () {
  const up = trips.filter(t => t.legs.some(l => daysBetween(l.date, TODAY) >= 0));
  $('#tripsBody').innerHTML = `<div class="page-h"><h1 class="h-xl">Minhas viagens</h1></div>
    <div class="pad"><div class="seg" id="tSeg" style="--i:${tripsTab}"><button class="${tripsTab === 0 ? 'on' : ''}" onclick="switchTripsTab(0)">Próximas · ${up.length}</button><button class="${tripsTab === 1 ? 'on' : ''}" onclick="switchTripsTab(1)">Anteriores</button></div></div>
    <div class="tlist rise" id="tList">${tripListMarkup(up)}</div>`;
};

screenResumers.trips = screenRenderers.trips;

function tripListMarkup(up) {
  if (tripsTab === 0)
    return up.length
      ? up
          .map(t => {
            const l = t.legs[0],
              last = t.legs[t.legs.length - 1],
              d = DESTINATIONS[l.d],
              n = daysBetween(l.date, TODAY);
            return `<button class="tcard" onclick="openTrip('${t.id}')"><div class="tc-ph">${photoMarkup(d ? d.card : 'air-1', 's')}<span class="pill glass">${n === 0 ? 'Hoje' : n === 1 ? 'Amanhã' : 'Em ' + n + ' dias'}</span></div>
      <div class="tc-b"><div class="tc-top"><b class="tc-route">${AIRPORTS[l.o].c} → ${AIRPORTS[l.d].c}</b>${statusPillMarkup(l)}</div>
      <span class="tc-meta">${formatWeekdayDate(l.date)}${t.legs.length > 1 ? ' a ' + formatWeekdayDate(last.date) : ''} · ${t.pax.length === 1 ? '1 pessoa' : t.pax.length + ' pessoas'} · <span class="mono">${t.id}</span></span></div></button>`;
          })
          .join('')
      : `<div class="empty">Nenhuma viagem marcada. Que tal procurar uma?</div>`;
  return PAST_TRIPS.map(p => {
    const d = DESTINATIONS[p.d];
    return `<button class="tcard past" onclick="showToast('Essa viagem rendeu ${formatNumber(p.mi)} milhas','star')"><div class="tc-ph">${photoMarkup(d ? d.card : 'air-1', 's')}</div>
    <div class="tc-b"><div class="tc-top"><b class="tc-route">${AIRPORTS[p.o].c} → ${AIRPORTS[p.d].c}</b><span class="pill">+${formatNumber(p.mi)} milhas</span></div><span class="tc-meta">${formatDayMonth(p.date)} de ${p.date.getFullYear()} · ${p.num}</span></div></button>`;
  }).join('');
}

function switchTripsTab(i) {
  tripsTab = i;
  $('#tSeg').style.setProperty('--i', i);
  $$('#tSeg button').forEach((b, k) => b.classList.toggle('on', k === i));
  const up = trips.filter(t => t.legs.some(l => daysBetween(l.date, TODAY) >= 0));
  const el = $('#tList');
  el.classList.remove('rise');
  void el.offsetWidth;
  el.classList.add('rise');
  el.innerHTML = tripListMarkup(up);
}

function openTrip(id, fromDone) {
  activeTripId = id;
  if (fromDone) {
    navStack = [{ id: 'trips', k: 'fade' }];
    tripsTab = 0;
    screenRenderers.trips();
    screens.trips.classList.remove('on');
    navStack.push({ id: 'trip', k: 'push' });
    transitionScreens('done', 'trip', 'push');
  } else navigate('trip');
}

screenRenderers.trip = function () {
  const t = trips.find(x => x.id === activeTripId),
    l0 = t.legs[0],
    d = DESTINATIONS[l0.d];
  $('#tTopT').textContent = AIRPORTS[l0.d].c;
  $('#tTop').classList.remove('solid');
  $('#tripBody').scrollTop = 0;
  $('#tripBody').innerHTML =
    `<div class="t-hero">${photoMarkup(d ? d.ph[0] : 'air-1', 'l', '', true)}<div class="t-hero-tx"><span class="pill glass">Localizador <span class="mono">${t.id}</span></span><h1 class="h-dest">${AIRPORTS[l0.d].c}</h1>
      <p>${formatWeekdayDate(l0.date)}${t.legs.length > 1 ? ' a ' + formatWeekdayDate(t.legs[1].date) : ''} · ${t.pax.map(p => escapeHtml(p.first)).join(' e ')}</p></div></div>
    <div class="t-body rise">
      ${t.legs.map((l, i) => legCardMarkup(t, l, i)).join('')}
      <h2 class="h-m">Passageiros</h2>
      <div class="plist">${t.pax.map((p, pi) => `<div class="prow"><span class="av">${escapeHtml(p.first.charAt(0))}</span><span class="grow"><b>${escapeHtml(p.first + ' ' + p.last)}</b><small>${t.legs.map((l, i) => (t.legs.length > 1 ? (i ? 'Volta ' : 'Ida ') : 'Assento ') + (l.seats[pi] || 'a definir')).join(' · ')}</small></span></div>`).join('')}</div>
      <h2 class="h-m">Gerenciar</h2>
      <div class="manage">
        <button class="mbtn" onclick="showToast('Troca de assento chega na próxima versão','seat')">${iconSvg('seat')}Trocar assento</button>
        <button class="mbtn" onclick="openSheet('bags')">${iconSvg('bag')}Adicionar mala</button>
        <button class="mbtn" onclick="showToast('Remarcação chega na próxima versão','cal')">${iconSvg('cal')}Remarcar voo</button>
        <button class="mbtn" onclick="showToast('Viagem adicionada à sua agenda','cal')">${iconSvg('clock')}Adicionar à agenda</button>
      </div>
    </div>`;
};

screenResumers.trip = screenRenderers.trip;

function legCardMarkup(t, l, i) {
  const n = daysBetween(l.date, TODAY),
    opens = n - 2;
  const tl = [
    [
      l.checked ? 'ok' : canCheckIn(l) ? 'now' : '',
      'Check-in',
      l.checked
        ? 'Feito. Cartão de embarque na aba Cartão.'
        : canCheckIn(l)
          ? 'Aberto agora, leva menos de 1 minuto.'
          : `Abre em ${opens} dia${opens > 1 ? 's' : ''}, em ${formatDayMonth(addDays(l.date, -2))}.`
    ],
    [
      l.checked ? 'now' : '',
      'Embarque',
      l.checked
        ? `${formatTime(l.board)} · portão ${l.gate} · grupo ${l.group}`
        : 'Portão e horário aparecem após o check-in.'
    ],
    [
      '',
      'Decolagem',
      `${formatTime(l.dep)} de ${AIRPORTS[l.o].c}${l.via ? ` · conexão em ${AIRPORTS[l.via].c}` : ''}`
    ],
    ['', 'Chegada', `${formatTime(l.arr)} em ${AIRPORTS[l.d].c}`]
  ];
  return `<section class="lcard"><div class="lc-h"><span>${t.legs.length > 1 ? (i === 0 ? 'Ida · ' : 'Volta · ') : ''}${capitalize(formatLongDate(l.date))}</span>${statusPillMarkup(l)}</div>
    ${legRowMarkup(l)}
    <div class="lc-meta"><span>${l.num}</span><span>${l.ac}</span><span>Tarifa ${FARES[l.fare].n}</span></div>
    <ol class="timeline">${tl.map(s => `<li class="${s[0]}"><i>${s[0] === 'ok' ? iconSvg('check', 's') : ''}</i><span><b>${s[1]}</b><small>${s[2]}</small></span></li>`).join('')}</ol>
    ${canCheckIn(l) ? (l.checked ? `<button class="btn block dark" onclick="openBoardingPass('${t.id}',${i})">Ver cartão de embarque</button>` : `<button class="btn block" onclick="startCheckIn('${t.id}',${i})">Fazer check-in</button>`) : `<button class="btn block soft" onclick="openBoardingPass('${t.id}',${i})">Ver cartão de embarque</button>`}
  </section>`;
}

$('#tripBody').addEventListener(
  'scroll',
  e => {
    const s = e.target.scrollTop > 250;
    $('#tTop').classList.toggle('solid', s);
    if (currentScreen() === 'trip') app.dataset.sb = s ? 'dark' : 'light';
  },
  { passive: true }
);
