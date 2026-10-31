'use strict';

const AIRPORTS = {
  POA: { c: 'Porto Alegre', n: 'Salgado Filho', la: -29.99, lo: -51.17 },
  GRU: { c: 'São Paulo', n: 'Guarulhos', la: -23.43, lo: -46.47 },
  CGH: { c: 'São Paulo', n: 'Congonhas', la: -23.63, lo: -46.66 },
  GIG: { c: 'Rio de Janeiro', n: 'Galeão', la: -22.81, lo: -43.25 },
  SDU: { c: 'Rio de Janeiro', n: 'Santos Dumont', la: -22.91, lo: -43.16 },
  BSB: { c: 'Brasília', n: 'Juscelino Kubitschek', la: -15.87, lo: -47.92 },
  CNF: { c: 'Belo Horizonte', n: 'Confins', la: -19.62, lo: -43.97 },
  FLN: { c: 'Florianópolis', n: 'Hercílio Luz', la: -27.67, lo: -48.55 },
  CWB: { c: 'Curitiba', n: 'Afonso Pena', la: -25.53, lo: -49.18 },
  IGU: { c: 'Foz do Iguaçu', n: 'Cataratas', la: -25.6, lo: -54.49 },
  SSA: { c: 'Salvador', n: 'Luís Eduardo Magalhães', la: -12.91, lo: -38.33 },
  REC: { c: 'Recife', n: 'Guararapes', la: -8.13, lo: -34.92 },
  MCZ: { c: 'Maceió', n: 'Zumbi dos Palmares', la: -9.51, lo: -35.79 },
  FOR: { c: 'Fortaleza', n: 'Pinto Martins', la: -3.78, lo: -38.53 },
  JJD: { c: 'Jericoacoara', n: 'Comandante Ariston Pessoa', la: -2.91, lo: -40.36 },
  NAT: { c: 'Natal', n: 'Aluízio Alves', la: -5.77, lo: -35.37 },
  FEN: { c: 'Fernando de Noronha', n: 'Governador Carlos Wilson', la: -3.85, lo: -32.42 },
  EZE: { c: 'Buenos Aires', n: 'Ezeiza', la: -34.82, lo: -58.54, cc: 'Argentina' },
  MVD: { c: 'Montevidéu', n: 'Carrasco', la: -34.84, lo: -56.03, cc: 'Uruguai' },
  SCL: { c: 'Santiago', n: 'Arturo Merino Benítez', la: -33.39, lo: -70.79, cc: 'Chile' }
};

const SAME_TIMEZONE = ['Brasília', 'mesmo horário'];

