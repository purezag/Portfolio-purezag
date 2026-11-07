# purezag — portfolio v2

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000

## Build de produção

```bash
npm run build
npm run start
```

## Estrutura

```
src/
  app/            layout, página, estilos globais e favicon
  components/     navbar, preloader, dock de tema/idioma, deck de scroll, retratos em canvas
  sections/       hero, projetos, modal de case, sobre, contato
  hooks/          media queries, ajuste de texto, horário local
  lib/            textos pt/en, dados dos projetos, logo vetorizada, transição circular
  providers/      tema, idioma, Lenis e estado global
public/media/     retrato recortado e telas dos projetos otimizadas
public/cases/     sites compilados dos estudos hospedados aqui, abertos pelo botão de ver ao vivo
```

## Editar conteúdo

- Textos PT/EN: `src/lib/i18n.ts`
- Projetos, stack, redes e e-mail: `src/lib/projects.ts`
- Ordem dos cases: é a ordem do array `projects`. Case novo entra sempre no topo (vira o 01) e os demais descem uma posição. Ordem atual: Oriel One, Santander Agora, GOL App, OHMEN, Beatframe, Open, No Esquema, Bellamonte, Euvatar 360 (mobile), Euvatar landing, Euvatar institucional, Superba, Celeiro
- Motion de divulgação: `public/media/previews/<id>.mp4` com pôster `<id>.webp` (1280×800). Enquanto o vídeo não existe, `motion: "pending"` no projeto mostra só o pôster
- Telas de um projeto: `public/media/work/<id>/NN-800.webp` e `NN-1600.webp`
- Sites dos estudos OHMEN e Bellamonte e o protótipo do Beatframe (estáticos, com caminhos relativos): `public/cases/<id>/`
- Oriel One, Santander Agora e GOL App rodam em projetos próprios no Vercel (`url` no projeto). Celeiro, Superba e os sites da Euvatar ficam sem `url`: o case mostra o aviso de projeto sem link público
