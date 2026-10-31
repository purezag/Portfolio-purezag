'use strict';

const seatPicker = { leg: 'out', pax: 0 };

function openSeatMap() {
  ['out', 'back'].forEach(k => {
    if (!booking.seats[k] || booking.seats[k].length !== booking.pax)
      booking.seats[k] = Array(booking.pax).fill(null);
  });
  seatPicker.leg = 'out';
  seatPicker.pax = 0;
  navigate('seats');
}

function seatMapLegs() {
  return booking.type && booking.sel.back ? ['out', 'back'] : ['out'];
}

function occupiedSeats(f) {
  const s = new Set();
  for (let r = 1; r <= 30; r++)
    for (const c of 'ABCDEF') {
      const id = r + c;
      if (hashString(f.num + f.date.toDateString() + id) < (r <= 4 ? 0.3 : 0.44)) s.add(id);
    }
  return s;
}

screenRenderers.seats = function () {
  $('#prog-seats').innerHTML = progressMarkup(3);
  renderSeatHeader();
  renderCabin(true);
  renderTotal();
};

function renderSeatHeader() {
  const legs = seatMapLegs(),
    k = seatPicker.leg,
    f = booking.sel[k];
  $('#seatSub').textContent = `${f.o} → ${f.d} · ${f.num}`;
  $('#seatTop').innerHTML =
    `${legs.length > 1 ? `<div class="seg" style="--i:${legs.indexOf(k)}">${legs.map(x => `<button class="${x === k ? 'on' : ''}" onclick="switchSeatLeg('${x}')">${x === 'out' ? 'Ida' : 'Volta'} · ${booking.sel[x].o} → ${booking.sel[x].d}</button>`).join('')}</div>` : ''}
    <div class="pchips">${booking.paxList.map((p, i) => `<button class="pchip ${seatPicker.pax === i ? 'on' : ''}" onclick="seatPicker.pax=${i};renderSeatHeader()"><span class="av">${escapeHtml(p.first.charAt(0))}</span><span><b>${escapeHtml(p.first)}</b><small>${booking.seats[k][i] ? 'Assento ' + booking.seats[k][i] : 'Sem assento'}</small></span></button>`).join('')}</div>`;
  const all = legs.every(x => booking.seats[x].every(Boolean)),
    none = legs.every(x => booking.seats[x].every(s => !s));
  $('#seatBtn').textContent = none
    ? 'Pular por agora'
    : legs.length > 1 && k === 'out' && booking.seats.out.every(Boolean) && !booking.seats.back.every(Boolean)
      ? 'Ir pra volta'
      : 'Continuar';
  if (all) markTourStep('seat');
}

function switchSeatLeg(k) {
  seatPicker.leg = k;
  seatPicker.pax = Math.max(
    0,
    booking.seats[k].findIndex(x => !x)
  );
  const sg = $('#seatTop .seg');
  if (sg) sg.style.setProperty('--i', seatMapLegs().indexOf(k));
  setTimeout(
    () => {
      renderSeatHeader();
      renderCabin(true);
    },
    sg ? 220 : 0
  );
}

