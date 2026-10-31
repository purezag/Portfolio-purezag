'use strict';

function selectedLegs() {
  const a = [{ ...booking.sel.out, fare: booking.fare.out, key: 'out' }];
  if (booking.type && booking.sel.back) a.push({ ...booking.sel.back, fare: booking.fare.back, key: 'back' });
  return a;
}

function seatFee(id, fare) {
  const r = parseInt(id, 10);
  if (r <= 4) return fare === 2 ? 0 : 59;
  if (r === 15 || r === 16) return 49;
  return 0;
}

function orderTotals() {
  const legs = selectedLegs(),
    paxCount = booking.pax,
    lines = [];
  let sum = 0;
  legs.forEach(l => {
    const v = (l.price + FARES[l.fare].add) * paxCount;
    sum += v;
    lines.push([
      `${l.key === 'out' ? 'Ida' : 'Volta'} · tarifa ${FARES[l.fare].n} · ${paxCount} pessoa${paxCount > 1 ? 's' : ''}`,
      v
    ]);
  });
  const tax = 37 * paxCount * legs.length;
  lines.push(['Taxas de embarque', tax]);
  const light = legs.filter(l => l.fare === 0).length,
    notMax = legs.filter(l => l.fare < 2).length;
  const addLine = (on, label, v) => {
    if (on && v) {
      lines.push([label, v]);
      sum += v;
    }
  };
  addLine(booking.ext.bag, 'Mala despachada', 75 * paxCount * light);
  addLine(booking.ext.prio, 'Embarque prioritário', 29 * paxCount * notMax);
  addLine(booking.ext.ins, 'Seguro viagem', 39 * paxCount);
  addLine(booking.ext.co2, 'Compensação de carbono', 8 * legs.length);
  let sf = 0;
  legs.forEach(l =>
    (booking.seats[l.key] || []).forEach(id => {
      if (id) sf += seatFee(id, l.fare);
    })
  );
  addLine(true, 'Assentos especiais', sf);
  const sub = sum + tax,
    pixOff = Math.round(sub * 0.05);
  return {
    lines,
    sub,
    tax,
    pixOff,
    total: booking.pm === 'pix' ? sub - pixOff : sub,
    miles: toMiles(sub - tax)
  };
}

const displayedTotals = new WeakMap();

function renderTotal() {
  if (!booking.sel.out) return;
  const T = orderTotals(),
    milesPay = booking.pm === 'miles';
  $$('.tTotal').forEach(el => {
    const target = milesPay ? T.miles : T.total,
      from = displayedTotals.get(el) ?? target,
      t0 = performance.now();
    displayedTotals.set(el, target);
    const fmt = v => (milesPay ? formatNumber(v) + ' mi' : formatCurrency(v));
    if (from === target || prefersReducedMotion) {
      el.textContent = fmt(target);
      return;
    }
    (function st(t) {
      const k = Math.min((t - t0) / 450, 1),
        e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (target - from) * e);
      if (k < 1) requestAnimationFrame(st);
    })(t0);
  });
}

function openPassengers() {
  const pl = [];
  for (let i = 0; i < booking.pax; i++)
    pl.push(
      booking.paxList[i] ||
        (i === 0
          ? { first: user.first, last: user.last, doc: user.doc, email: user.email }
          : { first: '', last: '', doc: '' })
    );
  booking.paxList = pl;
  navigate('pax');
}

screenRenderers.pax = function () {
  $('#prog-pax').innerHTML = progressMarkup(1);
  $('#paxSub').textContent = booking.pax + ' adulto' + (booking.pax > 1 ? 's' : '');
  const intl = ['EZE', 'MVD', 'SCL'].includes(booking.to) || ['EZE', 'MVD', 'SCL'].includes(booking.from);
  $('#paxBody').innerHTML = `<div class="stack rise">
    <p class="lead">Use o nome igual ao do documento.${intl ? ' Pra Argentina, Uruguai e Chile vale RG ou passaporte.' : ''}</p>
    ${booking.paxList
      .map(
        (
          p,
          i
        ) => `<section class="paxc"><div class="paxc-h"><span class="pnum">${i + 1}</span><b>${i === 0 ? 'Você' : 'Passageiro ' + (i + 1)}</b>
      ${i > 0 ? `<span class="saved">${SAVED_TRAVELERS.map((s, k) => `<button class="chip sm" onclick="fillSavedTraveler(${i},${k})">${s.first}</button>`).join('')}</span>` : ''}</div>
      <div class="two"><div class="inp"><label for="pf${i}">Nome</label><input id="pf${i}" value="${escapeHtml(p.first || '')}" autocomplete="off" autocapitalize="words" ${inputModeAttrs('text')}></div><div class="inp"><label for="pl${i}">Sobrenome</label><input id="pl${i}" value="${escapeHtml(p.last || '')}" autocomplete="off" autocapitalize="words" ${inputModeAttrs('text')}></div></div>
      <div class="inp"><label for="pd${i}">CPF</label><input id="pd${i}" ${inputModeAttrs('numeric')} value="${escapeHtml(p.doc || '')}" placeholder="000.000.000-00" oninput="maskCpf(this)" autocomplete="off"></div>
      ${i === 0 ? `<div class="inp"><label for="pe0">E-mail pra receber o bilhete</label><input id="pe0" ${inputModeAttrs('email')} value="${escapeHtml(p.email || user.email)}" autocomplete="off" autocapitalize="off"></div>` : ''}
      <p class="err" id="perr${i}" hidden></p></section>`
      )
      .join('')}
  </div>`;
  renderTotal();
};

