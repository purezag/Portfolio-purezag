"use strict";

/* =========================================================
   1. I18N — dicionário central (pt padrão, en, es)
   ========================================================= */
const I18N = {
  pt: {
    "nav.home": "Home", "nav.work": "Work", "nav.about": "Sobre", "nav.contact": "Contato",
    "nav.homeAria": "Voltar ao início", "nav.primaryAria": "Navegação principal",
    "lang.btnAria": "Idioma", "lang.listAria": "Selecionar idioma",
    "hero.aria": "Introdução",
    "work.eyebrow": "Trabalhos selecionados", "work.title": "<em class='serif'>Work</em>space",
    "work.all": "Todos", "work.web": "Web & Interface", "work.design": "Design", "work.motion": "Motion",
    "work.hint": "Arraste ou use as setas", "work.filterAria": "Filtrar projetos",
    "work.prevAria": "Case anterior", "work.nextAria": "Próximo case",
    "work.trackAria": "Projetos, role para navegar", "work.cta": "Ver case",
    "about.eyebrow": "Sobre",
    "about.statement": "Eu <em class='serif'>desenho</em> interfaces<br />&amp; <em class='serif'>construo</em> o código<br />por trás delas.",
    "about.bio": "Raízes no design gráfico, graduação em Análise e Desenvolvimento de Sistemas em andamento e a disciplina de um ex-atleta internacional — transformadas em experiências digitais bonitas e confiáveis.",
    "about.langsAria": "Idiomas", "about.pt": "Português", "about.en": "Inglês", "about.es": "Espanhol",
    "about.native": "nativo", "about.advanced": "avançado", "about.working": "intermediário",
    "about.location": "Porto Alegre, BR", "about.athlete": "Ex-atleta internacional", "about.available": "Disponível para projetos",
    "contact.eyebrow": "Contato",
    "contact.ctaFront": "Vamos criar<br />algo <em class='serif'>incrível</em>.",
    "contact.ctaBack": "<em class='serif'>Vamos criar</em><br /><em class='serif'>algo</em> incrível.",
    "contact.ctaAria": "Enviar e-mail para glhrmpureza@gmail.com",
    "contact.status": "Disponível para novos projetos",
    "modal.tools": "Ferramentas", "modal.year": "Ano", "modal.role": "Atuação",
    "modal.live": "Ver projeto online", "modal.closeAria": "Fechar case", "modal.mediaAria": "Mídias do projeto",
  },
  en: {
    "nav.home": "Home", "nav.work": "Work", "nav.about": "About", "nav.contact": "Contact",
    "nav.homeAria": "Back to home", "nav.primaryAria": "Primary navigation",
    "lang.btnAria": "Language", "lang.listAria": "Select language",
    "hero.aria": "Introduction",
    "work.eyebrow": "Selected work", "work.title": "<em class='serif'>Work</em>space",
    "work.all": "All", "work.web": "Web & Interface", "work.design": "Design", "work.motion": "Motion",
    "work.hint": "Drag or use the arrows", "work.filterAria": "Filter projects",
    "work.prevAria": "Previous case", "work.nextAria": "Next case",
    "work.trackAria": "Projects, scroll to browse", "work.cta": "View case",
    "about.eyebrow": "About",
    "about.statement": "I <em class='serif'>design</em> interfaces<br />&amp; <em class='serif'>build</em> the code<br />behind them.",
    "about.bio": "Graphic design roots, a Systems Analysis & Development degree in progress and the discipline of a former international athlete — turned into digital experiences that are beautiful and reliable.",
    "about.langsAria": "Spoken languages", "about.pt": "Portuguese", "about.en": "English", "about.es": "Spanish",
    "about.native": "native", "about.advanced": "advanced", "about.working": "working",
    "about.location": "Porto Alegre, BR", "about.athlete": "Former international athlete", "about.available": "Available for projects",
    "contact.eyebrow": "Contact",
    "contact.ctaFront": "Let's build<br />something <em class='serif'>great</em>.",
    "contact.ctaBack": "<em class='serif'>Let's build</em><br /><em class='serif'>something</em> great.",
    "contact.ctaAria": "Send an email to glhrmpureza@gmail.com",
    "contact.status": "Available for new projects",
    "modal.tools": "Tools", "modal.year": "Year", "modal.role": "Role",
    "modal.live": "View live project", "modal.closeAria": "Close case study", "modal.mediaAria": "Project media",
  },
  es: {
    "nav.home": "Inicio", "nav.work": "Work", "nav.about": "Sobre mí", "nav.contact": "Contacto",
    "nav.homeAria": "Volver al inicio", "nav.primaryAria": "Navegación principal",
    "lang.btnAria": "Idioma", "lang.listAria": "Seleccionar idioma",
    "hero.aria": "Introducción",
    "work.eyebrow": "Trabajos seleccionados", "work.title": "<em class='serif'>Work</em>space",
    "work.all": "Todos", "work.web": "Web e Interfaz", "work.design": "Diseño", "work.motion": "Motion",
    "work.hint": "Arrastra o usa las flechas", "work.filterAria": "Filtrar proyectos",
    "work.prevAria": "Caso anterior", "work.nextAria": "Siguiente caso",
    "work.trackAria": "Proyectos, desplaza para navegar", "work.cta": "Ver caso",
    "about.eyebrow": "Sobre mí",
    "about.statement": "Yo <em class='serif'>diseño</em> interfaces<br />y <em class='serif'>construyo</em> el código<br />detrás de ellas.",
    "about.bio": "Raíces en el diseño gráfico, estudios de Análisis y Desarrollo de Sistemas en curso y la disciplina de un exatleta internacional — convertidos en experiencias digitales bonitas y confiables.",
    "about.langsAria": "Idiomas", "about.pt": "Portugués", "about.en": "Inglés", "about.es": "Español",
    "about.native": "nativo", "about.advanced": "avanzado", "about.working": "intermedio",
    "about.location": "Porto Alegre, BR", "about.athlete": "Exatleta internacional", "about.available": "Disponible para proyectos",
    "contact.eyebrow": "Contacto",
    "contact.ctaFront": "Vamos a crear<br />algo <em class='serif'>increíble</em>.",
    "contact.ctaBack": "<em class='serif'>Vamos a crear</em><br /><em class='serif'>algo</em> increíble.",
    "contact.ctaAria": "Enviar un correo a glhrmpureza@gmail.com",
    "contact.status": "Disponible para nuevos proyectos",
    "modal.tools": "Herramientas", "modal.year": "Año", "modal.role": "Rol",
    "modal.live": "Ver proyecto online", "modal.closeAria": "Cerrar caso", "modal.mediaAria": "Medios del proyecto",
  },
};

const LANG_HTML = { pt: "pt-BR", en: "en", es: "es" };
const DEFAULT_LANG = "en";   /* idioma padrão a cada carregamento */
let LANG = DEFAULT_LANG;
const t = (key) => (I18N[LANG] && I18N[LANG][key]) || I18N.pt[key] || "";
const tx = (obj) => (obj ? obj[LANG] || obj.pt : "");

/* =========================================================
   2. CASES
   ========================================================= */
const CAT_LABELS = {
  web: { pt: "Web & Interface", en: "Web & Interface", es: "Web e Interfaz" },
  design: { pt: "Design", en: "Design", es: "Diseño" },
  motion: { pt: "Motion", en: "Motion", es: "Motion" },
};
const LIVE_LINK_CATEGORIES = ["web", "interface"]; // regra do botão "Ver projeto online"

/* ---------------------------------------------------------
   URLs dos projetos online — PREENCHA AQUI.
   Todo case de web/interface com URL aqui exibe o botão
   "Ver projeto online". Deixe "" para esconder o botão.
   --------------------------------------------------------- */
const CASE_LINKS = {
  "laboratorio-criativo": "https://www.laboratoriocriativo.com",
  "euvatar-institucional": "https://www.euvatar.com.br",
  "euvatar-landing": "",
  "colonial-site": "",
  "super-tratores-site": "",
};

const C = "./assets/cases";
const im = (s) => ({ t: "img", src: s });
const vd = (s, poster) => ({ t: "vid", src: s, poster });
const imgs = (dir, slug, n, from = 1) =>
  Array.from({ length: n }, (_, i) => im(`${C}/${dir}/${slug}-${String(i + from).padStart(2, "0")}.webp`));

