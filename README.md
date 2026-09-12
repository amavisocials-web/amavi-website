# AMAVI Socials

Marketing site for AMAVI Socials — a boutique influencer marketing and creator
partnerships agency working with Irish brands.

Built with [Astro](https://astro.build). Static output, no UI framework, no CSS
framework. One small script for the mobile menu and one for form submission;
everything else ships as HTML and CSS.

---

## Running it locally

**Requires Node 22.12 or newer.** Astro 7 will not run on Node 20.

Check what you have:

```bash
node -v
```

### If that prints v22.12 or higher

```bash
npm install
```

```bash
npm run dev
```

### If it prints something older

Pick whichever applies:

**You use nvm** (and it's loaded in your shell — `nvm -v` prints a version).
The required version is pinned in `.nvmrc`:

```bash
nvm install 22 && nvm use
```

**You have nvm downloaded but not wired into your shell** (`nvm -v` says
"command not found" but `~/.nvm` exists). nvm is a shell function, not a
binary, so it has to be sourced. Either add the loader to `~/.zshrc`:

```bash
echo -e '\nexport NVM_DIR="$HOME/.nvm"\n[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.zshrc
```

...then open a new terminal and run `nvm install 22 && nvm use`. Or skip nvm
entirely and put the binary on PATH for the current shell only:

```bash
export PATH="$HOME/.nvm/versions/node/$(ls ~/.nvm/versions/node | sort -V | tail -1)/bin:$PATH"
```

**You installed Node from nodejs.org** and want to just replace it. Download
the Node 22 LTS `.pkg` from [nodejs.org](https://nodejs.org) and run it — it
overwrites `/usr/local/bin/node` in place. Requires your password.

Then:

```bash
npm install
```

```bash
npm run dev
```

The site runs at **http://localhost:4321**. Edits reload automatically.

### All commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally, to check the real output |

---

## Project structure

```
src/
  consts.ts              Site-wide constants: contact email, nav, socials
  content.config.ts      Schemas for the two content collections
  content/
    case-studies/        One markdown file per case study
    services/            One markdown file per service
  layouts/Base.astro     <head>, header, footer — every page uses this
  components/            Nav, footer, forms, logo wall, and the metric displays
  pages/                 One file per route
  scripts/               The form submission script
  styles/global.css      Design tokens and global styles
public/                  favicon, robots.txt, OG share image
```

---

## Adding a case study

Create a markdown file in `src/content/case-studies/`. It appears on `/work`
automatically — no page edits.

```markdown
---
client: Client Name
sector: What they do
summary: One or two sentences, shown under the client name.
challenge: What they came to us with.
approach:
  - What we did, one line per step
results:
  - value: "22"
    label: "What this number measures"
deliverables:
  - What the client received
tone: sage        # sage | clay | stone — picks the placeholder colourway
order: 4          # controls position on /work
published: true   # false keeps it out of the page until sign-off lands
---

Any extra copy goes here as normal markdown.
```

**`published: false`** builds and validates the entry but renders it nowhere.
That is how a client awaiting sign-off is kept in the repo without going live.
Two entries are currently held this way: The Humble Fishmonger and Beyond BMI.

> **On metrics:** every figure on this site comes from AMAVI's own cumulative
> creator-programme report (April–August 2026). Do not add, round, extrapolate,
> or compute new totals from the parts. If a number isn't in that report, it
> doesn't go on the site.

## Adding a service

Same idea — a markdown file in `src/content/services/`, rendered on `/services`
and summarised on the homepage.

```markdown
---
title: Service name
summary: Plain-language description of what the client receives.
includes:
  - What's included, one line per item
order: 7
provisional: false   # true shows a "Scope to be confirmed" flag
---
```

---

## Brand handover

The site is built so that swapping in AMAVI's real brand touches **two files**:

1. **`src/styles/global.css`** — every colour, typeface, size and spacing value
   is a CSS custom property in the `:root` block at the top. Change them there.
2. **`src/components/Logo.astro`** — the temporary wordmark. Replace the markup
   with the supplied logo.

No component holds a raw colour or font value, so nothing else needs editing.

**Two provisional colour tokens were adjusted from the original brief** to meet
the WCAG AA contrast the spec also requires. Both are commented in place:

| Token | Brief | Used | Why |
|---|---|---|---|
| `--accent-alt` | `#C25E3A` | `#A8492A` | Brief value is 3.89:1 on `--paper` — fails AA for the body-size links it's meant for. Now 5.28:1. |
| `--ink-muted` | `#6B655C` | `#5F5A51` | Brief value is 4.47:1 on `--paper-deep` — just under AA. Now 5.30:1. |

If the real brand guide supersedes these, re-check contrast before shipping.

**Typefaces** are Instrument Serif (display) and Archivo (body), installed as
npm packages and self-hosted — not loaded from Google's CDN.

**Imagery** is placeholder colour fields at the correct aspect ratios. Swapping
in real photography is a file replacement via `<Image />` from `astro:assets`
at the same ratio, and shifts nothing on the page.

---

## Deploying

Netlify, connected to this Git repo. `netlify.toml` holds the build config, so
no dashboard setup is needed beyond connecting the repo.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 22 (set in `netlify.toml`)

Deploy previews are generated on every push.

### Forms

Both forms post to **Netlify Forms**. They're plain HTML with
`data-netlify="true"`, so Netlify detects them at build time — nothing to
configure. Submissions appear under **Site configuration → Forms**.

Each form has a honeypot field for spam, validates client-side before
submitting, and shows a visible success **and** a visible error state. A failed
submission is never silent, and the visitor's input is preserved so nothing is
lost on a retry.

### Before launch

The site is configured for `https://www.amavisocials.co` from the first commit,
so canonical URLs and the sitemap are correct at launch. Review it on the free
Netlify subdomain first — rename the site to something presentable, e.g.
`amavi-socials-preview.netlify.app`, so review links look intentional.

**Launch checklist:**

1. **`public/robots.txt`** — currently `Disallow: /` so the preview stays out
   of search. The production version is in the same file, commented out
   directly beneath. Swapping them is the launch step.
2. **Confirm where the existing signup submissions route** before switching
   DNS. `amavisocials.co` currently serves a live influencer signup form whose
   submissions may be going somewhere active. This is a blocker — see the note
   at the top of `src/pages/creators.astro`.
3. **Copy the live page's consent wording** into `src/components/CreatorForm.astro`.
   The current wording is a GDPR-appropriate reconstruction; the brief requires
   the original be preserved verbatim, and the source file supplied was empty.
4. **Fill in the privacy policy blanks** — registered entity name, company
   number and address. They're marked inline and render visibly on `/privacy`
   so they can't ship unnoticed.
5. **Connect the custom domain and HTTPS.** Nothing about the build changes.

### Open questions for the client

Everything still awaiting an answer is marked `TODO(client):` in the code —
30 markers in total. Find them with:

```bash
grep -rn "TODO(client)" src/ public/
```

The ones that matter most:

- **Contact email.** Two are in circulation — `hello@amavi.social` (on the live
  page) and `hello@amavisocials.com` (the working mailbox). The working mailbox
  is used, defined once in `src/consts.ts`.
- **Social handles.** The Instagram and LinkedIn URLs are assumed. Confirm them.
- **Brand assets.** No logo files, colours or fonts supplied.
- **Photography.** None approved. Template preview images are not licensed.
- **Team section.** No photos or bios, so `/about` ships without one rather than
  using stock portraits. `src/components/Team.astro` is scaffolded and
  unimported, ready for when they arrive.
- **Case study briefs.** The three published case studies carry real outcome
  figures but `[PLACEHOLDER]` challenge copy — the clients' own framing of what
  they came to us with is still needed.
- **Analytics.** GA4 or Plausible, client's choice. Note that GA4 sets cookies
  and would make a consent banner legally required; Plausible is cookieless and
  would not.
- **Budget bands and follower/engagement bands** on the two forms are sensible
  defaults, not supplied figures.

---

## Accessibility and standards

- Semantic HTML, one `<h1>` per page, logical heading order
- Keyboard accessible with visible focus states; skip link on every page
- `prefers-reduced-motion` respected — the one load animation is disabled
- WCAG AA contrast across all three surface colours (see the token table above)
- Forms use real labels, `aria-describedby` for hints and errors, and
  `aria-live` regions for status
- Tested at 375px, 768px, 1280px and 1440px
