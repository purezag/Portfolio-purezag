'use strict';

screenRenderers.account = function () {
  const pct = Math.round((user.pts / user.goal) * 100),
    ti = ['auto', 'light', 'dark'].indexOf(themePreference);
  $('#accBody').innerHTML =
    `<div class="acc-h"><div class="avatar xl">${userInitials()}</div><div class="grow"><h1 class="h-l">${escapeHtml(user.first + ' ' + user.last)}</h1><p class="muted sm" style="margin-top:4px">Smiles ${user.smiles} · cliente desde 2014</p></div></div>
    <div class="pad"><button class="btn block soft sm" onclick="navigate('me')">${iconSvg('edit', 's')}Editar perfil</button></div>
    <section class="smiles" style="margin-top:16px;cursor:default">
      <div class="top"><span>${iconSvg('star', 's')}Smiles</span><span class="tier">Diamante</span></div>
      <div class="mi">${formatNumber(user.miles)}<small>milhas</small></div>
      <div class="tierbar"><i style="width:${pct}%"></i></div>
      <p>${formatNumber(user.pts)} de ${formatNumber(user.goal)} pontos. Faltam ${formatNumber(user.goal - user.pts)} pra manter o Diamante em 2027.</p>
      <div class="sm-btns"><button class="btn sm glassbtn" onclick="navigate('extrato')">Ver extrato</button><button class="btn sm" onclick="openMilesSuggestion()">Usar milhas</button></div>
    </section>
    <div class="group"><h3 class="mini-h">Sua conta</h3>
      ${listRowMarkup('user', 'Dados pessoais', escapeHtml(user.email), "navigate('me')")}
      ${listRowMarkup('id', 'Documentos de viagem', 'CPF, RG e passaporte', "navigate('docs')")}
      ${listRowMarkup('card', 'Formas de pagamento', 'Visa final 4412, Mastercard e Pix', "navigate('pays')")}
      ${listRowMarkup('users', 'Viajantes salvos', SAVED_TRAVELERS.map(s => s.first).join(' e '), "navigate('travelers')")}
    </div>
    <div class="group"><h3 class="mini-h">Aparência</h3>
      <div class="seg" id="accTheme" style="--n:3;--i:${ti}">${[
        ['auto', 'Automático'],
        ['light', 'Claro'],
        ['dark', 'Escuro']
      ]
        .map(
          ([k, l], i) => `<button class="${i === ti ? 'on' : ''}" onclick="setTheme('${k}')">${l}</button>`
        )
        .join('')}</div>
    </div>
    <div class="group"><h3 class="mini-h">Preferências</h3>
      <label class="lrow">${iconSvg('window')}<span class="grow"><b>Preferir janela</b><small>Marcamos janelas livres na escolha de assentos</small></span><span class="switch"><input type="checkbox" id="prefWinAcc" ${user.win ? 'checked' : ''} onchange="setWindowPreference(this.checked)"><i></i></span></label>
      <label class="lrow">${iconSvg('bell')}<span class="grow"><b>Avisos do voo</b><small>Portão, atrasos e embarque</small></span><span class="switch"><input type="checkbox" checked onchange="showToast(this.checked?'Avisos ligados':'Avisos desligados','bell')"><i></i></span></label>
      <label class="lrow">${iconSvg('lock')}<span class="grow"><b>Entrar com biometria</b><small>Face ID neste aparelho</small></span><span class="switch"><input type="checkbox" checked onchange="showToast(this.checked?'Biometria ligada':'Biometria desligada','lock')"><i></i></span></label>
      ${listRowMarkup('globe', 'Idioma', 'Português (Brasil)')}
    </div>
    <div class="group"><h3 class="mini-h">Ajuda</h3>
      ${listRowMarkup('chat', 'Falar com a gente', 'Chat 24h', 'openChat()')}
      ${listRowMarkup('info', 'Sobre este conceito', 'Créditos e observações', "openSheet('about')")}
    </div>
    <div class="acc-out"><button class="btn block line danger" onclick="showToast('Você saiu (demonstração)','logout')">Sair da conta</button></div>`;
};

