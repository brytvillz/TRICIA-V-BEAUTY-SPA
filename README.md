# TRICIA-V Unisex Salon and Spa

Static Astro site, deployed on Vercel at https://tricia-v.vercel.app.

```
npm install
npm run dev         # local dev server
npm run build       # builds to dist/
npm run check:csp   # after a build: checks every inline script is allowed by vercel.json
```

## Where things live

- `src/pages/index.astro` is the home page. `src/pages/[slug].astro` renders one page per file in
  `src/content/services/` (`/dental-care`, `/facials`, `/hair-and-barbing`, `/nails-and-spa`,
  `/tattoos-brows-and-lashes`, `/home-service`). `src/pages/404.astro` is the not-found page.
- Service page copy is plain Markdown with frontmatter in `src/content/services/*.md`. Edit the file and
  rebuild. `draft` and `draftNote` are internal editorial notes: they are never shown on the site.
- `src/data/home.ts` holds the home page service cards, gallery, packages and ticker.
- `src/styles/global.css` has all styling. Colours are CSS variables for light (`:root`) and
  dark (`[data-theme="dark"]`).
- Photos, video, icons and the manifest are in `public/`.
- WhatsApp links are built by `wa()` in `src/lib/site.ts`, so every link carries the same pre-filled message.

## Security policy (vercel.json)

The Content-Security-Policy allows scripts only from the site itself plus one hashed inline script (the theme
setter in `src/scripts/theme-init.js`, which prevents a flash of the wrong theme). If you edit that file, run
`npm run build && npm run check:csp`: it prints the new hash to put in `vercel.json`.

## Go-live checklist (when the real domain is attached)

1. Connect the domain in Vercel and add a 301 redirect from tricia-v.vercel.app to it.
2. Change `site` in `astro.config.mjs`, `SITE` in `src/lib/site.ts`, and the Sitemap line in
   `public/robots.txt` to the new domain (these produce the canonical, og:url, og:image,
   Schema.org and sitemap URLs).
3. Submit the new domain in Google Search Console.