function fillSavedTraveler(i, k) {
  const s = SAVED_TRAVELERS[k];
  $('#pf' + i).value = s.first;
  $('#pl' + i).value = s.last;
  $('#pd' + i).value = s.doc;
  showToast(s.first + ' adicionada à viagem', 'users');
}

function maskCpf(el) {
  const d = el.value.replace(/\D/g, '').slice(0, 11);
  let o = d;
  if (d.length > 9) o = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6, 9) + '-' + d.slice(9);
  else if (d.length > 6) o = d.slice(0, 3) + '.' + d.slice(3, 6) + '.' + d.slice(6);
  else if (d.length > 3) o = d.slice(0, 3) + '.' + d.slice(3);
  el.value = o;
}

function maskDate(el) {
  const d = el.value.replace(/\D/g, '').slice(0, 8);
  el.value =
    d.length > 4
      ? d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4)
      : d.length > 2
        ? d.slice(0, 2) + '/' + d.slice(2)
        : d;
}

function maskPhone(el) {
  const d = el.value.replace(/\D/g, '').slice(0, 11);
  el.value =
    d.length > 7
      ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
      : d.length > 2
        ? `(${d.slice(0, 2)}) ${d.slice(2)}`
        : d;
}

function scrollToElement(sc, el) {
  sc.scrollTo({
    top: sc.scrollTop + (el.getBoundingClientRect().top - sc.getBoundingClientRect().top) / phoneScale() - 16,
    behavior: 'smooth'
  });
}

function savePassengers() {
  let bad = null;
  booking.paxList = booking.paxList.map((p, i) => {
    const f = $('#pf' + i),
      l = $('#pl' + i),
      d = $('#pd' + i),
      er = $('#perr' + i);
    [f, l, d].forEach(x => x.classList.remove('bad'));
    er.hidden = true;
    const miss = [];
    if (!f.value.trim()) miss.push(f);
    if (!l.value.trim()) miss.push(l);
    if (d.value.replace(/\D/g, '').length !== 11) miss.push(d);
    if (miss.length) {
      miss.forEach(x => x.classList.add('bad'));
      er.textContent =
        miss.includes(d) && miss.length === 1
          ? 'O CPF precisa ter 11 números.'
          : 'Preencha nome, sobrenome e CPF.';
      er.hidden = false;
      if (!bad) bad = er.closest('.paxc');
    }
    return {
      first: f.value.trim(),
      last: l.value.trim(),
      doc: d.value,
      email: i === 0 ? $('#pe0').value : ''
    };
  });
  if (bad) {
    scrollToElement($('#paxBody'), bad);
    bad.animate(
      [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }],
      { duration: 300 }
    );
    return;
  }
  navigate('extras');
}

screenRenderers.extras = function () {
  $('#prog-extras').innerHTML = progressMarkup(2);
  const legs = selectedLegs(),
    light = legs.filter(l => l.fare === 0).length,
    maxAll = legs.every(l => l.fare === 2),
    n = legs.length;
  const row = (
    icon,
    t,
    sub,
    key,
    locked
  ) => `<label class="exrow ${locked ? 'locked' : ''}"><span class="ex-ic">${iconSvg(icon)}</span><span class="grow"><b>${t}</b><small>${sub}</small></span>
    <span class="switch"><input type="checkbox" ${locked || booking.ext[key] ? 'checked' : ''} ${locked ? 'disabled' : ''} onchange="booking.ext.${key}=this.checked;renderTotal()"><i></i></span></label>`;
  $('#exBody').innerHTML = `<div class="stack rise">
    <p class="lead">Dá pra mudar depois, em Minhas viagens.</p>
    ${row('bag', 'Mala despachada de 23 kg', light ? `R$ 75 por pessoa, ${light === n ? 'por trecho' : 'no trecho Light'}` : 'Já incluída na sua tarifa', 'bag', !light)}
    ${row('bolt', 'Embarque prioritário', maxAll ? 'Já incluído na tarifa Max' : `R$ 29 por pessoa, por trecho`, 'prio', maxAll)}
    ${row('shield', 'Seguro viagem', 'Despesas médicas e bagagem extraviada · R$ 39 por pessoa', 'ins', false)}
    ${row('leaf', 'Compensar o carbono do voo', 'Apoio a projetos de reflorestamento · R$ 8 por trecho', 'co2', false)}
  </div>`;
  renderTotal();
};
