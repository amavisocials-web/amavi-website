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
that lead to the practice areas, a clients marquee, and a footer of contact routes — as
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
| `/` | Full-screen video hero ("Content that connects"), copy centred, with "Brands \| Creators" under the headline and the two buttons under that; the "Trusted by" logo marquee; what AMAVI is, in three paragraphs; the three figures beside a drifting collage of creator work; the case study; the six services, as an accordion |
| `/about` | Who AMAVI is: the intro, the approach (strategy, creator selection, content, reporting and optimisation), the philosophy over a photograph in black, and the closing invitation |
| `/become-a-creator` | The intro, what happens next, then the creator application: six steps, to Google Sheets and Netlify Forms |
| `/contact` | Get in touch, the heading centred: brands to email, creators to the application. Nothing else on the page |
| `/privacy` | Privacy policy |

`/creators` redirects to `/become-a-creator`. **`/services` is temporarily off
the site** — see below.

### Services, temporarily off the site

Taken down on 5 October 2026, at the client's request, without deleting any of
the work. `src/pages/services.astro` was renamed **`src/pages/_services.astro`**:
Astro ignores any file in `src/pages/` whose name starts with an underscore, so
the route does not build, is not in the sitemap, and 404s on the site's own 404
page. The page, its data, its components and its images are all still here.

Four links were taken out with it. **To restore the page, rename the file back
and put these back:**

| Where | What |
|---|---|
| `src/consts.ts`, `NAV_LINKS` | `{ label: 'Services', href: '/services/' }`, after About |
| `src/components/Footer.astro`, `pages` | the same entry, after Home |
| `src/pages/index.astro`, the hero | the first button pointed at `/services/`; it points at `CONTACT_PATH` now |
| `src/pages/index.astro`, the services section | a "see all services" link under the accordion |

Each is marked with a comment naming this file. The accordion on the home page
reads the same `src/data/services.ts`, so the service copy stays live and in one
place while the page is down.

Two things to check when it comes back: the "Services invoice" photograph at the
top of the page still lists the old five services, including Affiliate
Marketing, and `src/data/media.ts` still imports two pictures that only that
page renders, so they ship on every build while it is off.

## Project structure

```
src/
  consts.ts              Site-wide constants: email, nav, socials, positioning,
                         tagline, region label, hero video path
  data/clients.ts        Client manifest: logo, site, clearance, optical sizing
  data/services.ts       The six practice areas, read by both accordions; the
                         sectors and results (kept, not rendered)
  data/tiles.ts          Creator videos: tiles 1–4 play behind the home figures
  data/media.ts          Every image and video slot, by page
  data/countries.ts      Country codes for the application's country field
  lib/media.ts           Build-time checks for files in public/
  assets/
    amavi-socials-logo.png   The supplied logo — favicon and share image only
    logos/                   Client logos, solid black on transparent
  layouts/Base.astro     <head>, header, footer — every page uses this
  components/            Nav (header and menu), Connect (the closing
                         invitation), Footer, Hero, Feature, Numbers,
                         ServiceList (the practice areas, on both pages),
                         LoopVideo, Placeholder, ProofLink, LogoWall,
                         ContactPaths, the creator form, Logo, Lines, Frame,
                         Fonts. ServicesSlider is kept but unused: the home
                         page's carousel became the accordion on 5 Oct 2026
  scripts/lib/motion.ts    One prefers-reduced-motion query, shared
  scripts/loop-videos.ts   Lazy, visible-only playback for every video
  scripts/service-accordions.ts  Every practice-area accordion, opening in place
  scripts/services-slider.ts  Unused, with its component
  scripts/country-combobox.ts  The country field, as a combobox you type into
  scripts/creator-form.ts  The application's steps, validation and submission
  pages/                 One file per route. A leading underscore takes a file
                         out of routing: _services.astro is off the site
  styles/global.css      Tokens and the shared styles
scripts/brand-assets.mjs Generates the favicon and share image
scripts/logos-mono.mjs   Converts client logos to solid black
scripts/encode-video.swift  Encodes video files (macOS; see "Making the video files")
scripts/google-sheets-handler.gs  The Apps Script that writes applications to
                         a Google Sheet (see "Creator applications → Google Sheets")
public/                  favicon, share image, robots.txt
public/media/            The hero's video and poster, desktop and portrait;
                         tiles/ holds the creator videos
public/fonts/            ALT Rigatoni goes here once licensed (see Typefaces)
.env.example             The one environment variable, PUBLIC_SHEETS_ENDPOINT
```

