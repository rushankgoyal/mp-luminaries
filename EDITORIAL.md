# MP Luminaries — Daily Editorial Brief

This is the operating manual for the automated daily edition. The daily agent must follow it exactly.

## The job

Publish **exactly two new profile articles per run**, celebrating people doing genuinely good, *recently reported* work. Focus: Madhya Pradesh (politicians, MLAs, ministers, IAS/IPS officers and other public servants, athletes, actors and artists, entrepreneurs, scientists). Occasionally (at most ~2 stories per week) a national-level figure.

## Picking the two subjects

1. List existing coverage first: `ls src/articles/` — never feature the same person twice within 60 days, and avoid three same-category days in a row. Rotate across: governance, administration, sports, cinema-arts, business, national.
2. Use web search to find candidates with a **concrete, positive accomplishment reported in roughly the last 7 days** — an inauguration, award, medal, milestone, rescue, reform, release, funding round. "Is generally admired" is not a story; "did this specific thing this week" is.
3. At least one of the two subjects each day must be MP-focused. Prefer a mix of prominence: one well-known figure, one under-covered one (a district collector, a constable, a para-athlete) when the reporting supports it.
4. **Skip any candidate whose current story carries controversy, an ongoing dispute, or contested claims** — this site only runs stories that are positive *and* uncontested. (Example of a correct skip: the 2026 Khandwa National Water Award, which was entangled in AI-image allegations.)

## Sourcing rules (non-negotiable)

- Every factual claim must come from published reporting found via web search. Two independent sources minimum for the story's central claim.
- Acceptable sources: established news outlets, official government releases (PIB, mpinfo.org), sports federations, stock exchanges. Not acceptable: anonymous social posts, fan pages, the subject's own ads.
- List 2–4 sources in the article front matter; they render as a "Reporting this story draws on" box.
- Never invent quotes, numbers, dates or events. If a detail can't be verified, leave it out. A shorter true article beats a longer embellished one.

## Voice and structure

- 400–600 words. Warm, concrete, specific — admiration earned through detail, not adjectives. No "visionary leader" boilerplate; show the corridor, the medal, the policy count.
- Structure: a sharp lede tied to the news hook → context and what the person actually did → one `## subhead` section with the numbers or backstory → a short closing graf on why it matters to MP/India.
- Bold key facts sparingly (`**₹2,360-crore**`). One blockquote allowed if a real, sourced quote exists.
- Title pattern: evocative, person-anchored, ~8–14 words. Summary (dek): one sentence, 25–45 words.

## Article file format

Create `src/articles/YYYY-MM-DD-<person-slug>.md` (use today's date in IST):

```yaml
---
title: "..."
person: "Full Name"
role: "Their role/title"
category: governance | administration | sports | cinema-arts | business | national
date: YYYY-MM-DD
image: /assets/images/YYYY-MM-DD-<person-slug>.png
imageRef: "https://upload.wikimedia.org/...jpg"   # freely licensed reference photo (omit if none exists)
imageAlt: "Editorial illustration of <person>"
summary: "One-sentence dek."
sources:
  - title: "Headline (Outlet)"
    url: "https://..."
---
```

Body in Markdown below the front matter. The layout adds the AI-illustration disclosure caption, sources box and share buttons automatically.

## Portrait illustrations

Every article gets a 16:10 landscape editorial illustration at the `image:` path. House style: **painterly editorial-magazine illustration — visible oil-paint brushwork, warm earthy palette with saffron/terracotta accents, soft flat muted background, dignified, clearly hand-painted in feel, never photorealistic.**

**The daily agent does not generate images itself.** It only sets `image:` and `imageRef:` in the front matter; GitHub Actions generates any missing image on push (`scripts/generate-missing-images.mjs`, using the repo's `OPENROUTER_API_KEY` secret) and commits it before the site builds.

1. Find a freely licensed reference photo of the person on Wikimedia Commons (licenses OK: CC0, CC BY, CC BY-SA, GODL-India):
   ```bash
   curl -s "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=PERSON%20NAME&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1200&format=json"
   ```
   Check the license field in the output. Put the chosen image URL in `imageRef:`.
2. If no acceptably licensed photo exists, **omit `imageRef:`** — the generator then produces a contextual scene (role, setting, no specific likeness) instead. Optionally set `imagePrompt:` to describe that scene (e.g. "a district collector reviewing flood-relief logistics at dusk, painterly editorial illustration, face not prominent"). Never claim likeness without a reference, and never link a copyrighted photo.

## Publishing

1. Verify the build passes: `npm install && npx eleventy`.
2. Commit the two new article files to `main` with message `Daily edition: <Person A> & <Person B> (YYYY-MM-DD)` and push. GitHub Actions generates the portraits, rebuilds and deploys automatically.
3. If anything fails irrecoverably (no sources found, no second subject that meets the bar), publish what is solid; never publish an unsourced article to hit the quota.
