'use strict';

const booking = {
  type: 1,
  from: 'POA',
  to: 'SSA',
  out: addDays(TODAY, 9),
  back: addDays(TODAY, 13),
  pax: 1,
  useMiles: false,
  leg: 'out',
  sel: { out: null, back: null },
  fare: { out: 0, back: 0 },
  paxList: [],
  ext: { bag: false, prio: false, ins: false, co2: false },
  seats: { out: [], back: [] },
  pm: 'pix',
  inst: 1
};

const RECENT_SEARCHES = [
  ['POA', 'GRU'],
  ['POA', 'FLN'],
  ['POA', 'EZE']
];

function openSearch() {
  navigate('search', 'up');
}

screenRenderers.search = function () {
  $('#searchBody').innerHTML = `<div class="sform rise">
    <div class="seg" id="sSeg" style="--i:${booking.type ? 0 : 1}"><button class="${booking.type ? 'on' : ''}" onclick="setTripType(1)">Ida e volta</button><button class="${booking.type ? '' : 'on'}" onclick="setTripType(0)">Só ida</button></div>
    <div class="od">
      <button class="od-row" onclick="openAirportPicker('from')"><span class="lab">De</span><b id="sFromC"></b><small id="sFromN"></small></button>
      <button class="od-row" onclick="openAirportPicker('to')"><span class="lab">Para</span><b id="sToC"></b><small id="sToN"></small></button>
      <button class="od-swap" id="sSwap" onclick="swapAirports()" aria-label="Inverter origem e destino">${iconSvg('swap')}</button>
    </div>
    <div class="two">
      <button class="box" onclick="openCalendar('out')"><span>${iconSvg('cal', 's')}Ida</span><b id="sOut"></b></button>
      <button class="box" id="sBackBox" onclick="openCalendar('back')"><span>${iconSvg('cal', 's')}Volta</span><b id="sBack"></b></button>
    </div>
    <div class="box row"><span class="grow" style="display:grid;gap:3px"><span style="display:flex;align-items:center;gap:6px;font:600 12px var(--ui);color:var(--ink-3)">${iconSvg('users', 's')}Passageiros</span><b id="sPax"></b></span>
      <span class="stepper"><button id="sMinus" onclick="changePassengerCount(-1)" aria-label="Remover passageiro">${iconSvg('minus', 's')}</button><output id="sPaxN"></output><button id="sPlus" onclick="changePassengerCount(1)" aria-label="Adicionar passageiro">${iconSvg('plus', 's')}</button></span></div>
    <label class="box row"><span class="grow" style="display:grid;gap:2px"><b class="b15">Usar milhas Smiles</b><small>Você tem ${formatNumber(user.miles)} milhas</small></span>
      <span class="switch"><input type="checkbox" id="sMiles" onchange="booking.useMiles=this.checked"><i></i></span></label>
    <div class="recent"><h3 class="mini-h">Buscas recentes</h3><div class="chips">${RECENT_SEARCHES.map((r, i) => `<button class="chip" onclick="useRecentSearch(${i})">${r[0]} → ${r[1]}</button>`).join('')}</div></div>
  </div>`;
  updateSearchForm();
};

screenResumers.search = () => updateSearchForm();

function updateSearchForm() {
  if (!$('#sFromC')) return;
  $('#sFromC').textContent = AIRPORTS[booking.from].c;
  $('#sFromN').textContent = booking.from + ' · ' + AIRPORTS[booking.from].n;
  $('#sToC').textContent = AIRPORTS[booking.to].c;
  $('#sToN').textContent = booking.to + ' · ' + AIRPORTS[booking.to].n;
  $('#sOut').textContent = formatWeekdayDate(booking.out);
  $('#sBack').textContent = booking.type ? formatWeekdayDate(booking.back) : 'Só ida';
  $('#sBackBox').classList.toggle('dim', !booking.type);
  $('#sPax').textContent = booking.pax + ' adulto' + (booking.pax > 1 ? 's' : '');
  $('#sPaxN').textContent = booking.pax;
  $('#sMinus').disabled = booking.pax <= 1;
  $('#sPlus').disabled = booking.pax >= 6;
  $('#sMiles').checked = booking.useMiles;
  const sg = $('#sSeg');
  sg.style.setProperty('--i', booking.type ? 0 : 1);
  $$('button', sg).forEach((b, i) => b.classList.toggle('on', i === (booking.type ? 0 : 1)));
}

function setTripType(t) {
  booking.type = t;
  if (t && (!booking.back || booking.back <= booking.out)) booking.back = addDays(booking.out, 4);
  updateSearchForm();
}

function swapAirports() {
  [booking.from, booking.to] = [booking.to, booking.from];
  $('#sSwap').classList.toggle('flip');
  updateSearchForm();
}

function changePassengerCount(d) {
  booking.pax = Math.min(6, Math.max(1, booking.pax + d));
  updateSearchForm();
}

function useRecentSearch(i) {
  booking.from = RECENT_SEARCHES[i][0];
  booking.to = RECENT_SEARCHES[i][1];
  updateSearchForm();
  showToast('Busca preenchida', 'search');
}