const PROJECTS = [
  /* ---------------- WEB ---------------- */
  {
    id: "euvatar-landing",
    category: "web",
    title: "Euvatar — Landing Page",
    eyebrow: { pt: "Landing Page · Imobiliário & Eventos", en: "Landing Page · Real Estate & Events", es: "Landing Page · Inmobiliario y Eventos" },
    note: {
      pt: "Landing page de conversão para o mercado imobiliário e de eventos.",
      en: "Conversion landing page for the real estate and events market.",
      es: "Landing page de conversión para el mercado inmobiliario y de eventos.",
    },
    description: {
      pt: "Landing page focada em conversão para a vertical de mercado imobiliário e eventos: proposta de valor clara logo no primeiro bloco, carregamento rápido e um layout desenhado para levar o visitante direto ao contato.\n\nProjeto da Euvatar, agência onde atuo hoje. O crédito criativo é integralmente da Euvatar — meu papel foi a execução do design e do front-end. O cliente é da agência, não meu.",
      en: "Conversion-focused landing page for the real estate and events vertical: a clear value proposition above the fold, fast loading and a layout engineered to guide the visitor straight to contact.\n\nA Euvatar project — the agency I currently work for. Full creative credit goes to Euvatar; my role was executing the design and front-end. The client belongs to the agency, not to me.",
      es: "Landing page enfocada en conversión para el sector inmobiliario y de eventos: propuesta de valor clara desde el primer bloque, carga rápida y un layout diseñado para llevar al visitante directo al contacto.\n\nProyecto de Euvatar, la agencia donde trabajo actualmente. El crédito creativo es totalmente de Euvatar; mi rol fue la ejecución del diseño y del front-end. El cliente es de la agencia, no mío.",
    },
    thumb: `${C}/euvatar-landing/euvatar-landing-cover.webp`,
    media: imgs("euvatar-landing", "euvatar-landing", 6),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain"],
    date: "2025",
    role: { pt: "Execução de design & front-end", en: "Design & front-end execution", es: "Ejecución de diseño y front-end" },
  },
  {
    id: "euvatar-institucional",
    category: "web",
    title: "Euvatar — Site Institucional",
    eyebrow: { pt: "Site Institucional", en: "Institutional Website", es: "Sitio Institucional" },
    note: {
      pt: "Site institucional com stack moderna e visual de marca reforçado por IA.",
      en: "Institutional site on a modern stack with AI-enhanced brand visuals.",
      es: "Sitio institucional con stack moderno y visual de marca reforzado con IA.",
    },
    description: {
      pt: "Site institucional da Euvatar, construído com stack moderna (Tailwind + Vite). Imagens de marca tratadas em Photoshop e Premiere e complementadas por visuais gerados com OpenAI e Kling AI.\n\nProjeto da Euvatar, agência onde atuo hoje. O crédito criativo é integralmente da Euvatar — meu papel foi a execução. O cliente é da agência, não meu.",
      en: "Euvatar's institutional website, built on a modern stack (Tailwind + Vite). Brand imagery treated in Photoshop and Premiere, complemented by visuals generated with OpenAI and Kling AI.\n\nA Euvatar project — the agency I currently work for. Full creative credit goes to Euvatar; my role was execution. The client belongs to the agency, not to me.",
      es: "Sitio institucional de Euvatar, construido con stack moderna (Tailwind + Vite). Imágenes de marca tratadas en Photoshop y Premiere y complementadas con visuales generados con OpenAI y Kling AI.\n\nProyecto de Euvatar, la agencia donde trabajo actualmente. El crédito creativo es totalmente de Euvatar; mi rol fue la ejecución. El cliente es de la agencia, no mío.",
    },
    thumb: `${C}/euvatar-institucional/euvatar-institucional-cover.webp`,
    media: imgs("euvatar-institucional", "euvatar-institucional", 6),
    tools: ["devicon-tailwindcss-original", "devicon-vitejs-plain", "devicon-photoshop-plain", "devicon-premierepro-plain", "OpenAI", "Kling AI"],
    date: "2025",
    role: { pt: "Execução de design & front-end", en: "Design & front-end execution", es: "Ejecución de diseño y front-end" },
  },
  {
    id: "colonial-site",
    category: "web",
    title: "Colonial — Site",
    eyebrow: { pt: "Site Institucional · Máquinas Agrícolas", en: "Institutional Website · Agricultural Machinery", es: "Sitio Institucional · Maquinaria Agrícola" },
    note: {
      pt: "Site de concessionária agrícola com hero cinematográfico e catálogo claro.",
      en: "Agricultural dealership site with a cinematic hero and a clear catalogue.",
      es: "Sitio de concesionaria agrícola con hero cinematográfico y catálogo claro.",
    },
    description: {
      pt: "Site institucional para concessionária de máquinas agrícolas: hero cinematográfico com a força do campo, navegação direta para linhas de produto e serviços, e uma hierarquia pensada para um público que decide por confiança.",
      en: "Institutional website for an agricultural machinery dealership: a cinematic hero carrying the strength of the field, direct navigation to product lines and services, and a hierarchy designed for an audience that decides on trust.",
      es: "Sitio institucional para concesionaria de maquinaria agrícola: hero cinematográfico con la fuerza del campo, navegación directa a líneas de producto y servicios, y una jerarquía pensada para un público que decide por confianza.",
    },
    thumb: `${C}/colonial/site/colonial-site-cover.webp`,
    media: imgs("colonial/site", "colonial-site", 4),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain"],
    date: "2025",
    role: { pt: "Design & desenvolvimento", en: "Design & development", es: "Diseño y desarrollo" },
  },
  {
    id: "super-tratores-site",
    category: "web",
    title: "Super Tratores New Holland",
    eyebrow: { pt: "Site Institucional · Estudo não oficial", en: "Institutional Website · Unofficial study", es: "Sitio Institucional · Estudio no oficial" },
    note: {
      pt: "Proposta de site para a marca — projeto de estudo, sem vínculo oficial.",
      en: "Website proposal for the brand — a study project, no official ties.",
      es: "Propuesta de sitio para la marca — proyecto de estudio, sin vínculo oficial.",
    },
    description: {
      pt: "Proposta de site institucional para concessionária New Holland: vitrine de máquinas pesadas, hero de alto impacto e mídia tratada em Photoshop e Premiere.\n\nProjeto de estudo, criado para apresentar uma ideia à marca. Não é um trabalho oficial e não possui qualquer vínculo com a New Holland ou a Super Tratores.",
      en: "Institutional website proposal for a New Holland dealership: heavy-machinery showcase, high-impact hero and media treated in Photoshop and Premiere.\n\nA study project, created to present an idea to the brand. It is not official work and has no affiliation with New Holland or Super Tratores.",
      es: "Propuesta de sitio institucional para concesionaria New Holland: vitrina de maquinaria pesada, hero de alto impacto y medios tratados en Photoshop y Premiere.\n\nProyecto de estudio, creado para presentar una idea a la marca. No es un trabajo oficial y no tiene vínculo con New Holland ni Super Tratores.",
    },
    thumb: `${C}/super-tratores-site/super-tratores-site-cover.webp`,
    media: imgs("super-tratores-site", "super-tratores-site", 4),
    tools: ["devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain", "devicon-photoshop-plain", "devicon-premierepro-plain"],
    date: "2025",
    role: { pt: "Conceito, design & desenvolvimento", en: "Concept, design & development", es: "Concepto, diseño y desarrollo" },
  },
  {
    id: "laboratorio-criativo",
    category: "web",
    title: "Laboratório Criativo",
    eyebrow: { pt: "E-commerce · UX/UI & Código", en: "E-commerce · UX/UI & Code", es: "E-commerce · UX/UI y Código" },
    note: {
      pt: "E-commerce completo, do design da interface ao front-end em WordPress.",
      en: "Full e-commerce, from interface design to the WordPress front-end.",
      es: "E-commerce completo, del diseño de interfaz al front-end en WordPress.",
    },
    description: {
      pt: "Experiência de e-commerce desenhada e construída de ponta a ponta — do design de interface alinhado à marca até um front-end responsivo e focado em performance rodando em WordPress. Hierarquia de produto clara, navegação rápida e checkout sem atrito.",
      en: "E-commerce experience designed and built end to end — from brand-aligned interface design to a responsive, performance-focused front-end running on WordPress. Clear product hierarchy, fast navigation and a frictionless checkout.",
      es: "Experiencia de e-commerce diseñada y construida de punta a punta — del diseño de interfaz alineado a la marca hasta un front-end responsivo y enfocado en rendimiento sobre WordPress. Jerarquía de producto clara, navegación rápida y checkout sin fricción.",
    },
    thumb: `${C}/laboratorio-criativo/laboratorio-criativo-cover.webp`,
    media: imgs("laboratorio-criativo", "laboratorio-criativo", 3),
    tools: ["devicon-photoshop-plain", "devicon-html5-plain", "devicon-css3-plain", "devicon-javascript-plain", "devicon-wordpress-plain"],
    date: "2025",
    role: { pt: "Design & desenvolvimento", en: "Design & development", es: "Diseño y desarrollo" },
    link: "https://www.laboratoriocriativo.com",
  },

  /* ---------------- DESIGN ---------------- */
  {
    id: "colonial-design",
    category: "design",
    title: "Colonial — Redes Sociais",
    eyebrow: { pt: "Social Media Design", en: "Social Media Design", es: "Diseño para Redes Sociales" },
    note: {
      pt: "Sistema visual para o feed: campanhas, produtos e manipulação digital.",
      en: "Visual system for the feed: campaigns, products and digital manipulation.",
      es: "Sistema visual para el feed: campañas, productos y manipulación digital.",
    },
    description: {
      pt: "Produção visual contínua para redes sociais: peças de campanha, destaques de produto e manipulação digital assistida por IA. Um sistema visual construído para manter o feed coeso, com cada peça funcionando individualmente.",
      en: "Ongoing visual production for social media: campaign pieces, product highlights and AI-assisted digital manipulation. A visual system built to keep the feed cohesive while every piece stands on its own.",
      es: "Producción visual continua para redes sociales: piezas de campaña, destacados de producto y manipulación digital asistida por IA. Un sistema visual para mantener el feed cohesivo con cada pieza funcionando por sí sola.",
    },
    thumb: `${C}/colonial/design/colonial-design-cover.webp`,
    media: imgs("colonial/design", "colonial-design", 4),
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: { pt: "Direção de arte & design", en: "Art direction & design", es: "Dirección de arte y diseño" },
  },
  {
    id: "euvatar-social",
    category: "design",
    title: "Euvatar — Redes Sociais",
    eyebrow: { pt: "Social Media Design", en: "Social Media Design", es: "Diseño para Redes Sociales" },
    note: {
      pt: "Peças de campanha e comunicação de marca para o feed da Euvatar.",
      en: "Campaign pieces and brand communication for Euvatar's feed.",
      es: "Piezas de campaña y comunicación de marca para el feed de Euvatar.",
    },
    description: {
      pt: "Produção contínua de social media: lançamentos, comunicação de produto e peças alinhadas à identidade da marca — tipografia expressiva, verde-limão característico e tratamento de imagem forte.\n\nProjeto da Euvatar, agência onde atuo hoje. O crédito criativo é integralmente da Euvatar — meu papel foi a execução das peças.",
      en: "Ongoing social media production: launches, product communication and pieces aligned with the brand identity — expressive typography, the signature lime green and strong image treatment.\n\nA Euvatar project — the agency I currently work for. Full creative credit goes to Euvatar; my role was executing the pieces.",
      es: "Producción continua de social media: lanzamientos, comunicación de producto y piezas alineadas a la identidad de marca — tipografía expresiva, el verde lima característico y tratamiento de imagen potente.\n\nProyecto de Euvatar, la agencia donde trabajo actualmente. El crédito creativo es totalmente de Euvatar; mi rol fue la ejecución de las piezas.",
    },
    thumb: `${C}/euvatar-social/euvatar-social-cover.webp`,
    media: imgs("euvatar-social", "euvatar-social", 4),
    tools: ["devicon-canva-original", "devicon-photoshop-plain"],
    date: "2025",
    role: { pt: "Execução de design", en: "Design execution", es: "Ejecución de diseño" },
  },
  {
    id: "super-tratores-social",
    category: "design",
    title: "Super Tratores — Redes Sociais",
    eyebrow: { pt: "Social Media · Conteúdo de estudo", en: "Social Media · Study content", es: "Redes Sociales · Contenido de estudio" },
    note: {
      pt: "Estudo de feed para o agro: máquina em destaque e tipografia pesada.",
      en: "Feed study for agribusiness: machinery in focus and heavy typography.",
      es: "Estudio de feed para el agro: maquinaria destacada y tipografía pesada.",
    },
    description: {
      pt: "Conteúdo de estudo para o segmento de máquinas agrícolas: presença forte do produto, tipografia pesada e um sistema de feed pensado para trazer sofisticação a um mercado tradicionalmente funcional.\n\nEstudo pessoal, sem vínculo com a Super Tratores ou a New Holland.",
      en: "Study content for the agricultural machinery segment: strong product presence, heavy typography and a feed system designed to bring sophistication to a traditionally functional market.\n\nA personal study, with no affiliation to Super Tratores or New Holland.",
      es: "Contenido de estudio para el segmento de maquinaria agrícola: presencia fuerte del producto, tipografía pesada y un sistema de feed pensado para dar sofisticación a un mercado tradicionalmente funcional.\n\nEstudio personal, sin vínculo con Super Tratores ni New Holland.",
    },
    thumb: `${C}/super-tratores-social/super-tratores-social-cover.webp`,
    media: imgs("super-tratores-social", "super-tratores-social", 3),
    tools: ["devicon-canva-original", "devicon-photoshop-plain"],
    date: "2025",
    role: { pt: "Design", en: "Design", es: "Diseño" },
  },
  {
    id: "clothes",
    category: "design",
    title: "Clothes",
    eyebrow: { pt: "Moda · Estudo de design", en: "Fashion · Design study", es: "Moda · Estudio de diseño" },
    note: {
      pt: "Estudo editorial de moda: tipografia serifada sobre fotografia urbana.",
      en: "Fashion editorial study: serif typography over urban photography.",
      es: "Estudio editorial de moda: tipografía serif sobre fotografía urbana.",
    },
    description: {
      pt: "Estudo de direção de arte para moda: composição editorial, tipografia serifada em itálico sobre fotografia urbana e um sistema de peças que atravessa collection, lifestyle e performance.\n\nDesign de estudo, sem qualquer vínculo com as marcas eventualmente retratadas.",
      en: "Art direction study for fashion: editorial composition, italic serif typography over urban photography and a set of pieces spanning collection, lifestyle and performance.\n\nA study design, with no affiliation to any brand that may appear.",
      es: "Estudio de dirección de arte para moda: composición editorial, tipografía serif en cursiva sobre fotografía urbana y un conjunto de piezas entre collection, lifestyle y performance.\n\nDiseño de estudio, sin vínculo con las marcas que puedan aparecer.",
    },
    thumb: `${C}/clothes/clothes-cover.webp`,
    media: imgs("clothes", "clothes", 3),
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: { pt: "Conceito & design", en: "Concept & design", es: "Concepto y diseño" },
  },
  {
    id: "food-drinks",
    category: "design",
    title: "Food & Drinks",
    eyebrow: { pt: "Food · Estudo de design", en: "Food · Design study", es: "Food · Estudio de diseño" },
    note: {
      pt: "Cor, textura e apetite: estudo de direção de arte para food.",
      en: "Colour, texture and appetite: an art direction study for food.",
      es: "Color, textura y apetito: estudio de dirección de arte para food.",
    },
    description: {
      pt: "Exploração visual de direção de arte para comidas e bebidas — textura, gradação de cor e estudos de layout para traduzir sabor em imagem.\n\nDesign de estudo, sem vínculo com as marcas eventualmente retratadas.",
      en: "Visual exploration of food and beverage art direction — texture, colour grading and layout studies to translate flavour into imagery.\n\nA study design, with no affiliation to any brand that may appear.",
      es: "Exploración visual de dirección de arte para comidas y bebidas — textura, gradación de color y estudios de layout para traducir el sabor en imagen.\n\nDiseño de estudio, sin vínculo con las marcas que puedan aparecer.",
    },
    thumb: `${C}/food-drinks/food-drinks-cover.webp`,
    media: imgs("food-drinks", "food-drinks", 3),
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: { pt: "Conceito & design", en: "Concept & design", es: "Concepto y diseño" },
  },
  {
    id: "smart-fit",
    category: "design",
    title: "Smart Fit",
    eyebrow: { pt: "Fitness · Estudo não oficial", en: "Fitness · Unofficial study", es: "Fitness · Estudio no oficial" },
    note: {
      pt: "Estudo de comunicação fitness: alto contraste e frases de impacto.",
      en: "Fitness communication study: high contrast and punchy copy.",
      es: "Estudio de comunicación fitness: alto contraste y frases de impacto.",
    },
    description: {
      pt: "Estudo conceitual reimaginando a comunicação de uma marca fitness: composição de alta energia, contraste forte, frases de impacto e tratamento inspirado em motion aplicado a peças estáticas.\n\nEstudo de design com uso da marca apenas para fins de exercício criativo. Não possui qualquer vínculo com a Smart Fit.",
      en: "Concept study reimagining fitness brand communication: high-energy composition, strong contrast, punchy copy and motion-inspired treatment applied to static pieces.\n\nA design study using the brand purely as a creative exercise. It has no affiliation with Smart Fit.",
      es: "Estudio conceptual reimaginando la comunicación de una marca fitness: composición de alta energía, contraste fuerte, frases de impacto y tratamiento inspirado en motion aplicado a piezas estáticas.\n\nEstudio de diseño con uso de la marca solo como ejercicio creativo. No tiene vínculo con Smart Fit.",
    },
    thumb: `${C}/smart-fit/smart-fit-cover.webp`,
    media: imgs("smart-fit", "smart-fit", 3),
    tools: ["devicon-photoshop-plain", "devicon-canva-original"],
    date: "2025",
    role: { pt: "Conceito & design", en: "Concept & design", es: "Concepto y diseño" },
  },
  {
    id: "mister-burguer",
    category: "design",
    title: "Mister Burguer",
    eyebrow: { pt: "Marca fictícia · Design & Motion", en: "Fictional brand · Design & Motion", es: "Marca ficticia · Diseño y Motion" },
    note: {
      pt: "Marca criada para testes: fogo, tipografia pesada e personagem animado.",
      en: "Brand created for testing: fire, heavy type and an animated character.",
      es: "Marca creada para pruebas: fuego, tipografía pesada y personaje animado.",
    },
    description: {
      pt: "Marca fictícia criada por mim para testar ideias e execuções: composição orientada ao apetite, iluminação dramática, tipografia pesada e um personagem mascote que ganha vida em vídeo.\n\nMister Burguer não existe comercialmente — é um laboratório pessoal de criação, sem vínculo com qualquer marca real.",
      en: "A fictional brand I created to test ideas and execution: appetite-driven composition, dramatic lighting, heavy typography and a mascot character brought to life on video.\n\nMister Burguer does not exist commercially — it is a personal creative lab, with no affiliation to any real brand.",
      es: "Marca ficticia creada por mí para probar ideas y ejecuciones: composición orientada al apetito, iluminación dramática, tipografía pesada y un personaje mascota que cobra vida en video.\n\nMister Burguer no existe comercialmente — es un laboratorio personal de creación, sin vínculo con ninguna marca real.",
    },
    thumb: `${C}/mister-burguer/mister-burguer-cover.webp`,
    media: [
      ...imgs("mister-burguer", "mister-burguer", 3),
      im(`${C}/mister-burguer/mister-burguer-art.webp`),
      vd(`${C}/mister-burguer/mister-burguer-video-01.mp4`, `${C}/mister-burguer/mister-burguer-cover.webp`),
    ],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "FlowLabs"],
    date: "2025",
    role: { pt: "Conceito, design & motion", en: "Concept, design & motion", es: "Concepto, diseño y motion" },
  },

  /* ---------------- MOTION ---------------- */
  {
    id: "euvatar-motion",
    category: "motion",
    title: "Euvatar — Design & Motion",
    eyebrow: { pt: "Motion · Produção audiovisual", en: "Motion · Audiovisual production", es: "Motion · Producción audiovisual" },
    note: {
      pt: "Peças audiovisuais de marca — produção de motion para a Euvatar.",
      en: "Audiovisual brand pieces — motion production for Euvatar.",
      es: "Piezas audiovisuales de marca — producción de motion para Euvatar.",
    },
    description: {
      pt: "Produção audiovisual de marca: peças em motion com tratamento de imagem, edição rítmica e integração entre filmagem e visuais gerados por IA.\n\nProjeto da Euvatar, agência onde atuo hoje. O crédito criativo é integralmente da Euvatar — meu papel foi a execução.",
      en: "Audiovisual brand production: motion pieces with image treatment, rhythm-driven editing and integration between footage and AI-generated visuals.\n\nA Euvatar project — the agency I currently work for. Full creative credit goes to Euvatar; my role was execution.",
      es: "Producción audiovisual de marca: piezas en motion con tratamiento de imagen, edición rítmica e integración entre filmación y visuales generados con IA.\n\nProyecto de Euvatar, la agencia donde trabajo actualmente. El crédito creativo es totalmente de Euvatar; mi rol fue la ejecución.",
    },
    // capa opcional — se o arquivo não existir, o card mostra um placeholder elegante
    thumb: `${C}/euvatar-motion/euvatar-motion-cover.webp`,
    media: [
      vd(`${C}/euvatar-motion/euvatar-motion-01.mp4`, `${C}/euvatar-motion/euvatar-motion-cover.webp`),
      vd(`${C}/euvatar-motion/euvatar-motion-02.mp4`, `${C}/euvatar-motion/euvatar-motion-cover.webp`),
    ],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "OpenAI", "Kling AI"],
    date: "2025",
    role: { pt: "Edição & motion", en: "Edit & motion", es: "Edición y motion" },
  },
  {
    id: "sebrae",
    category: "motion",
    title: "Sebrae",
    eyebrow: { pt: "Motion · Personagem de marca", en: "Motion · Brand character", es: "Motion · Personaje de marca" },
    note: {
      pt: "Mascote quero-quero ganhando vida em peças audiovisuais.",
      en: "The quero-quero mascot brought to life in audiovisual pieces.",
      es: "La mascota quero-quero cobrando vida en piezas audiovisuales.",
    },
    description: {
      pt: "Personagem de marca em movimento: o quero-quero, símbolo do Rio Grande do Sul, transformado em mascote e animado para peças audiovisuais — do render ao corte final.\n\nProjeto da Euvatar, agência onde atuo hoje. O crédito criativo é integralmente da Euvatar — meu papel foi a execução. O cliente é da agência, não meu.",
      en: "Brand character in motion: the quero-quero, a symbol of Rio Grande do Sul, turned into a mascot and animated for audiovisual pieces — from render to final cut.\n\nA Euvatar project — the agency I currently work for. Full creative credit goes to Euvatar; my role was execution. The client belongs to the agency, not to me.",
      es: "Personaje de marca en movimiento: el quero-quero, símbolo de Rio Grande do Sul, convertido en mascota y animado para piezas audiovisuales — del render al corte final.\n\nProyecto de Euvatar, la agencia donde trabajo actualmente. El crédito creativo es totalmente de Euvatar; mi rol fue la ejecución. El cliente es de la agencia, no mío.",
    },
    thumb: `${C}/sebrae/sebrae-cover.webp`,
    media: [
      vd(`${C}/sebrae/sebrae-video-01.mp4`, `${C}/sebrae/sebrae-cover.webp`),
      vd(`${C}/sebrae/sebrae-video-02.mp4`, `${C}/sebrae/sebrae-cover.webp`),
      im(`${C}/sebrae/sebrae-01.webp`),
    ],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "OpenAI", "Kling AI"],
    date: "2025",
    role: { pt: "Edição & motion", en: "Edit & motion", es: "Edición y motion" },
  },
  {
    id: "capi-do-agro",
    category: "motion",
    title: "Capi do Agro",
    eyebrow: { pt: "Colab de criação com @Euvatar", en: "Creation collab with @Euvatar", es: "Colab de creación con @Euvatar" },
    note: {
      pt: "Capivara mascote do agro: turnaround, refino e animação do personagem.",
      en: "Agribusiness capybara mascot: turnaround, refinement and animation.",
      es: "Capibara mascota del agro: turnaround, refinamiento y animación.",
    },
    description: {
      pt: "Criação colaborativa de personagem: uma capivara mascote para o universo do agro, com colete de marca, turnaround completo (frente, lado, costas) e detalhamento de pelagem e assinatura visual. Edição e refinamento do personagem até a peça animada.\n\nColaboração com a Euvatar, agência onde atuo hoje. O crédito criativo é integralmente da Euvatar — meu papel foi a execução, edição e refinamento.",
      en: "Collaborative character creation: a capybara mascot for the agribusiness world, in a branded vest, with a full turnaround (front, side, back) and detailing of fur and visual signature. Editing and refinement of the character through to the animated piece.\n\nA collaboration with Euvatar — the agency I currently work for. Full creative credit goes to Euvatar; my role was execution, editing and refinement.",
      es: "Creación colaborativa de personaje: un capibara mascota para el universo del agro, con chaleco de marca, turnaround completo (frente, lado, espalda) y detalle de pelaje y firma visual. Edición y refinamiento del personaje hasta la pieza animada.\n\nColaboración con Euvatar, la agencia donde trabajo actualmente. El crédito creativo es totalmente de Euvatar; mi rol fue la ejecución, edición y refinamiento.",
    },
    thumb: `${C}/capi-do-agro/capi-do-agro-cover.webp`,
    media: [
      vd(`${C}/capi-do-agro/capi-do-agro-video-01.mp4`, `${C}/capi-do-agro/capi-do-agro-cover.webp`),
      ...imgs("capi-do-agro", "capi-do-agro", 6),
    ],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "OpenAI", "Kling AI"],
    date: "2025",
    role: { pt: "Edição & refinamento do personagem", en: "Editing & character refinement", es: "Edición y refinamiento del personaje" },
  },
  {
    id: "personal-luan",
    category: "motion",
    title: "Personal Luan",
    eyebrow: { pt: "Reels · Redes sociais", en: "Reels · Social media", es: "Reels · Redes sociales" },
    note: {
      pt: "Reels e peças de consultoria fitness com edição de ritmo acelerado.",
      en: "Fitness coaching reels and pieces with fast-paced editing.",
      es: "Reels y piezas de consultoría fitness con edición de ritmo acelerado.",
    },
    description: {
      pt: "Produção de reels e peças para redes sociais de um personal trainer: cortes dinâmicos, edição guiada por ritmo, iluminação em neon e tipografia de impacto para prender a atenção no feed.",
      en: "Reels and social media pieces for a personal trainer: dynamic cuts, rhythm-driven editing, neon lighting and impactful typography built to hold attention in the feed.",
      es: "Producción de reels y piezas para redes sociales de un personal trainer: cortes dinámicos, edición guiada por ritmo, iluminación neón y tipografía de impacto para captar la atención en el feed.",
    },
    thumb: `${C}/personal-luan/personal-luan-cover.webp`,
    media: [
      vd(`${C}/personal-luan/personal-luan-video-01.mp4`, `${C}/personal-luan/personal-luan-cover.webp`),
      vd(`${C}/personal-luan/personal-luan-video-02.mp4`, `${C}/personal-luan/personal-luan-cover.webp`),
      ...imgs("personal-luan", "personal-luan", 5),
    ],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut"],
    date: "2025",
    role: { pt: "Design, edição & motion", en: "Design, edit & motion", es: "Diseño, edición y motion" },
  },
  {
    id: "rughor",
    category: "motion",
    title: "Rughor",
    eyebrow: { pt: "Personagem ganhando vida · Estudo", en: "Character brought to life · Study", es: "Personaje cobrando vida · Estudio" },
    note: {
      pt: "Guerreiro anão na neve: do concept art à animação completa.",
      en: "Dwarf warrior in the snow: from concept art to full animation.",
      es: "Guerrero enano en la nieve: del concept art a la animación completa.",
    },
    description: {
      pt: "Estudo de criação de personagem original: um guerreiro anão em cenário de neve, do concept art à animação. Imagens desenvolvidas em Photoshop, animação e refino em FlowLabs, montagem final em Premiere e CapCut.\n\nProjeto pessoal de estudo, sem vínculo comercial.",
      en: "Original character creation study: a dwarf warrior in a snowy setting, from concept art to animation. Stills developed in Photoshop, animation and refinement in FlowLabs, final cut in Premiere and CapCut.\n\nA personal study project, with no commercial ties.",
      es: "Estudio de creación de personaje original: un guerrero enano en un escenario nevado, del concept art a la animación. Imágenes desarrolladas en Photoshop, animación y refinamiento en FlowLabs, montaje final en Premiere y CapCut.\n\nProyecto personal de estudio, sin vínculo comercial.",
    },
    thumb: `${C}/rughor/rughor-cover.webp`,
    media: [
      vd(`${C}/rughor/rughor-video-01.mp4`, `${C}/rughor/rughor-cover.webp`),
      ...imgs("rughor", "rughor", 2),
    ],
    tools: ["devicon-photoshop-plain", "devicon-premierepro-plain", "CapCut", "FlowLabs"],
    date: "2025",
    role: { pt: "Conceito, design & motion", en: "Concept, design & motion", es: "Concepto, diseño y motion" },
  },
];

