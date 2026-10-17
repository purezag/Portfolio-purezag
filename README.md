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
```

## Editar conteúdo

- Textos PT/EN: `src/lib/i18n.ts`
- Projetos, stack, redes e e-mail: `src/lib/projects.ts`
- Telas de um projeto: `public/media/work/<id>/NN-800.webp` e `NN-1600.webp`
