/**
 * Generates the favicon and the Open Graph share image from the supplied
 * logo (src/assets/amavi-socials-logo.png). That PNG is used for these two
 * things only — the header wordmark is live text (src/components/Logo.astro).
 *
 *   npm run brand:assets
 *
 * Re-run it whenever the logo file changes.
 */
import sharp from 'sharp';

const SRC = 'src/assets/amavi-socials-logo.png';
const src = sharp(SRC);
const { width, height } = await src.metadata();

// The avatar's background is a flat colour; read it rather than hard-code it,
// so the share image's padding always matches the file exactly.
const data = await sharp(SRC).removeAlpha().extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
const bg = { r: data[0], g: data[1], b: data[2] };

// Favicons: the avatar as-is, downscaled.
await sharp(SRC).resize(32, 32, { kernel: 'lanczos3' }).png().toFile('public/favicon-32.png');
await sharp(SRC).resize(180, 180, { kernel: 'lanczos3' }).png().toFile('public/apple-touch-icon.png');

// Share image: 1200×630, the size social platforms want for a large preview.
// The avatar is composited 1:1 — never upscaled, which is what would make it
// soft — onto a canvas of its own background, positioned so the wordmark
// (not the square) is centred. Its ink box was measured at x 206–375, y 196–299.
const OG = { w: 1200, h: 630 };
const ink = { cx: (206 + 375) / 2, cy: (196 + 299) / 2 };
const left = Math.round(OG.w / 2 - ink.cx);
const top = Math.round(OG.h / 2 - ink.cy);
if (left < 0 || top < 0 || left + width > OG.w || top + height > OG.h) throw new Error('logo does not fit the share canvas');
await sharp({ create: { width: OG.w, height: OG.h, channels: 3, background: bg } })
  .composite([{ input: SRC, left, top }])
  .png()
  .toFile('public/og.png');

console.log(`brand assets from ${SRC} (${width}×${height}, background rgb(${bg.r} ${bg.g} ${bg.b})):`);
console.log('  public/favicon-32.png, public/apple-touch-icon.png, public/og.png (1200×630)');