/* =========================================================
   3. DOM
   ========================================================= */
const panels = Array.from(document.querySelectorAll(".panel"));
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const track = document.getElementById("workTrack");
const modal = document.getElementById("caseModal");
const video = document.getElementById("bgVideo");
const meter = document.getElementById("edgeMeter");
const meterFill = meter.querySelector("i");
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

const HERO_INDEX = 0;
const WORK_INDEX = panels.findIndex((p) => p.id === "work");
const CONTACT_INDEX = panels.findIndex((p) => p.id === "contact");

/* =========================================================
   4. RENDER + I18N APPLY
   ========================================================= */
const toolHTML = (tool) =>
  tool.startsWith("devicon-") || tool.startsWith("fa-")
    ? `<i class="${tool}" aria-hidden="true"></i>`
    : `<span class="tool-tag">${tool}</span>`;

function renderCards() {
  track.innerHTML = PROJECTS.map(
    (p) => `
    <button class="card" data-category="${p.category}" data-id="${p.id}" aria-haspopup="dialog" aria-label="${tx(p.eyebrow)} — ${p.title}">
      <span class="card-thumb" data-fallback="${p.title.charAt(0)}">
        <img src="${p.thumb}" alt="${p.title}" loading="lazy" decoding="async" width="370" height="278"
             onerror="this.parentNode.classList.add('no-img')" />
      </span>
      <span class="card-body">
        <span class="card-eyebrow">${tx(p.eyebrow)}</span>
        <span class="card-title">${p.title}</span>
        <span class="card-note">${tx(p.note)}</span>
        <span class="card-tools">${p.tools.map(toolHTML).join("")}</span>
        <span class="card-cta">${t("work.cta")} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
      </span>
    </button>`
  ).join("");
  applyFilter(currentFilter, true);
}

