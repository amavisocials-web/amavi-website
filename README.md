# AMAVI Socials

Marketing site for AMAVI Socials — a boutique influencer marketing and creator
partnerships agency working with brands across Ireland.

Built with [Astro](https://astro.build). Static output, no UI framework, no CSS
framework. Two small scripts: ~20 lines for the mobile menu, and the creator
application's validation and submission.

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
| `npm run brand:assets` | Regenerate the favicon and share image from the logo file |

---

## Pages

| Path | What it is |
|---|---|
| `/` | Hero, partner logos, content tiles |
| `/about` | Tagline, how a programme runs, why creator-led, results by sector |
| `/services` | "Work with us": the services, then who AMAVI works with |
| `/become-a-creator` | The creator application (Netlify Forms) |
| `/contact` | Get in Touch: brands to email, creators to the application |
| `/privacy` | Privacy policy |

`/creators` redirects to `/become-a-creator`.

## Project structure

```
src/
  consts.ts              Site-wide constants: email, nav, socials, tagline, paths
  logos.ts               Client logo manifest and optical sizing
  assets/
    amavi-socials-logo.png   The supplied logo — favicon and share image only
    logos/                   Client logos, backgrounds already cut
  content.config.ts      Schema for the services collection
  content/services/      One markdown file per service
  layouts/Base.astro     <head>, header, footer — every page uses this
  components/            Logo, Nav, Footer, Hero, content tiles, logo wall,
                         contact paths, the creator form, Fonts.astro
  scripts/creator-form.ts  The application's validation and submission
  pages/                 One file per route
  styles/global.css      Tokens, surfaces, and the shared form styles
scripts/brand-assets.mjs Generates the favicon and share image
public/                  favicon, share image, robots.txt
public/fonts/            ALT Rigatoni goes here once licensed (see Typefaces)
```

---

## Brand

### Colour

Six colours, defined once in `src/styles/global.css`:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Page background |
| `--band` | `#FBEEF1` | Pale petal pink — tint sections only |
| `--ink` | `#0D0D0D` | True black: text, and black sections |
| `--muted` | `#6E6E73` | Supporting text; form-field edges |
| `--line` | `#EAEAEA` | Hairlines; supporting text on dark sections |
| `--accent` | `#341BCA` | Buttons, links, indigo sections |

These are the **palette**: fixed, and the only colours in the codebase. To
rebrand, edit them. Components never use them directly; they read **role**
tokens (`--fg`, `--fg-muted`, `--hairline`, `--link`, `--focus`, the button
colours), which each section sets from the palette:

| Section class | Background | Text | Supporting text |
|---|---|---|---|
| `.surface-bg` (default) | `--bg` | `--ink` | `--muted` |
| `.surface-band` | `--band` | `--ink` | `--ink` — see below |
| `.surface-accent` | `--accent` | `--bg` | `--line` |
| `.surface-ink` | `--ink` | `--bg` | `--line` |

So a component never needs to know what it sits on, and sections nest safely.

**Contrast, measured:**

| Pairing | Ratio | |
|---|---|---|
| `--ink` on `--bg` | 19.44:1 | |
| `--accent` on `--bg` | 9.74:1 | Passes for body text, not only large text |
| `--bg` on `--accent` | 9.74:1 | |
| `--muted` on `--bg` | 5.07:1 | |
| `--muted` on `--band` | 4.49:1 | **A hair under AA (4.5)** — so on band sections supporting text is `--ink` |
| `--muted` on `--ink` | 3.83:1 | Fails — supporting text on black is `--line` (16.16:1) |
| `--muted` on `--accent` | 1.92:1 | Fails — supporting text on indigo is `--line` (8.10:1) |
| `--accent` on `--ink` | 2.00:1 | **Fails** even for large text — on black, indigo is only ever a solid block |
| `--muted` field edge on `--bg` | 5.07:1 | Form fields need 3:1; `--line` (1.20:1) is never a field edge |

If you'd rather keep grey supporting text on the pink band, darkening
`--muted` one step (to about `#6A6A6F`) clears AA there — at the cost of
changing the value above.

Button hover on light sections is `--ink`. The one place colour is thinned
rather than used flat is the hero's placeholder reel wall: `--ink` at three
strengths over `--accent`.

Form errors use no extra colour: an errored field gets a heavy `--ink` border
plus an icon and a message, while focus is `--accent`, so the two states stay
distinct.

### Logo

The header and footer wordmark is **live text**, not the PNG
(`src/components/Logo.astro`). The PNG is a social avatar with its background
baked in and would look soft. The live version was measured against it:
Poppins Light (300), lowercase, right-aligned on two lines, tracking
−0.068em, line-height 1.02 — matching the file's letterforms and spacing
within ~2px at its own scale.

```astro
<Logo variant="brand" />   <!-- indigo, on white -->
<Logo variant="white" />   <!-- on indigo or black -->
<Logo variant="black" />
```

The PNG (`src/assets/amavi-socials-logo.png`) is used only for the favicon
and the Open Graph share image. If the file changes:

```bash
npm run brand:assets
```

The share image is the PNG placed pixel-for-pixel (never upscaled) on a
1200×630 canvas of its own exact background colour, with the wordmark
centred.

### Typefaces

- **ALT Rigatoni** — display headings only.
- **Montserrat** — body and UI.
- **Poppins Light** — the wordmark only.

Montserrat and Poppins are open source and self-hosted from npm.

**ALT Rigatoni** is commercial — by Giulia Boggio, sold by
[ALT.tf](https://alt-tf.com/products/alt-rigatoni) — and needs a **Web**
licence. (Not *Rigatoni* by Sudtipos, an unrelated didone.) Installing it is
a file drop: put the licensed `.woff2` files in `public/fonts/` and rebuild.

| File | Weight |
|---|---|
| `alt-rigatoni-variable.woff2` | all — preferred, one file |
| `alt-rigatoni-regular.woff2` | 400 |
| `alt-rigatoni-semibold.woff2` | 600 — what the headings use |
| `alt-rigatoni-bold.woff2` | 700 |

`src/components/Fonts.astro` detects them at build time, so there are no 404s
before then. Until they arrive, Archivo at its widest width stands in. The
real face may set wider; the display sizes are the `--display-*` tokens.

---

## The creator application

`/become-a-creator` posts to **Netlify Forms** as `creator-application`.
Netlify detects the form at deploy time — nothing to configure. Submissions
appear under **Site configuration → Forms**.

Its options mirror AMAVI's existing live form, so new applications line up
with the ones already collected: the follower bands (Nano to Major), engagement
bands, niches, content formats, per-format rates and currencies. The consent
wording is the live form's, adapted to a checkbox.

Built for a phone first: one column, 48px controls, 16px text in every input
(so iOS never zooms), tap-sized chips for multi-select.

- **Required:** name, email, city, country, at least one channel, follower
  range, collaboration preference, consent.
- **Validation** is inline. On a failed submit it says how many fields need
  attention and takes you to the first.
- **Handles become links.** "@jane" in the Instagram field is sent as
  `https://www.instagram.com/jane`; a bare domain gets `https://`. Anything
  that isn't a link is flagged as typed, never rewritten.
- **Success** replaces the form with a confirmation.
- **Failure** — offline, a timeout (20s) or a server error — shows a panel
  saying so, keeps everything that was typed, and gives the email address as a
  fallback. It never fails silently.
- **Without JavaScript** it still posts natively, with the browser's own
  validation.
- A honeypot field filters spam.

---

## Client logos

Logos live in `src/assets/logos/` and are declared once in **`src/logos.ts`**.

```ts
{ name: 'Client Name', src: clientLogo, cleared: true, scale: 1.0 }
```

- **Clearance.** Only clients already public on the related agency site may
  appear (brief §9). The two held back — The Humble Fishmonger and Beyond BMI —
  have their files in `src/assets/logos/pending/`, deliberately **not
  imported**: Astro copies every imported image into the public build whether
  or not a page shows it. Once sign-off lands, move the file up a folder and
  uncomment its two lines in `src/logos.ts`.
- **`scale`** is an optional optical nudge. Leave it off unless a logo reads
  visibly heavy or light beside the others.

Every supplied logo needed two things, and will again if re-exported:
**backgrounds cut** by flood-filling inward from the border (which clears the
background white but keeps white enclosed by artwork, like the knocked-out
"IRELAND BOX" lettering), and **trimming** to the artwork. Logos are sized to
cover comparable *area*, not a shared height — see `opticalK()` — which is why
a 6:1 wordmark and a 1:1 roundel are different heights on purpose.

Client logos keep their own colours, so they only sit on light surfaces.

## Adding a service

A markdown file in `src/content/services/`:

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

## Visual content

No footage or content has been supplied. Both slots are built and waiting:

- **Hero** (`src/components/Hero.astro`): pass `video="/media/hero.mp4"` and a
  `poster` still. Until then a wall of reel-shaped tiles stands in. The clip
  autoplays muted and never plays for visitors who ask for reduced motion.
- **Content tiles** (home page): give a tile a `video` or an `image` plus
  `alt`. Tiles are 9:16, the native reel ratio.

Get sign-off from the creator and the client before publishing any creator's
content.

---

## Deploying

Netlify, connected to this repo. `netlify.toml` holds the build config.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 22 (set in `netlify.toml`)

Brands are sent to email (`CONTACT_EMAIL`, with the subject and a short prompt
pre-filled). Creators go to `/become-a-creator`. Both live in `src/consts.ts`.

### Before launch

The site is configured for `https://www.amavisocials.co`, so canonical URLs and
the sitemap are right at launch. Review it on the Netlify subdomain first.

1. **`public/robots.txt`** — currently `Disallow: /`. The production version is
   commented out directly beneath; swapping them is the launch step.
2. **Export the old creator form's submissions.** The previous form (a Vercel
   app on `www.amavisocials.co`) saved applications through its own
   `/api/submit`. New ones arrive in Netlify Forms. Anything the old form
   collected stays with the old app once DNS moves.
3. **Fill in the privacy policy blanks** — registered entity name, company
   number and address. They render visibly on `/privacy`.
4. **Connect the custom domain and HTTPS.**

### Open questions for the client

Everything awaiting an answer is marked `TODO(client):` in the code. Find them
with:

```bash
grep -rn "TODO(client)" src/ public/
```

The ones that matter most:

- **ALT Rigatoni licence.** See Typefaces.
- **Hero footage and content tiles.** See Visual content.
- **The tagline is a working draft.** One constant, `TAGLINE`, in
  `src/consts.ts`.
- **The old creator form's email is dead.** It tells creators to write to
  `hello@amavi.social`, a domain with no DNS. This site uses
  `hello@amavisocials.com`, which is verified working.
- **Services format.** Framed as "Work with us"; the nav label is still
  "Services" — one line in `src/consts.ts` to rename.
- **Analytics.** GA4 or Plausible. GA4 sets cookies and would need a consent
  banner; Plausible would not.

---

## Accessibility and standards

- Semantic HTML, one `<h1>` per page, logical heading order
- Keyboard accessible with visible focus states; skip link on every page
- `prefers-reduced-motion` respected
- WCAG AA contrast on every text pairing — measured; see Colour
- Form fields have real labels, `aria-describedby` hints and errors, and
  `aria-invalid` states; errors are never colour alone
- Placeholder visuals are hidden from assistive tech
- No HTML comments ship in page source — internal notes use `{/* */}`
- Tested at 375px, 390px, 768px, 1024px, 1280px and 1440px
