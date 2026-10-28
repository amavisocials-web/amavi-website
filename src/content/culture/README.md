# Adding an AMAVI Culture piece

Every piece is read **on Substack**. The site has no article pages: each post
here is a row in the listing at `/culture/`, and the row opens the piece on
Substack in a new tab. Adding a file adds the row and an item in the RSS feed.
No route is registered by hand.

**A post is frontmatter only.** Nothing goes under the closing `---`: there
is no page to show it on.

## The steps

1. Publish the piece on Substack and copy its address.
2. Copy `why-fashion-month-still-matters.md` in this folder and rename it.
   Lower case and hyphens, e.g. `the-new-front-row.md`. The name is not shown
   anywhere, it only has to be unique.
3. Put the thumbnail picture in this folder too (see below).
4. Change the frontmatter.
5. Commit and push. Netlify rebuilds on the push.

## Frontmatter

```yaml
---
title: "The New Front Row"
excerpt: "One sentence on what the piece is about."
date: 2026-11-06
readingTime: 6
image: "./the-new-front-row.jpg"
imageCredit: "Image: not owned by AMAVI Socials."
substackUrl: "https://amavisocials.substack.com/p/the-new-front-row"
---
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Sentence case. Set in capitals by the page |
| `excerpt` | yes | One sentence. The row shows **up to two lines** of it and cuts the rest, so put the point first. Also the feed's description |
| `date` | yes | `2026-10-08`. Decides the order of the listing, newest first |
| `readingTime` | no | Minutes, a whole number. Shown as "7 min read". Left out, the row simply has no time |
| `substackUrl` | **yes** | The full `https://` address of the piece on Substack. The build stops if it is missing, because the row would have nowhere to go |
| `image` | no | The thumbnail, as `"./name.jpg"` with the file in this folder. Left out, the row is text only |
| `imageCredit` | no | Small print under the thumbnail, e.g. `"Image: not owned by AMAVI Socials."` |
| `imageCrop` | no | Which part of the picture the thumbnail keeps: `top` (the default), `center`, `bottom`, `left` or `right` |
| `tags` | no | e.g. `["Fashion", "Culture"]`. Used in the feed only |
| `draft` | no | `true` keeps it out of the listing and the feed |

## The thumbnail

- **Landscape, 4:3.** The site cuts every picture to 4:3 itself, so any
  photograph works, portrait or landscape. It keeps the **top** of a portrait
  picture, which is where faces usually are. If the cut loses what matters,
  set `imageCrop` (e.g. `imageCrop: "center"`) and look again.
- **At least 1080 pixels wide.** On a phone the thumbnail runs the full
  width of the screen. The site makes the smaller sizes itself, so the
  original can be any size above that.
- **JPEG, in this folder**, named after the post: `the-new-front-row.jpg`
  next to `the-new-front-row.md`.
- A picture AMAVI does not own needs `imageCredit`.

`front-row.jpg` is the thumbnail of "Why Fashion Month Still Matters".
Two more pictures from that piece are kept here and used by nothing at the
moment: `show-arrival.jpg` (supplied 23 October 2026) and
`opera-mercedes.jpg`, a Mercedes in Paris Fashion Week livery outside the
Palais Garnier (supplied 28 October 2026). To swap one in, change the post's
`image`, e.g. to `"./opera-mercedes.jpg"`.

**TODO(client): the real photographer or agency credit** for the fashion
pictures, once it is known. It goes in `imageCredit` in
`why-fashion-month-still-matters.md`.

## Checking it

```bash
npm run dev
```

Then open <http://localhost:4321/culture/>. The new row should be at the top,
with its thumbnail, and clicking it should open the piece on Substack in a new
tab.

The listing shows the **twelve most recent** pieces with a "Load more" button
beneath for the rest.