function applyI18n() {
  document.documentElement.lang = LANG_HTML[LANG];
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  renderCards();
  if (!modal.hidden && openProject) fillModal(openProject);
}

function setLang(lang) {
  if (!I18N[lang]) return;
  LANG = lang;
  document.querySelectorAll(".lang-opt").forEach((b) => {
    const active = b.dataset.lang === lang;
    b.classList.toggle("is-active", active);
    b.setAttribute("aria-selected", active ? "true" : "false");
  });
  applyI18n();
}

/* =========================================================
   5. LANGUAGE DRAWER
   ========================================================= */
const langWrap = document.getElementById("lang");
const langBtn = document.getElementById("langBtn");
const langDrawer = document.getElementById("langDrawer");

function openLang() {
  langDrawer.hidden = false;
  requestAnimationFrame(() => langWrap.classList.add("open"));
  langBtn.setAttribute("aria-expanded", "true");
}
function closeLang() {
  if (!langWrap.classList.contains("open")) return;
  langWrap.classList.remove("open");
  langBtn.setAttribute("aria-expanded", "false");
  setTimeout(() => { if (!langWrap.classList.contains("open")) langDrawer.hidden = true; }, 300);
}
langBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  langWrap.classList.contains("open") ? closeLang() : openLang();
});
langDrawer.addEventListener("click", (e) => {
  const opt = e.target.closest(".lang-opt");
  if (!opt) return;
  const lang = opt.dataset.lang;
  if (lang === LANG || replaying) { closeLang(); return; }
  closeLang();                                  /* gaveta desce suave... */
  setTimeout(() => replayIntro(lang), 340);     /* ...e o preloader assume */
});
document.addEventListener("pointerdown", (e) => {
  if (langWrap.classList.contains("open") && !langWrap.contains(e.target)) closeLang();
});
window.addEventListener("wheel", closeLang, { passive: true });
window.addEventListener("touchstart", closeLang, { passive: true });

