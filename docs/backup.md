# Backing up DatoCMS

`pnpm datocms:export` makes a complete, offline copy of the DatoCMS project: the content model,
every record (drafts included), every uploaded file, and the project settings. It only reads from
DatoCMS and never changes anything there.

Why: the project runs on DatoCMS's legacy €10/month plan. If DatoCMS retires that plan, or we
decide to move to another CMS, an export means the move is never urgent and nothing can get lost.

## Running it

Needs the full-access API token in `.env.local`:

```sh
DATO_CMA_TOKEN=…   # DatoCMS → Project settings → API tokens → "Full-access API token"
```

```sh
pnpm datocms:export                 # everything → backups/datocms-YYYY-MM-DD/
pnpm datocms:export --used-assets   # only the files that records actually use (≈370 of 1,750)
pnpm datocms:export --skip-assets   # schema + records + file metadata, no downloads (seconds)
pnpm datocms:export --out=~/Backups/thefeeling   # pick the folder
```

- A full run downloads about **580 MB** (1,749 files) and takes a few minutes.
- **Re-running into the same folder resumes:** files that are already there and match their md5
  are skipped. So a weekly `--out=<same folder>` run only fetches what's new.
- The command exits non-zero if any file failed to download. The failures are listed in
  `manifest.json` under `assets.failed`.
- `backups/` is gitignored. Exports contain all content, so store them somewhere private
  (a Drive/Dropbox folder, an external disk).

## What's in an export

```
backups/datocms-2026-09-24/
  README.md          summary + manifest
  manifest.json      counts, sizes, download results
  site.json          project settings (name, locales, theme, global SEO, favicon)
  settings.json      environments, roles, plugins, webhooks, build triggers, API token names
  schema.json        every model and block with its fields, validations and fieldsets
  records/
    <model>.current.json     latest version of every record, including unpublished drafts
    <model>.published.json   what's live on the website
  uploads.json       metadata for every file: alt/title, focal point, size, md5, original URL
  assets/            the files themselves, named like the DatoCMS path (<timestamp>-<name>)
```

**Records** are the CMA's JSON: one object per record, field values keyed by API key
(`slug`, `x_position`, `sub_pages`, …). Blocks (`content`, `block`, `video`) are inlined inside
their parent (e.g. `page_portfolio.sub_pages[]`) and also listed in their own files. A file
field looks like `{ "upload_id": "…", "alt": …, "focal_point": … }`. Look the id up in
`uploads.json`, whose `path` ends in the filename under `assets/`.

**Secrets are never exported:** API token values, webhook header values, and the preview secret
inside the plugin settings are removed or replaced with `REDACTED`.

## Content model at a glance (from `schema.json`)

| Model                | Records   | Notes                                                                                  |
| -------------------- | --------- | -------------------------------------------------------------------------------------- |
| `page_portfolio`     | 31        | Oeuvre collage tiles; `sub_pages` = the detail slides                                  |
| `page_archive`       | 27        | Same shape, "ye olden stuffe"                                                          |
| `page_about`         | 1         | Singleton; `content` = label + Markdown body blocks                                    |
| `background`         | singleton | Background images per section                                                          |
| `content` (block)    | —         | A slide: image, text (HTML), colors, font sizes, video, `bold_video_id`, external link |
| `block` (block)      | —         | About page section                                                                     |
| `page_home`, `video` | —         | Unused leftovers from the old site                                                     |

## Moving to another CMS

The website only talks to DatoCMS in a few places: `src/lib/datocms/*` (queries, client),
`src/actions/layout.ts` (layout saves), `src/components/preview/*` (realtime, click-to-edit) and
the preview API routes. A migration means:

1. Recreate the models in the new CMS from `schema.json`. The model is small: 2 collections + 1
   singleton + 3 block types.
2. Upload `assets/` to the new storage, keeping a map from DatoCMS upload id → new URL.
3. Import `records/*.published.json` (or `.current.json` to keep drafts), replacing
   `upload_id`s with the new URLs.
4. Swap the queries in `src/lib/datocms/queries.ts` for the new CMS's API. The components
   receive plain data and don't care where it comes from.
5. Image URLs on the site are raw DatoCMS/imgix URLs today. After a move they must point to the
   new storage, and the imgix parameters (`?w=…&fit=crop`) used by the social cards need that
   service's equivalent.

The best fit if we ever have to move: **Payload CMS** running inside this same Next.js app
(open source, Postgres + Vercel Blob, drafts, versions and live preview built in). Estimated at
2–3 days, mostly asset migration.