function renderCabin(fresh) {
  const k = seatPicker.leg,
    f = booking.sel[k],
    occ = occupiedSeats(f),
    mine = booking.seats[k],
    fare = booking.fare[k];
  let h = `<div class="seat-legend"><span><i class="lg-cf"></i>Conforto ${fare === 2 ? 'incluso' : '+R$ 59'}</span><span><i class="lg-ex"></i>Espaço extra +R$ 49</span><span><i class="lg-std"></i>Incluso</span><span><i class="lg-x"></i>Ocupado</span></div>`;
  if (user.win)
    h += `<p class="win-hint">${iconSvg('window', 's')}Marcamos com um ponto as janelas livres, do jeito que você gosta.</p>`;
  h += `<div class="cabin ${fresh ? 'rise' : ''}"><div class="cols"><span>A</span><span>B</span><span>C</span><span></span><span>D</span><span>E</span><span>F</span></div>`;
  for (let r = 1; r <= 30; r++) {
    if (r === 1) h += `<div class="zone">GOL+ Conforto</div>`;
    if (r === 5) h += `<div class="zone">Econômica</div>`;
    if (r === 15) h += `<div class="zone exit">Saídas de emergência</div>`;
    h += '<div class="srow">';
    for (const c of 'ABC|DEF') {
      if (c === '|') {
        h += `<span class="rn">${r}</span>`;
        continue;
      }
      const id = r + c,
        mi = mine.indexOf(id),
        taken = occ.has(id) && mi < 0,
        type = r <= 4 ? 'cf' : r === 15 || r === 16 ? 'ex' : '',
        w = user.win && (c === 'A' || c === 'F') && !taken && mi < 0;
      h += `<button class="seat ${type} ${taken ? 'x' : ''} ${mi >= 0 ? 'me' : ''} ${w ? 'w' : ''}" ${taken ? 'disabled' : ''} onclick="selectSeat('${id}')" aria-label="Assento ${id}${taken ? ', ocupado' : ''}">${mi >= 0 ? escapeHtml(booking.paxList[mi].first.charAt(0)) : ''}</button>`;
    }
    h += '</div>';
  }
  $('#seatBody').innerHTML = h + '</div>';
}

function selectSeat(id) {
  const k = seatPicker.leg,
    arr = booking.seats[k],
    owner = arr.indexOf(id);
  if (owner === seatPicker.pax) {
    arr[owner] = null;
  } else {
    if (owner >= 0) arr[owner] = null;
    arr[seatPicker.pax] = id;
    const fee = seatFee(id, booking.fare[k]);
    showToast(
      `${booking.paxList[seatPicker.pax].first} no ${id}${fee ? ` · +${formatCurrency(fee)}` : isWindowSeat(id) ? ' · janela' : ''}`,
      'seat'
    );
    const nx = arr.findIndex(x => !x);
    if (nx >= 0) seatPicker.pax = nx;
  }
  const sc = $('#seatBody').scrollTop;
  renderCabin(false);
  $('#seatBody').scrollTop = sc;
  renderSeatHeader();
  renderTotal();
}

function autoAssignSeats() {
  const k = seatPicker.leg,
    f = booking.sel[k],
    occ = occupiedSeats(f),
    n = booking.pax;
  const groups = user.win
    ? [
        ['A', 'B', 'C'],
        ['F', 'E', 'D']
      ]
    : [
        ['C', 'B', 'A'],
        ['D', 'E', 'F']
      ];
  for (let r = 6; r <= 30; r++) {
    if (r === 15 || r === 16) continue;
    for (const g of groups) {
      const pick = g.slice(0, Math.min(n, 3)).map(c => r + c);
      if (pick.every(id => !occ.has(id))) {
        booking.seats[k] = Array(n)
          .fill(null)
          .map((_, i) => pick[i] || null);
        if (n > 3) {
          const extra = g.map(c => r + 1 + c).filter(id => !occ.has(id));
          for (let i = 3; i < n; i++) booking.seats[k][i] = extra[i - 3] || null;
        }
        renderCabin(false);
        renderSeatHeader();
        renderTotal();
        showToast(n > 1 ? 'Escolhemos lugares juntos pra vocês' : 'Escolhemos uma janela pra você', 'spark');
        return;
      }
    }
  }
  showToast('Não achamos lugares juntos. Escolha no mapa.', 'info');
}

function continueFromSeats() {
  const legs = seatMapLegs();
  if (
    legs.length > 1 &&
    seatPicker.leg === 'out' &&
    booking.seats.out.some(Boolean) &&
    !booking.seats.back.every(Boolean)
  ) {
    switchSeatLeg('back');
    showToast('Agora, os assentos da volta', 'seat');
    return;
  }
  navigate('pay');
}