/* =========================================================
   6. PANEL CONTROLLER
   ========================================================= */
let index = 0;
let animating = false;
let lastNavTime = 0;
const SWAP_MS = 980;

function syncChrome(i) {
  navLinks.forEach((a) => {
    const active = Number(a.dataset.goto) === i;
    a.classList.toggle("is-active", active);
    if (active) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  document.body.classList.toggle("theme-dark", i === CONTACT_INDEX);
  if (video) {
    if (i === HERO_INDEX) video.play().catch(() => {});
    else video.pause();
  }
}

function goTo(i) {
  i = Math.max(0, Math.min(panels.length - 1, i));
  if (i === index || animating) return;

  hideMeter();
  closeLang();
  const outgoing = panels[index];
  const incoming = panels[i];
  index = i;
  syncChrome(i);
  if (i === WORK_INDEX) resetTrack();

  if (REDUCED) {
    outgoing.classList.remove("is-active", "is-leaving");
    incoming.classList.add("is-active");
    lastNavTime = performance.now();
    return;
  }

  animating = true;
  outgoing.classList.remove("is-active");
  outgoing.classList.add("is-leaving");
  incoming.classList.add("is-active");

  setTimeout(() => {
    outgoing.classList.remove("is-leaving");
    animating = false;
    lastNavTime = performance.now();
  }, SWAP_MS);
}

/* =========================================================
   7. WORK TRACK — desktop lerp + mobile momentum & snap
   ========================================================= */
let trackTarget = 0;
let trackRAF = null;
let dragging = false;
let momentumRAF = null;
let snapRAF = null;

const trackMax = () => Math.max(0, track.scrollWidth - track.clientWidth);
const resetTrack = () => { trackTarget = track.scrollLeft; };
const clampTrack = (x) => Math.max(0, Math.min(trackMax(), x));

function stopTrackAnims() {
  cancelAnimationFrame(momentumRAF);
  cancelAnimationFrame(snapRAF);
  momentumRAF = null;
  snapRAF = null;
}

/* render loop: a posicao real persegue o alvo — nunca escrevemos scrollLeft "seco" */
function trackLoop() {
  const diff = trackTarget - track.scrollLeft;
  const ease = dragging ? 0.28 : 0.16;
  if (!dragging && Math.abs(diff) < 0.4) {
    track.scrollLeft = trackTarget;
    trackRAF = null;
    return;
  }
  track.scrollLeft += diff * ease;
  trackRAF = requestAnimationFrame(trackLoop);
}
function startTrackLoop() {
  if (!trackRAF) trackRAF = requestAnimationFrame(trackLoop);
}
function nudgeTrack(delta) {
  trackTarget = clampTrack(trackTarget + delta);
  startTrackLoop();
}

function visibleCards() {
  return Array.from(track.querySelectorAll(".card:not(.hide)"));
}
function trackPadLeft() {
  return parseFloat(getComputedStyle(track).paddingLeft) || 0;
}

/* alvo de snap: card mais proximo, com leve peso na direcao do movimento */
function snapPosition(bias) {
  const cards = visibleCards();
  if (!cards.length) return null;
  const padLeft = trackPadLeft();
  const ref = trackTarget + padLeft + (bias || 0);
  let best = cards[0].offsetLeft;
  let bestD = Infinity;
  cards.forEach((c) => {
    const d = Math.abs(c.offsetLeft - ref);
    if (d < bestD) { bestD = d; best = c.offsetLeft; }
  });
  return clampTrack(best - padLeft);
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/* snap por tween (nao por lerp) — chegada macia, sem "puxao" no fim */
function snapTrack(bias, duration) {
  stopTrackAnims();
  const to = snapPosition(bias);
  if (to === null) return;
  const from = track.scrollLeft;
  const dist = to - from;
  const dur = Math.max(240, Math.min(duration || 520, 200 + Math.abs(dist) * 0.6));
  if (Math.abs(dist) < 1) { trackTarget = to; return; }
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const v = from + dist * easeOutCubic(p);
    track.scrollLeft = v;
    trackTarget = v;
    if (p < 1) snapRAF = requestAnimationFrame(step);
    else { trackTarget = to; snapRAF = null; updateTrackButtons(); }
  };
  snapRAF = requestAnimationFrame(step);
}

/* inercia: desacelera com atrito e entrega no snap sem corte */
function runMomentum(velocity) {
  stopTrackAnims();
  let v = velocity;
  if (Math.abs(v) < 0.8) { snapTrack(0, 420); return; }
  let projected = trackTarget;
  const step = () => {
    v *= 0.945;
    projected = trackTarget + v;
    const clamped = clampTrack(projected);
    /* resistencia elastica ao passar das bordas */
    if (projected !== clamped) v *= 0.4;
    trackTarget = clamped;
    track.scrollLeft = trackTarget;
    if (Math.abs(v) > 1.1 && trackTarget > 0 && trackTarget < trackMax()) {
      momentumRAF = requestAnimationFrame(step);
    } else {
      momentumRAF = null;
      snapTrack(v * 6, 480);
    }
  };
  momentumRAF = requestAnimationFrame(step);
}

/* ---- setas + arrasto com o mouse (desktop) ---- */
const trackPrev = document.getElementById("trackPrev");
const trackNext = document.getElementById("trackNext");

function stepTrack(dir) {
  const cards = visibleCards();
  if (!cards.length) return;
  const padLeft = trackPadLeft();
  const ref = trackTarget + padLeft;
  let target = null;
  if (dir > 0) {
    for (const c of cards) if (c.offsetLeft > ref + 8) { target = c.offsetLeft; break; }
    if (target === null) target = cards[cards.length - 1].offsetLeft;
  } else {
    for (let i = cards.length - 1; i >= 0; i--) if (cards[i].offsetLeft < ref - 8) { target = cards[i].offsetLeft; break; }
    if (target === null) target = cards[0].offsetLeft;
  }
  tweenTrack(clampTrack(target - padLeft), 620);
}

function tweenTrack(to, duration) {
  stopTrackAnims();
  const from = track.scrollLeft;
  const dist = to - from;
  if (Math.abs(dist) < 1) { trackTarget = to; updateTrackButtons(); return; }
  const t0 = performance.now();
  const step = (now) => {
    const pr = Math.min(1, (now - t0) / duration);
    const v = from + dist * easeOutCubic(pr);
    track.scrollLeft = v;
    trackTarget = v;
    if (pr < 1) snapRAF = requestAnimationFrame(step);
    else { trackTarget = to; snapRAF = null; updateTrackButtons(); }
  };
  snapRAF = requestAnimationFrame(step);
}

function updateTrackButtons() {
  if (!trackPrev || !trackNext) return;
  const max = trackMax();
  trackPrev.disabled = track.scrollLeft <= 2;
  trackNext.disabled = track.scrollLeft >= max - 2;
}
track.addEventListener("scroll", updateTrackButtons, { passive: true });
if (trackPrev) trackPrev.addEventListener("click", () => stepTrack(-1));
if (trackNext) trackNext.addEventListener("click", () => stepTrack(1));

/* arrasto com a mão no desktop */
let pointerDragging = false;
let pointerMoved = 0;
let suppressCardClick = false;

track.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.button !== 0) return;
  stopTrackAnims();
  pointerDragging = true;
  pointerMoved = 0;
  velocity = 0;
  dragging = true;
  trackTarget = track.scrollLeft;
  track.classList.add("dragging");
  track.setPointerCapture(e.pointerId);
  startTrackLoop();
});

