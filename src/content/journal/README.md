# Adding a journal post

One post is one markdown file in this folder. Adding a file adds the post: to
the journal listing, to its own page, to the RSS feed and to the sitemap.
**There is no code to change.**

## How to add one

1. Copy an existing post in this folder and give the copy a new filename.
   **The filename is the web address.** `why-fashion-month-still-matters.md`
   becomes `/journal/why-fashion-month-still-matters/`, so use lower case,
   words separated by hyphens, and no spaces, accents or capitals.
2. Change the frontmatter — everything between the two `---` lines at the top.
3. Write the post underneath it.
4. Commit and push. The site rebuilds and the post is live.

This README is ignored: it is instructions, not a post.

## The frontmatter

| Field | Needed | What it is |
|---|---|---|
| `title` | yes | The headline, in quotes |
| `subtitle` | no | The standing line beneath the title. It shows on the listing row and under the title on the post, one step up from body text. Leave it out and neither shows one |
| `excerpt` | yes | One or two sentences. It is the line at the foot of the listing row and the page's meta description, so write it to read as both |
| `date` | yes | `2026-10-08`. Posts are ordered newest first, everywhere |
| `readingTime` | no | A whole number of minutes. Left out, the row simply has no reading time |
| `tags` | no | `["Fashion", "Culture"]` |
| `image` | no | A cover, e.g. `"/media/journal/name.jpg"`, with the file in `public/media/journal/`. It is **not** shown in the listing row: it fades in beside the cursor when someone hovers the row, and sits under the title on the post itself |
| `substackUrl` | no | Where the piece first appeared. Setting it adds a line at the foot of the post and points the page's canonical link at Substack, so search engines treat Substack as the original and the two copies do not compete |
| `draft` | no | `true` keeps the post out of the listing, the feed, the sitemap and the build entirely. It has no page at all until you remove it |

A field that is not needed can simply be left out of the file.

## Writing the body

Plain markdown.

- `## A heading` is a section heading. They are set large, with a lot of room
  above them, so sections announce themselves.
- `### A heading` is a smaller sub-head, set in the small capitals the rest of
  the site uses for labels.
- `**bold**` for emphasis, `[text](https://example.com)` for a link.
- `> A quotation` is set larger than the words around it, with a rule down its
  left edge.
- `---` on its own line draws a thin rule. Use it sparingly, where the piece
  changes direction.
- Blank lines separate paragraphs. **Single-line paragraphs are fine**: the
  page gives consecutive short lines room to breathe rather than letting them
  stack into a block, so write the rhythm you want and it will hold.

Do not repeat the `subtitle` as the first paragraph. The page already sets it
beneath the title.

## Checking it before you push

```bash
npm run dev
```

Then open <http://localhost:4321/journal/>.
