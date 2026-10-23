# Adding an AMAVI Culture piece

Every post here is a **preview**, not the whole article. The markdown holds the
opening few paragraphs, the last of them fades into the page, and the reader is
sent to Substack to finish it. Adding a file adds the post to the index at
`/culture/`, to its own page, to the RSS feed and to the sitemap. No route is
registered by hand.

## The steps

1. Copy an existing file in this folder and rename it. **The filename is the
   URL**: `why-fashion-month-still-matters.md` becomes
   `/culture/why-fashion-month-still-matters/`, so use lower case, hyphens and
   no dates in the name.
2. Change the frontmatter, including `substackUrl`.
3. Paste the **opening few paragraphs only** as the body. Three or four is
   usually right: enough that the piece has started, not so much that there is
   no reason to follow the link.
4. Commit and push. Netlify rebuilds on the push.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Sentence case. Set in capitals by the page |
| `subtitle` | no | The standing line under the title on the post page |
| `excerpt` | yes | One sentence. The index row shows it **on one line, truncated**, and it is the meta description, so put the point first |
| `date` | yes | `2026-10-08`. Decides the order of the index |
| `readingTime` | no | Minutes, a whole number. Left out, the row simply has no time |
| `tags` | no | Lower case, used in the feed only |
| `substackUrl` | yes in practice | The full piece. It carries the canonical link, so Substack is treated as the original. **Without it the page has no button**, only a line saying the piece is not published yet |
| `image` | no | A cover, e.g. `"/media/culture/name.jpg"`, with the file in `public/media/culture/`. Shown under the title on the post page, never in the index |
| `draft` | no | `true` keeps it out of the index, the feed and the build entirely |

## Pictures in a piece

Images go in `public/media/culture/` and are referenced by absolute path. The
stylesheet already gives every image in the body the site's radius, lazy
loading and the full content measure, so plain markdown is enough:

```markdown
![A black Mercedes in Paris Fashion Week livery outside the Palais Garnier at dusk](/media/culture/name.jpg)
```

Set `width` and `height` on the tag so nothing shifts as it loads:

```html
<img src="/media/culture/name.jpg" width="1320" height="1760" loading="lazy"
     decoding="async" alt="...">
```

**A two-up pair** — side by side from 48em, stacked below it, equal height:

```html
<div class="post-pair">
  <img src="/media/culture/one.jpg" width="1240" height="1654" loading="lazy" decoding="async" alt="...">
  <img src="/media/culture/two.jpg" width="1280" height="1920" loading="lazy" decoding="async" alt="...">
</div>
```

**A credit** under a picture, in the site's footnote style:

```html
<p class="post-credit">Image: not owned by AMAVI Socials. All rights remain with the original photographer.</p>
```

`figure` and `figcaption` work too and take the same caption styling.

## The first piece

`why-fashion-month-still-matters.md` has its preview copy and its two
pictures, both supplied on 23 October 2026. The band above the title comes
from `heroImages` in the frontmatter.

**TODO(client): the real photographer or agency credit.** One line currently
covers the band (`IMAGE_CREDIT` in `src/pages/culture/[...slug].astro`).
Replace it with the actual credit per picture once it is known.

## Checking it

```bash
npm run dev
```

Then open <http://localhost:4321/culture/>.

The index shows the **twelve most recent** pieces with a "Load more" button
beneath for the rest. The rows are deliberately tight so six to eight fit in a
viewport: if a row looks tall, the excerpt is probably wrapping, which it
should never do.
