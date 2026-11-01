import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tricia-v.vercel.app',
  output: 'static',
  // /dental-care (no trailing slash), served as dental-care.html with Vercel cleanUrls
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [sitemap()],
  vite: {
    // never inline bundled scripts into the HTML: the CSP only allows the one hashed theme script
    build: { assetsInlineLimit: 0 },
  },
});