---

## Where AMAVI works

The standalone region label is **`REGION` in `src/consts.ts`**, and it reads
**"Europe & ROW"** since 5 October 2026 (it was "Ireland & EU"). It is the
label used wherever the reach is simply stated: the footer under the wordmark,
the privacy policy, the home page's title and its Organization schema.

Prose that names countries for a reason is **not** this label and was left
alone: "brands across Europe" on /about, "1,000+ creators in our network across
Europe" and "Working with brands across Ireland, UK, Netherlands, France,
Germany and the Balkans" on the home page.

---

## Brand

### Colour

White backgrounds, black text, black hairline rules, `#341BCA` for accents
and highlights, and a black footer. Six colours, defined once in
`src/styles/global.css`, and — with the section divider's two translucent
shades below — the only colour values anywhere in the codebase:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Every background. No tinted, grey or alternating sections |
| `--ink` | `#000000` | All text |
| `--line` | `#000000` | Every rule, divider, border, field outline and table line |
| `--accent` | `#341BCA` | Accents and highlights: the logo, links, button fills and outlines, hover and pressed states, focus rings, the hero's full stops, area and step numbers, the application's progress bar — wherever musetheagency.com uses its red |
| `--surface-dark` | `#000000` | The footer, and the flat overlay under text on video |
| `--on-dark` | `#FFFFFF` | Text, links, outlines and focus rings on black and on video |
| `--divider-line` | `rgb(0 0 0 / 0.06)`, and `rgb(255 255 255 / 0.10)` under `.surface-dark` | The few lines left between sections |

**The exceptions to white** are the footer (full bleed, edge to edge), the
"Our philosophy" band on /about — white over a photograph under a black
shade at 0.72, where white holds 9.2:1 on the lightest pixel in the picture —
and text set over video, which sits on a flat black overlay (the hero and the
stat tiles). There are no tints, gradients or shadows beyond
those overlays and the drawing's own line opacities, and one grey: the line
between sections, below.

**Separation without colour.** Depth comes from line weight, type scale and
space. Where a section used to sit on a tint, it takes `.section--ruled`, and
room above and below (`--section-y`, set at 70% of its original value on 28
September 2026, with `.section--tight` cut to match).

**Sections divide by space, not by lines** (30 September 2026). `.section--ruled`
is now the exception: one boundary on the home page, two on About, one on
Services, none anywhere else — kept only where two white sections of similar
shape meet and would otherwise run together. Where it does appear it is a 1px
line in `--divider-line`, barely there, across the container's content box at
the top of the section: `.section--ruled::before` rather than a border, so it
stops where the words do and a screen reader never meets it, and inside
`.surface-dark` the same property gives it a translucent white.

Rules inside content went the same way. The stat lines, the approach items,
the service sub-services, the value grid, the contact routes and the privacy
lead all separate on space now; each list's gap grew to carry the separation.
What keeps its rules: **the collapsed accordion rows on Services**, which are
the clickable rows themselves, and field, button and card borders.

**Two-column gaps** came down by a third on 30 September 2026 — 96px to 64px
between the columns of every split, and 40px to 24px between a label and its
line — so the two halves read as one block. The rows of sub-services split
into two columns at 80em rather than 64em: beside a picture, a 64em panel left
the description about 34 characters wide.

| Token | Value | Use |
|---|---|---|
| `--stroke` | 1px | Borders, field outlines, rules |
| `--stroke-hair` | 1px, 0.5px on dense screens | Section and row dividers |
| `--stroke-mark` | 2px | Accent marks only: focus ring, active nav |

**`.row-label`** in `global.css` is the one rule behind the label in every
two-column row — the approach items, the service sub-services, the value grid:
12px capitals at 700, which three components used to declare separately.

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
| White on the hero video | ≥ 4.7:1 | Every pixel behind the headline, intro and buttons, over the 0.55 black overlay (measured every 0.4s through both cuts) |
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

### Copy

**No em dashes.** Not anywhere the reader sees: page copy, form labels and
hints, option lists, error and confirmation text, `aria-label`s. A comma, a
colon or a full stop instead, whichever the sentence wants. Code comments and
this file are not copy. To check a build:

