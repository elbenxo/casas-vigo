import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Site URL + base path. Override via env when we move to a custom domain:
//   SITE_URL=https://casasvigo.com BASE_PATH=/ npm run build
const site = process.env.SITE_URL || 'https://elbenxo.github.io';
const base = process.env.BASE_PATH || '/casas-vigo';

export default defineConfig({
  site,
  base,
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'gl', 'fr', 'de', 'ko', 'pt', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