screenResumers.account = screenRenderers.account;

function listRowMarkup(icon, t, s, act) {
  return `<button class="lrow" onclick="${act || `showToast('${t}: chega na próxima versão','info')`}">${iconSvg(icon)}<span class="grow"><b>${t}</b><small>${s}</small></span>${iconSvg('chev', 's chev')}</button>`;
}

function formFieldMarkup(id, label, val, extra = '') {
  return `<div class="inp"><label for="${id}">${label}</label><input id="${id}" value="${escapeHtml(val)}" autocomplete="off" ${extra}></div>`;
}

screenRenderers.me = function () {
  markTourStep('profile');
  $('#meBody').innerHTML = `<div class="stack rise">
    <div class="me-av"><div class="avatar xxl">${userInitials()}</div><button class="link" onclick="showToast('Trocar foto chega na próxima versão','user')">Trocar foto</button></div>
    <div class="two">${formFieldMarkup('meF', 'Nome', user.first, `autocapitalize="words" ${inputModeAttrs('text')}`)}${formFieldMarkup('meL', 'Sobrenome', user.last, `autocapitalize="words" ${inputModeAttrs('text')}`)}</div>
    ${formFieldMarkup('meDoc', 'CPF', user.doc, 'readonly')}
    ${formFieldMarkup('meBirth', 'Data de nascimento', user.birth, `${inputModeAttrs('numeric')} oninput="maskDate(this)" placeholder="dd/mm/aaaa"`)}
    ${formFieldMarkup('meMail', 'E-mail', user.email, `${inputModeAttrs('email')} autocapitalize="off"`)}
    ${formFieldMarkup('mePhone', 'Celular', user.phone, `${inputModeAttrs('tel')} oninput="maskPhone(this)"`)}
    ${formFieldMarkup('meCity', 'Cidade', user.city, `autocapitalize="words" ${inputModeAttrs('text')}`)}
    <p class="err" id="meErr" hidden></p>
    <p class="fine">${iconSvg('lock', 's')}O CPF não pode ser alterado pelo app.</p>
  </div>`;
};

function saveProfile() {
  const f = $('#meF').value.trim(),
    l = $('#meL').value.trim(),
    m = $('#meMail').value.trim(),
    er = $('#meErr');
  $$('#meBody input').forEach(x => x.classList.remove('bad'));
  er.hidden = true;
  const bad = [];
  if (!f) bad.push('#meF');
  if (!l) bad.push('#meL');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)) bad.push('#meMail');
  if (bad.length) {
    bad.forEach(s => $(s).classList.add('bad'));
    er.textContent =
      bad.includes('#meMail') && bad.length === 1
        ? 'Confira o e-mail: parece que falta alguma parte.'
        : 'Preencha nome, sobrenome e um e-mail válido.';
    er.hidden = false;
    scrollToElement($('#meBody'), $(bad[0]));
    return;
  }
  Object.assign(user, {
    first: f,
    last: l,
    email: m,
    birth: $('#meBirth').value,
    phone: $('#mePhone').value,
    city: $('#meCity').value.trim()
  });
  trips.forEach(t =>
    t.pax.forEach(p => {
      if (p.me) {
        p.first = f;
        p.last = l;
      }
    })
  );
  showToast('Dados atualizados', 'check');
  goBack();
  updateHome();
}

