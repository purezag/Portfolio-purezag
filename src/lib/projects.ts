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
  status?: "study" | "production" | "soon";
};

const euvatarNote: Localized = {
  pt: "Projeto desenvolvido para a Euvatar. O crédito criativo e o cliente são da agência — minha atuação foi o desenvolvimento front-end.",
  en: "Built for Euvatar. Creative credit and the client belong to the agency — my role was front-end development.",
};

export const projects: Project[] = [
  {
    id: "laboratorio-criativo",
    logo: "/media/logos/laboratorio-criativo.png",
    platform: "web",
    name: "Laboratório Criativo",
    type: { pt: "E-commerce", en: "E-commerce" },
    year: "2025",
    role: { pt: "Desenvolvimento", en: "Development" },
    stack: ["WordPress", "WooCommerce", "PHP", "HTML", "CSS", "JavaScript"],
    url: "https://www.laboratoriocriativo.com",
    summary: {
      pt: "E-commerce completo em WordPress, da interface ao checkout.",
      en: "Full WordPress e-commerce, from interface to checkout.",
    },
    description: [
      {
        pt: "E-commerce construído de ponta a ponta em WordPress, com front-end responsivo e focado em performance.",
        en: "E-commerce built end to end on WordPress, with a responsive, performance-focused front-end.",
      },
      {
        pt: "Hierarquia de produto clara, navegação rápida e um checkout sem atrito.",
        en: "Clear product hierarchy, fast navigation and a frictionless checkout.",
      },
    ],
    screens: 3,
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
    url: "/cases/celeiro/index.html",
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
    url: "/cases/superba/index.html",
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
    id: "euvatar-landing",
    logo: "/media/logos/euvatar.png",
    platform: "web",
    name: "Euvatar",
    type: { pt: "Landing page", en: "Landing page" },
    year: "2025",
    role: { pt: "Front-end", en: "Front-end" },
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://videos-todos.vercel.app/",
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
    url: "https://euvatar-web.vercel.app/",
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
