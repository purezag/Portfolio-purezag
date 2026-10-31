'use strict';

let showPriceDetails = false;
screenRenderers.pay = function () {
  $('#prog-pay').innerHTML = progressMarkup(4);
  renderPayment(true);
};

function renderPayment(fresh) {
  const T = orderTotals(),
    canMiles = T.miles <= user.miles;
  if (booking.pm === 'miles' && !canMiles) booking.pm = 'pix';
  const T2 = orderTotals();
  $('#paySub').textContent =
    `${booking.from} → ${booking.to}${booking.type ? ' → ' + booking.from : ''} · ${booking.pax} pessoa${booking.pax > 1 ? 's' : ''}`;
  const pm = (v, icon, t, sub, tag, off) =>
    `<label class="pm ${off ? 'off' : ''}"><input type="radio" name="pm" value="${v}" ${booking.pm === v ? 'checked' : ''} ${off ? 'disabled' : ''} onchange="booking.pm='${v}';renderPayment()"><span class="radio"></span><span class="pm-ic">${iconSvg(icon)}</span><span class="grow"><b>${t}</b><small>${sub}</small></span>${tag ? `<span class="tag">${tag}</span>` : ''}</label>`;
  $('#payBody').innerHTML = `<div class="stack ${fresh ? 'rise' : ''}">
    <section class="psum">
      ${selectedLegs()
        .map((l, i) => `${i ? '<hr>' : ''}${legRowMarkup(l)}`)
        .join('')}
      <hr><button class="more ${showPriceDetails ? 'open' : ''}" onclick="showPriceDetails=!showPriceDetails;renderPayment()">${showPriceDetails ? 'Esconder detalhes do valor' : 'Ver detalhes do valor'}${iconSvg('chev', 's')}</button>
      ${showPriceDetails ? `<div class="lines">${T2.lines.map(l => `<div class="ln"><span>${l[0]}</span><b>${formatCurrency(l[1])}</b></div>`).join('')}${booking.pm === 'pix' ? `<div class="ln disc"><span>Desconto Pix (5%)</span><b>−${formatCurrency(T2.pixOff)}</b></div>` : ''}<div class="ln tot"><span>Total</span><b>${booking.pm === 'miles' ? formatNumber(T2.miles) + ' milhas + ' + formatCurrency(T2.tax) : formatCurrency(T2.total)}</b></div></div>` : ''}
    </section>
    <h2 class="h-m" style="margin-top:6px">Como você quer pagar?</h2>
    <div class="pms">
      ${pm('pix', 'pix', 'Pix', 'Aprovação na hora', `−${formatCurrency(T.pixOff)}`)}
      ${pm('card', 'card', 'Cartão de crédito', 'Visa final 4412 · até 10x sem juros', '')}
      ${pm('miles', 'star', 'Milhas Smiles', canMiles ? `${formatNumber(T.miles)} milhas + ${formatCurrency(T.tax)} de taxas` : `Faltam ${formatNumber(T.miles - user.miles)} milhas pra esta compra`, '', !canMiles)}
    </div>
    ${booking.pm === 'card' ? `<div class="inst">${[1, 3, 6, 10].map(n => `<button class="chip ${booking.inst === n ? 'on' : ''}" onclick="booking.inst=${n};renderPayment()">${n}x de ${formatCurrencyCents(T2.total / n)}</button>`).join('')}</div>` : ''}
    <p class="fine">${iconSvg('lock', 's')}Ambiente de demonstração: nenhum pagamento é processado.</p>
  </div>`;
  $('#payLbl').textContent =
    booking.pm === 'pix'
      ? 'Total no Pix'
      : booking.pm === 'miles'
        ? '+ ' + formatCurrency(T2.tax) + ' de taxas'
        : booking.inst > 1
          ? `${booking.inst}x de ${formatCurrencyCents(T2.total / booking.inst)}`
          : 'Total';
  $('#payBtn').textContent =
    booking.pm === 'pix' ? 'Pagar com Pix' : booking.pm === 'miles' ? 'Usar milhas' : 'Pagar';
  renderTotal();
}

function payNow() {
  if (booking.pm === 'pix') {
    openSheet('pix');
    return;
  }
  startPaymentProcessing();
}

let pixTimer;

function startPaymentProcessing() {
  closeSheet();
  clearInterval(pixTimer);
  const steps = [
    'Pagamento aprovado',
    'Assentos reservados',
    'Bilhete emitido',
    'E-mail enviado pra ' + (booking.paxList[0].email || user.email)
  ];
  navigate('proc', 'fade');
  $('#procSteps').innerHTML = steps
    .map(s => `<li><i>${iconSvg('check', 's')}</i><span>${escapeHtml(s)}</span></li>`)
    .join('');
  const li = $$('#procSteps li');
  let i = 0;
  li[0].classList.add('now');
  const iv = setInterval(
    () => {
      li[i].classList.remove('now');
      li[i].classList.add('ok');
      i++;
      if (i < li.length) li[i].classList.add('now');
      else {
        clearInterval(iv);
        setTimeout(completeOrder, 450);
      }
    },
    prefersReducedMotion ? 60 : 720
  );
}

