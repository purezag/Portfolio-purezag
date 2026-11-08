import type { Localized } from "./i18n";

export type Project = {
  id: string;
  name: string;
  type: Localized;
  year: string;
  role: Localized;
  stack: string[];
  url?: string;
  summary: Localized;
  description: Localized[];
  note?: Localized;
  screens: number;
  logo?: string;
  platform: "web" | "mobile";
  status?: "study" | "prototype" | "production" | "soon";
  motion?: "pending";
};

const euvatarNote: Localized = {
  pt: "Projeto desenvolvido para a Euvatar. O crédito criativo e o cliente são da agência — minha atuação foi o desenvolvimento front-end.",
  en: "Built for Euvatar. Creative credit and the client belong to the agency — my role was front-end development.",
};

export const projects: Project[] = [
  {
    id: "vulto",
    name: "VULTO",
    logo: "/media/logos/vulto.svg",
    platform: "web",
    status: "study",
    type: { pt: "E-commerce de moda esportiva · estudo", en: "Sportswear e-commerce · study" },
    year: "2026",
    role: { pt: "Marca, design & desenvolvimento", en: "Brand, design & development" },
    stack: ["Next.js", "React", "TypeScript", "Zustand", "CSS Modules"],
    url: "https://vulto-loja.vercel.app",
    motion: "pending",
    summary: {
      pt: "Loja de roupas de corrida que vende a madrugada: do preloader ao checkout, a compra é uma prova.",
      en: "A running apparel store that sells the early hours: from preloader to checkout, buying is a race.",
    },
    description: [
      {
        pt: "E-commerce completo de uma grife de corrida, treino e bike de São Paulo: vitrine, categorias, linhas de treino, página de produto com ficha técnica e guia de medidas, sacola, busca e favoritos. O checkout tem três etapas contadas como quilômetros, com cronômetro de prova, e a confirmação entrega um número de peito com o pedido e o Pix.",
        en: "A complete e-commerce for a São Paulo running, training and cycling label: storefront, categories, training lines, product pages with specs and a size guide, bag, search and favourites. Checkout has three steps counted as kilometres, with a race clock, and the confirmation hands over a race bib with the order and the Pix code.",
      },
      {
        pt: "Identidade própria em preto e lime, com relógio do nascer do sol em São Paulo, lookbook por horário da madrugada, conta com rastreio de pedidos e as páginas da marca. Mobile first de 320 a 1920 px, 49 páginas estáticas em Next.js 16 e React 19, estado em Zustand e 78 fotos de campanha.",
        en: "Its own black-and-lime identity, with a São Paulo sunrise clock, a lookbook told by the hour, an account with order tracking and the brand pages. Mobile first from 320 to 1920 px, 49 static pages in Next.js 16 and React 19, state in Zustand and 78 campaign photos.",
      },
    ],
    note: {
      pt: "Projeto de estudo com marca fictícia criada por mim: a VULTO não existe. Pagamento, conta e pedidos são simulados no navegador e nenhum valor é cobrado.",
      en: "A study project with a fictional brand I created: VULTO does not exist. Payment, account and orders are simulated in the browser and nothing is charged.",
    },
    screens: 11,
  },
  {
    id: "oriel-one",
    name: "Oriel One",
    logo: "/media/logos/oriel-one.png",
    platform: "web",
    status: "study",
    type: { pt: "Site de lançamento 3D · estudo", en: "3D launch website · study" },
    year: "2026",
    role: { pt: "Conceito, 3D, design & desenvolvimento", en: "Concept, 3D, design & development" },
    stack: ["three.js", "JavaScript", "Vite", "Blender"],
    url: "https://oriel-one-nine.vercel.app",
    summary: {
      pt: "Lançamento de um smartphone contado como um filme 3D que mergulha na tela até os subpixels.",
      en: "A smartphone launch told as a 3D film that dives into the screen down to the subpixels.",
    },
    description: [
      {
        pt: "A rolagem dirige o filme em tempo real com three.js: um anel de cinco aparelhos, a desmontagem camada por camada com pinos e lista de peças, a remontagem e um mergulho na tela até os subpixels. Ao atravessar o subpixel, a cor dele vira a cor da primeira seção e o site se monta sobre ela.",
        en: "Scrolling drives a real-time three.js film: a ring of five phones, a layer-by-layer teardown with pins and a parts list, reassembly and a dive into the screen down to the subpixels. Passing through a subpixel, its colour becomes the first section's colour and the site builds itself on top of it.",
      },
      {
        pt: "Cinco acabamentos com materiais físicos trocados no arraste, preços, armazenamento e reserva, inglês e português, tema claro e escuro e uma versão sem 3D para aparelhos sem WebGL 2. Modelo do aparelho gerado no Blender, sem framework de interface.",
        en: "Five finishes with physical materials swapped by dragging, pricing, storage and reservation, English and Portuguese, light and dark themes and a no-3D version for devices without WebGL 2. The phone model was generated in Blender, with no UI framework.",
      },
    ],
    note: {
      pt: "Projeto de estudo com marca e aparelho fictícios: a Oriel e o Oriel One não existem. Ambiente de estúdio “Brown Photostudio 02”, da Poly Haven (CC0).",
      en: "A study project with a fictional brand and device: Oriel and the Oriel One do not exist. Studio environment “Brown Photostudio 02” by Poly Haven (CC0).",
    },
    screens: 11,
  },
  {
    id: "santander-agora",
    name: "Santander Agora",
    logo: "/media/logos/santander-agora.png",
    platform: "mobile",
    status: "study",
    type: { pt: "Redesign de app · estudo", en: "App redesign · study" },
    year: "2026",
    role: { pt: "Produto, UX/UI & front-end", en: "Product, UX/UI & front-end" },
    stack: ["JavaScript", "CSS", "Vite"],
    url: "https://santander-agora.vercel.app",
    summary: {
      pt: "Releitura do app de um banco organizado pelo tempo: o saldo acompanha o dia que você escolhe.",
      en: "A rethink of a bank app organised by time: the balance follows the day you pick.",
    },
    description: [
      {
        pt: "A tela inicial é uma linha do tempo arrastável. Para trás fica o que já aconteceu, em papel claro; para a frente, o que vai acontecer (salário, contas, Pix agendados e gastos estimados), em noite. O saldo grande acompanha o dia escolhido, e extrato e agenda viram um gesto só.",
        en: "The home screen is a draggable timeline. Behind you is what already happened, on light paper; ahead is what's coming (salary, bills, scheduled Pix and estimated spending), at night. The big balance follows the chosen day, and statement and calendar become a single gesture.",
      },
      {
        pt: "Pix, pagamento por leitura de código, cartões, impostos, comprovantes, chat e perfil a um toque. Front-end puro, sem dependências em produção, publicado como um único arquivo com fontes e imagens embutidas.",
        en: "Pix, code-scan payments, cards, taxes, receipts, chat and profile one tap away. Plain front-end with no production dependencies, shipped as a single file with fonts and images embedded.",
      },
    ],
    note: {
      pt: "Conceito independente de UX/UI, sem vínculo com o banco. Não acessa contas reais e todos os valores, pessoas e transações são fictícios.",
      en: "An independent UX/UI concept with no affiliation with the bank. It does not access real accounts and all amounts, people and transactions are fictional.",
    },
    screens: 12,
  },
  {
    id: "gol-app",
    name: "GOL App",
    logo: "/media/logos/gol-app.png",
    platform: "mobile",
    status: "study",
    type: { pt: "Redesign de app · estudo", en: "App redesign · study" },
    year: "2026",
    role: { pt: "Direção de arte, UX/UI & front-end", en: "Art direction, UX/UI & front-end" },
    stack: ["JavaScript", "CSS", "Vite"],
    url: "https://gol-app.vercel.app",
    summary: {
      pt: "Os dois Os do logo de uma companhia aérea viram a linguagem do app inteiro.",
      en: "The two Os of an airline's logo become the language of the whole app.",
    },
    description: [
      {
        pt: "O O laranja é você agindo, o cinza é o eco, e os dois só se entrelaçam quando algo se completa: check-in, pagamento aprovado, a chegada do próximo voo. Todo o resto é retângulo, como a sinalização de um aeroporto, com painel split-flap, fichas de voo e a cabine desenhada como a planta do 737.",
        en: "The orange O is you acting, the grey one is the echo, and they only interlock when something completes: check-in, an approved payment, the next flight drawing near. Everything else is a rectangle, like airport signage, with a split-flap board, flight strips and the cabin drawn as a 737 floor plan.",
      },
      {
        pt: "Compra completa com adultos, crianças e bebês, filtros de voo, tarifas, assentos, check-in, cartão de embarque, milhas, perfil e chat, além de um globo em pontos para explorar destinos. Front-end puro, sem dependências em produção, com logo refeito em vetor e tema claro e escuro.",
        en: "Full booking with adults, children and infants, flight filters, fares, seats, check-in, boarding pass, miles, profile and chat, plus a dotted globe to explore destinations. Plain front-end with no production dependencies, a logo redrawn in vector and light and dark themes.",
      },
    ],
    note: {
      pt: "Conceito não oficial de UX/UI, sem vínculo com a companhia. Voos, preços e reservas são fictícios. Fotos dos destinos do Unsplash, com os autores creditados no próprio app.",
      en: "An unofficial UX/UI concept with no affiliation with the airline. Flights, prices and bookings are fictional. Destination photos from Unsplash, with authors credited in the app.",
    },
    screens: 12,
  },
  {
    id: "ohmen",
    name: "OHMEN Electric",
    logo: "/media/logos/ohmen.png",
    platform: "web",
    status: "study",
    type: { pt: "Site 3D em tempo real · estudo", en: "Real-time 3D website · study" },
    year: "2026",
    role: { pt: "Conceito, 3D, filme, design & desenvolvimento", en: "Concept, 3D, film, design & development" },
    stack: ["three.js", "GSAP", "Lenis", "Web Audio", "Blender", "JavaScript"],
    url: "/cases/ohmen/index.html",
    summary: {
      pt: "Marca fictícia de carros elétricos contada como um filme 3D guiado pela rolagem.",
      en: "A fictional electric car marque told as a scroll-driven 3D film.",
    },
    description: [
      {
        pt: "O hipercarro ARC e o SUV UMBRA apresentados num filme em seis capítulos, desenhado em tempo real com three.js: a rolagem move a câmera, os carros e as luzes do estúdio, com piso refletivo, bloom e coreografias exportadas do Blender.",
        en: "The ARC hypercar and the UMBRA SUV presented in a six-chapter film rendered in real time with three.js: scrolling drives the camera, the cars and the studio lights, with a reflective floor, bloom and choreography exported from Blender.",
      },
      {
        pt: "A mesma cena vira uma garagem 3D para configurar pintura, rodas, pinças e interior, com troca de modelo animada. Som elétrico sintetizado com Web Audio, inglês e português com transição circular e versão leve para celular.",
        en: "The same scene becomes a 3D garage to configure paint, wheels, calipers and interior, with an animated model swap. Synthesised electric sound with Web Audio, English and Portuguese with a circular transition and a lighter mobile version.",
      },
    ],
    note: {
      pt: "Projeto de estudo com marca e carros fictícios: OHMEN, ARC e UMBRA não existem. Modelo 3D base “Car Concept”, de Eric Chadwick, sob licença CC BY 4.0, modificado.",
      en: "A study project with a fictional brand and cars: OHMEN, ARC and UMBRA do not exist. Base 3D model “Car Concept” by Eric Chadwick, CC BY 4.0, modified.",
    },
    screens: 5,
  },
  {
    id: "beatframe",
    name: "Beatframe",
    logo: "/media/logos/beatframe.svg",
    platform: "web",
    status: "prototype",
    type: { pt: "Plataforma de vídeo com IA", en: "AI video platform" },
    year: "2026",
    role: { pt: "Produto, design & front-end", en: "Product, design & front-end" },
    stack: ["Preact", "JavaScript", "HTML", "CSS"],
    url: "/cases/beatframe/index.html",
    summary: {
      pt: "IA que lê o ritmo de uma edição de referência e monta a sua versão com o seu material.",
      en: "AI that reads the rhythm of a reference edit and builds your version with your own footage.",
    },
    description: [
      {
        pt: "O Beatframe assiste a um vídeo de referência, lê a estrutura da edição (cortes na batida, bpm, tempo e posição das legendas, transições e efeitos) e refaz a peça com as imagens, vídeos e a marca de quem usa. Nada da referência entra no resultado: só a estrutura é reaproveitada. O mesmo fluxo vale para posts, com o modo imagem.",
        en: "Beatframe watches a reference video, reads the structure of the edit (cuts on the beat, bpm, caption timing and placement, transitions and effects) and rebuilds the piece with the user's own images, videos and brand. Nothing from the reference ends up in the result: only the structure is reused. The same flow works for posts in image mode.",
      },
      {
        pt: "Protótipo navegável com 25 telas: entrada com vídeo, área de criação com monitor de leitura e linha do tempo, geração em segundo plano, projetos, planos e pagamento, créditos, conta, ajuda e os documentos legais. Identidade própria em grafite e creme, tema claro e escuro, atalhos de teclado e movimento que respeita a preferência de reduzir animações.",
        en: "A clickable prototype with 25 screens: a video sign-in, a creation workspace with a reading monitor and timeline, background generation, projects, plans and checkout, credits, account, help and the legal documents. Its own graphite-and-cream identity, light and dark themes, keyboard shortcuts and motion that respects the reduced-motion preference.",
      },
    ],
    note: {
      pt: "Protótipo só de front-end: login, geração, créditos e pagamento são simulados no navegador e nenhum dado sai dele. Preços, e-mails e dados da empresa são ilustrativos.",
      en: "Front-end-only prototype: sign-in, generation, credits and payment are simulated in the browser and no data leaves it. Prices, e-mails and company details are illustrative.",
    },
    screens: 5,
  },
  {
    id: "open",
    name: "Open",
    logo: "/media/logos/open.svg",
    platform: "web",
    status: "production",
    type: { pt: "Sistema interativo", en: "Interactive system" },
    year: "2026",
    role: { pt: "Design & desenvolvimento", en: "Design & development" },
    stack: [],
    summary: {
      pt: "Sistema interativo de divulgação de empreendimentos.",
      en: "Interactive showcase system for real estate developments.",
    },
    description: [
      {
        pt: "Sistema de divulgação de empreendimentos da Open Construtora, totalmente interativo: o visitante explora cada empreendimento de forma imersiva, em vez de só rolar uma página.",
        en: "A fully interactive showcase system for Open Construtora's developments: visitors explore each project in an immersive way instead of just scrolling a page.",
      },
      {
        pt: "O projeto está em produção — telas e detalhes chegam assim que for publicado.",
        en: "The project is in production — screens and details will follow once it launches.",
      },
    ],
    screens: 0,
  },
  {
    id: "no-esquema",
    name: "No Esquema",
    logo: "/media/logos/no-esquema.png",
    platform: "mobile",
    status: "production",
    type: { pt: "Aplicativo iOS & Android", en: "iOS & Android app" },
    year: "2026",
    role: { pt: "Produto, design & desenvolvimento", en: "Product, design & development" },
    stack: ["React Native", "Expo", "Supabase", "Realtime"],
    summary: {
      pt: "O app para decidir onde ir hoje — e com quem.",
      en: "The app to decide where to go tonight — and with whom.",
    },
    description: [
      {
        pt: "App de vida noturna e conexões criado para Pelotas/RS. Junta três movimentos num só lugar: descobrir bares, baladas e restaurantes com horário real, entrada, eventos, mapa e busca; combinar com amigos e tribos por interesse, com encontros marcados; e confiar, com identidade verificada e curadoria de cada local.",
        en: "A nightlife and social app built for Pelotas, Brazil. It brings three moves together: discover bars, clubs and restaurants with real opening hours, entry, events, map and search; plan with friends and interest-based tribes, with scheduled meetups; and trust, with verified identity and curated venues.",
      },
      {
        pt: "Produto próprio, do conceito ao código: React Native + Expo para iOS e Android, Supabase (Postgres) com regras de acesso no servidor, notificações em tempo real, \"aberto agora\" calculado pelos turnos de cada casa, rota no Maps e Waze, e painel para estabelecimentos com planos e equipe.",
        en: "My own product, from concept to code: React Native + Expo for iOS and Android, Supabase (Postgres) with server-side access rules, real-time notifications, \"open now\" computed from each venue's shifts, routes in Maps and Waze, and a venue dashboard with plans and teams.",
      },
    ],
    note: {
      pt: "As fotos, os dados e os nomes de estabelecimentos exibidos nas telas são de teste e não correspondem a locais reais.",
      en: "The photos, data and venue names shown in the screens are test content and do not correspond to real places.",
    },
    screens: 8,
  },
  {
    id: "bellamonte",
    name: "Bellamonte",
    logo: "/media/logos/bellamonte.svg",
    platform: "web",
    status: "study",
    type: { pt: "Site institucional · estudo", en: "Institutional website · study" },
    year: "2026",
    role: { pt: "Marca, design & desenvolvimento", en: "Brand, design & development" },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "GSAP", "Lenis", "Motion"],
    url: "/cases/bellamonte/index.html",
    summary: {
      pt: "Incorporadora de alto padrão com maquete 3D que se constrói conforme a rolagem.",
      en: "High-end developer with a 3D scale model that builds itself as you scroll.",
    },
    description: [
      {
        pt: "Site de uma incorporadora litorânea de alto padrão. No hero, a maquete 3D do prédio sobe andar por andar conforme a rolagem e passa do dia para a noite, numa sequência de 64 quadros sincronizada com GSAP, ScrollTrigger e Lenis.",
        en: "Website for a high-end coastal developer. In the hero, a 3D scale model of the building rises floor by floor as you scroll and moves from day to night, in a 64-frame sequence synced with GSAP, ScrollTrigger and Lenis.",
      },
      {
        pt: "Carrossel infinito de empreendimentos com arraste, páginas com galeria, plantas, ficha e andamento da obra, em português, inglês e espanhol. Identidade visual e imagens 3D criadas do zero para o projeto.",
        en: "An infinite, draggable carousel of developments and pages with gallery, floor plans, specs and construction progress, in Portuguese, English and Spanish. Visual identity and 3D renders created from scratch for the project.",
      },
    ],
    note: {
      pt: "Projeto de estudo com marca e cidade fictícias criadas por mim: a Bellamonte e Altomar não existem e não têm vínculo com nenhuma incorporadora real.",
      en: "A study project with a fictional brand and city I created: Bellamonte and Altomar do not exist and have no affiliation with any real developer.",
    },
    screens: 5,
  },
  {
    id: "euvatar-app-360",
    name: "Euvatar 360",
    logo: "/media/logos/euvatar.png",
    platform: "mobile",
    status: "soon",
    type: { pt: "Aplicativo 360°", en: "360° app" },
    year: "2026",
    role: { pt: "Desenvolvimento mobile", en: "Mobile development" },
    stack: [],
    summary: {
      pt: "Aplicativo mobile com experiência 360° desenvolvido para a Euvatar.",
      en: "Mobile app with a 360° experience built for Euvatar.",
    },
    description: [
      {
        pt: "Aplicativo mobile com experiência 360°, desenvolvido para a Euvatar. Telas, vídeo e detalhes completos chegam em breve.",
        en: "Mobile app with a 360° experience, built for Euvatar. Screens, video and full details coming soon.",
      },
    ],
    note: euvatarNote,
    screens: 0,
  },
  {
    id: "euvatar-landing",
    logo: "/media/logos/euvatar.png",
    platform: "web",
    name: "Euvatar",
    type: { pt: "Landing page", en: "Landing page" },
    year: "2025",
    role: { pt: "Front-end", en: "Front-end" },
    stack: ["HTML", "CSS", "JavaScript"],
    summary: {
      pt: "Landing page de conversão para mercado imobiliário e eventos.",
      en: "Conversion landing page for real estate and events.",
    },
    description: [
      {
        pt: "Landing page focada em conversão para os mercados imobiliário e de eventos: proposta de valor clara logo no primeiro bloco e um fluxo que leva o visitante direto ao contato.",
        en: "Conversion-focused landing page for the real estate and events markets: a clear value proposition above the fold and a flow that takes visitors straight to contact.",
      },
      {
        pt: "Front-end leve, carregamento rápido e layout responsivo pensado primeiro para o celular.",
        en: "Lightweight front-end, fast loading and a responsive layout designed mobile-first.",
      },
    ],
    note: euvatarNote,
    screens: 6,
  },
  {
    id: "euvatar-institucional",
    logo: "/media/logos/euvatar.png",
    platform: "web",
    name: "Euvatar",
    type: { pt: "Site institucional", en: "Institutional website" },
    year: "2025",
    role: { pt: "Front-end", en: "Front-end" },
    stack: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    summary: {
      pt: "Site institucional em stack moderna, com build otimizado e componentes reutilizáveis.",
      en: "Institutional website on a modern stack, with an optimized build and reusable components.",
    },
    description: [
      {
        pt: "Site institucional da Euvatar construído com Vite e Tailwind CSS. A estrutura foi organizada em blocos reutilizáveis para manter consistência entre páginas e facilitar a evolução do conteúdo.",
        en: "Euvatar's institutional website built with Vite and Tailwind CSS. The structure is organized into reusable blocks to keep pages consistent and make the content easy to evolve.",
      },
      {
        pt: "O foco técnico foi performance de carregamento, mídia pesada tratada com cuidado e uma experiência fluida do mobile ao desktop.",
        en: "The technical focus was load performance, carefully handled heavy media and a fluid experience from mobile to desktop.",
      },
    ],
    note: euvatarNote,
    screens: 6,
  },
  {
    id: "superba",
    logo: "/media/logos/superba.svg",
    platform: "web",
    status: "study",
    name: "Superba Tratores",
    type: { pt: "Site institucional · estudo", en: "Institutional website · study" },
    year: "2026",
    role: { pt: "Marca, design & desenvolvimento", en: "Brand, design & development" },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion"],
    summary: {
      pt: "Concessionária de máquinas com vitrine de seminovos, linha off-road e 11 filiais no mapa.",
      en: "Machinery dealership with a used stock showcase, an off-road line and 11 branches on the map.",
    },
    description: [
      {
        pt: "Site completo para uma concessionária de máquinas agrícolas com 11 filiais no Rio Grande do Sul: vitrine de seminovos com filtro e busca, linha de máquinas novas por categoria, linha off-road de quadriciclos e utilitários, serviços, institucional e filiais no mapa do estado.",
        en: "A complete website for an agricultural machinery dealership with 11 branches in Rio Grande do Sul: a used stock showcase with filters and search, new machines by category, an off-road line of ATVs and UTVs, services, company pages and branches on a state map.",
      },
      {
        pt: "Mais de 25 páginas em React, TypeScript e Tailwind, com identidade visual própria: logotipo, emblema, paleta e tipografia documentados em manual de marca.",
        en: "Over 25 pages in React, TypeScript and Tailwind, with its own visual identity: logo, emblem, palette and typography documented in brand guidelines.",
      },
    ],
    note: {
      pt: "Projeto de estudo com marcas fictícias criadas por mim: Superba, Nordfeld e Onça não existem e não têm vínculo com nenhuma concessionária ou fabricante real.",
      en: "A study project with fictional brands I created: Superba, Nordfeld and Onça do not exist and have no affiliation with any real dealership or manufacturer.",
    },
    screens: 5,
  },
  {
    id: "celeiro",
    logo: "/media/logos/celeiro.svg",
    platform: "web",
    name: "Celeiro",
    type: { pt: "Site institucional", en: "Institutional website" },
    year: "2026",
    role: { pt: "Marca, design & desenvolvimento", en: "Brand, design & development" },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Motion"],
    summary: {
      pt: "Revenda de máquinas e implementos agrícolas com catálogo, seminovos e equipe por região.",
      en: "Agricultural machinery and implements dealer with a catalogue, used stock and a team by region.",
    },
    description: [
      {
        pt: "Site de uma revenda de máquinas e implementos agrícolas com lojas em Pelotas e Camaquã: hero de impacto, promoções em destaque, catálogo de novos e seminovos com ficha, galeria em tela cheia e orçamento direto pelo WhatsApp.",
        en: "Website for an agricultural machinery and implements dealer with stores in Pelotas and Camaquã: a high-impact hero, featured deals, a catalogue of new and used machines with spec sheets, a full-screen gallery and quotes straight through WhatsApp.",
      },
      {
        pt: "Cada consultor aparece com os municípios que atende destacados no mapa real do Rio Grande do Sul. Código reescrito em React, TypeScript e Tailwind, com visual modernizado e identidade visual própria, do logotipo ao manual de marca.",
        en: "Each sales rep is shown with the towns they cover highlighted on a real map of Rio Grande do Sul. Rewritten in React, TypeScript and Tailwind, with a modernized look and its own visual identity, from logo to brand guidelines.",
      },
    ],
    note: {
      pt: "Releitura de um projeto real com marca fictícia: criei a Celeiro e a parceira Halden para mostrar o trabalho sem usar a marca do cliente. Pessoas, telefones e endereços são fictícios.",
      en: "A reinterpretation of a real project under a fictional brand: I created Celeiro and its partner Halden to show the work without using the client's brand. People, phone numbers and addresses are fictional.",
    },
    screens: 5,
  },
];

export const previewSrc = (id: string) => `/media/previews/${id}.mp4`;

export const posterSrc = (id: string) => `/media/previews/${id}.webp`;

export const screenSrc = (id: string, index: number, width: 800 | 1600) =>
  `/media/work/${id}/${String(index).padStart(2, "0")}-${width}.webp`;

export const stack = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "React Native",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
];

export const socials = [
  { label: "GitHub", handle: "@purezag", href: "https://github.com/purezag" },
  { label: "LinkedIn", handle: "/in/purezag", href: "https://www.linkedin.com/in/purezag/" },
  { label: "Instagram", handle: "@purezag", href: "https://instagram.com/purezag" },
];

export const email = "glhrmpureza@gmail.com";
