# Cutover runbook: Gatsby/Netlify → Next.js/Vercel

Current state (2026-09-23):

|                       |                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------- |
| Vercel project        | `marcelfahles-projects/the-feeling`, production branch **`v2`** (temporary)            |
| Production URL        | https://the-feeling-omega.vercel.app                                                   |
| Live site             | https://thefeeling.de on Netlify (Gatsby, branch `master`)                             |
| DatoCMS               | project 5427, admin https://the-feeling.admin.datocms.com, only env `master` (primary) |
| Deployment protection | preview deployments only (production + custom domains are public)                      |

Everything below needs the **full-access CMA token** as `DATO_CMA_TOKEN` in `.env.local`
(the setup script loads it).

### What the legacy DatoCMS plan allows (checked 2026-09-24)

- **No sandbox environments** (`PLAN_UPGRADE_REQUIRED`), so every schema change happens on primary.
- **Three API tokens:** the built-in "Full-access" and "Read-only" plus one more, now
  "Website (published)" (CDA only, role "Website (read)"). Tokens in use:
  - `DATOCMS_PUBLISHED_CDA_TOKEN`: "Website (published)", read-only, no drafts, no CMA;
  - `DATOCMS_DRAFT_CDA_TOKEN`: the built-in "Read-only API token" (the old `DATO_API`, which
    Gatsby also uses). Keep it after cutover; it's the preview token;
  - `DATOCMS_LAYOUT_CMA_TOKEN`: the built-in "Full-access API token", server-only, used only by
    the layout-save action (editor session + model and field checks).
- **No stega Visual Editing:** click-to-edit is record-level.
- The old deploy hooks are **build triggers** "Production" and "Staging" (Netlify adapter), not
  webhooks.
- Already done on primary (2026-09-24):
  - **drafts on** for `page_portfolio`, `page_archive`, `page_about`, `background`: Save now
    creates a draft and only Publish goes live, on both the old and the new site;
  - Web Previews plugin installed with the 4 viewport presets, pointing at the Vercel URL;
  - webhook "Invalidate website cache" → the Vercel URL;
  - the six "available updates" that don't touch the management API (validations on publish,
    draft mode default, GraphQL security, 8-digit hex, multi-locale fields, milliseconds);
  - layout save round trip + conflict detection verified on production with a throwaway draft
    record (deleted afterwards).
- Still off until after cutover (they change what Gatsby reads): improved items listing,
  boolean fields, timezone management, non-localized focal points.

At cutover, re-point the plugin and webhook to the real domain:
`pnpm datocms:setup --plugin --webhook --base-url=https://thefeeling.de`.

## 0. Before cutover: rehearse on a sandbox (not possible on the legacy plan; kept for later)

```sh
pnpm datocms:setup --fork=nextjs-preview                    # fork primary (plan permitting)
pnpm datocms:setup --drafts --environment=nextjs-preview
pnpm datocms:setup --plugin --environment=nextjs-preview --base-url=https://the-feeling-omega.vercel.app
pnpm datocms:setup --tokens                                 # roles + 3 tokens → .env.datocms
```

Then in Vercel set `DATOCMS_ENVIRONMENT=nextjs-preview` (Production, while `v2` is the production
branch), copy the three tokens from `.env.datocms` into Vercel + `.env.local`, redeploy, and walk
through the preview checklist in the plan (Phase 5–7 manual verification) inside the sandbox.

If the DatoCMS plan has no sandbox environments, skip the fork and test on primary with a
throwaway `page_archive` record, as the plan describes.

## 1. Cutover (about 30 minutes, announce a content freeze)

1. Tell the client: no edits in DatoCMS for 30 minutes.
2. ~~Drafts on primary~~ (done).
3. Plugin + webhook → real domain:
   `pnpm datocms:setup --plugin --webhook --base-url=https://thefeeling.de`
   Then in DatoCMS → Project settings → Build triggers, **disable** (don't delete) "Production" and
   "Staging" (Netlify). Re-enabling them is the rollback.
4. Vercel env (Production): `DATOCMS_ENVIRONMENT` empty; published/drafts/layout tokens from
   `.env.datocms`; **`SITE_URL=https://thefeeling.de`** (this switches on indexing, canonical URLs,
   robots.txt allow rules and the sitemap; without it every host is `noindex`). Redeploy.
5. Vercel → Domains: add `thefeeling.de` and `www.thefeeling.de` (www → apex redirect, like today).
6. DNS: point `thefeeling.de` to Vercel (A `76.76.21.21` or the record Vercel shows) and
   `www` CNAME `cname.vercel-dns.com`. Wait for the certificate.
7. Verify: `E2E_BASE=https://thefeeling.de pnpm e2e smoke preview`, then publish a small change in
   DatoCMS and confirm it is live within seconds.
8. Merge `v2` into `master`; set the Vercel production branch to `master`
   (`vercel api /v9/projects/the-feeling/branch -X PATCH -f branch=master`).
9. Netlify: stop auto-publishing, keep the site for two weeks as rollback.
10. Search: add `thefeeling.de` to Google Search Console and Bing Webmaster Tools, submit
    `https://thefeeling.de/sitemap.xml`, and run a couple of project URLs through
    https://search.google.com/test/rich-results and https://www.opengraph.xyz.

## 2. After cutover

- Activate the remaining DatoCMS "available updates" (items listing, boolean fields, timezone
  management, focal points). Only Gatsby cared about them.

11. Rotate the Bold API key (the old one is public in the Gatsby bundle): create a new key in Bold,
    `vercel env add BOLD_API_KEY production --force`, redeploy, revoke the old key.
12. After Netlify is retired: revoke the old `DATO_API` token that Gatsby and `cmd.txt` used.
    Ask the client to delete `~/Documents/TheFeeling-Website` and the `thefeeling` alias in `~/.zshrc`.
13. Delete the `nextjs-preview` sandbox or keep it for schema work.

## Rollback

1. DNS back to Netlify.
2. Re-enable the "Production" build trigger in DatoCMS.
3. Optional: `draft_mode_active: false` on the 4 models. Gatsby only reads published content, so
   it keeps working with drafts on.
