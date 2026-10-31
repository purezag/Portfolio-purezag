'use strict';

function buildHome() {
  $('#homeScroll').innerHTML = `
  <header class="home-top">
    <span class="logo-wrap">${logoMarkup('logo')}</span>
    <div class="acts">
      <button class="ibtn" onclick="openSheet('notif')" aria-label="Notificações">${iconSvg('bell')}<i class="badge-dot" id="bellDot"></i></button>
      <button class="avatar" id="hAvatar" onclick="switchTab('account')" aria-label="Seu perfil"></button>
    </div>
  </header>
  <div class="greet"><h1 class="h-xl" id="hHello"></h1><p id="hSub"></p></div>
  <button class="search-pill" onclick="openSearch()">${iconSvg('search')}<span class="grow"><b>Pra onde vamos?</b><small>Saindo de Porto Alegre</small></span><span class="go">${iconSvg('arrow')}</span></button>
  <section class="hero" id="hero" tabindex="0" aria-roledescription="carrossel" aria-label="Promoções"></section>
  <div id="hNext"></div>
  <nav class="quick" aria-label="Atalhos">
    <button class="qa" onclick="startCheckIn()"><i>${iconSvg('checkin')}</i>Check-in</button>
    <button class="qa" onclick="openFlightStatus()"><i>${iconSvg('clock')}</i>Status do voo</button>
    <button class="qa" onclick="openSheet('bags')"><i>${iconSvg('bag')}</i>Bagagem</button>
    <button class="qa" onclick="navigate('extrato')"><i>${iconSvg('star')}</i>Smiles</button>
  </nav>
  <div class="sec"><h2 class="h-m">Saindo de Porto Alegre</h2><button class="link" onclick="navigate('offers')">Ver todas</button></div>
  <div class="rail" id="rail"></div>
  <section class="smiles" id="hSmiles" onclick="openMilesSuggestion()"></section>
  <section class="pref">
    ${photoMarkup('air-2', 's')}
    <div class="tx"><b>Janela, como sempre?</b><p>Você escolheu janela nas últimas 8 viagens. A gente já marca as livres pra você.</p>
      <label class="switch"><input type="checkbox" id="prefWinHome" onchange="setWindowPreference(this.checked)"><i></i><span>Preferir janela</span></label></div>
  </section>
  <section class="help">
    <span class="hic">${iconSvg('chat')}</span>
    <div class="grow"><b>Precisa de ajuda?</b><p>Atendimento 24h pelo chat do app.</p></div>
    <button class="btn soft sm" onclick="openChat()">Conversar</button>
  </section>
  <p class="foot-note">Conceito de UX/UI · dados fictícios</p>`;
  initHeroCarousel();
  pauseHeroCarousel(currentScreen() !== 'home');
  $('#rail').innerHTML = FEATURED_DESTINATIONS.map(destinationCardMarkup).join('');
}

function destinationCardMarkup(c) {
  const d = DESTINATIONS[c],
    b = bestDeal(c);
  return `<button class="dcard" onclick="openDestination('${c}')"><div class="dc-ph">${photoMarkup(d.card, 's')}${favoriteButtonMarkup(c)}</div><b>${d.name}</b><span>ida e volta a partir de</span><em>${formatCurrency(b.price)}</em></button>`;
}

function favoriteButtonMarkup(c, glass) {
  return `<span class="${glass ? 'ibtn glass' : 'heart'} ${favorites.has(c) ? 'on' : ''}" role="button" tabindex="0" aria-label="Favoritar ${DESTINATIONS[c].name}" onclick="event.stopPropagation();toggleFavorite(this,'${c}')">${iconSvg('heart', glass ? '' : 's')}</span>`;
}

function toggleFavorite(el, c) {
  if (favorites.has(c)) {
    favorites.delete(c);
    showToast('Removido dos favoritos', 'heart');
  } else {
    favorites.add(c);
    showToast(DESTINATIONS[c].name + ' nos seus favoritos', 'heart');
  }
  $$(`[aria-label="Favoritar ${DESTINATIONS[c].name}"]`).forEach(x =>
    x.classList.toggle('on', favorites.has(c))
  );
}

