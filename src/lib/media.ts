/**
 * Build-time checks for self-hosted media in /public. Components use these
 * to leave out any file that isn't there yet — so the site never requests a
 * missing file, and a missing video or image shows its placeholder instead.
 * Server-side only: it reads the filesystem while the site builds.
 */
import fs from 'node:fs';
import path from 'node:path';

export const inPublic = (file: string) => fs.existsSync(path.join(process.cwd(), 'public', file));

export interface VideoFiles {
  webm?: string;
  mp4?: string;
  poster?: string;
  /** At least one playable file exists. */
  playable: boolean;
}

/**
 * One video, by base path under /public with no extension: `<base>.webm`,
 * `<base>.mp4` and a poster (by default `<base>.jpg`), each only if present.
 */
export function videoFiles(base: string, poster = `${base}.jpg`): VideoFiles {
  const webm = inPublic(`${base}.webm`) ? `${base}.webm` : undefined;
  const mp4 = inPublic(`${base}.mp4`) ? `${base}.mp4` : undefined;
  return { webm, mp4, poster: inPublic(poster) ? poster : undefined, playable: Boolean(webm || mp4) };
}
