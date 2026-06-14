# alpha-onboarding

The Alpha team onboarding program ("חפיפה"), as an interactive Hebrew/RTL website built with
[Astro Starlight](https://starlight.astro.build/).

**Live site:** https://even-alpha-academy.github.io/alpha-onboarding/

## What's here

```
site/                      Astro Starlight app — the program itself
  src/content/docs/        the 26 docs (Hebrew, RTL), the single source of truth
  src/components/          interactive islands (Checklist, Quiz, ModeLadder)
  astro.config.mjs         he locale, dir:'rtl', sidebar in schedule order
.github/workflows/         build + deploy to GitHub Pages
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