function updateHome() {
  const h = new Date().getHours();
  $('#hAvatar').textContent = userInitials();
  $('#hHello').textContent =
    (h < 5 ? 'Boa noite' : h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + ', ' + user.first + '.';
  const nx = nextLeg();
  if (nx) {
    const { t, l, li } = nx,
      n = daysBetween(l.date, TODAY);
    const day =
      n === 0
        ? 'Hoje'
        : n === 1
          ? 'Amanhã'
          : n < 7
            ? capitalize(WEEKDAYS[l.date.getDay()])
            : 'Dia ' + l.date.getDate() + ' de ' + MONTHS[l.date.getMonth()];
    let s = `${day} você voa pra ${AIRPORTS[l.d].c}.`;
    s += canCheckIn(l)
      ? l.checked
        ? ' Seu cartão de embarque já tá aqui.'
        : ' O check-in já tá aberto.'
      : ` Faltam ${n} dias.`;
    $('#hSub').textContent = s;
    const who =
      t.pax.length === 1
        ? 'Só você'
        : 'Você e ' +
          t.pax
            .slice(1)
            .map(p => p.first)
            .join(', ');
    $('#hNext').innerHTML = `<article class="nt" onclick="openTrip('${t.id}')">
      <div class="nt-h"><span>${capitalize(WEEKDAYS[l.date.getDay()])}, ${formatDayMonth(l.date)} · ${l.num}</span>${statusPillMarkup(l)}</div>
      ${legRowMarkup(l)}
      <div class="nt-meta">${iconSvg('seat', 's')}Assento ${l.seats[0] || 'a definir'}${isWindowSeat(l.seats[0]) ? ' · janela' : ''}<span>·</span>${iconSvg('users', 's')}${escapeHtml(who)}</div>
      ${canCheckIn(l) ? (l.checked ? `<button class="btn block dark" onclick="event.stopPropagation();openBoardingPass('${t.id}',${li})">Ver cartão de embarque</button>` : `<button class="btn block" onclick="event.stopPropagation();startCheckIn('${t.id}',${li})">Fazer check-in</button>`) : ''}
    </article>`;
  } else {
    $('#hSub').textContent = 'Que tal planejar a próxima viagem?';
    $('#hNext').innerHTML = '';
  }
  const idea = milesSuggestion();
  $('#hSmiles').innerHTML =
    `<div class="top"><span>${iconSvg('star', 's')}Smiles</span><span class="tier">Diamante</span></div>
    <div class="mi"><span id="milesNum">${formatNumber(user.miles)}</span><small>milhas</small></div>
    <p>${idea ? `Dá pra ir pra ${DESTINATIONS[idea.code].name} e voltar só com milhas.` : 'Junte milhas voando e nos parceiros.'}</p>
    ${idea ? `<div class="sm-idea">${photoMarkup(DESTINATIONS[idea.code].card, 's')}<span class="grow"><b>${DESTINATIONS[idea.code].name}</b><small>ida e volta a partir de ${formatNumber(idea.miles)} milhas</small></span>${iconSvg('chev')}</div>` : ''}`;
  $('#bellDot').hidden = !hasUnread;
  $('#prefWinHome').checked = user.win;
}

screenRenderers.home = updateHome;
screenResumers.home = updateHome;

function milesSuggestion() {
  for (const c of ['FEN', 'JJD', 'SSA', 'GIG']) {
    const m = toMiles(bestDeal(c).price);
    if (m <= user.miles) return { code: c, miles: m };
  }
  return null;
}

function openMilesSuggestion() {
  const i = milesSuggestion();
  if (i) openDestination(i.code, { miles: true });
  else showToast('Junte mais milhas pra resgatar uma viagem', 'star');
}

let milesCounted = false;

function animateMilesCounter() {
  if (milesCounted || prefersReducedMotion) return;
  milesCounted = true;
  const el = $('#milesNum'),
    t0 = performance.now();
  (function st(t) {
    const k = Math.min((t - t0) / 1400, 1),
      e = 1 - Math.pow(1 - k, 3);
    if (el) el.textContent = formatNumber(user.miles * e);
    if (k < 1) requestAnimationFrame(st);
  })(t0);
}

function setWindowPreference(v) {
  user.win = v;
  $$('#prefWinHome,#prefWinAcc').forEach(i => (i.checked = v));
  showToast(v ? 'Vamos marcar as janelas livres pra você' : 'Preferência de janela desligada', 'window');
}

function openFlightStatus() {
  const nx = nextLeg();
  if (nx) openTrip(nx.t.id);
}

const heroCarousel = { i: 0 };

function initHeroCarousel() {
  const h = $('#hero');
  h.innerHTML =
    PROMOS.map((p, i) => {
      const b = bestDeal(p.d, p);
      return `<article class="slide${i === 0 ? ' on' : ''}" aria-hidden="${i !== 0}">${photoMarkup(p.ph, 'l', '', i < 2)}
      <div class="slide-copy"><span class="pill glass">${p.tag}</span><h3>${p.title}</h3><p>${p.sub}</p>
      <div class="row"><div class="price-big"><small>ida e volta a partir de</small><b>${p.miles ? formatNumber(toMiles(b.price)) + ' milhas' : formatCurrency(b.price)}</b></div><span class="go-round">${iconSvg('arrow')}</span></div></div></article>`;
    }).join('') +
    `<div class="hbars">${PROMOS.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"><b></b></i>`).join('')}</div>`;
  $$('.hbars i b', h).forEach((b, i) =>
    b.addEventListener('animationend', () => {
      if (i === heroCarousel.i) showHeroSlide(heroCarousel.i + 1);
    })
  );
  let x0 = 0,
    t0 = 0,
    moved = false,
    hold;
  h.addEventListener('pointerdown', e => {
    x0 = e.clientX;
    t0 = Date.now();
    moved = false;
    hold = setTimeout(() => h.classList.add('paused'), 220);
  });
  h.addEventListener('pointermove', e => {
    if (Math.abs(e.clientX - x0) > 8) moved = true;
  });
  h.addEventListener('pointerup', e => {
    clearTimeout(hold);
    h.classList.remove('paused');
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 36) {
      showHeroSlide(heroCarousel.i + (dx < 0 ? 1 : -1));
      return;
    }
    if (!moved && Date.now() - t0 < 350) openPromo(heroCarousel.i);
  });
  h.addEventListener('pointercancel', () => {
    clearTimeout(hold);
    h.classList.remove('paused');
  });
  h.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') showHeroSlide(heroCarousel.i + 1);
    else if (e.key === 'ArrowLeft') showHeroSlide(heroCarousel.i - 1);
    else if (e.key === 'Enter') openPromo(heroCarousel.i);
  });
}

function showHeroSlide(n) {
  const h = $('#hero');
  if (!h) return;
  n = (n + PROMOS.length) % PROMOS.length;
  if (n === heroCarousel.i) return;
  const sl = $$('.slide', h),
    bars = $$('.hbars i', h),
    old = sl[heroCarousel.i];
  old.classList.remove('on');
  old.classList.add('prev');
  old.setAttribute('aria-hidden', 'true');
  setTimeout(() => old.classList.remove('prev'), 950);
  sl[n].classList.add('on');
  sl[n].setAttribute('aria-hidden', 'false');
  bars.forEach((b, i) => {
    b.classList.remove('on');
    b.classList.toggle('done', i < n);
  });
  void bars[n].offsetWidth;
  bars[n].classList.add('on');
  heroCarousel.i = n;
}

function pauseHeroCarousel(p) {
  const h = $('#hero');
  if (h) h.classList.toggle('paused', p);
}

function openPromo(i) {
  const p = PROMOS[i];
  openDestination(p.d, { promo: i, miles: !!p.miles });
}
