# AMAVI Socials

Marketing site for AMAVI Socials — a creator-led marketing and partnerships
agency working with brands across Ireland. Creator partnerships are the
speciality, not the limit: AMAVI finds the creators, communities, businesses
and partners that put a brand in front of the right audience.

Built with [Astro](https://astro.build). Static output, no UI framework, no CSS
framework. Three small scripts: the menu, lazy visible-only video playback,
and the creator application's steps, validation and submission. Creator
applications land in a Google Sheet, with Netlify Forms keeping a backup copy.

The layout takes its pacing and patterns from musetheagency.com — full-screen
video hero, large split entry points, stats over looping video, proof lines
that lead to Services, a clients marquee, and a footer of contact routes — as
AMAVI's own implementation: original code, AMAVI's copy and media, nothing of
MUSE's reused.

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
| `/` | Full-screen video hero with split entry points for brands and creators; "Creators are one part of the equation"; stats over looping video tiles; how we work; partners marquee; philosophy line |
| `/about` | A point of view more than an introduction: who AMAVI is, what it believes, the approach (four services), why AMAVI, one example beyond creators, the philosophy, AMAVI by the numbers |
| `/services` | What AMAVI does, goal first: four areas and their services, six sectors, how we work (six stages), why creator-led, results (client · objective · approach · result), who AMAVI works with |
| `/become-a-creator` | The creator application: six steps, to Google Sheets and Netlify Forms |
| `/contact` | Get in Touch: brands to email, creators to the application |
| `/privacy` | Privacy policy |

`/creators` redirects to `/become-a-creator`.

## Project structure

```
src/
  consts.ts              Site-wide constants: email, nav, socials, positioning,
                         tagline, hero video path
  logos.ts               Client logo manifest and optical sizing
  data/services.ts       The four service areas, the sectors, and the results
  data/tiles.ts          Creator videos: tiles 1–4 play behind the home stats
  lib/media.ts           Build-time checks for files in public/
  assets/
    amavi-socials-logo.png   The supplied logo — favicon and share image only
    logos/                   Client logos, solid black on transparent
  layouts/Base.astro     <head>, header, footer — every page uses this
  components/            Nav (header and menu), Footer, Hero, Feature,
                         StatTiles, LoopVideo, Placeholder, ProofLink, LogoWall,
                         ContactPaths, the creator form, Logo, Fonts
  scripts/loop-videos.ts   Lazy, visible-only playback for every video
  scripts/creator-form.ts  The application's steps, validation and submission
  pages/                 One file per route
  styles/global.css      Tokens and the shared styles
scripts/brand-assets.mjs Generates the favicon and share image
scripts/logos-mono.mjs   Converts client logos to solid black
scripts/encode-video.swift  Encodes video files (macOS; see "Making the video files")
scripts/google-sheets-handler.gs  The Apps Script that writes applications to
                         a Google Sheet (see "Creator applications → Google Sheets")
public/                  favicon, share image, robots.txt
public/media/            The hero's videos (none yet); tiles/ holds the creator videos
public/fonts/            ALT Rigatoni goes here once licensed (see Typefaces)
.env.example             The one environment variable, PUBLIC_SHEETS_ENDPOINT
```

---

## Brand

### Colour

White backgrounds, black text, black hairline rules, `#341BCA` for accents
and highlights, and a black footer. Six colours, defined once in
`src/styles/global.css`, and the only colour values anywhere in the codebase:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Every background. No tinted, grey or alternating sections |
| `--ink` | `#000000` | All text |
| `--line` | `#000000` | Every rule, divider, border, field outline and table line |
| `--accent` | `#341BCA` | Accents and highlights: the logo, links, button fills and outlines, hover and pressed states, focus rings, the hero's full stops, area and step numbers, the application's progress bar — wherever musetheagency.com uses its red |
| `--surface-dark` | `#000000` | The footer, and the flat overlay under text on video |
| `--on-dark` | `#FFFFFF` | Text, links, outlines and focus rings on black and on video |

**The exceptions to white** are the footer (full bleed, edge to edge) and text set over
video — the hero, once it has footage, and the stat tiles — which sits on a
flat black overlay. There are no greys, tints, gradients or shadows beyond
those two overlays.

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
| `--on-dark` on `--surface-dark` | 21.00:1 | Text on the footer |
| White on the stat tiles | ≥ 5.0:1 | On 95% of the pixels behind each label, over a 0.5 black shade (measured on each tile's first frame) |
| `--accent` on `--surface-dark` | 2.16:1 | **Hover only.** Footer links turn `#341BCA` on hover, with an underline so the state never rests on colour. Never used at rest on black, or for a focus ring there — those are white |

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
<Logo />                   <!-- brand, #341BCA -->
<Logo variant="current" /> <!-- the header: #341BCA on white, white over footage -->
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

**The scale steps by 1.125.** On 24 September 2026 the client asked for every
size to come down two steps and the wordmark to go up two, so the tokens in
`:root` already hold the reduced values — don't "correct" them back. Body copy
is 13px, the lead 13–16px, section heads 17–28px and the home hero 25–47px.
Three things keep their own sizes deliberately: **buttons** (`.btn`, 13px, and
their padding), **form controls** (16px, or iOS zooms on focus) and the
**wordmark** (27px in the header). The floor for text is 11px. The menu links
match the wordmark, on 44px rows.

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
  app, which also **emails a copy to partnerships@amavisocials.com**. This is the
  working copy: the creators database. Setup below.
- **Netlify Forms** — a backup copy of every application, under **Site
  configuration → Forms → creator-application**. Netlify detects the form at
  deploy time; nothing to configure.

The row is written before the email is sent, each in its own try/catch, so a
bounced or rate-limited notification can never cost you the row.

The success message appears **only after a confirmed response**: the Apps
Script replied `{"success":true}`, or Netlify accepted the submission. If
neither confirms — offline, a 20-second timeout, a server error — the error
state shows instead, everything typed stays in place to retry, and the
applicant is asked to email their application to **partnerships@amavisocials.com**
(`APPLICATIONS_EMAIL` in `src/consts.ts`). If only one of the two fails, the
applicant still sees success (the application is safe in the other) and the
failure is logged to the browser console for you to diagnose.

## Creator applications → Google Sheets

**Setup: [`scripts/README.md`](scripts/README.md)** — create the sheet, paste
in `scripts/google-sheets-handler.gs`, deploy it as a web app with access set
to "Anyone", copy the `/exec` URL into Netlify as `PUBLIC_SHEETS_ENDPOINT`,
redeploy. That file also lists every column in the creators database, how to
test a dummy application, and how to change the script later without changing
its URL.

Two settings worth knowing here:

| Where | Setting | What it does |
|---|---|---|
| Netlify → Environment variables | `PUBLIC_SHEETS_ENDPOINT` | The Apps Script `/exec` URL. Missing, and applications go to Netlify Forms only |
| `scripts/google-sheets-handler.gs` | `NOTIFY_EMAIL` | Where the notification email goes |

The build checks the endpoint: if it isn't a `https://script.google.com/…/exec`
URL, the deploy fails with a message saying so, and the previous deploy stays
live. For local development, copy `.env.example` to `.env` and set the same
value.

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
  in its place, at the same optical weight. Every cleared partner has a file
  now; when a new one arrives, import it and add `src`.
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
supplied light-on-dark (The Humble Fishmonger, Line 98) is detected and
inverted, so its lettering is the black. Le Olive, supplied on 24 September as
a gold gradient on white, reads as ink at every stop and converted in one
pass. Each file is then trimmed to its artwork. Run it on any new or re-exported logo; running it twice changes
nothing. The colour originals are in git history, except for two.

Line 98 and Pearls Co. were supplied as square social images (JPEG), which are
not in the repo, so each was cut to its mark by hand first: the script
converts everything it's given. Pearls Co. also had its full stop, a
photographed pearl, redrawn as a flat dot; converted as it was, its shading
would have become a broken crescent.

Logos are sized to cover comparable *area*, not a shared height — see
`opticalK()` — which is why a 6:1 wordmark and a 1:1 roundel are different
heights on purpose.

On the home page the row is a **marquee**: a continuous scroll with no visible
join, paused on hover and while it has keyboard focus. The repeated copies are
hidden from screen readers, so each partner is read once. With reduced motion
on, it doesn't move: it's a static, wrapped row. On `/services` the same logos
are a static row.

## Layout

- **Header.** A menu button on the left, the wordmark centred, "Get in touch"
  on the right; it stays at the top as the page scrolls. The menu is a
  full-screen panel of the site's pages, set large, with the contact routes
  beneath. Without JavaScript the menu button is a link to the footer's list
  of pages. Over hero footage the header is see-through with white contents
  until the hero has scrolled past.
- **Hero** (`Hero.astro`). Full screen. Headline, the four-word subline with
  accent full stops, one line of positioning, then two large entry points:
  **For Brands** → Get in Touch, **For Creators** → Become a Creator.
- **Feature blocks** (`Feature.astro`). One text column beside one portrait
  piece of media, alternating sides. Key phrases in the body copy are bold;
  each block ends on a **proof line** (`ProofLink.astro`) — a short claim in
  capitals with a chevron — linking to Services.
- **Stat tiles** (`StatTiles.astro`). The four figures, each over a looping
  creator video: four across on a wide screen, two by two on a phone.
- **Partners marquee** (`LogoWall.astro`), then the philosophy line.
- **Footer** (`Footer.astro`). Full-bleed black: edge to edge and down to the
  bottom of the page, its own padding holding the content off the edges. It opens
  on the page's closing call to action, with one route each for brands (the
  pre-filled brand enquiry email), creators (the application) and anything
  else (the inbox); then the pages, socials, the sign-off and the small print.
  The call to action's wording is a default on every page except About and
  Services, which set their own through `footerCta` on `Base.astro` — anything
  a page leaves out keeps the default.

### Placeholders

Wherever an image or a video is missing, the page shows an outlined frame at
the exact aspect ratio the real media will take, with **"Add image"** or
**"Add video"** in the middle (`Placeholder.astro`). Swapping in the real file
moves nothing else on the page. Today every slot but one is filled with
temporary media (see Visual content); the Tech & Startups sector on Services
shows "Add image" until a picture arrives.

## Services

The copy lives in **`src/data/services.ts`**:

- **Four areas**, each a short intro, a list of services (a name and one line
  on what the client gets) and a closing line.
- **Six sectors**, each a sector and the kind of work there. No metrics and no
  client names.
- **Results**, as client · objective · approach · result. They use only the
  verified figures in brief §5, written out as counts rather than
  percentages. Clients are described, never named.

Add, reorder or edit entries there and the page lays itself out, including the
index at the top that jumps to each area (`/services/#creator-marketing` and so
on). Sector images are keyed by sector name in `src/data/media.ts`, so a
renamed sector needs its key renamed there too. The six stages of "How we
work" and the "Why creator-led" text are in `src/pages/services.astro`
itself.

## Visual content

Every slot but one is filled for now with **temporary media, "until further
notice"**: the files supplied on 21 September 2026, cropped to each slot. Replace them
as final photography and footage arrives. The image and video slots all live
in **`src/data/media.ts`** (the hero in `src/consts.ts`), so each swap is one
line; take a slot out and it goes back to its outlined "Add image" / "Add
video" frame. Four of the supplied clips carry stock-library file names —
flagged in `src/data/media.ts`, to be replaced first.

- **Hero** — full-screen video in two separate cuts, both from one constant,
  `HERO_VIDEO` in `src/consts.ts` (now `/media/hero`):

  | Cut | Shown on | Files in `public/media/` |
  |---|---|---|
  | Desktop, 1920×1080 (16:9) | landscape screens | `hero.mp4`, `hero.webm`, poster `hero.jpg` |
  | Mobile, 1080×1920 (9:16) | portrait screens | `hero-portrait.mp4`, `hero-portrait.webm`, poster `hero-portrait.jpg` |

  **Now:** AMAVI's own café clip (`IMG_9245.mov`, 5.8s, shot 9:16): the
  desktop cut is a 16:9 band across the laptop, the mobile cut the whole
  frame, each with a 1s crossfade where it loops. The footage fills the screen
  edge to edge, the text is white over a flat black overlay (0.45 in
  `Hero.astro` — measured on this footage, white holds 6.7:1 or better), and
  the header sits over it. To replace it, drop new files in under these names —
  **H.264 MP4 plus a WebM, each under ~5MB**, silent and loopable, posters
  from each cut's first frame — and rebuild. Remove a cut and that
  orientation shows the "Add video" frame, with black text.
- **Stat tiles** — tiles 1–4 of `src/data/tiles.ts` (`public/media/tiles/`),
  creator videos from AMAVI's campaigns, behind the four figures. Tile 5 isn't
  used: its burned-in captions read badly as a silent loop.
- **Feature videos** (home, 2:3) — "Creators are one part of the equation"
  plays a photo shoot (`16521739…mp4`); "How we work" a content studio
  (`15636407…mp4`, first 12 seconds). In `public/media/features/`.
- **Images** — the Services page (2:3 for the head and each area, 4:5 for each
  sector) and the About page's four (2:3): stills from the supplied clips and
  the café photo, in `src/assets/media/`, served as responsive WebP. Which
  image fills which slot is `src/data/media.ts`. Content & Social's still was
  added on 22 September, from the studio clip (`15636407…mp4`, 6s). Nothing
  supplied suits Tech & Startups without repeating a picture already on the
  page, so that slot shows "Add image".

**Every video** is lazy and visible-only (`src/scripts/loop-videos.ts`): no
preload; the poster and sources are attached only as it nears the screen; it
plays while at least a quarter is visible and pauses as it scrolls away; a cut
that isn't displayed never loads; and under reduced motion it never plays —
the poster is all there is.

Get sign-off from the creator and the client before publishing any creator's
content.

### Making the video files

There's no ffmpeg on the machine this was built on, so the video files come
from `scripts/encode-video.swift`, which uses macOS's own AVFoundation: H.264
MP4, no audio track, and no WebM (a WebM dropped in beside an MP4 is picked
up automatically). Its header lists the options. For the hero, encode each
cut to its size (`--size 1920x1080`, and `--size 1080x1920` for the mobile
cut; `--fade 30` makes the loop seamless). The tile files were made with:

| Output | Source | Options |
|---|---|---|
| `hero.mp4` | `IMG_9245.mov` | `--size 1920x1080 --crop 0,1159,2160,1215 --bitrate 3000000 --fade 30` |
| `hero-portrait.mp4` | the same | `--size 1080x1920 --bitrate 2500000 --fade 30` |
| `features/creators.mp4` | `16521739_1440_2560_60fps.mp4` | `--size 720x1080 --crop 0,200,1440,2160 --bitrate 1500000 --fade 45` |
| `features/studio.mp4` | `15636407_1080_1920_30fps.mp4` | `--size 720x1080 --crop 0,150,1080,1620 --bitrate 1200000 --max 12 --fade 30` |
| `tiles/tile-1.mp4` | `Video-20656.mp4` | `--size 360x640 --bitrate 700000 --max 12` |
| `tiles/tile-2.mp4` | `Video-43037.mp4` | `--size 540x960 --bitrate 1100000 --max 12` |
| `tiles/tile-3.mp4` | `Video-15280.mp4` | `--size 540x960 --bitrate 1100000 --max 12` |
| `tiles/tile-4.mp4` | `Video-76499.mp4` | `--size 540x960 --bitrate 1200000` |
| `tiles/tile-5.mp4` | `Video-81412.mp4` | `--size 540x960 --bitrate 1000000 --max 12` |

```bash
swift scripts/encode-video.swift Video-43037.mp4 public/media/tiles/tile-2.mp4 tile-2.png --size 540x960 --bitrate 1100000 --max 12
```

Each run also writes a PNG of the first frame. The posters are JPEGs made
from those with sharp (`mozjpeg`, quality 75). The encoder can leave a temp
copy beside its output (`*.sb-*`): delete it, or it will be published from
`public/`.

```bash
node -e "require('sharp')('tile-2.png').jpeg({ quality: 75, mozjpeg: true }).toFile('public/media/tiles/tile-2.jpg')"
```

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
- **Final hero footage**, in two cuts: desktop 16:9 and mobile 9:16. The
  café clip holds the place for now. See Visual content.
- **Final media for every slot.** All are temporary fills for now, four of
  them from clips with stock-library names. See `src/data/media.ts`.
- **Creator handles and consent** for the creator videos, in
  `src/data/tiles.ts`.
- **About: client and industry counts.** "AMAVI by the numbers" shows only
  600+ creators and 125+ live posts until the current counts are confirmed.
  Set them in `src/pages/about.astro` and they appear. For reference, the logo
  wall shows 9 cleared partners.
- **"Restaurant" or "seafood bar".** Brief §2 says The Humble Fishmonger is a
  seafood bar, never a restaurant. The About page's example uses the supplied
  copy ("One restaurant. A whole new audience."), while Services calls it a
  seafood bar. If the example is the Fishmonger, About should say seafood bar
  too.
- **The home page's 92%.** The brief lists "92% net-new audience reach" but
  not how it is measured, so Services doesn't repeat it. Its results are
  written out as counts instead. Confirm the basis, or drop the figure.
- **A measured outcome for the seafood bar** result on Services, if there is
  one, and **an image for Tech & Startups**.
- **TikTok link** for the footer (`SOCIALS` in `src/consts.ts`).
- **A Work page.** The footer's "Work" leads to the sectors on Services until
  there is one.
- **Menu labels.** The header menu still reads About / Services / Become a
  Creator / Get in Touch; the footer uses the new names (Creator Network,
  Contact). Say which set to keep.
- **The old creator form's email is dead.** It tells creators to write to
  `hello@amavi.social`, a domain with no DNS. This site uses
  `hello@amavisocials.com`, which is verified working.
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
