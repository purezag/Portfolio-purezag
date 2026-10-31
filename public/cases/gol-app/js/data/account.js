'use strict';

const user = {
  first: 'Guilherme',
  last: 'Pureza',
  email: 'guilherme.pureza@exemplo.com',
  doc: '123.456.789-09',
  birth: '14/03/1990',
  phone: '(51) 99876-5432',
  city: 'Porto Alegre, RS',
  miles: 42580,
  smiles: '109.228.431',
  pts: 24580,
  goal: 35000,
  win: true
};

const userInitials = () => (user.first.charAt(0) + user.last.charAt(0)).toUpperCase();

const SAVED_TRAVELERS = [
  { first: 'Marina', last: 'Pureza', doc: '987.654.321-00', rel: 'Viaja com você com frequência' },
  { first: 'Rafael', last: 'Pureza', doc: '456.123.789-55', rel: 'Última viagem juntos em julho' }
];

const favorites = new Set(['FEN']);

function createLeg(o, d, date, slot, num, fare, seats) {
  const f = flightsFor(o, d, date)[slot];
  return { ...f, num, fare, seats, checked: false, gate: null, group: null, board: null };
}

let trips = [
  {
    id: 'QW8EK2',
    pax: [{ first: user.first, last: user.last, me: 1 }],
    legs: [createLeg('POA', 'GRU', addDays(TODAY, 2), 0, 'G3 1409', 1, ['14A'])]
  },
  {
    id: 'ZT3MRA',
    pax: [
      { first: user.first, last: user.last, me: 1 },
      { first: 'Marina', last: 'Pureza' }
    ],
    legs: [
      createLeg('POA', 'SSA', addDays(TODAY, 22), 1, 'G3 1764', 1, ['22A', '22B']),
      createLeg('SSA', 'POA', addDays(TODAY, 25), 3, 'G3 1765', 1, ['20E', '20F'])
    ]
  }
];

const PAST_TRIPS = [
  { o: 'GRU', d: 'REC', date: addDays(TODAY, -47), num: 'G3 1780', mi: 1240 },
  { o: 'POA', d: 'EZE', date: addDays(TODAY, -116), num: 'G3 7650', mi: 980 }
];

let milesStatement = [
  { d: addDays(TODAY, -3), t: 'Bônus da categoria Diamante', ic: 'star', v: 1500 },
  { d: addDays(TODAY, -9), t: 'Compras no cartão parceiro', ic: 'card', v: 620 },
  { d: addDays(TODAY, -47), t: 'Voo GRU → REC', ic: 'plane', v: 1240 },
  { d: addDays(TODAY, -63), t: 'Resgate: POA → FLN, ida e volta', ic: 'ticket', v: -12400 },
  { d: addDays(TODAY, -116), t: 'Voo POA → EZE', ic: 'plane', v: 980 },
  { d: addDays(TODAY, -141), t: 'Transferência de pontos do cartão', ic: 'card', v: 10000 }
];

let notifications = [
  {
    ic: 'checkin',
    t: 'Check-in aberto',
    s: 'Seu voo pra São Paulo já aceita check-in pelo app.',
    when: 'agora'
  },
  { ic: 'star', t: '+1.500 milhas de bônus', s: 'Presente da categoria Diamante.', when: '3 dias' },
  {
    ic: 'spark',
    t: 'Feriadão de 20 de novembro',
    s: 'Salvador com ida e volta saindo de Porto Alegre.',
    when: '4 dias'
  }
];

let hasUnread = true;
const canCheckIn = l => {
  const n = daysBetween(l.date, TODAY);
  return n >= 0 && n <= 2;
};
const isWindowSeat = s => /[AF]$/.test(s || '');

function upcomingLegs() {
  const out = [];
  trips.forEach(t =>
    t.legs.forEach((l, li) => {
      if (daysBetween(l.date, TODAY) >= 0) out.push({ t, l, li });
    })
  );
  return out.sort((a, b) => a.l.date - b.l.date || a.l.dep - b.l.dep);
}

const nextLeg = () => upcomingLegs()[0];
