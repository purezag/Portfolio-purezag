'use strict';

const QUICK_REPLIES = [
  'Quanto de bagagem posso levar?',
  'Quando abre o check-in?',
  'Como remarco meu voo?',
  'Posso levar meu pet?',
  'Quero falar com uma pessoa'
];

const BOT_REPLIES = [
  [
    /pessoa|humano|atendente|alguem/,
    'Claro! Já chamei alguém da equipe. Neste protótipo a conversa termina aqui, mas no app de verdade você continuaria neste mesmo chat.'
  ],
  [
    /bagagem|mala|kg|peso|mochila/,
    'Em todas as tarifas você leva uma mala de mão de até 10 kg e um item pessoal, como mochila ou bolsa. A mala despachada de 23 kg vem nas tarifas Plus e Max, ou pode ser comprada à parte.'
  ],
  [
    /check.?in/,
    'O check-in pelo app abre 48 horas antes do voo. Depois dele, o seu cartão de embarque fica na aba Cartão.'
  ],
  [
    /remarc|alterar|trocar.*(voo|data)|mudar.*(voo|data)/,
    'Em Viagens, abra a reserva e toque em Remarcar voo. Na tarifa Max não tem taxa. Nas outras, você paga a taxa e a diferença de preço, se houver.'
  ],
  [
    /reembolso|cancel|devolu|desist/,
    'Na tarifa Max o reembolso é integral. Nas outras, depende das regras da tarifa. E pela regra da ANAC, se a compra foi feita com pelo menos 7 dias de antecedência do voo, você pode desistir sem custo em até 24 horas.'
  ],
  [
    /pet|cachorr|gato|animal|bicho/,
    'Cães e gatos pequenos podem viajar na cabine, numa caixa de transporte embaixo do assento. Como o número de pets por voo é limitado, vale reservar com antecedência.'
  ],
  [
    /bebe|crianca|filh|menor/,
    'Bebês de até 2 anos incompletos podem viajar no colo de um adulto. A partir dos 2 anos, a criança precisa de assento próprio.'
  ],
  [
    /assento|janela|corredor|poltrona/,
    'Você escolhe ou troca o assento em Viagens, até o check-in. Os assentos Conforto e de saída de emergência têm valor extra.'
  ],
  [
    /milha|smiles|ponto/,
    () =>
      `Você tem ${formatNumber(user.miles)} milhas. Na hora de pagar uma passagem, é só escolher Milhas Smiles.`
  ],
  [
    /atras|status|horario|portao|embarque/,
    'Você acompanha o horário e o portão em Viagens. Se algo mudar, a gente avisa por notificação e por aqui.'
  ],
  [/obrigad|valeu|brigad/, 'Imagina! Se precisar de mais alguma coisa, é só chamar.'],
  [
    /^(oi|ola|bom dia|boa tarde|boa noite|e ai|hey)\b/,
    () => `Oi, ${user.first}! Me conta o que você precisa.`
  ]
];

let chatHistory = [],
  botTyping = false;

function botReplyFor(t) {
  const n = normalizeText(t);
  for (const [re, a] of BOT_REPLIES) if (re.test(n)) return typeof a === 'function' ? a() : a;
  return 'Ainda estou aprendendo sobre esse assunto. Quer que eu chame alguém da equipe? É só escrever "falar com uma pessoa".';
}

function openChat() {
  closeSheet();
  navigate('chat', 'up');
}

screenRenderers.chat = function () {
  if (!chatHistory.length) chatHistory.push({ me: 0, t: `Oi, ${user.first}! Como a gente pode ajudar?` });
  $('#chatList').innerHTML =
    '<div class="chat-day">Hoje</div>' +
    chatHistory.map(m => `<div class="msg ${m.me ? 'me' : 'them'}">${escapeHtml(m.t)}</div>`).join('');
  $('#chatQuick').innerHTML = QUICK_REPLIES.map(
    (q, i) => `<button class="chip" onclick="sendChatMessage(QUICK_REPLIES[${i}])">${q}</button>`
  ).join('');
  updateSendButton();
  setTimeout(scrollChatToEnd, 30);
};

function scrollChatToEnd() {
  const c = $('#chatList');
  c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
}

function updateSendButton() {
  $('#chatSend').disabled = !$('#chatIn').value.trim();
}

function appendChatMessage(m) {
  $('#chatList').insertAdjacentHTML(
    'beforeend',
    `<div class="msg new ${m.me ? 'me' : 'them'}">${escapeHtml(m.t)}</div>`
  );
  scrollChatToEnd();
}

function sendChatMessage(text) {
  const inp = $('#chatIn'),
    t = (text == null ? inp.value : text).trim();
  if (!t || botTyping) return;
  if (text == null) {
    inp.value = '';
    updateSendButton();
    if (keyboard.t === inp) {
      keyboard.shift = true;
      renderKeyboard();
    }
  }
  chatHistory.push({ me: 1, t });
  appendChatMessage({ me: 1, t });
  markTourStep('chat');
  const reply = botReplyFor(t);
  botTyping = true;
  $('#chatList').insertAdjacentHTML(
    'beforeend',
    '<div class="msg new them typing" id="typing"><i></i><i></i><i></i></div>'
  );
  scrollChatToEnd();
  setTimeout(
    () => {
      const ty = $('#typing');
      if (ty) ty.remove();
      botTyping = false;
      chatHistory.push({ me: 0, t: reply });
      appendChatMessage({ me: 0, t: reply });
    },
    prefersReducedMotion ? 50 : 800 + Math.min(1400, reply.length * 7)
  );
}