let lastOrder = null;

function completeOrder() {
  const id = Array.from(
    { length: 6 },
    () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]
  ).join('');
  const legs = selectedLegs().map(l => {
    const { key, ...rest } = l;
    return {
      ...rest,
      seats: (booking.seats[key] || []).slice(),
      checked: false,
      gate: null,
      group: null,
      board: null
    };
  });
  const t = {
    id,
    pax: booking.paxList.map((p, i) => ({ first: p.first, last: p.last, me: i === 0 ? 1 : 0 })),
    legs
  };
  trips.push(t);
  trips.sort((a, b) => a.legs[0].date - b.legs[0].date);
  lastOrder = t;
  if (booking.pm === 'miles') {
    const m = orderTotals().miles;
    user.miles -= m;
    milesStatement.unshift({
      d: new Date(TODAY),
      t: `Resgate: ${legs[0].o} → ${legs[0].d}${legs.length > 1 ? ', ida e volta' : ''}`,
      ic: 'ticket',
      v: -m
    });
  }
  notifications.unshift({
    ic: 'check',
    t: 'Compra confirmada',
    s: `${AIRPORTS[legs[0].o].c} → ${AIRPORTS[legs[0].d].c} · localizador ${id}`,
    when: 'agora'
  });
  hasUnread = true;
  markTourStep('buy');
  booking.sel = { out: null, back: null };
  booking.seats = { out: [], back: [] };
  booking.ext = { bag: false, prio: false, ins: false, co2: false };
  resetTo('done', 'fade');
}

screenRenderers.done = function () {
  const t = lastOrder,
    l = t.legs[0],
    d = DESTINATIONS[l.d];
  $('#doneBg').innerHTML = photoMarkup(d ? d.ph[0] : 'air-1', 'l', '', true);
  $('#doneBody').innerHTML = `<span class="pill glass">${iconSvg('check', 's')}Compra confirmada</span>
    <h1 class="h-done">${AIRPORTS[l.d].c} te espera, ${escapeHtml(t.pax[0].first)}.</h1>
    <p>${t.legs.length > 1 ? `Ida ${formatWeekdayDate(t.legs[0].date)}, volta ${formatWeekdayDate(t.legs[1].date)}` : `Ida ${formatWeekdayDate(l.date)}`} · ${t.pax.length === 1 ? '1 pessoa' : t.pax.length + ' pessoas'}</p>
    <div class="loc"><span>Localizador</span><b>${t.id}</b><button onclick="copyText('${t.id}','Localizador copiado')" aria-label="Copiar localizador">${iconSvg('copy', 's')}</button></div>
    <p>${canCheckIn(l) ? 'O check-in já está aberto.' : 'O check-in abre 48 horas antes do voo. A gente te avisa.'}</p>
    <div class="done-actions"><button class="btn block" onclick="openTrip('${t.id}',true)">Ver minha viagem</button><button class="btn block glassbtn" onclick="showToast('Viagem adicionada à sua agenda','cal')">Adicionar à agenda</button><button class="done-home" onclick="resetTo('home')">Voltar ao início</button></div>`;
  $$('#doneBody>*').forEach((e, i) =>
    e.animate(
      [
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'none' }
      ],
      { duration: 650, delay: 250 + i * 70, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
    )
  );
  setTimeout(launchConfetti, 200);
};

function launchConfetti() {
  if (prefersReducedMotion) return;
  const cv = $('#confetti'),
    ctx = cv.getContext('2d'),
    C = ['#ff7020', '#ffc9a5', '#ffffff', '#ffd166', '#ff9a5a'];
  const P = Array.from({ length: 110 }, () => ({
    x: 195 + (Math.random() - 0.5) * 80,
    y: 360,
    vx: (Math.random() - 0.5) * 10,
    vy: -5 - Math.random() * 8,
    s: 4 + Math.random() * 5,
    c: C[Math.floor(Math.random() * C.length)],
    r: Math.random() * 6.3,
    vr: (Math.random() - 0.5) * 0.35
  }));
  const t0 = performance.now();
  (function f(t) {
    ctx.clearRect(0, 0, 390, 844);
    const k = (t - t0) / 2200;
    for (const p of P) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.vx *= 0.99;
      p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - k);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6);
      ctx.restore();
    }
    if (k < 1) requestAnimationFrame(f);
    else ctx.clearRect(0, 0, 390, 844);
  })(t0);
}
