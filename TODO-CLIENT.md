# TODO(client) — everything the site is waiting on

Generated 23 October 2026. **33 markers across 15 files.** Each one is a point
where the site is running on a placeholder, a guess, or the live form's old
values, and needs something only you can supply.

Nothing here blocks a build. Everything here is visible to a visitor or carries
a legal or factual risk, so it is worth clearing before the site goes public.

Regenerate this list any time with:

```bash
grep -rn "TODO(client)" src
```

---

## Blocking a public launch

These are the ones that are a problem the moment the site is live.

| # | File | Waiting on |
|---|---|---|
| 1 | `src/pages/_privacy.astro:66` | **Registered legal entity name, company registration number and registered address.** A published privacy policy needs all three. The page is **off the site since 27 October 2026** until these arrive; see the README. |
| 2 | `src/pages/_privacy.astro:139` | Confirm the applications spreadsheet and the notification mailbox live in AMAVI's **Google Workspace**, not a personal Google account. Name any CRM or database applications later move to. |
| 3 | `src/pages/_privacy.astro:149` | If an analytics tool, CRM or email platform is added, it must be listed. Any transfer outside the EEA must be named with its safeguard. |
| 4 | `src/pages/_privacy.astro:117` | Optional: a fixed retention period, e.g. reviewing creator records every 24 months. |
| 5 | `src/pages/_privacy.astro:160` | Analytics not added yet. **GA4 sets cookies and would legally require a consent banner before it loads.** Plausible is cookieless and would not. |
| 6 | `src/layouts/Base.astro:55` | Which analytics: GA4 or Plausible. See above — the choice changes whether a consent banner is required. |
| 7 | `src/pages/index.astro:33` | **"100+ partnerships delivered" is ahead of the brief**, which has 61 all-time. "1,000+" sits under its 1,100 creators sourced, so that one holds. Confirm the current counts before publishing either. |
| 8 | `src/pages/index.astro:111` | The case study's **healthcare partner is unnamed** and its three figures are the client's own wording. Confirm the partner may be named and the figures may be published as they stand. |
| 9 | `src/data/tiles.ts:39` | **Creator handle and consent for every collage tile.** `credit` stays empty and nothing shows under a tile until the creator's handle is supplied and both creator and client have signed off. |
| 10 | `src/pages/culture/[...slug].astro:36` | **Real photographer or agency credit** for the two article pictures. One generic line currently covers both. |

## Email and contact

| # | File | Waiting on |
|---|---|---|
| 11 | `src/consts.ts:88` | Confirm **partnerships@amavisocials.com** exists as a Workspace user or alias and is monitored. The domain has Google Workspace MX records, but an address never created will bounce. Set in two places: here and `NOTIFY_EMAIL` in `scripts/google-sheets-handler.gs`. |
| 12 | `src/consts.ts:77` | The **live creator form still points at hello@amavi.social**, a domain with no DNS at all — mail to it bounces. Worth fixing on that form independently of this site. |
| 13 | `src/consts.ts:126` | Confirm the response-time commitment: "We reply to every enquiry within two working days." |
| 14 | `src/components/BrandEnquiry.astro:18` | **No automatic reply reaches the enquirer.** Netlify notifies AMAVI only, so the two working days promised beside the form is a person's job. Hooks in at the success branch in `src/scripts/brand-enquiry.ts`. Needs an email provider and a sending domain. |
| 15 | `src/components/BrandEnquiry.astro:95` | Phone number, if one should be listed under EMAIL US. |
| 16 | `src/components/Subscribe.astro:16` | **Where AMAVI Culture subscribers should end up.** Netlify Forms is holding them; `ENDPOINT` is the single line to change to point at Mailchimp, Substack or anything else. Exportable from the Netlify UI meanwhile. |
| 17 | `src/consts.ts:121` | **TikTok link.** TikTok is named in the footer copy but no account URL was supplied. |
| 18 | `src/consts.ts:109` | Export anything the **old Vercel form** collected before DNS moves, or those records stay behind with the old app. |

## Content and media

| # | File | Waiting on |
|---|---|---|
| 19 | `src/data/tiles.ts:17` | **Five more collage clips.** Two columns of five is ten slots against five clips, so one column runs three tiles and the other two — no repeats, but short of five a column. Portrait 9:16 please; tile 7 arrived landscape and had to be cropped to a third of its frame. |
| 20 | `src/consts.ts:54` | **Final hero footage.** Silent, 10–20s, loopable; H.264 MP4 plus WebM under ~5MB each, with a JPEG poster from each cut's first frame. Keep the filenames and no code changes are needed. |
| 21 | `src/data/media.ts:24` | **Temporary image fills throughout**, "until further notice" — each slot holds whatever was supplied on 21 September 2026, cropped to the slot's ratio. |
| 22 | `src/data/media.ts:93` | Nothing supplied suits **Founder & Personal Brand** or **Mobile First Organic Content**, so both open on their paragraph alone. |
| 23 | `src/data/media.ts:102` | Nothing supplied suits **Tech & Startups** without repeating a picture already on the page, so it shows "Add image". |
| 24 | `src/data/services.ts:114` | **Sub-services for one practice area.** The panel opens on its paragraph alone until they arrive. |
| 25 | `src/data/services.ts:137` | Sub-services for a second practice area, same as above. |
| 26 | `src/data/services.ts:187` | **A measured outcome** for one service; currently "New routes to the audience, beyond social media." |
| 27 | `src/components/CreatorForm.astro:35` | **Follower tier bands.** These are the live form's existing bands, left in place so the step works until the new ones arrive. |
| 28 | `src/content/culture/README.md` | The real photographer credit for the article pictures (same as #10). |
| 29 | `src/pages/about.astro:52` | A different photograph may be wanted for the About hero. If it changes, **re-measure the left edge** — `#222021` over the current one runs 1.87:1 on its darkest grain to 15.53:1 on the highlight, and the mask is what keeps the words readable. |

## Build-time warnings, not markers

These print to the console during a build when a file is missing, rather than
sitting in the source as a note.

| # | File | Behaviour |
|---|---|---|
| 30 | `src/components/Hero.astro:75` | Warns which hero video cut is missing and shows an "Add video" frame for that orientation. |
| 31 | `src/components/LoopVideo.astro:39` | Warns which looping video is missing and shows "Add video" at the same ratio. |

---

## Cleared on 23 October 2026

Recorded so nobody goes looking for them:

- **Team name-to-face matching** (`src/data/team.ts`) — you confirmed all four,
  and Elda and Venera's photographs were swapped to match.
- **The contact photograph** — supplied, so the grey placeholder is gone.
- **The Culture preview copy** — your five paragraphs are in, with both
  pictures as the band above the title.

## Not a TODO, but needs you

- **The deployed Netlify site is still serving an old build.** None of this
  session's work is live. Redeploying needs your login, so it has not been
  touched.
- **Nothing is committed.** All 43 changed files are working-tree only.