const DESTINATIONS = {
  SSA: {
    name: 'Salvador',
    where: 'Bahia, Brasil',
    cat: 'Praia',
    ph: ['ssa-1', 'ssa-2', 'ssa-3'],
    card: 'ssa-2',
    temp: '30°',
    sky: 'sol entre nuvens',
    tz: SAME_TIMEZONE,
    tips: [
      ['Pelourinho', 'Casarões coloridos, igrejas barrocas e música pelas ladeiras do centro histórico.'],
      ['Farol da Barra', 'O pôr do sol mais aplaudido da cidade. Chegue cedo pra garantir lugar.'],
      ['Rio Vermelho', 'Bairro boêmio, com acarajé na praça e música ao vivo até tarde.']
    ]
  },
  GIG: {
    name: 'Rio de Janeiro',
    where: 'Rio de Janeiro, Brasil',
    cat: 'Cidade',
    ph: ['rio-1', 'rio-2', 'rio-3'],
    card: 'rio-2',
    temp: '29°',
    sky: 'calor e pancadas à tarde',
    tz: SAME_TIMEZONE,
    tips: [
      ['Pão de Açúcar', 'Suba de bondinho no fim da tarde e veja a cidade acender.'],
      ['Arpoador', 'Todo mundo aplaude o sol se pondo entre Ipanema e Copacabana.'],
      ['Santa Teresa', 'Ladeiras, ateliês e vista para a Baía de Guanabara.']
    ]
  },
  FLN: {
    name: 'Florianópolis',
    where: 'Santa Catarina, Brasil',
    cat: 'Praia',
    ph: ['fln-1', 'fln-2', 'fln-3'],
    card: 'fln-2',
    temp: '27°',
    sky: 'verão com brisa',
    tz: SAME_TIMEZONE,
    tips: [
      ['Lagoa da Conceição', 'Sandboard nas dunas de dia e jantar à beira da lagoa à noite.'],
      ['Santo Antônio de Lisboa', 'Ostras frescas e um dos pores do sol mais bonitos da ilha.'],
      ['Lagoinha do Leste', 'Trilha de 1 a 2 horas até uma praia sem acesso de carro.']
    ]
  },
  FEN: {
    name: 'Fernando de Noronha',
    where: 'Pernambuco, Brasil',
    cat: 'Natureza',
    ph: ['fen-1', 'fen-2', 'fen-3'],
    card: 'fen-2',
    temp: '29°',
    sky: 'sol e mar calmo',
    tz: ['+1 hora', 'em relação a Brasília'],
    tips: [
      ['Baía do Sancho', 'Escadas entre as rochas levam a uma das praias mais bonitas do país.'],
      ['Mirante dos Dois Irmãos', 'O cartão-postal da ilha, visto da Baía dos Porcos.'],
      ['Mirante dos Golfinhos', 'Vá cedo pra ver os golfinhos-rotadores entrando na baía.']
    ],
    note: 'A ilha cobra uma taxa de preservação ambiental por dia de estadia, paga antes da viagem ou na chegada.'
  },
  EZE: {
    name: 'Buenos Aires',
    where: 'Argentina',
    cat: 'Internacional',
    ph: ['eze-1', 'eze-2', 'eze-3'],
    card: 'eze-3',
    temp: '24°',
    sky: 'primavera amena',
    tz: ['Igual', 'ao de Brasília'],
    tips: [
      ['Caminito', 'As casas coloridas de La Boca e casais de tango na calçada.'],
      ['San Telmo', 'Feira de antiguidades aos domingos e bares antigos.'],
      ['Palermo', 'Parques, cafés e as parrillas mais disputadas.']
    ],
    note: 'Brasileiros entram na Argentina com RG em bom estado ou passaporte válido.'
  },
  IGU: {
    name: 'Foz do Iguaçu',
    where: 'Paraná, Brasil',
    cat: 'Natureza',
    ph: ['igu-1', 'igu-2'],
    card: 'igu-1',
    temp: '31°',
    sky: 'quente e úmido',
    tz: SAME_TIMEZONE,
    tips: [
      [
        'Cataratas do Iguaçu',
        'A passarela do lado brasileiro chega bem perto das quedas. Leve capa de chuva.'
      ],
      ['Parque das Aves', 'Araras, tucanos e viveiros em que você caminha entre as aves.'],
      ['Marco das Três Fronteiras', 'Brasil, Argentina e Paraguai no mesmo pôr do sol.']
    ]
  },
  JJD: {
    name: 'Jericoacoara',
    where: 'Ceará, Brasil',
    cat: 'Praia',
    ph: ['jjd-1', 'jjd-2', 'jjd-3'],
    card: 'jjd-1',
    temp: '31°',
    sky: 'sol e vento constante',
    tz: SAME_TIMEZONE,
    tips: [
      ['Pedra Furada', 'Na maré baixa, dá pra chegar caminhando pela praia.'],
      ['Duna do Pôr do Sol', 'O ritual de todo fim de tarde na vila.'],
      ['Lagoa do Paraíso', 'Redes dentro da água e água azul-turquesa.']
    ],
    note: 'O aeroporto fica em Cruz, a cerca de 40 minutos da vila de carro.'
  },
  MCZ: {
    name: 'Maceió',
    where: 'Alagoas, Brasil',
    cat: 'Praia',
    ph: ['mcz-2', 'mcz-1'],
    card: 'mcz-1',
    temp: '29°',
    sky: 'sol e água morna',
    tz: SAME_TIMEZONE,
    tips: [
      ['Pajuçara', 'Jangadas levam até as piscinas naturais em frente à praia.'],
      ['Maragogi', 'A cerca de 2 horas de carro, com piscinas naturais em alto-mar.'],
      ['Praia do Gunga', 'Coqueirais e falésias coloridas ao sul da cidade.']
    ]
  },
  GRU: {
    name: 'São Paulo',
    where: 'São Paulo, Brasil',
    cat: 'Cidade',
    ph: ['sao-1', 'sao-2'],
    card: 'sao-1',
    temp: '25°',
    sky: 'tempo variável',
    tz: SAME_TIMEZONE,
    tips: [
      ['Avenida Paulista', 'Museus, livrarias e a avenida aberta pra pedestres aos domingos.'],
      ['Mercadão', 'O sanduíche de mortadela é parada obrigatória.'],
      ['Pinacoteca', 'Arte brasileira num prédio histórico no bairro da Luz.']
    ]
  }
};

DESTINATIONS.CGH = DESTINATIONS.GRU;
DESTINATIONS.SDU = DESTINATIONS.GIG;
const FEATURED_DESTINATIONS = ['GIG', 'SSA', 'FLN', 'IGU', 'FEN', 'JJD', 'MCZ', 'EZE'];

const PROMOS = [
  {
    d: 'SSA',
    ph: 'ssa-1',
    tag: 'Feriadão de 20 de novembro',
    title: 'Salvador',
    sub: 'Pelourinho, acarajé e o pôr do sol no Farol da Barra.',
    win: [new Date(2026, 10, 18), new Date(2026, 10, 20)]
  },
  {
    d: 'GIG',
    ph: 'rio-1',
    tag: 'Black Friday antecipada',
    title: 'Rio de Janeiro',
    sub: '35% off em voos de 1 a 15 de dezembro.',
    win: [new Date(2026, 11, 1), new Date(2026, 11, 12)]
  },
  {
    d: 'FEN',
    ph: 'fen-1',
    tag: 'Smiles',
    title: 'Noronha',
    sub: 'Ida e volta pagando só com milhas.',
    miles: true
  },
  {
    d: 'FLN',
    ph: 'fln-1',
    tag: 'Férias de janeiro',
    title: 'Florianópolis',
    sub: '42 praias a uma hora de voo de casa.',
    win: [new Date(2027, 0, 5), new Date(2027, 0, 25)]
  },
  {
    d: 'EZE',
    ph: 'eze-1',
    tag: 'Internacional',
    title: 'Buenos Aires',
    sub: 'Dá pra ir só com o RG, e o fuso é o mesmo.'
  }
];

const FARES = [
  {
    n: 'Light',
    add: 0,
    inc: ['Mala de mão de até 10 kg', 'Item pessoal embaixo do assento'],
    no: ['Mala despachada', 'Remarcação']
  },
  {
    n: 'Plus',
    add: 110,
    inc: ['Mala de mão de até 10 kg', 'Mala despachada de 23 kg', 'Remarcação com taxa reduzida'],
    tag: 'Mais escolhida'
  },
  {
    n: 'Max',
    add: 290,
    inc: [
      'Duas malas despachadas de 23 kg',
      'Remarcação sem taxa',
      'Reembolso integral',
      'Embarque prioritário e assento Conforto'
    ]
  }
];

const MILES_PER_REAL = 30;
const toMiles = v => Math.round((v * MILES_PER_REAL) / 100) * 100;
