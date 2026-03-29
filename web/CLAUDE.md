# CLAUDE.md

## Project Overview

Static multilingual marketing website for room rentals in Vigo, Galicia. Deployed on GitHub Pages.

## Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Styling via @astrojs/tailwind integration
- **TypeScript** - Strict mode
- **Formspree** - Contact form backend (replace YOUR_FORM_ID in contact pages)

## Commands

- `npm run dev` - Start dev server
- `npm run build` - Build static site to `dist/`
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/     # Nav, Footer, FlatCard (Astro components)
├── data/           # flats.ts, vigo.ts - typed placeholder data
├── i18n/           # translations.ts - ES (default), EN, GL
├── layouts/        # Layout.astro - base HTML shell
├── pages/          # File-based routing
│   ├── *.astro     # Spanish (default locale, no prefix)
│   ├── en/         # English locale pages
│   └── gl/         # Galician locale pages
└── styles/         # global.css (Tailwind + fonts)
```

## i18n

- Default locale: `es` (no URL prefix)
- Additional: `en`, `gl` (URL prefix `/en/`, `/gl/`)
- Translations in `src/i18n/translations.ts`
- Helper functions: `t(lang, key)`, `getLangFromUrl()`, `getLocalePath()`
- Each locale has its own page files under `src/pages/{en,gl}/`

## Key Files

- `astro.config.mjs` - Site config, base path `/web_casas`
- `tailwind.config.mjs` - Design tokens (primary, accent, sand colors)
- `src/data/flats.ts` - Flat/room data with multilingual fields
- `src/data/vigo.ts` - Vigo info sections with multilingual fields
- `.github/workflows/deploy.yml` - GitHub Pages deployment

## Deployment

- GitHub Pages via GitHub Actions
- Base path: `/web_casas` (update `astro.config.mjs` site/base for your repo)
- Push to `main` triggers automatic deploy

## TODO

- Replace `YOUR_FORM_ID` in contact pages with actual Formspree form ID
- Replace placeholder phone/email with real contact info
- Add real property photos to `public/images/`
- Update `site` in `astro.config.mjs` with actual GitHub username
