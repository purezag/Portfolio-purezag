export type Lang = "pt" | "en";

export type Localized = Record<Lang, string>;

const pt = {
  meta: {
    htmlLang: "pt-BR",
  },
  nav: {
    home: "Início",
    work: "Projetos",
    about: "Sobre",
    contact: "Contato",
    open: "Abrir menu",
    menuLabel: "menu",
    closeLabel: "fechar",
    close: "Fechar menu",
    status: "Disponível para projetos",
    social: "Redes",
    reach: "Fale comigo",
    localTime: "Pelotas, RS",
  },
  controls: {
    theme: "Alternar tema claro e escuro",
    lang: "Mudar idioma para inglês",
    light: "Claro",
    dark: "Escuro",
  },
  preloader: {
    steps: ["resolvendo módulos", "compilando interface", "hidratando componentes", "pronto"],
  },
  hero: {
    eyebrow: "Portfólio · 2026",
    role: "Desenvolvedor web & mobile",
    stack: "react · react native · next.js · typescript",
    scroll: "role para explorar",
    based: "Pelotas, RS — BR",
  },
  work: {
    eyebrow: "Projetos",
    title: "Clientes & projetos",
    more: "ver mais",
    open: "Abrir case",
    close: "Fechar prévia",
    platform: { web: "web", mobile: "mobile" },
    status: { study: "estudo", production: "em produção", soon: "em breve" },
    ctaTitle: "Seu projeto aqui",
    ctaText: "vamos conversar",
  },
  modal: {
    close: "Fechar case",
    year: "Ano",
    role: "Atuação",
    stack: "Stack",
    type: "Tipo",
    live: "Ver projeto online",
    offline: "Projeto sem link público",
    next: "Próximo case",
    note: "Nota",
    screens: "Telas",
  },
  about: {
    eyebrow: "Sobre",
    statement: "Design e código.",
    bio: [
      "Desenvolvedor front-end e designer de UI/UX. Crio interfaces para sites, aplicativos e sistemas — desenho, programo e lanço.",
      "Trabalho principalmente com React, React Native, Next.js e TypeScript, e também atuo no back-end.",
    ],
    stack: "Stack",
    profile: {
      role: "front-end & ui/ux",
      focus: "sites · apps · sistemas",
      base: "Pelotas, RS",
      languages: ["português — nativo", "inglês — avançado", "espanhol — regular"],
    },
  },
  contact: {
    eyebrow: "Contato",
    ctaFront: ["Vamos criar", "algo", "incrível."],
    social: "Redes",
    time: "Horário local",
    status: "Disponível para novos projetos",
    top: "Voltar ao topo",
  },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  meta: {
    htmlLang: "en",
  },
  nav: {
    home: "Home",
    work: "Work",
    about: "About",
    contact: "Contact",
    open: "Open menu",
    menuLabel: "menu",
    closeLabel: "close",
    close: "Close menu",
    status: "Available for work",
    social: "Social",
    reach: "Get in touch",
    localTime: "Pelotas, RS",
  },
  controls: {
    theme: "Toggle light and dark theme",
    lang: "Switch language to Portuguese",
    light: "Light",
    dark: "Dark",
  },
  preloader: {
    steps: ["resolving modules", "compiling interface", "hydrating components", "ready"],
  },
  hero: {
    eyebrow: "Portfolio · 2026",
    role: "Web & mobile developer",
    stack: "react · react native · next.js · typescript",
    scroll: "scroll to explore",
    based: "Pelotas, RS — BR",
  },
  work: {
    eyebrow: "Work",
    title: "Clients & projects",
    more: "see more",
    open: "Open case",
    close: "Close preview",
    platform: { web: "web", mobile: "mobile" },
    status: { study: "study", production: "in production", soon: "coming soon" },
    ctaTitle: "Your project here",
    ctaText: "let's talk",
  },
  modal: {
    close: "Close case",
    year: "Year",
    role: "Role",
    stack: "Stack",
    type: "Type",
    live: "Visit live project",
    offline: "No public link",
    next: "Next case",
    note: "Note",
    screens: "Screens",
  },
  about: {
    eyebrow: "About",
    statement: "Design and code.",
    bio: [
      "Front-end developer and UI/UX designer. I build interfaces for websites, apps and systems — I design, code and ship.",
      "I work mainly with React, React Native, Next.js and TypeScript, and also on the back-end.",
    ],
    stack: "Stack",
    profile: {
      role: "front-end & ui/ux",
      focus: "websites · apps · systems",
      base: "Pelotas, RS",
      languages: ["portuguese — native", "english — advanced", "spanish — intermediate"],
    },
  },
  contact: {
    eyebrow: "Contact",
    ctaFront: ["Let's create", "something", "amazing."],
    social: "Social",
    time: "Local time",
    status: "Available for new projects",
    top: "Back to top",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { pt, en };
