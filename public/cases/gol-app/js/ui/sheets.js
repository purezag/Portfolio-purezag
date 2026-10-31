'use strict';

const sheetTemplates = {
  fare: () => {
    const f = pendingFlight;
    return `<div class="sh-title"><h2 class="h-l">Escolha sua tarifa</h2><p class="muted sm">${f.num} · ${formatTime(f.dep)} → ${formatTime(f.arr)} · ${AIRPORTS[f.o].c} → ${AIRPORTS[f.d].c}</p></div>
    <div class="fares">${FARES.map(
      (
        F,
        k
      ) => `<label class="fare"><input type="radio" name="fare" value="${k}" ${k === selectedFare ? 'checked' : ''} onchange="selectedFare=${k};$('#fareBtn').textContent=fareButtonLabel()">
      <div class="fare-h"><span class="radio"></span><b>${F.n}</b>${F.tag ? `<span class="pill brand">${F.tag}</span>` : ''}<span class="fare-p">${booking.useMiles ? formatNumber(toMiles(f.price + F.add)) + ' mi' : formatCurrency(f.price + F.add)}</span></div>
      <ul>${F.inc.map(x => `<li>${iconSvg('check', 's')}${x}</li>`).join('')}${(F.no || []).map(x => `<li class="no">${iconSvg('close', 's')}${x}</li>`).join('')}</ul></label>`
    ).join('')}</div>
    <button class="btn block" id="fareBtn" onclick="confirmFare()">${fareButtonLabel()}</button>`;
  },
  airports:
    () => `<div class="sh-title"><h2 class="h-l">${airportField === 'from' ? 'De onde você sai?' : 'Pra onde você vai?'}</h2></div>
    <label class="sbox" id="apBox">${iconSvg('search')}<input id="apQ" placeholder="Busque cidade ou aeroporto" oninput="filterAirports(this.value)" autocomplete="off" autocapitalize="words" data-ret="buscar" ${inputModeAttrs('search')} aria-label="Buscar cidade ou aeroporto"><button type="button" class="clr" onmousedown="clearAirportSearch(event)" ontouchstart="clearAirportSearch(event)" onclick="clearAirportSearch(event)" aria-label="Limpar busca">${iconSvg('close', 's')}</button></label>
    <div class="aplist" id="apList">${airportListMarkup('')}</div>`,
  cal: () => {
    const [a, b] = calendarHeading();
    return `<div class="sh-title"><h2 class="h-l" id="calT">${a}</h2><p class="muted sm" id="calS">${b}</p></div>
    <div><div class="cal-wd">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(x => `<span>${x}</span>`).join('')}</div><div class="cal" id="calBody">${calendarMarkup()}</div></div>`;
  },
  sort: () =>
    `<div class="sh-title"><h2 class="h-l">Ordenar voos</h2></div><div>${['Menor preço', 'Saída mais cedo', 'Mais rápido'].map((x, i) => `<label class="opt"><input type="radio" name="srt" ${resultsSort === i ? 'checked' : ''} onchange="resultsSort=${i};closeSheet();renderFlightList()"><span class="radio"></span>${x}</label>`).join('')}</div>`,
  pix: () => `<div class="sh-title"><h2 class="h-l">Pague com Pix</h2><p class="muted sm">Abra o app do seu banco, escolha Pix e escaneie o código. Ele vale por <b id="pixT">10:00</b>.</p></div>
    <div class="pixbox"><canvas width="33" height="33" data-seed="pix${Date.now() % 997}" aria-label="Código Pix ilustrativo"></canvas><div><span>Valor com desconto</span><b>${formatCurrency(orderTotals().total)}</b><span style="margin-top:6px">Código ilustrativo</span></div></div>
    <button class="btn block soft" onclick="copyText('PIX-DEMO-CONCEITO-GOL','Código Pix copiado')">${iconSvg('copy', 's')}Copiar código Pix</button>
    <button class="btn block" onclick="startPaymentProcessing()">Simular pagamento aprovado</button>`,
  bags: () => `<div class="sh-title"><h2 class="h-l">Bagagem</h2><p class="muted sm">O que você pode levar em voos nacionais.</p></div>
    <div class="baglist">
      <div class="bagrow">${iconSvg('pack', 'l')}<span><b>Item pessoal</b><small>Mochila ou bolsa que caiba embaixo do assento. Em todas as tarifas.</small></span></div>
      <div class="bagrow">${iconSvg('trips', 'l')}<span><b>Mala de mão de até 10 kg</b><small>Vai no compartimento acima do assento. Em todas as tarifas.</small></span></div>
      <div class="bagrow">${iconSvg('bag', 'l')}<span><b>Mala despachada de até 23 kg</b><small>Inclusa nas tarifas Plus e Max. Na Light, a partir de R$ 75 por trecho.</small></span></div>
    </div>
    <button class="btn block" onclick="closeSheet();showToast('Mala de 23 kg adicionada','bag')">Adicionar mala à próxima viagem</button>`,
  notif: () => {
    hasUnread = false;
    const d = $('#bellDot');
    if (d) d.hidden = true;
    return `<div class="sh-title"><h2 class="h-l">Notificações</h2></div>
    <div class="nlist">${notifications.map(n => `<div class="nrow"><span class="n-ic">${iconSvg(n.ic)}</span><span class="grow"><b>${n.t}</b><small>${n.s}</small></span><time>${n.when}</time></div>`).join('')}</div>`;
  },
  about: () => `<div class="sh-title"><h2 class="h-l">Sobre este conceito</h2></div>
    <p class="txt-body">Protótipo de redesign do app, feito para estudo de UX e UI. Não é um produto oficial: voos, preços, reservas e documentos são fictícios, e nenhum pagamento é processado.</p>
    <p class="txt-body">A marca GOL pertence à GOL Linhas Aéreas. Fotos dos destinos do Unsplash, de ${photoCredits()}.</p>
    <button class="btn block soft" onclick="closeSheet()">Fechar</button>`,
  checkin: () => {
    const t = trips.find(x => x.id === checkInTarget.id),
      l = t.legs[checkInTarget.li];
    if (checkInTarget.done)
      return `<div class="ck-done"><svg class="big" viewBox="0 0 90 90"><circle cx="45" cy="45" r="41"/><path d="M28 46l11 11 23-25"/></svg>
      <h2 class="h-l">Check-in feito</h2><p class="muted">Seu cartão de embarque já está liberado na aba Cartão.</p>
      <div class="ck-facts"><span class="pill">Portão ${l.gate}</span><span class="pill">Embarque ${formatTime(l.board)}</span><span class="pill">Grupo ${l.group}</span></div></div>
      <button class="btn block dark" onclick="openBoardingPass('${t.id}',${checkInTarget.li})">Ver cartão de embarque</button>`;
    return `<div class="sh-title"><h2 class="h-l">Check-in</h2><p class="muted sm">${AIRPORTS[l.o].c} → ${AIRPORTS[l.d].c} · ${l.num} · ${formatWeekdayDate(l.date)} às ${formatTime(l.dep)}</p></div>
      <div class="ck-list">${t.pax.map((p, pi) => `<label class="ckrow"><input type="checkbox" checked><span class="box-ck">${iconSvg('check', 's')}</span><span class="grow"><b>${escapeHtml(p.first + ' ' + p.last)}</b><small>Assento ${l.seats[pi] || 'a definir no check-in'}</small></span></label>`).join('')}
      <label class="ckrow"><input type="checkbox" id="ckDecl"><span class="box-ck">${iconSvg('check', 's')}</span><span class="grow"><b>Não levo itens proibidos</b><small>Baterias de lítio e carregadores portáteis vão só na bagagem de mão.</small></span></label></div>
      <button class="btn block" onclick="confirmCheckIn(this)">Confirmar check-in</button>`;
  }
};