screenRenderers.docs = function () {
  $('#docsBody').innerHTML = `<div class="stack rise">
    <p class="lead">Seus documentos ficam salvos pra preencher as próximas compras.</p>
    <article class="doc"><span class="doc-ic">${iconSvg('doc')}</span><div class="grow"><b>CPF</b><small>${user.doc}</small></div><span class="pill good">${iconSvg('check', 's')}Verificado</span></article>
    <article class="doc"><span class="doc-ic">${iconSvg('id')}</span><div class="grow"><b>RG</b><small>•••• 4521 · SSP/RS · emitido em 2019</small><small class="ok">Vale pra voos nacionais e países do Mercosul</small></div></article>
    <article class="doc"><span class="doc-ic">${iconSvg('globe')}</span><div class="grow"><b>Passaporte</b><small>FZ•••• 812 · Brasil · válido até mar/2031</small></div><span class="pill">Válido</span></article>
    <button class="btn block soft" onclick="showToast('Adicionar documento chega na próxima versão','doc')">${iconSvg('plus', 's')}Adicionar documento</button>
  </div>`;
};

screenRenderers.pays = function () {
  const nm = escapeHtml((user.first + ' ' + user.last).toUpperCase());
  $('#paysBody').innerHTML = `<div class="stack rise">
    <div class="ccard"><div class="cc-top"><span>Visa</span><span class="pill glass">Principal</span></div><span class="cc-chipi"></span><b>•••• •••• •••• 4412</b><div class="cc-bot"><span>${nm}</span><span>08/29</span></div></div>
    <div class="ccard alt"><div class="cc-top"><span>Mastercard</span></div><span class="cc-chipi"></span><b>•••• •••• •••• 8890</b><div class="cc-bot"><span>${nm}</span><span>11/27</span></div></div>
    <article class="doc"><span class="doc-ic">${iconSvg('pix')}</span><div class="grow"><b>Pix</b><small>5% de desconto e aprovação na hora</small></div></article>
    <button class="btn block soft" onclick="showToast('Cadastro de cartão fica fora desta demonstração','card')">${iconSvg('plus', 's')}Adicionar cartão</button>
    <p class="fine">${iconSvg('lock', 's')}Nenhum dado de cartão é coletado neste protótipo.</p>
  </div>`;
};

screenRenderers.travelers = function () {
  const mk = d => d.slice(0, 3) + '.•••.•••-' + d.slice(-2);
  $('#travBody').innerHTML = `<div class="stack rise">
    <p class="lead">Quem costuma viajar com você. Na compra, é só tocar no nome.</p>
    ${SAVED_TRAVELERS.map(s => `<article class="doc"><span class="av">${s.first.charAt(0)}</span><div class="grow"><b>${s.first} ${s.last}</b><small>CPF ${mk(s.doc)} · ${s.rel}</small></div>${iconSvg('chev', 's')}</article>`).join('')}
    <button class="btn block soft" onclick="showToast('Adicionar viajante chega na próxima versão','users')">${iconSvg('plus', 's')}Adicionar viajante</button>
  </div>`;
};

screenRenderers.extrato = function () {
  const groups = {};
  milesStatement.forEach(x => {
    const k = capitalize(MONTHS[x.d.getMonth()]) + ' de ' + x.d.getFullYear();
    (groups[k] = groups[k] || []).push(x);
  });
  $('#extBody').innerHTML = `<div class="stack rise">
    <div class="ex-sum"><span>Saldo disponível</span><b>${formatNumber(user.miles)} milhas</b><small>3.200 milhas vencem em 31 de março de 2027</small></div>
    ${Object.entries(groups)
      .map(
        ([k, list]) =>
          `<div><p class="txn-m">${k}</p>${list.map(x => `<div class="txn"><span class="txn-ic">${iconSvg(x.ic)}</span><span class="grow"><b>${x.t}</b><small>${formatDayMonth(x.d)}</small></span><em class="${x.v > 0 ? 'plus' : ''}">${x.v > 0 ? '+' : '−'}${formatNumber(Math.abs(x.v))}</em></div>`).join('')}</div>`
      )
      .join('')}
    <button class="btn block" onclick="openMilesSuggestion()">Usar minhas milhas</button>
  </div>`;
};
