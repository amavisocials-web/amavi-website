/**
 * Converts every client logo to solid black (#000000) on transparent.
 *
 *   npm run logos:mono
 *
 * A CSS filter can't do this: brightness(0) blacks out every opaque pixel,
 * including the white shapes inside a logo — the ADHD Now roundel's centre,
 * the Cleaning Doctor disc, the knocked-out "IRELAND BOX" lettering — and
 * turns them into solid blobs. Instead each pixel's ink is read from its
 * luminance, so artwork becomes black and light interiors become transparent,
 * with anti-aliased edges kept.
 *
 * Mode is detected per file:
 *   dark-on-light  corners transparent (the cut logos): dark = ink
 *   light-on-dark  corners an opaque dark field (The Humble Fishmonger's
 *                  navy): light artwork = ink, the field is dropped
 *
 * Safe to re-run: a logo that is already black converts to itself. Each file
 * is trimmed to its new ink afterwards, so optical sizing (src/logos.ts) sees
 * the artwork that actually shows.
 */
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// A narrow cut, chosen from each logo's measured histogram so that nothing
// renders grey: the lightest artwork (My Ireland Box's green gradient) tops
// out at 0.78 and becomes solid black; Fettle's brushstroke starts at 0.88
// and every white interior sits at 0.95+, so all of them clear completely.
// Only genuinely anti-aliased edge pixels land inside the 0.85–0.87 band.
const DARK_ON_LIGHT = { full: 0.85, none: 0.87 };
const LIGHT_ON_DARK = { none: 0.15, full: 0.30 };

const lum = (d, i) => (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

async function convert(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const corner = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
  const inverted = corner.every((i) => data[i + 3] > 200 && lum(data, i) < 0.3);

  for (let i = 0; i < data.length; i += 4) {
    const y = lum(data, i);
    const ink = inverted
      ? clamp01((y - LIGHT_ON_DARK.none) / (LIGHT_ON_DARK.full - LIGHT_ON_DARK.none))
      : clamp01((DARK_ON_LIGHT.none - y) / (DARK_ON_LIGHT.none - DARK_ON_LIGHT.full));
    data[i + 3] = Math.round(data[i + 3] * ink);
    data[i] = data[i + 1] = data[i + 2] = 0; // #000000 — --ink
  }

  const black = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const trimmed = await sharp(black).trim({ threshold: 0 }).png({ compressionLevel: 9 }).toBuffer();
  await sharp(trimmed).toFile(path);
  const m = await sharp(trimmed).metadata();
  return `${inverted ? 'light-on-dark' : 'dark-on-light'}  ${w}×${h} → ${m.width}×${m.height}`;
}

for (const dir of ['src/assets/logos', 'src/assets/logos/pending']) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.png')).sort()) {
    console.log(`  ${join(dir, file).padEnd(48)} ${await convert(join(dir, file))}`);
  }
}
