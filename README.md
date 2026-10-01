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

- `index.html` – all page content (scroll-film introduction, roster, results, services, roadmap, team, privacy, terms)
- `src/styles.css` – design tokens and styles (light and dark themes)
- `src/main.ts` – the scroll-scrubbed studio film (ported from Higgsfield's scroll-scrub engine), Lenis smooth scroll, chapter rail, services accordion, Wren's clip play/pause, transform-only reveals and the current-section nav highlight; all motion is off for reduced motion
- `public/media/` – Higgsfield-generated media: creator images and video, the studio film (`film/`, desktop + mobile encodes and posters), service icons, section plate and share card
- `design-brief.md` + `refs/` – the Higgsfield design pipeline artifacts: brief, storyboard, per-section design boards and source renders (not served)
- `tests/tests.json` – AppDeploy end-to-end QA checks

## Results figures

The Results section is a static snapshot of AI Cleared's own accounts from Zernio (posts published 16–30 September 2026, last synced 30 September 2026). Update the numbers and the dates together when refreshing it.