```bash
grep -rl "—" dist --include="*.html"
```

**Mind the space before an inline tag.** Astro trims the newline between text
and an element, the way JSX does, so a paragraph broken like this renders
`with25`:

```astro
<p>
  ... partnerships with
  <strong>25 active partnerships</strong>.
</p>
```

End the line with `{' '}`, or keep the opening tag on the same line. To check a
build for the whole class of it:

```bash
grep -rnoE '[^[:space:]>]<(strong|em|b|i|a)[ >]' dist --include="*.html"
```

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

1. **About you** — name, email, country (a select of every country, each with
   its flag — `src/data/countries.ts`)
2. **Your channels** — Instagram, TikTok, YouTube, other
3. **Your audience** — follower range (`TODO(client)`: tiers to be supplied),
   engagement rate, audience insights
4. **Your content** — niches, content formats
5. **Rates** — collaboration preference, then (only for Paid or Both) rates
   per format and currency, plus rate notes, past collaborations, media kit
   link
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
- **Handles are stored bare.** Instagram and TikTok carry a fixed "@" inside
  the field, so a typed one is stripped as it's typed and a pasted profile
  link is cut back to the handle when the field is left. The sheet gets
  `jane`, not `@jane` or a URL. The media kit link is still normalised to a
  full URL, and anything that isn't a link is flagged as typed, never
  rewritten.
- **Rates follow the answer above them.** Gifted hides them and empties
  anything typed, so a hidden field can never block the step or reach the
  sheet; Paid and Both show them and ask for at least one.
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

**Only the Apps Script's reply decides what the applicant sees.** The button
reads "Send application", then "Sending…" (disabled, so it can't be sent
twice), then "Sent" — and the confirmation appears only after
`{"success":true}`. A refusal, a non-2xx, a dropped connection or the
20-second timeout all show the error state instead, with everything typed
still in place:

> We couldn't submit your application. Please try again in a moment — or email
> your details to partnerships@amavisocials.com.

(`APPLICATIONS_EMAIL` in `src/consts.ts`.) The backup copy to Netlify is sent
alongside and its outcome is only logged — otherwise a page served from
anywhere but Netlify would "confirm" an application that never arrived.

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
- **Size.** `--logo-base` in `LogoWall.astro` sets the height and `--logo-cap`
  the widest any mark may run. Both are set so no client logo is taller or
  wider than the AMAVI wordmark in the header (79×55 at every width): today
  the tallest renders 46px and the widest 76px.

**Two sets.** The home page runs the logos **solid black on transparent**
(`src/assets/logos/`); /services runs the **full-colour originals**
(`src/assets/logos/colour/`), each on a white chip with the same padding and
radius, which is what lets a set supplied on white, cream and navy sit
together in one row. `<LogoWall colour />` picks the colour file, falls back
to the black one where there is no colour version, and takes its optical
nudge from `colourScale` rather than `scale`: a mark that is a filled block in
colour carries far more ink than its black cut-out.

The colour set was reassembled on 30 September 2026, after the mono
conversion had overwritten the originals in place: six came back out of git
(`a7c66c1`, and `f4bf291` for The Humble Fishmonger), Le Olive and Pearls Co.
from the supplied files, each trimmed to its own artwork. **Line 98 has no
colour original anywhere** — it was cut from a square social image before the
conversion — so the colour row shows its black wordmark until the file is
supplied.

The black set was converted in place by:

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
- **Hero** (`Hero.astro`). Full screen and **centred**: the headline, the
  subline, one line of positioning and the two buttons share one axis down the
  middle, over video. The subline is the words of `subline` divided by an
  accent rule — "Brands | Creators" on the home page, which labels the two
  buttons under it. It can also take a line of services under the buttons and
  large entry points beneath; the home page uses neither.

  Centring the copy moved it onto the engraved wordmark in the footage, so the
  overlay was re-measured there rather than assumed: over the whole copy block,
  every frame of both cuts, white holds **4.84:1** on the desktop cut and
  **10.6:1** on the portrait one at the current 0.55. Re-measure if the footage
  or the copy's position changes.
