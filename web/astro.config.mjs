import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://elbenxo.github.io',
  base: '/casas-vigo',
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'gl', 'fr', 'de', 'ko', 'pt', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
