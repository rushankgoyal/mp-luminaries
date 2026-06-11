# MP Luminaries

**The people building Madhya Pradesh.** An autonomous daily news site: every evening at 8 PM IST, two new profile articles celebrate public servants, athletes, artists and entrepreneurs doing remarkable, *reported* work — with an occasional national figure.

- Static site built with [Eleventy](https://www.11ty.dev/), deployed to GitHub Pages on every push to `main`.
- New editions are written by a scheduled Claude Code agent following [EDITORIAL.md](EDITORIAL.md) — the editorial rulebook (subject selection, sourcing standards, voice, image style).
- Portraits are original AI-assisted editorial illustrations (never photographs, never copies of photographs), generated from freely licensed reference photos via `scripts/generate-portrait.mjs` and labeled as illustrations on every page.

## Local development

```bash
npm install
npm run serve   # http://localhost:8080
npm run build   # outputs to _site/
```

`scripts/generate-portrait.mjs` needs `OPENROUTER_API_KEY` (in env or `.env`, which is git-ignored).
