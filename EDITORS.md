# Editor portal — how to manage this site without touching code

Content on MP Luminaries is managed through [Pages CMS](https://pagescms.org),
a free, open-source editorial interface that works directly on this GitHub
repository. There is no separate server, database or password system to
maintain: every change an editor saves becomes a Git commit, and GitHub
Actions rebuilds and deploys the site automatically within a few minutes.

## One-time activation (repository owner)

1. Go to **https://app.pagescms.org** and sign in with the GitHub account
   that owns this repository.
2. Authorize the Pages CMS GitHub App and, when asked which repositories it
   may access, select **only this repository** (`mp-luminaries`).
3. Open the repository in Pages CMS. The portal reads its layout from
   [`.pages.yml`](.pages.yml) and shows two areas: **Stories** and
   **Site settings**.

## Inviting editors and admins

In Pages CMS, open **Settings → Collaborators** for this repository and
invite people **by email address**. They receive a sign-in link and do not
need a GitHub account. Anyone invited this way can edit, add and unpublish
stories through the portal — and nothing else: they cannot touch the
workflows, scripts or repository settings.

To make someone a full **admin** (able to invite or remove other people,
or work on the repository itself), add them as a collaborator on the GitHub
repository instead: **GitHub → repo → Settings → Collaborators**. GitHub
collaborators can sign in to Pages CMS with their own GitHub account.

To revoke access, remove the person from the same screen where they were
added. Removal takes effect immediately.

## What editors can do

| Task | How |
|---|---|
| Edit a story | **Stories** → open it → change any field or the body → **Save** |
| Replace artwork or caption | Edit the story's **Artwork**, **Image alt text** and **Image caption** fields |
| Unpublish a story | Open the story → switch **Published** off → Save. The page, its listings and feed entry disappear on the next build |
| Add a new story | **Stories → Add entry**. Leave **Artwork** empty and fill in **Image prompt** — the site's image bot paints an illustration automatically on the next build |
| Manage site name/tagline/sections | **Site settings** (avoid changing slugs of existing sections) |

Saving publishes: each save triggers a deploy, so the live site updates in
roughly 2–5 minutes. There is no separate "publish" button.

## House style

Headlines must be plain English a mass audience can read on first pass — no
idioms, puns or wordplay. Artwork is always painterly, clearly non-photo
illustration with **no text inside the image**, and is labelled as
AI-assisted in the caption. Every claim in a story must be backed by an
entry in **Sources**. See [EDITORIAL.md](EDITORIAL.md) for the full policy.

## Security model

- **No custom auth.** Sign-in is handled by GitHub (for admins) and by
  Pages CMS email links (for invited editors). This repository stores no
  passwords, tokens or secrets for the portal — `.pages.yml` is layout
  configuration only.
- **Least privilege.** The Pages CMS GitHub App is scoped to this single
  repository. Email-invited editors can only act through the CMS, and the
  CMS only exposes the content declared in `.pages.yml` — story files,
  images and `site.json`. Workflows, scripts and templates are not
  reachable from the portal.
- **Full audit trail.** Every change is a Git commit attributed to the
  person who made it. Anything can be reviewed or reverted from the
  repository's commit history.
- **Revocable.** Removing a collaborator (in Pages CMS or GitHub) cuts off
  access immediately. Uninstalling the Pages CMS GitHub App from the
  repository disables the entire portal at once.