let activeSheet = null;

function openSheet(type) {
  if (viewer.open) closePhotoViewer(true);
  activeSheet = type;
  $('#shBody').innerHTML = sheetTemplates[type]();
  $('#shBody').scrollTop = 0;
  $('#sheet').classList.toggle('tall', type === 'airports');
  $('#sheet').classList.add('on');
  $('#scrim').classList.add('on');
  if (type === 'pix') {
    $$('#shBody canvas').forEach(drawQrCode);
    let s = 600;
    clearInterval(pixTimer);
    pixTimer = setInterval(() => {
      s--;
      const e = $('#pixT');
      if (!e || s < 0) {
        clearInterval(pixTimer);
        return;
      }
      e.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    }, 1000);
  }
  if (type === 'cal')
    setTimeout(() => {
      const s = $('#calBody .sel'),
        b = $('#shBody');
      if (s && b)
        b.scrollTop +=
          (s.getBoundingClientRect().top - b.getBoundingClientRect().top) / phoneScale() - b.clientHeight / 2;
    }, 60);
}

function closeSheet() {
  const a = document.activeElement;
  if (a && $('#sheet').contains(a)) a.blur();
  $('#sheet').classList.remove('on');
  $('#scrim').classList.remove('on');
  activeSheet = null;
  clearInterval(pixTimer);
}

(function sheetDrag() {
  const s = $('#sheet'),
    g = $('#shGrab');
  let y0 = null,
    dy = 0;
  g.addEventListener('pointerdown', e => {
    y0 = e.clientY;
    dy = 0;
    s.classList.add('drag');
    g.setPointerCapture(e.pointerId);
  });
  g.addEventListener('pointermove', e => {
    if (y0 === null) return;
    dy = Math.max(0, (e.clientY - y0) / phoneScale());
    s.style.transform = `translateY(${dy}px)`;
  });
  const end = () => {
    if (y0 === null) return;
    y0 = null;
    s.classList.remove('drag');
    s.style.transform = '';
    if (dy > 80) closeSheet();
  };
  g.addEventListener('pointerup', end);
  g.addEventListener('pointercancel', end);
})();
