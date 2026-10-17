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
    id: "colonial",
    logo: "/media/logos/colonial.png",
    platform: "web",
    name: "Colonial",
    type: { pt: "Site institucional", en: "Institutional website" },
    year: "2025",
    role: { pt: "Desenvolvimento", en: "Development" },
    stack: ["HTML", "CSS", "JavaScript"],
    summary: {
      pt: "Concessionária de máquinas agrícolas com hero cinematográfico e catálogo direto.",
      en: "Agricultural machinery dealership with a cinematic hero and a direct catalogue.",
    },
    description: [
      {
        pt: "Site institucional para uma concessionária de máquinas agrícolas: hero de impacto, navegação direta para linhas de produto e serviços e uma hierarquia pensada para um público que decide por confiança.",
        en: "Institutional website for an agricultural machinery dealership: a high-impact hero, direct navigation to product lines and services, and a hierarchy designed for an audience that decides on trust.",
      },
      {
        pt: "Desenvolvido sem frameworks, com HTML semântico, CSS responsivo e JavaScript leve para as interações.",
        en: "Built without frameworks, using semantic HTML, responsive CSS and lightweight JavaScript for interactions.",
      },
    ],
    screens: 4,
  },
  {
    id: "super-tratores",
    logo: "/media/logos/new-holland.png",
    platform: "web",
    status: "study",
    name: "Super Tratores",
    type: { pt: "Site institucional · estudo", en: "Institutional website · study" },
    year: "2025",
    role: { pt: "Conceito & desenvolvimento", en: "Concept & development" },
    stack: ["HTML", "CSS", "JavaScript"],
    url: "https://super-tratores.vercel.app/",
    summary: {
      pt: "Proposta de site para concessionária New Holland, com vitrine de máquinas.",
      en: "Website proposal for a New Holland dealership, with a machinery showcase.",
    },
    description: [
      {
        pt: "Proposta de site institucional para uma concessionária New Holland: vitrine de máquinas novas e seminovas, hero de alto impacto e navegação por linhas de produto.",
        en: "Institutional website proposal for a New Holland dealership: a showcase of new and used machinery, a high-impact hero and navigation by product line.",
      },
      {
        pt: "Construído do zero com HTML, CSS e JavaScript, com filtros e cards de produto responsivos.",
        en: "Built from scratch with HTML, CSS and JavaScript, with responsive filters and product cards.",
      },
    ],
    note: {
      pt: "Projeto de estudo, criado para apresentar uma ideia à marca. Não é um trabalho oficial e não possui vínculo com a New Holland ou a Super Tratores.",
      en: "A study project created to pitch an idea to the brand. It is not official work and has no affiliation with New Holland or Super Tratores.",
    },
    screens: 4,
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
    id: "montebello",
    name: "Montebello",
    logo: "/media/logos/montebello.svg",
    platform: "web",
    status: "study",
    type: { pt: "Site institucional · proposta", en: "Institutional website · proposal" },
    year: "2026",
    role: { pt: "Design & desenvolvimento", en: "Design & development" },
    stack: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "GSAP", "Lenis"],
    url: "https://montebello-xi.vercel.app/",
    summary: {
      pt: "Proposta de site para uma construtora de alto padrão de Torres/RS.",
      en: "Website proposal for a high-end construction company in Torres, Brazil.",
    },
    description: [
      {
        pt: "Proposta de novo site para a Construtora Montebello, criada do zero com estética de alto padrão, rolagem suave e animações guiadas pelo scroll.",
        en: "A new website proposal for Construtora Montebello, built from scratch with a high-end look, smooth scrolling and scroll-driven animation.",
      },
      {
        pt: "Páginas por empreendimento, galeria em alta resolução e foco em performance, SEO e acessibilidade.",
        en: "Dedicated pages per development, a high-resolution gallery and a focus on performance, SEO and accessibility.",
      },
    ],
    note: {
      pt: "Projeto de proposta, criado por iniciativa própria. Não é um trabalho oficial e não possui vínculo com a Construtora Montebello.",
      en: "A proposal project created on my own initiative. It is not official work and has no affiliation with Construtora Montebello.",
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
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "React Native",
  "Expo",
  "Vite",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Lenis",
  "Supabase",
  "PostgreSQL",
  "WordPress",
  "WooCommerce",
  "PHP",
  "Git",
  "Vercel",
];

export const socials = [
  { label: "GitHub", handle: "@purezag", href: "https://github.com/purezag" },
  { label: "LinkedIn", handle: "/in/purezag", href: "https://www.linkedin.com/in/purezag/" },
  { label: "Instagram", handle: "@purezag", href: "https://instagram.com/purezag" },
];

export const email = "glhrmpureza@gmail.com";
