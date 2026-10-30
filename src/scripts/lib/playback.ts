/**
 * Playing the site's videos, and what happens when the browser will not.
 *
 * Added on 30 October 2026. Every video here is muted, inline and looping,
 * with those attributes in the markup, which is what browsers let play
 * without a tap. Some settings refuse every video anyway until the visitor
 * does something: Low Power Mode on a Mac or an iPhone, and Safari set to
 * Never Auto-Play. play() then rejects with NotAllowedError. That rejection
 * used to be swallowed, and the page showed still frames that looked broken.
 *
 * - **A refused video is marked and left alone.** `data-blocked`, its poster
 *   stays up, and nothing asks it to play again until the visitor does — no
 *   retry on a timer or on the next scroll.
 * - **Its frame gets a small play button**, one per frame: the hero, the
 *   collage, the collage's phone row (each marked `data-play-host`), or the
 *   video's own box elsewhere. Never inside a link: the collage tiles are
 *   links, so the button sits over the collage rather than in a tile.
 * - **One press plays them all.** A browser that refuses on its own allows a
 *   play() made during the visitor's tap, video by video, so the press asks
 *   every video on the page at once — the refused ones and the ones not yet
 *   scrolled to, which would otherwise be refused in their turn — and then
 *   hands back to the scripts that decide which should be running
 *   (`onUnlock`), so the ones off screen pause again, still allowed to play
 *   later.
 *
 * The sources are attached here too (they are in the markup as `data-src`,
 * so a video costs nothing until it is near), since the press has to attach
 * them for videos that have not loaded yet.
 */
import { reduceMotion } from './motion';

const blocked = new Set<HTMLVideoElement>();
const unlockers = new Set<() => void>();

/** Run after a press has played everything, to settle who should be playing. */
export function onUnlock(fn: () => void) {
  unlockers.add(fn);
}

/** Whether a video's width gate (`data-loop-from`), if it has one, is open. */
export function gateOpen(video: HTMLVideoElement): boolean {
  const query = video.dataset.loopFrom;
  return !query || window.matchMedia(query).matches;
}

export function attachPoster(video: HTMLVideoElement) {
  if (video.dataset.poster && !video.getAttribute('poster')) video.poster = video.dataset.poster;
}

/** The real source URLs, once: never under reduced motion or a shut gate. */
export function attachSources(video: HTMLVideoElement) {
  if (reduceMotion.matches || !gateOpen(video) || video.dataset.sources === 'on') return;
  video.dataset.sources = 'on';
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src!;
  });
  video.load();
}

/**
 * play(), with its answer heard. Refused: marked blocked and given a button.
 * Interrupted by a pause() or a reload (AbortError): nothing, that is the
 * scripts changing their minds. No playable source: nothing either; the
 * poster stays, and a button could not help.
 */
export function tryPlay(video: HTMLVideoElement) {
  if (blocked.has(video)) return;
  video.play()?.catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'NotAllowedError') block(video);
  });
}

function block(video: HTMLVideoElement) {
  blocked.add(video);
  video.dataset.blocked = '';
  const host = video.closest<HTMLElement>('[data-play-host]') ?? video.parentElement;
  if (host && !host.querySelector(':scope > .video-play')) host.append(button());
}

function button(): HTMLButtonElement {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'video-play';
  control.setAttribute('aria-label', 'Play the videos');
  control.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';
  control.addEventListener('click', playAll);
  return control;
}

/** Every video the page is showing, played inside the press. */
function playAll() {
  const shown = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')].filter(
    (video) => video.getClientRects().length > 0,
  );
  blocked.clear();
  document.querySelectorAll('.video-play').forEach((control) => control.remove());
  for (const video of shown) {
    delete video.dataset.blocked;
    attachPoster(video);
    attachSources(video);
    if (video.dataset.sources === 'on') tryPlay(video);
  }
  // Inside the same press: the ones off screen pause again, already allowed.
  unlockers.forEach((settle) => settle());
}