function searchFlights() {
  if (booking.from === booking.to) {
    showToast('Escolha destinos diferentes', 'info');
    return;
  }
  booking.leg = 'out';
  booking.sel = { out: null, back: null };
  navigate('results');
}

let airportField = 'from';

function openAirportPicker(t) {
  airportField = t;
  openSheet('airports');
}

function airportRowMarkup(c, near) {
  return `<button class="aprow" onclick="selectAirport('${c}')"><span class="code ${near ? 'near' : ''}">${near ? iconSvg('pin', 's') : c}</span><span class="grow"><b>${AIRPORTS[c].c}</b><small>${near ? c + ' · ' + AIRPORTS[c].n + ' · perto de você' : AIRPORTS[c].n + (AIRPORTS[c].cc ? ' · ' + AIRPORTS[c].cc : '')}</small></span>${DESTINATIONS[c] ? photoMarkup(DESTINATIONS[c].card, 's') : ''}</button>`;
}

function airportListMarkup(q) {
  q = normalizeText(q || '').trim();
  if (q) {
    const codes = Object.keys(AIRPORTS).filter(c =>
      normalizeText(c + ' ' + AIRPORTS[c].c + ' ' + AIRPORTS[c].n + ' ' + (AIRPORTS[c].cc || '')).includes(q)
    );
    return codes.length
      ? `<p class="ap-h">${codes.length} resultado${codes.length > 1 ? 's' : ''}</p>` +
          codes.map(c => airportRowMarkup(c)).join('')
      : '<p class="empty">Nenhum aeroporto com esse nome. Tente pela cidade, como "Recife".</p>';
  }
  const other = airportField === 'from' ? booking.to : booking.from,
    near = airportField === 'from' ? ['POA'] : [];
  const pop = ['GRU', 'GIG', 'SSA', 'FLN', 'REC', 'BSB'].filter(c => c !== other && !near.includes(c));
  const rest = Object.keys(AIRPORTS).filter(c => !pop.includes(c) && !near.includes(c));
  return (
    (near.length ? '<p class="ap-h">Perto de você</p>' + airportRowMarkup('POA', true) : '') +
    '<p class="ap-h">Mais buscados</p>' +
    pop.map(c => airportRowMarkup(c)).join('') +
    '<p class="ap-h">Todos os aeroportos</p>' +
    rest.map(c => airportRowMarkup(c)).join('')
  );
}

function filterAirports(v) {
  $('#apBox').classList.toggle('has', !!v);
  $('#apList').innerHTML = airportListMarkup(v);
}

function clearAirportSearch(e) {
  e.preventDefault();
  const i = $('#apQ');
  i.value = '';
  filterAirports('');
  i.focus();
}

function selectAirport(c) {
  if (airportField === 'from') {
    if (c === booking.to) booking.to = booking.from;
    booking.from = c;
  } else {
    if (c === booking.from) booking.from = booking.to;
    booking.to = c;
  }
  closeSheet();
  updateSearchForm();
}

let calendarField = 'out';

function openCalendar(t) {
  if (t === 'back' && !booking.type) setTripType(1);
  calendarField = t;
  openSheet('cal');
}

function calendarMarkup() {
  let h = '';
  for (let k = 0; k < 3; k++) {
    const m = new Date(TODAY.getFullYear(), TODAY.getMonth() + k, 1),
      days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    h += `<div class="cal-m"><b>${capitalize(MONTHS[m.getMonth()])} ${m.getFullYear()}</b><div class="cal-g">`;
    for (let i = 0; i < m.getDay(); i++) h += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const dt = new Date(m.getFullYear(), m.getMonth(), d),
        n = daysBetween(dt, TODAY);
      const dis = n < 1 || (calendarField === 'back' && dt <= booking.out);
      const sel = isSameDay(dt, booking.out) || (booking.type && isSameDay(dt, booking.back)),
        mid = booking.type && booking.back && dt > booking.out && dt < booking.back;
      h += `<button class="${sel ? 'sel' : ''} ${mid ? 'mid' : ''}" ${dis ? 'disabled' : ''} onclick="selectCalendarDay(${dt.getTime()})" aria-label="${formatLongDate(dt)}">${d}</button>`;
    }
    h += '</div></div>';
  }
  return h;
}

function calendarHeading() {
  return calendarField === 'out'
    ? ['Quando você vai?', booking.type ? 'Escolha a ida. Depois, a volta.' : 'Escolha o dia da ida.']
    : ['E quando volta?', 'A volta precisa ser depois da ida.'];
}

function selectCalendarDay(ts) {
  const dt = new Date(ts);
  if (calendarField === 'out') {
    booking.out = dt;
    if (booking.type) {
      if (!booking.back || booking.back <= dt) booking.back = addDays(dt, 3);
      calendarField = 'back';
      const [a, b] = calendarHeading();
      $('#calT').textContent = a;
      $('#calS').textContent = b;
      $('#calBody').innerHTML = calendarMarkup();
      updateSearchForm();
      return;
    }
  } else booking.back = dt;
  $('#calBody').innerHTML = calendarMarkup();
  updateSearchForm();
  setTimeout(closeSheet, 260);
}