track.addEventListener("pointermove", (e) => {
  if (!pointerDragging) return;
  const delta = -e.movementX * 1.15;
  pointerMoved += Math.abs(e.movementX);
  trackTarget = clampTrack(trackTarget + delta);
  velocity = velocity * 0.7 + delta * 0.3;
  startTrackLoop();
});

function endPointerDrag(e) {
  if (!pointerDragging) return;
  pointerDragging = false;
  dragging = false;
  track.classList.remove("dragging");
  if (e && track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
  suppressCardClick = pointerMoved > 6;
  runMomentum(velocity * 1.6);
  setTimeout(() => { suppressCardClick = false; }, 60);
}
track.addEventListener("pointerup", endPointerDrag);
track.addEventListener("pointercancel", endPointerDrag);
track.addEventListener("pointerleave", endPointerDrag);

/* =========================================================
   8. EDGE METER
   ========================================================= */
let meterHideTimer = null;
function showMeter(progress) {
  meter.classList.add("show");
  meterFill.style.setProperty("--p", Math.min(1, progress).toFixed(3));
  clearTimeout(meterHideTimer);
  meterHideTimer = setTimeout(hideMeter, 500);
}
function hideMeter() {
  meter.classList.remove("show");
  meterFill.style.setProperty("--p", 0);
}

/* =========================================================
   9. GESTURE-INTENT NAVIGATION
   ========================================================= */
const GESTURE_GAP = 280;
const NAV_ACCUM = 170;

let lastWheelTime = 0;
let gestureDir = 0;
let gestureAccum = 0;
let gestureEligible = false;
let gestureConsumed = false;

function atBoundary(dir) {
  const panel = panels[index];
  if (index === WORK_INDEX) return dir > 0 ? trackTarget >= trackMax() - 2 : trackTarget <= 2;
  const scrollable = panel.scrollHeight - panel.clientHeight > 4;
  if (!scrollable) return true;
  return dir > 0
    ? panel.scrollTop >= panel.scrollHeight - panel.clientHeight - 1
    : panel.scrollTop <= 1;
}
const cooling = () => animating || performance.now() - lastNavTime < 450;

window.addEventListener(
  "wheel",
  (e) => {
    if (!modal.hidden) return;
    if (animating) { e.preventDefault(); return; }

    const now = performance.now();
    const dir = e.deltaY > 0 ? 1 : -1;
    const fresh = now - lastWheelTime > GESTURE_GAP || dir !== gestureDir;
    lastWheelTime = now;
    if (fresh) {
      gestureDir = dir;
      gestureAccum = 0;
      gestureConsumed = false;
      gestureEligible = atBoundary(dir) && !cooling();
    }
    gestureAccum += Math.abs(e.deltaY);

    if (index === HERO_INDEX) {
      e.preventDefault();
      if (dir > 0 && !cooling() && Math.abs(e.deltaY) >= 12) goTo(index + 1);
      return;
    }

    if (index === WORK_INDEX) {
      e.preventDefault();
      if (!atBoundary(dir)) {
        gestureEligible = false;
        nudgeTrack(e.deltaY * 1.7);
        return;
      }
      if (gestureConsumed || cooling()) return;
      if (!gestureEligible) { showMeter(0); return; }
      showMeter(gestureAccum / NAV_ACCUM);
      if (gestureAccum >= NAV_ACCUM) {
        gestureConsumed = true;
        goTo(index + dir);
      }
      return;
    }

    const panel = panels[index];
    const scrollable = panel.scrollHeight - panel.clientHeight > 4;
    if (scrollable && !atBoundary(dir)) { gestureEligible = false; return; }
    e.preventDefault();
    if (gestureConsumed || cooling() || !gestureEligible) return;
    if (gestureAccum >= 90) {
      gestureConsumed = true;
      goTo(index + dir);
    }
  },
  { passive: false }
);

/* ---- touch ---- */
const TOUCH_SPEED = 1.35;   /* arrasto quase 1:1 no dedo — a suavidade vem do lerp */
const TOUCH_BOOST = 1.9;    /* ganho aplicado a inercia, nao ao arrasto */
let startY = 0, startX = 0, lastY = 0, lastX = 0, lastT = 0, velocity = 0;
let touchEligibleDown = false, touchEligibleUp = false;

window.addEventListener("touchstart", (e) => {
  const tp = e.touches[0];
  startY = lastY = tp.clientY;
  startX = lastX = tp.clientX;
  lastT = performance.now();
  velocity = 0;
  touchEligibleDown = atBoundary(1);
  touchEligibleUp = atBoundary(-1);
  if (index === WORK_INDEX) {
    stopTrackAnims();
    dragging = true;
    trackTarget = track.scrollLeft;
    startTrackLoop();
  }
}, { passive: true });

window.addEventListener("touchmove", (e) => {
  if (!modal.hidden || index !== WORK_INDEX) return;
  e.preventDefault();
  const tp = e.touches[0];
  const now = performance.now();
  const dy = lastY - tp.clientY;
  const dx = lastX - tp.clientX;
  lastY = tp.clientY;
  lastX = tp.clientX;

  /* o gesto vertical vira horizontal; o horizontal continua valendo */
  let delta = (dy + dx) * TOUCH_SPEED;

  /* rubber band: alem da borda o conteudo resiste em vez de travar */
  const next = trackTarget + delta;
  if (next < 0 || next > trackMax()) delta *= 0.32;

  trackTarget = clampTrack(trackTarget + delta);

  const dt = Math.max(8, now - lastT);
  lastT = now;
  /* velocidade suavizada — evita picos de um frame solto */
  velocity = velocity * 0.7 + (delta / (dt / 16.67)) * 0.3;

  startTrackLoop();
}, { passive: false });

window.addEventListener("touchend", (e) => {
  if (!modal.hidden) { dragging = false; return; }

  const dy = startY - e.changedTouches[0].clientY;
  const dx = startX - e.changedTouches[0].clientX;
  const dir = dy > 0 ? 1 : -1;
  const panel = panels[index];

  if (index === WORK_INDEX) {
    dragging = false;
    const wantsSection =
      Math.abs(dy) >= 70 &&
      Math.abs(dy) > Math.abs(dx) &&
      ((dir > 0 && touchEligibleDown) || (dir < 0 && touchEligibleUp));

    if (wantsSection && !animating && !cooling()) {
      stopTrackAnims();
      goTo(index + dir);
      return;
    }
    runMomentum(velocity * TOUCH_BOOST);
    if (Math.abs(dy) >= 70 && atBoundary(dir)) showMeter(0);
    return;
  }

  if (animating || cooling()) return;
  if (index === HERO_INDEX) {
    if (dir > 0 && dy > 60) goTo(index + 1);
    return;
  }
  if (Math.abs(dy) < 70 || Math.abs(dx) > Math.abs(dy)) return;
  const scrollable = panel.scrollHeight - panel.clientHeight > 4;
  if (scrollable && ((dir > 0 && !touchEligibleDown) || (dir < 0 && !touchEligibleUp))) return;
  if ((dir > 0 && touchEligibleDown) || (dir < 0 && touchEligibleUp)) goTo(index + dir);
}, { passive: true });

window.addEventListener("touchcancel", () => {
  if (index === WORK_INDEX && dragging) {
    dragging = false;
    runMomentum(velocity * TOUCH_BOOST);
  }
}, { passive: true });

/* ---- keyboard & nav ---- */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && langWrap.classList.contains("open")) { closeLang(); return; }
  if (!modal.hidden) {
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") trapFocus(e);
    return;
  }
  if (["ArrowDown", "PageDown"].includes(e.key)) { e.preventDefault(); goTo(index + 1); }
  if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); goTo(index - 1); }
});

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-goto]");
  if (trigger) {
    e.preventDefault();
    goTo(Number(trigger.dataset.goto));
  }
});

