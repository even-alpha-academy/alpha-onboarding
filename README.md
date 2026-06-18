# alpha-onboarding

The Alpha team onboarding program ("חפיפה"), as an interactive Hebrew/RTL website built with
[Astro Starlight](https://starlight.astro.build/).

**Live site:** https://even-alpha-academy.github.io/alpha-onboarding/

## What's here

```
site/                      Astro Starlight app — the program itself (the single source of truth)
  src/content/docs/        the intern-facing docs (Hebrew, RTL)
  src/components/          interactive islands (Checklist, Quiz, ModeLadder)
  src/pages/mentor/        mentor docs + tooling runbook (StatiCrypt-encrypted at deploy)
  src/layouts/             MentorLayout.astro — standalone layout for the gated pages
  src/mentor-ops/          mentor scripts (e.g. provision-intern.sh); not emitted to the site
  astro.config.mjs         he locale, dir:'rtl', sidebar in schedule order, sitemap (mentor filtered)
.github/workflows/         build → encrypt /mentor → deploy to GitHub Pages
```

## Develop

```bash
cd site
npm install
npm run dev        # fast live editing — NOTE: search (Pagefind) does NOT work in dev
```

To test **search** and the production behaviour:

```bash
npm run build && npm run preview
```

## Deploy

Pushing to `main` builds the site and publishes it to GitHub Pages (see
`.github/workflows/deploy.yml`). The repo is private; the published Pages site is public
(content is unclassified-generic).

## Editing content

Docs live in `site/src/content/docs/**` as `.md`/`.mdx` with Hebrew `title:` frontmatter and
ASCII route slugs. Internal links use the full base path (`/alpha-onboarding/...`). Add a page to
the sidebar in `site/astro.config.mjs`.

## Mentor area (password-gated)

The mentor docs/tooling live in `site/src/pages/mentor/` (standalone pages, outside the Starlight
sidebar/search). At deploy time the workflow encrypts their built HTML with [StatiCrypt](https://github.com/robinmoisson/staticrypt)
using the **`MENTOR_DOCS_PASSWORD`** repo Actions secret — only ciphertext is published, and mentors
enter the shared passphrase to read them. Set that secret in repo settings before the first gated
deploy (until it's set, the workflow drops `/mentor` rather than publishing plaintext). The runnable
scripts stay in `src/mentor-ops/` and are rendered into the gated runbook via `?raw` (single source).
