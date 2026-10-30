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
 * - **Each refused video shows a play control over its poster**, the same
 *   small circle and arrow everywhere, and its frame takes `.is-blocked`.
 *   The hero gets a real button, labelled "Play video" (low in the frame:
 *   the middle holds the headline). A collage tile is already a link, and a
 *   button inside a link is invalid and its click would follow the link, so
 *   there the tile itself becomes the control while its video is refused:
 *   the circle is drawn over it, the link is labelled "Play video", and a
 *   click plays instead of opening Instagram. (Revised 31 October 2026; the
 *   first version put one button over the whole collage.)
 * - **Each control goes once its video plays.**
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
 * play(), with its answer heard. Refused: marked blocked and given a
 * control. Interrupted by a pause() or a reload (AbortError): nothing, that
 * is the scripts changing their minds. No playable source: nothing either;
 * the poster stays, and a control could not help.
 */
export function tryPlay(video: HTMLVideoElement) {
  if (blocked.has(video)) return;
  video.play()?.catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'NotAllowedError') block(video);
  });
}

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';

function block(video: HTMLVideoElement) {
  if (blocked.has(video)) return;
  blocked.add(video);
  video.dataset.blocked = '';
  const frame = video.parentElement;
  frame?.classList.add('is-blocked');
  // Gone the moment it plays, however that comes about.
  video.addEventListener('playing', () => unblock(video), { once: true });

  const link = video.closest<HTMLAnchorElement>('a[href]');
  if (link && frame) {
    // A tile: the link is the control for now, the circle only drawn.
    if (!frame.querySelector(':scope > .video-play')) {
      const mark = document.createElement('span');
      mark.className = 'video-play video-play--mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML = PLAY_ICON;
      frame.append(mark);
    }
    if (link.dataset.playLabel === undefined) {
      link.dataset.playLabel = link.getAttribute('aria-label') ?? '';
      link.setAttribute('aria-label', 'Play video');
    }
    return;
  }

  const host = video.closest<HTMLElement>('[data-play-host]') ?? frame;
  if (host && !host.querySelector(':scope > .video-play')) host.append(button());
}

function unblock(video: HTMLVideoElement) {
  blocked.delete(video);
  delete video.dataset.blocked;
  const frame = video.parentElement;
  frame?.classList.remove('is-blocked');
  frame?.querySelector(':scope > .video-play--mark')?.remove();
  const link = video.closest<HTMLAnchorElement>('a[data-play-label]');
  if (link) {
    if (link.dataset.playLabel) link.setAttribute('aria-label', link.dataset.playLabel);
    else link.removeAttribute('aria-label');
    delete link.dataset.playLabel;
  }
  // The hero's button, once none of the videos it stands for is refused.
  const host = video.closest<HTMLElement>('[data-play-host]');
  if (host && ![...host.querySelectorAll('video')].some((v) => blocked.has(v))) {
    host.querySelector(':scope > .video-play')?.remove();
  }
}

function button(): HTMLButtonElement {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'video-play';
  control.setAttribute('aria-label', 'Play video');
  control.innerHTML = PLAY_ICON;
  control.addEventListener('click', playAll);
  return control;
}

/* A click on a tile standing in as a play control plays, rather than
   following the link. Heard as it bubbles up, so a swipe along the phone
   row, which the row stops on the way down, never counts as a press. */
document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest?.('a[data-play-label]');
  if (!link) return;
  event.preventDefault();
  playAll();
});

/**
 * Every video the page is showing, played inside the press — the refused
 * ones and the ones not yet asked — so each has the permission the browser
 * wants. The controls go at once; a video refused even now gets its control
 * back, to be pressed again, never retried on its own.
 */
function playAll() {
  const shown = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')].filter(
    (video) => video.getClientRects().length > 0,
  );
  [...blocked].forEach(unblock);
  for (const video of shown) {
    attachPoster(video);
    attachSources(video);
    if (video.dataset.sources === 'on') tryPlay(video);
  }
  // Inside the same press: the ones off screen pause again, already allowed.
  unlockers.forEach((settle) => settle());
}
