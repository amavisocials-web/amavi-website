# AMAVI Socials

Marketing site for AMAVI Socials — a boutique influencer marketing and creator
partnerships agency working with brands across Ireland.

Built with [Astro](https://astro.build). Static output, no UI framework, no CSS
framework. Two small scripts: ~20 lines for the mobile menu, and the creator
application's steps, validation and submission. Creator applications land in a
Google Sheet, with Netlify Forms keeping a backup copy.

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
| `npm run logos:mono` | Convert every client logo to solid black (see Client logos) |

---

## Pages

| Path | What it is |
|---|---|
| `/` | Background-video hero, partners marquee, results, content tiles |
| `/about` | A short introduction and one call to action: email us |
| `/services` | "Work with us": the services, how a programme works, results by sector, who AMAVI works with |
| `/become-a-creator` | The creator application: six steps, to Google Sheets and Netlify Forms |
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
    logos/                   Client logos, solid black on transparent
  content.config.ts      Schema for the services collection
  content/services/      One markdown file per service
  layouts/Base.astro     <head>, header, footer — every page uses this
  components/            Logo, Nav, Footer, Hero, stats, content tiles, logo
                         wall, contact paths, the creator form, Fonts.astro
  scripts/creator-form.ts  The application's steps, validation and submission
  pages/                 One file per route
  styles/global.css      Tokens and the shared form styles
scripts/brand-assets.mjs Generates the favicon and share image
scripts/logos-mono.mjs   Converts client logos to solid black
scripts/google-sheets-handler.gs  The Apps Script that writes applications to
                         a Google Sheet (see "Creator applications → Google Sheets")
public/                  favicon, share image, robots.txt
public/media/            Hero video and poster (see Visual content)
public/fonts/            ALT Rigatoni goes here once licensed (see Typefaces)
.env.example             The one environment variable, PUBLIC_SHEETS_ENDPOINT
```

---

## Brand

### Colour

Black and white. `#341BCA` is an accent only. Seven colours, defined once in
`src/styles/global.css`, and the only colour values anywhere in the codebase —
four for the page, and three for its only non-white surfaces:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Every background. No tinted, grey or alternating sections |
| `--ink` | `#000000` | All text |
| `--line` | `#000000` | Every rule, divider, border, field outline and table line |
| `--accent` | `#341BCA` | Only: the logo, links, button fills and outlines, hover and pressed states, focus rings, and small marks such as the active nav underline and the application's step number and progress bar |
| `--surface-dark` | `#000000` | The hero overlay, Get in Touch (by default) and the footer |
| `--on-dark` | `#FFFFFF` | Text, links, outlines and focus rings on those dark surfaces |
| `--surface-soft` | `#F2F2F2` | Get in Touch, only if it is switched to grey |

**The three exceptions to white** are the hero's overlay, the Get in Touch
band and the footer; nothing else sits on anything but `--bg`. They use the
`.surface-dark` and `.surface-soft` classes, which flip text, links, the
outline button and the focus ring to suit. Get in Touch is one switch,
`GET_IN_TOUCH_SURFACE` in `src/consts.ts`: `'dark'` (the default) or `'soft'`.

There are no greys, tints, gradients or shadows beyond those. The hero
overlay is the one tint: black at part opacity over the footage.

**Separation without colour.** Depth comes from line weight, type scale and
space. Where a section used to sit on a tint, it now takes `.section--ruled`:
a full-width black hairline, and more room above and below (`--section-y`).

| Token | Value | Use |
|---|---|---|
| `--stroke` | 1px | Borders, field outlines, rules |
| `--stroke-hair` | 1px, 0.5px on dense screens | Section and row dividers |
| `--stroke-mark` | 2px | Accent marks only: focus ring, active nav |

**Secondary text** is never grey. It is black, set smaller or lighter:
`--weight-secondary` (300) against `--weight-body` (400) and
`--weight-strong` (600). Long reading text, such as the privacy policy, stays
at the body weight.

**Contrast, measured:**

| Pairing | Ratio | |
|---|---|---|
| `--ink` on `--bg` | 21.00:1 | Every piece of text |
| `--accent` on `--bg` | 9.74:1 | Links and the logo, at any size |
| `--bg` on `--accent` | 9.74:1 | The label on a filled button |
| `--ink` on `--accent` | 2.16:1 | **Fails** — so a filled button's label is white |
| `--on-dark` on `--surface-dark` | 21.00:1 | Text on the dark surfaces |
| `--ink` on `--surface-soft` | 18.76:1 | Text on a grey Get in Touch |
| `--accent` on `--surface-dark` | 2.16:1 | **Hover only.** Footer and Get in Touch links turn `#341BCA` on hover, as specified; an underline appears too, so the state never rests on colour. Never used at rest on black, or for a focus ring there — those are white |

That last row is the one exception to black text: the primary button is an
accent fill with a white label, because black on `#341BCA` fails AA. On hover
it inverts to an accent outline with an accent label; pressed, it refills.
The secondary button is a black outline that takes the accent on hover.

**Focus** is a 2px accent ring, offset 3px: 9.74:1 against white, where 3:1 is
required. The offset leaves a white gap, so the ring stays distinct even
around a filled accent button.

**Form states** use no colour, since there is none to use. An error is a
message with an outlined "!" beside the field. A selected chip gets an accent
outline, an accent tick and a heavier label: three signals, not one. Success
and failure panels are black-outlined boxes, told apart by what they say.

### Logo

The header and footer wordmark is **live text**, not the PNG
(`src/components/Logo.astro`). The PNG is a social avatar with its background
baked in and would look soft. The live version was measured against it:
Poppins Light (300), lowercase, right-aligned on two lines, tracking
−0.068em, line-height 1.02 — matching the file's letterforms and spacing
within ~2px at its own scale.

```astro
<Logo />                   <!-- brand, #341BCA: the header -->
<Logo variant="white" />   <!-- the black footer -->
<Logo variant="black" />
```

The PNG (`src/assets/amavi-socials-logo.png`) is used only for the favicon
and the Open Graph share image. If the file changes:

```bash
npm run brand:assets
```

The share image is the PNG placed pixel-for-pixel (never upscaled) on a
1200×630 canvas of its own exact background colour, with the wordmark
centred. Both it and the favicon are the supplied avatar, white on `#341BCA`:
the logo, which is one of the places the accent belongs. They appear in
browser tabs and share previews, not on the page.

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

`/become-a-creator` is a six-step form in a single card, one step on screen at
a time:

1. **About you** — name, email, city, country
2. **Your channels** — Instagram, TikTok, YouTube, X, LinkedIn, blog, other
3. **Your audience** — follower range, engagement rate, audience insights
4. **Your content** — niches, content formats
5. **Rates** — collaboration preference, rates per format, currency, rate
   notes, past collaborations, media kit link
6. **Review & submit** — every answer to check (each group has an Edit link),
   anything else, and the consent checkbox

Its options mirror AMAVI's existing live form, so new applications line up
with the ones already collected. The consent wording is the live form's,
adapted to a checkbox — word for word; keep it that way.

- **Each step is checked before Next.** Errors appear under the field, with
  an outlined "!", and focus moves to the first one.
- **Back keeps every answer.** It's one form throughout; steps only slide.
- **Focus moves to the step's heading** on every change, and the heading tells
  screen readers "Step n of 6". The progress bar and large step number are
  visual only.
- **Motion:** a slide between steps; instant for visitors who ask for reduced
  motion.
- **Phone first:** the card runs edge to edge, every input is 16px (so iOS
  never zooms), chips are tap-sized, and Back/Next stay pinned to the bottom
  of the screen on long steps.
- **Handles become links.** "@jane" in the Instagram field is sent as
  `https://www.instagram.com/jane`; a bare domain gets `https://`. Anything
  that isn't a link is flagged as typed, never rewritten.
- **Without JavaScript** it is one long form that posts natively to Netlify
  Forms, with the browser's own validation. The same happens if the script
  fails to load: after six seconds the long form comes back.
- A honeypot field filters spam.

### Where applications go

Each application is sent to two places at once:

- **A Google Sheet** — one row per application, via a Google Apps Script web
  app. This is the working copy. Setup below.
- **Netlify Forms** — a backup copy of every application, under **Site
  configuration → Forms → creator-application**. Netlify detects the form at
  deploy time; nothing to configure.

The success message appears **only after a confirmed response**: the Apps
Script replied `{"result":"success"}`, or Netlify accepted the submission. If
neither confirms — offline, a 20-second timeout, a server error — the error
state shows instead, everything typed stays in place to retry, and the email
address is offered as a fallback. If only one of the two fails, the applicant
still sees success (the application is safe in the other) and the failure is
logged to the browser console for you to diagnose.

## Creator applications → Google Sheets

The script is `scripts/google-sheets-handler.gs`. Its header has the same
steps as below, in more detail.

### 1. Deploy the script

1. Sign in to Google as **AMAVI's Workspace account** (hello@amavisocials.com),
   not a personal Gmail — the sheet holds applicants' personal data, and the
   privacy policy says it's kept in Google Workspace.
2. Create a Google Sheet, e.g. "AMAVI creator applications".
3. In the sheet: **Extensions → Apps Script**. Replace the sample code with the
   whole of `scripts/google-sheets-handler.gs`, and save.
4. **Deploy → New deployment** → gear icon → **Web app**.

### 2. Set its access

| Setting | Value | Why |
|---|---|---|
| Execute as | **Me** | The script writes to your sheet as you |
| Who has access | **Anyone** | Applicants aren't signed in to Google. This lets anyone *send* an application — as the form does — but not read the sheet, which stays private |

Click **Deploy** and authorise it. Google warns that it "hasn't verified this
app" because it's your own script: **Advanced → Go to … (unsafe) → Allow**.

Copy the **Web app URL** — it ends in `/exec`. Open it in a browser to check:
you should see `{"result":"ok", …}`.

### 3. Add the URL to Netlify

**Site configuration → Environment variables → Add a variable:**

| Key | Value |
|---|---|
| `PUBLIC_SHEETS_ENDPOINT` | the `/exec` URL |

Then **Deploys → Trigger deploy → Deploy site**. The URL is built into the
page, so it only takes effect on the next deploy. Submit a test application:
a row appears in the sheet's **Applications** tab, which the script creates
with a header row on first use.

The build checks the value: if it isn't a `https://script.google.com/…/exec`
URL — the script editor's address is the usual mistake — the deploy fails with
a message saying so, and the previous deploy stays live. If the variable is
missing, the build warns and applications go to Netlify Forms only.

For local development, copy `.env.example` to `.env` and set the same value.

### Later changes

- **Changing the script:** Deploy → Manage deployments → pencil → Version:
  **New version** → Deploy. That keeps the URL. A *new deployment* makes a new
  URL, which Netlify would then need.
- **Columns** are matched by header text, so you can reorder them or add your
  own (status, notes) freely. Don't rename the script's headers.
- **Adding a field** to the form means adding it to `FIELDS` in the script, then
  deploying a new version.
- Values that start with `=`, `+`, `-` or `@` are stored as text, never run as
  formulas.

---

## Client logos

Logos live in `src/assets/logos/` and are declared once in **`src/logos.ts`**.

```ts
{ name: 'Client Name', src: clientLogo, cleared: true, scale: 1.0 }
```

- **Clearance.** Only clients already public on the related agency site may
  appear (brief §9). The one still held back, Beyond BMI, has its file in
  `src/assets/logos/pending/`, deliberately **not imported**: Astro copies
  every imported image into the public build whether or not a page shows it.
  Once sign-off lands, move the file up a folder and uncomment its two lines
  in `src/logos.ts`.
- **No logo file yet?** Leave out `src` and the partner's name is set in type
  in its place, at the same optical weight (Line 98, Pearls Collective and
  Le Olive, for now). When the file arrives, import it and add `src`.
- **`scale`** evens out optical weight: a solid black disc and a thin ring
  cover the same area but not the same amount of ink. The comment above the
  manifest explains how the current values were set.

**Every logo is solid black** on transparent, with no colour versions. The
supplied colour artwork was converted in place by:

```bash
npm run logos:mono
```

It maps each pixel's lightness to black ink: dark artwork on a light ground
becomes black, and light areas enclosed by the artwork — the knocked-out
"IRELAND BOX" lettering, the ADHD Now roundel centre — stay open. Artwork
supplied light-on-dark (The Humble Fishmonger) is detected and inverted, so its
lettering is the black. Each file is then trimmed to its artwork. Run it on
any new or re-exported logo; running it twice changes nothing. The colour
originals are in git history.

Logos are sized to cover comparable *area*, not a shared height — see
`opticalK()` — which is why a 6:1 wordmark and a 1:1 roundel are different
heights on purpose.

On the home page the row is a **marquee**: a continuous scroll with no visible
join, paused on hover and while it has keyboard focus. The repeated copies are
hidden from screen readers, so each partner is read once. With reduced motion
on, it doesn't move: it's a static, wrapped row. On `/services` the same logos
are a static row.

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
image: ./images/service-name.jpg   # optional; 4:5, at least 960×1200
imageAlt: What the photograph shows   # required once image is set
---
```

Each service card has a fixed 4:5 image frame. Until `image` is set it shows an
outlined placeholder; the real photograph fills the same frame, cropped to
fit, so swapping it in moves nothing. The markdown body isn't shown on the
page; it's kept for a longer format later.

## Visual content

No footage or content has been supplied. Both slots are built and waiting:

- **Hero** — a full-bleed background video. Its source is one constant,
  `HERO_VIDEO` in `src/consts.ts` (now `/media/hero`). The hero loads
  `public/media/hero.webm`, `hero.mp4` and `hero.jpg` (the poster), and leaves
  out any file that isn't there — so today it shows the placeholder poster
  alone. To go live, export the footage as a compressed **H.264 MP4 plus a
  WebM, each under ~5MB**, silent and loopable, with a 1920×1080 poster from
  the first frame, and drop them in under those names: no code change. Other
  names are a one-line change to the constant. It autoplays muted and
  inline; visitors who ask for reduced motion get the poster and no video. A
  black overlay (`--hero-overlay` in `Hero.astro`, 0.5) keeps the white
  headline legible — retune it against the real footage.
- **Content tiles** (home page): give a tile a `video` or an `image` plus
  `alt`. Tiles are 9:16, the native reel ratio; until then each is a
  black-outlined frame.

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

**One environment variable:** `PUBLIC_SHEETS_ENDPOINT`, the Google Apps Script
URL — see "Creator applications → Google Sheets".

### Before launch

The site is configured for `https://www.amavisocials.co`, so canonical URLs and
the sitemap are right at launch. Review it on the Netlify subdomain first.

1. **`public/robots.txt`** — currently `Disallow: /`. The production version is
   commented out directly beneath; swapping them is the launch step.
2. **Export the old creator form's submissions.** The previous form (a Vercel
   app on `www.amavisocials.co`) saved applications through its own
   `/api/submit`. New ones arrive in the Google Sheet (and Netlify Forms).
   Anything the old form collected stays with the old app once DNS moves.
3. **Deploy the Google Sheets script and set `PUBLIC_SHEETS_ENDPOINT`** — see
   "Creator applications → Google Sheets".
4. **Fill in the privacy policy blanks** — registered entity name, company
   number and address. They render visibly on `/privacy`.
5. **Connect the custom domain and HTTPS.**

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
  `src/consts.ts`. The home content heading is another, `CONTENT_TAGLINE`,
  under copy review.
- **Get in Touch: black or grey.** `GET_IN_TOUCH_SURFACE` in `src/consts.ts`.
- **Partner logos** for Line 98, Pearls Collective and Le Olive, and service
  photographs (4:5) for each service.
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
  `aria-invalid` states; no state relies on colour
- Placeholder visuals are hidden from assistive tech
- No HTML comments ship in page source — internal notes use `{/* */}`
- Tested at 375px, 390px, 768px, 1024px, 1280px and 1440px
