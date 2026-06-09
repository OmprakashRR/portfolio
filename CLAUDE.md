# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is
A single-page academic portfolio for **Dr. Omprakash Ramalingam Rethnam** (Assistant
Lecturer in Construction Management, TU Dublin). Static site on GitHub Pages, plus an AI
"digital twin" chat widget backed by a Cloudflare Worker.

Live: https://omprakashrr.github.io/portfolio/

## Structure
- `index.html` — the entire site: 6 sections (About, Research, Publications, Teaching,
  Awards, Contact) + the chat-widget markup near the bottom.
- `css/style.css` — all styling; light/dark themes via CSS variables (`--accent`, `--card`,
  `--border`, `--text-*`). Reuse existing tokens and classes (`.block-title`,
  `.project-status` + `.status-active|-complete|-proposed`, `.chip`, `.pbadge-*`,
  `.proposal-row`) rather than inventing new ones.
- `js/main.js` — theme toggle, nav, publication filter (it recomputes the publication
  count from the number of `.pub-year-group[data-type]` elements), scroll-reveal.
- `cloudflare-worker.js` — the digital-twin proxy. The `SYSTEM_PROMPT` constant holds all
  verified CV facts and is the **source of truth for the bot**.
- `DIGITAL-TWIN-NOTES.md` — how the chatbot is wired up and how to redeploy it.
- `assets/` — `photo.jpg`, and `cv.pdf` (public download — keep it **redacted**, see below).

## Source of truth
The CV `.docx` in the repo root (`Omprakash Ramalingam Rethnam CV-<month>-<year>.docx`) is
the authoritative source for facts. When it changes, update **both** `index.html` **and**
the `SYSTEM_PROMPT` in `cloudflare-worker.js` so the site and bot stay consistent.

## Conventions & gotchas
- **Funding figures use Indian lakh notation.** The CV writes `INR 12 million ($1,44,187)`
  — that means **$144,187**, NOT $1.4M. Do not misread the comma grouping. Secured funding
  ≈ **$146K**; the 8 co-authored proposals total ≈ **$520K** requested.
- **The downloadable `assets/cv.pdf` MUST be redacted** — no home address, no phone number.
  The source docx has both on page 1; strip them before publishing.
  - Converting docx→PDF via Word automation **hangs** on the OneDrive copy because of
    Protected View (mark-of-the-web). Working recipe: copy the docx to a local temp dir,
    `Unblock-File` it, temporarily set the Word `ProtectedView` registry DWORDs to 1,
    `ExportAsFixedFormat(..., 17)`, then restore the registry values.
- **LinkedIn handle is `omprakashrethnam`** (single n). The CV has a typo
  `omprakashrethnnam` — do not copy it into the site.
- Publication year labels: the first entry of a year shows the year; later entries in the
  same year use `<div class="pub-year-label" style="visibility:hidden">` + a `data-merge`
  attribute so the year isn't repeated.

## Deploying
- **Website** — auto-deploys to GitHub Pages via `.github/workflows/deploy.yml` on every
  push to `master`. No manual step; watch the repo's **Actions** tab.
- **Chatbot** — manual. After editing `cloudflare-worker.js`, copy its full contents into
  Cloudflare → Workers & Pages → `digital-twin` → **Edit code** → paste → **Deploy**.

## Never
- Never publish an unredacted CV (home address / phone number).
- Never commit `*-jobspec.pdf` — private recruitment documents (already in `.gitignore`).
