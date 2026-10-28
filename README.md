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
public/cases/     sites compilados dos estudos, abertos pelo botão de ver ao vivo
```

## Editar conteúdo

- Textos PT/EN: `src/lib/i18n.ts`
- Projetos, stack, redes e e-mail: `src/lib/projects.ts`
- Ordem dos cases: é a ordem do array `projects`. Case novo entra sempre no topo (vira o 01) e os demais descem uma posição. Ordem atual: Beatframe, Open, No Esquema, Bellamonte, Euvatar 360 (mobile), Euvatar landing, Euvatar institucional, Superba, Celeiro, Laboratório Criativo
- Telas de um projeto: `public/media/work/<id>/NN-800.webp` e `NN-1600.webp`
- Sites dos estudos Celeiro, Superba e Bellamonte e o protótipo do Beatframe (build estático com rotas por hash): `public/cases/<id>/`
