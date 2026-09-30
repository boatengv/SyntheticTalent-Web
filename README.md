# Synthetic Talent

Launch site for Synthetic Talent, an agency that creates and manages AI influencers on TikTok, YouTube and Instagram.

- Live: https://synthetic-talent-98oer8.v2.appdeploy.ai/
- AppDeploy app id: `synthetic-talent-98oer8` (snapshot version 1790429414829)
- Stack: static HTML + TypeScript, Vite 6, Tailwind 3 (via PostCSS). No backend.

## Run locally

```bash
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## Files

- `index.html` – all page content (hero, services, roadmap, team, privacy, terms)
- `src/styles.css` – design tokens and styles (light and dark themes)
- `src/main.ts` – sets the footer year
- `tests/tests.json` – AppDeploy end-to-end QA checks