/* =========================================================
   10. FILTERS — layout estável
   ========================================================= */
let currentFilter = "all";
let filtering = false;

function stagger(cards) {
  cards.filter((c) => !c.classList.contains("hide")).forEach((c, i) => c.style.setProperty("--i", i % 7));
}
function applyFilter(f, silent) {
  const cards = Array.from(track.querySelectorAll(".card"));
  cards.forEach((c) => c.classList.toggle("hide", f !== "all" && c.dataset.category !== f));
  stagger(cards);
  if (silent) {
    track.scrollLeft = 0;
    trackTarget = 0;
  }
  requestAnimationFrame(updateTrackButtons);
}

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (filtering || btn.classList.contains("is-active")) return;
    filtering = true;
    document.querySelectorAll(".filter").forEach((b) => {
      b.classList.toggle("is-active", b === btn);
      b.setAttribute("aria-selected", b === btn ? "true" : "false");
    });
    currentFilter = btn.dataset.filter;

    if (REDUCED) {
      applyFilter(currentFilter, true);
      filtering = false;
      return;
    }

    const cards = Array.from(track.querySelectorAll(".card"));
    stagger(cards);
    track.classList.add("leaving");
    setTimeout(() => {
      applyFilter(currentFilter, true);
      track.classList.remove("leaving");
      track.classList.add("pre");
      void track.offsetWidth;
      track.classList.add("entering");
      track.classList.remove("pre");
      setTimeout(() => {
        track.classList.remove("entering");
        filtering = false;
      }, 950);
    }, 380);
  });
});