- **Feature blocks** (`Feature.astro`). One text column beside one portrait
  piece of media, alternating sides. Key phrases in the body copy are bold;
  each block ends on a **proof line** (`ProofLink.astro`) — a short claim in
  capitals with a chevron — linking to Services.
- **The figures** (`Numbers.astro`). A split: a collage of creator work on one
  side, the figures on the other, each written as a sentence with its number
  leading the line and a rule between. The collage is a slow vertical loop, in
  CSS alone: two sub-columns, one climbing and one falling, each holding its
  tiles twice and travelling exactly one set's height, so the join can't be
  seen. Top and bottom are masked. It pauses on hover and on focus, runs
  slower at 48em, and on a phone doesn't run at all — the tiles become a row
  that scrolls sideways. Under `prefers-reduced-motion` nothing moves.
- **The services** (`ServiceList.astro`). The same numbered accordion the
  services page uses, 01 to 06 with a hairline between the rows, opening on
  each service's paragraph alone. See "The areas are an accordion" below. It
  replaced a paged carousel on 5 October 2026; `ServicesSlider.astro` and its
  script are still in the repo, unused.
- **Partners marquee** (`LogoWall.astro`). On the home page it sits directly
  under the hero, logos only, with no heading of its own. The "Trusted by"
  label, the logos and the statement beneath them are one group: the space
  inside it is about half a section's, taken off the head's own padding, the
  marquee's and the two sections' (`.partners` and `.what` in
  `src/pages/index.astro`), not off a negative margin.
- **The closing invitation** (`Connect.astro`). The last section on /about,
  and the one that closes the practice areas on /services: the label, "Who are
  **YOU** trying to reach?" with a circle drawn around YOU, and **Bring Us In**,
  which leads to Get in touch. It is a component rather than part of the
  layout, so putting it at the end of another page is one line on that page.

  The circle is a stroked path stretched to whatever that word measures, so it
  stays around it at every size and in either display face, and its stroke
  stays even because it doesn't scale with the box. The word never breaks, so
  the ring sits on it however the line wraps.

  It **draws itself on** when the section first reaches the screen, and then
  stops watching: a mark being made, not an effect that repeats. The circle is
  complete in the markup and nothing takes it away until the observer has
  actually reported, so no IntersectionObserver, a renderer holding callbacks
  back, or a script that failed to load each leaves the finished circle rather
  than none at all. `prefers-reduced-motion` leaves it finished too.

  The pill and the round arrow beside it are one link, not two — one tab stop,
  one destination — and they fill and empty together, the arrow nudging right
  on hover.
- **Footer** (`Footer.astro`). Full-bleed black: edge to edge and down to the
  bottom of the page, its own padding holding the content off the edges. The
  same on every page — no props, no per-page variants: the wordmark, the region
  label under it, then three columns (**Site**, **Contact**, **Follow**) and the
  small print. No dividing rules, and no closing call to action: each page ends
  on its own last section.

  Changed on 5 October 2026: the wordmark came **two steps down the type
  scale** (`.wordmark--lg`, every stop of the clamp divided by 1.25²) so it
  closes the page rather than announcing it; the tagline lockup became the
  region label **Europe & ROW**; and the Contact column became two labelled
  addresses, **Brands** to `CONTACT_EMAIL` and **Talent** to
  `APPLICATIONS_EMAIL`, each label set like the column headings.

### Placeholders

Wherever an image or a video is missing, the page shows an outlined frame at
the exact aspect ratio the real media will take, with **"Add image"** or
**"Add video"** in the middle (`Placeholder.astro`). Swapping in the real file
moves nothing else on the page. Every slot is filled with temporary media
(see Visual content).

## Services

The copy lives in **`src/data/services.ts`**, read by two pages:

- **Six practice areas**, each a title and one paragraph, plus the sub-services
  it covers as a name and a line each. The list went from five to six on 5
  October 2026: Affiliate Marketing came off, Founder & Personal Brand and
  Mobile First Organic Content came on, and Influencer & Creator Campaigns was
  renamed Creator-Led Campaigns. The same change merged each area's italic
  summary line and its intro paragraph into the one `description` the panel
  opens on.
- Those two new areas have **no sub-services yet** (`TODO(client)`), so their
  panels open on the paragraph alone.
- **Six sectors** (`SECTORS`) and **results** (`CASE_STUDIES`) are still
  there but **not rendered**. The Results section came off the page on 28
  September 2026; the sectors, with their images, came off on 30 September,
  replaced by "Why AMAVI" in the same position. Both are ready if either
  section returns, and their images are still keyed by sector name in
  `src/data/media.ts`.

Add, reorder or edit entries and both lists lay themselves out. The "Why AMAVI"
four points are in `src/pages/_services.astro` itself.

### The areas are an accordion

**`src/components/ServiceList.astro`**, the same component on both pages: the
numbered list is both an index and its content, and a row opens in place to the
area's number, title and paragraph. One at a time; opening one closes the rest.

- `/services` passes `media` and gets the full panel: the paragraph, the
  services the area covers, and a picture beside them.
- The **home page** passes `detail={false}` and gets the paragraph alone, with
  no sub-services and no pictures. It also passes `level={3}`, because its rows
  sit under the section's own `<h2>`.
- Each trigger is a `<button>` inside its heading, with `aria-expanded` and
  `aria-controls`; each panel is a `role="region"` labelled by its trigger.
  Enter and Space toggle, Tab moves between the triggers.
- A closed panel is `inert`, so nothing inside it is focusable or read out.
- It opens by animating `grid-template-rows` from `0fr` to `1fr`, and holds
  still under `prefers-reduced-motion`.
- **Without JavaScript every panel stays open.** The collapsing CSS only
  applies once `src/scripts/service-accordions.ts` marks a list ready, so a
  failed script leaves the page readable rather than sealed shut. The script
  drives every `[data-accordion]` on the page, each independently.
- Each row keeps its own id, so `/services/#creator-campaigns` opens that area
  and scrolls to it — on load and on a later hash change. The ids changed with
  the practice areas on 29 September 2026; `#creator-campaigns` survived the
  renaming of 5 October, and `#affiliate-marketing` no longer exists.

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

  **Now:** AMAVI's own logo sting — the wordmark cut into brushed metal, on
  a slow push in. The desktop cut is the whole 16:9 frame. The mobile cut is
  a 9:16 crop of the same clip, taken left of the wordmark: a portrait crop
  keeps a third of a 16:9 frame's width, a phone shows about four fifths of
  that, and the wordmark is half the frame — so on phones the hero is the
  brushed plate on its own, rather than the wordmark cut in two. Both have a
  crossfade where they loop. The footage fills the screen edge to edge, the
  text is white over a flat black overlay (0.55 in `Hero.astro` — measured on
  this footage, white holds 4.7:1 or better), and the header sits over it. To replace it, drop new files in under these names —
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
| `hero.mp4` | `2.mp4` (the logo sting) | `--size 1920x1080 --bitrate 3000000 --fade 24` |
| `hero-portrait.mp4` | the same | `--size 1080x1920 --crop 400,0,1215,2160 --bitrate 1500000 --fade 24` |
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
  logo sting holds the place for now; there is no 9:16 export of it, so on
  phones the hero shows the brushed plate without the wordmark. A vertical
  export would replace the mobile cut. See Visual content.
- **Final media for every slot.** All are temporary fills for now, four of
  them from clips with stock-library names. See `src/data/media.ts`.
- **Creator handles and consent** for the creator videos, in
  `src/data/tiles.ts`.
- **The home page's 100+ and 1,000+.** Two of the three figures in "The
  numbers behind the work" since 29 September 2026, promoted from a line
  under the list. "100+ partnerships delivered" is ahead of the brief's 61
  all-time; "1,000+ creators" sits under its 1,100 sourced April–August 2026.
  Confirm both. Marked `TODO(client)` in `src/pages/index.astro`.
- **The home page's 92%.** The brief lists "92% net-new audience reach" but
  not how it is measured, and the home stats are the only place it appears.
  Confirm what it measures, or drop the figure.
- **The home page's proof lines.** "49 partnerships delivered against a target
  of 40" and "See how we work" used to link to sections on Services that have
  since been removed; both now go to the page itself. Marked `TODO(client)` in
  `src/pages/index.astro`.
- **Line 98's logo in colour.** Every other client logo has a colour original
  for the row on /services; Line 98's was lost to the mono conversion, so that
  row shows its black wordmark. See Client logos.
- **TikTok link** for the footer (`SOCIALS` in `src/consts.ts`).
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