/* =========================================================
   11. MODAL (galeria imagem + vídeo)
   ========================================================= */
const refs = {
  eyebrow: document.getElementById("modalEyebrow"),
  title: document.getElementById("modalTitle"),
  desc: document.getElementById("modalDesc"),
  gallery: document.querySelector(".gallery"),
  main: document.querySelector(".g-main"),
  thumbs: document.getElementById("galleryThumbs"),
  tools: document.getElementById("modalTools"),
  date: document.getElementById("modalDate"),
  role: document.getElementById("modalRole"),
  link: document.getElementById("modalLink"),
};
let lastFocused = null;
let swapTimer = null;
let openProject = null;

const caseLink = (p) => (CASE_LINKS[p.id] || p.link || "").trim();
const hasLiveLink = (p) => LIVE_LINK_CATEGORIES.includes(p.category) && caseLink(p) !== "";

function mediaHTML(item, title) {
  if (item.t === "vid") {
    const poster = item.poster ? ` poster="${item.poster}"` : "";
    return `<video class="g-media" src="${item.src}" controls playsinline preload="none"${poster}></video>`;
  }
  return `<img class="g-media" src="${item.src}" alt="${title}" decoding="async" />`;
}

function setMainMedia(item) {
  clearTimeout(swapTimer);
  const old = refs.main.querySelector("video");
  if (old) old.pause();
  refs.main.classList.add("swapping");
  swapTimer = setTimeout(() => {
    refs.main.innerHTML = mediaHTML(item, openProject ? openProject.title : "");
    requestAnimationFrame(() => refs.main.classList.remove("swapping"));
  }, 220);
}

function fillModal(p) {
  refs.eyebrow.textContent = `${tx(CAT_LABELS[p.category])} — ${tx(p.eyebrow)}`;
  refs.title.textContent = p.title;
  refs.desc.textContent = tx(p.description);
  refs.tools.innerHTML = p.tools.map(toolHTML).join("");
  refs.date.textContent = p.date;
  refs.role.textContent = tx(p.role);

  if (hasLiveLink(p)) {
    refs.link.href = caseLink(p);
    refs.link.hidden = false;
  } else {
    refs.link.removeAttribute("href");
    refs.link.hidden = true;
  }
}

function openModal(p) {
  openProject = p;
  fillModal(p);

  refs.main.classList.remove("swapping");
  refs.main.innerHTML = mediaHTML(p.media[0], p.title);
  refs.gallery.classList.toggle("single", p.media.length < 2);
  refs.thumbs.innerHTML = p.media
    .map((m, i) => {
      const inner =
        m.t === "vid"
          ? `${m.poster ? `<img src="${m.poster}" alt="" loading="lazy" decoding="async" />` : ""}<span class="play-badge"><i class="fa-solid fa-play" aria-hidden="true"></i></span>`
          : `<img src="${m.src}" alt="" loading="lazy" decoding="async" />`;
      return `<button class="g-thumb${i === 0 ? " is-active" : ""}" data-i="${i}" role="option" aria-selected="${i === 0}" aria-label="${i + 1}/${p.media.length}">${inner}</button>`;
    })
    .join("");

  lastFocused = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("open")));
  modal.querySelector(".modal-close").focus();
}

function closeModal() {
  const playing = refs.main.querySelector("video");
  if (playing) playing.pause();
  modal.classList.remove("open");
  const panel = modal.querySelector(".modal-panel");
  const done = () => {
    modal.hidden = true;
    refs.main.innerHTML = "";
    refs.thumbs.innerHTML = "";
    openProject = null;
    if (lastFocused) lastFocused.focus();
  };
  if (REDUCED) done();
  else panel.addEventListener("transitionend", done, { once: true });
}

function trapFocus(e) {
  const focusables = Array.from(modal.querySelectorAll("button, a[href], video")).filter((el) => !el.hidden);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

refs.thumbs.addEventListener("click", (e) => {
  const thumb = e.target.closest(".g-thumb");
  if (!thumb || !openProject) return;
  refs.thumbs.querySelectorAll(".g-thumb").forEach((el) => {
    const active = el === thumb;
    el.classList.toggle("is-active", active);
    el.setAttribute("aria-selected", active ? "true" : "false");
  });
  setMainMedia(openProject.media[Number(thumb.dataset.i)]);
});

track.addEventListener("click", (e) => {
  if (suppressCardClick) { e.preventDefault(); return; }
  const card = e.target.closest(".card");
  if (!card) return;
  const project = PROJECTS.find((p) => p.id === card.dataset.id);
  if (project) openModal(project);
});

modal.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeModal();
});

/* =========================================================
   12. CTA FLIP (toque/teclado — hover é CSS)
   ========================================================= */
const ctaFlip = document.getElementById("ctaFlip");
if (ctaFlip && isTouch) {
  ctaFlip.addEventListener("touchstart", () => ctaFlip.classList.add("flip"), { passive: true });
  ctaFlip.addEventListener("touchend", () => setTimeout(() => ctaFlip.classList.remove("flip"), 700), { passive: true });
}

/* =========================================================
   13. INTRO
   ========================================================= */
const curtain = document.getElementById("curtain");
const introLogo = document.getElementById("introLogo");
const brandImg = document.getElementById("brandImg");

function finishIntro() {
  curtain.classList.add("gone");
  introLogo.classList.add("gone");
  document.body.classList.remove("intro");
  document.body.classList.add("ready");
}

let replaying = false;

function runIntro(short) {
  if (REDUCED) {
    panels[0].classList.add("is-active");
    syncChrome(0);
    finishIntro();
    replaying = false;
    return;
  }

  const T = short
    ? { hold: 320, curtain: 320, panel: 900, logo: 1100 }
    : { hold: 1800, curtain: 1800, panel: 2350, logo: 2550 };

  if (!short) introLogo.classList.add("pulsing");

  setTimeout(() => {
    introLogo.classList.remove("pulsing");
    curtain.classList.add("up");
  }, T.curtain);

  setTimeout(() => {
    panels[0].classList.add("is-active");
    syncChrome(0);
  }, T.panel);

  setTimeout(() => {
    const from = introLogo.getBoundingClientRect();
    const to = brandImg.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const scale = to.width / from.width;
    introLogo.classList.add("fly");
    introLogo.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    introLogo.addEventListener("transitionend", () => { finishIntro(); replaying = false; }, { once: true });
    setTimeout(() => { finishIntro(); replaying = false; }, 1300);
  }, T.logo);
}

/* troca de idioma: cortina desce, idioma troca atrás dela, cortina sobe de novo */
function replayIntro(lang) {
  if (replaying) return;
  if (REDUCED) { setLang(lang); return; }
  replaying = true;

  stopTrackAnims();
  if (!modal.hidden) closeModal();

  curtain.classList.remove("gone", "up");
  introLogo.classList.remove("gone", "fly");
  introLogo.style.transform = "";
  document.body.classList.remove("ready");
  document.body.classList.add("intro");
  void curtain.offsetWidth;
  curtain.classList.add("down");

  setTimeout(() => {
    setLang(lang);                       /* tudo trocado atrás da cortina */
    panels.forEach((pl) => pl.classList.remove("is-active", "is-leaving"));
    index = 0;
    animating = false;
    syncChrome(0);
    curtain.classList.remove("down");
    void curtain.offsetWidth;
    runIntro(true);
  }, 780);
}

/* =========================================================
   14. BOOT
   ========================================================= */
setLang(DEFAULT_LANG);   /* sempre volta ao padrão a cada F5 */

window.addEventListener("load", () => {
  if (video) video.play().catch(() => {});
  runIntro();
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    trackTarget = Math.min(trackTarget, trackMax());
    track.scrollLeft = trackTarget;
  }, 150);
});