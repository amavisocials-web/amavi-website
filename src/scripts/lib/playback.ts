/**
 * Playing the site's videos: how many at once, and what happens when the
 * browser will not.
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
 *   click plays instead of opening Instagram. (Revised the same day; the
 *   first version put one button over the whole collage.)
 * - **Each control goes once its video plays.**
 * - **Any press plays them all**, on a control or anywhere else on the page:
 *   the visitor's first click, tap or key press (also 30 October 2026; until
 *   then only a control would do). A browser that refuses on its own allows
 *   a play() made while the visitor is doing something, video by video, so
 *   the press asks every video on the page at once — the refused ones and
 *   the ones not yet scrolled to, which would otherwise be refused in their
 *   turn — and then hands back to the scripts that decide which should be
 *   running (`onUnlock`), so the ones off screen pause again, still allowed
 *   to play later. Scrolling is not listened for, and a press the browser
 *   does not count is refused like any other: nothing on screen changes.
 *
 * **How many at once** (2 November 2026). On a MacBook Air in Chrome
 * the videos froze: too many were decoding together, not too much was
 * downloading. The scripts that decide which videos should be playing
 * (src/scripts/loop-videos.ts, src/scripts/collage-marquee.ts) say so
 * through tryPlay() and stopPlay(); this decides which actually may.
 *
 * - **Four live at most, page-wide.** A video is live while its files are
 *   attached — playing, or ready to — and each holds a decoder. A video
 *   wanted with all four taken stays on its poster until one frees up; the
 *   freed slot goes to the waiting video nearest the middle of the screen.
 *   A slot held by a video nobody wants (paused, or out of sight) is taken
 *   for one that is wanted. The hero always gets one while it is in view,
 *   from the tile farthest from the middle if it must.
 * - **Out of sight for two seconds, its files go.** Pausing does not free a
 *   decoder; letting the files go does. More than half a screen away, or
 *   wholly outside the row it drifts in, for two seconds: the files are let go
 *   and the poster — the video's first frame — shows, so nothing on screen
 *   changes. Back within reach, it takes them again if a slot is free, so it
 *   is ready before it is seen.
 * - **All of this looks once a second, at where things are.** The tiles drift
 *   under a CSS animation, and with nothing else happening Safari does not
 *   run IntersectionObservers at all: measured over 30 idle seconds, it had
 *   one report for tiles that had moved 600px, with tiles out of sight still
 *   playing and one 84% on screen still paused. Positions read from the page
 *   stay true, so a tick reads those and has the scripts decide again.
 * - **A weak device keeps the collage still.** Data Saver on, four cores or
 *   fewer, or 4GB of memory or less: the tiles (`data-loop-optional`) never
 *   load, their posters stand in, the phone row keeps moving, and the hero
 *   still plays. Only Chrome reports memory and Data Saver; WebKit reports 4
 *   cores for anything under 8, which includes every iPhone.
 */
import { clipsOf, shownShare } from './page-life';
import { reduceMotion } from './motion';

const blocked = new Set<HTMLVideoElement>();
const settlers = new Set<() => void>();

/** Videos with their files attached, playing or ready to. */
const LIVE_LIMIT = 4;
const live = new Set<HTMLVideoElement>();
/** Videos a script wants playing now, whether they have a slot or wait. */
const wanted = new Set<HTMLVideoElement>();
/** Since when each live video nobody wants has been out of reach. */
const gone = new Map<HTMLVideoElement, number>();
const RELEASE_AFTER = 2000;
/** Set while a press is playing everything, which may ask a refused video. */
let pressing = false;

/**
 * The brief's three signs of a device the collage's videos are too much for
 * (2 November 2026). Each is only read where the browser offers it.
 */
const weakDevice = (() => {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const cores = nav.hardwareConcurrency;
  return (
    nav.connection?.saveData === true ||
    (cores > 0 && cores <= 4) ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)
  );
})();

/** Run to settle who should be playing: after a press has played everything,
    and on each tick. */
export function onSettle(fn: () => void) {
  settlers.add(fn);
}

/** Whether a video's width gate (`data-loop-from`), if it has one, is open. */
export function gateOpen(video: HTMLVideoElement): boolean {
  const query = video.dataset.loopFrom;
  return !query || window.matchMedia(query).matches;
}

/**
 * Whether a video may load and play here at all: never under reduced motion,
 * never with its width gate shut, and a video the page can do without never
 * on a weak device.
 */
export function mayPlay(video: HTMLVideoElement): boolean {
  return (
    !reduceMotion.matches && gateOpen(video) && !(weakDevice && video.hasAttribute('data-loop-optional'))
  );
}

/**
 * The poster, and the same picture behind the video, cropped as the video is.
 * A video emptied by load() is transparent in Safari, which does not draw its
 * poster again (measured: a tile coming back into view was the frame's black
 * until it played), so the poster alone cannot be relied on to stay up.
 */
export function attachPoster(video: HTMLVideoElement) {
  const poster = video.dataset.poster;
  if (!poster || video.getAttribute('poster')) return;
  video.poster = poster;
  video.style.background = `url("${poster}") ${getComputedStyle(video).objectPosition} / cover no-repeat`;
}

/** A still copy's image (LoopVideo `still`), attached as a poster is. */
export function attachStill(image: HTMLImageElement) {
  if (image.dataset.src && !image.getAttribute('src')) image.src = image.dataset.src;
}

/** The real source URLs. Only through claim(), which keeps the count. */
function attachSources(video: HTMLVideoElement) {
  if (video.dataset.sources === 'on') return;
  video.dataset.sources = 'on';
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src!;
  });
  video.load();
}

/**
 * The files let go, which frees the decoder as a pause does not. The sources
 * are `<source>` elements, so it is their addresses that go, then load()
 * empties the element; the picture stays up (see attachPoster), so nothing on
 * screen changes.
 */
function release(video: HTMLVideoElement) {
  live.delete(video);
  gone.delete(video);
  if (video.dataset.sources !== 'on') return;
  delete video.dataset.sources;
  video.querySelectorAll<HTMLSourceElement>('source[src]').forEach((source) => source.removeAttribute('src'));
  video.load();
}

function isHero(video: HTMLVideoElement): boolean {
  return Boolean(video.closest('[data-play-host="hero"]'));
}

/** From the middle of the screen to the middle of the video, in pixels. */
function distance(video: HTMLVideoElement): number {
  const box = video.getBoundingClientRect();
  return Math.hypot(box.left + box.width / 2 - innerWidth / 2, box.top + box.height / 2 - innerHeight / 2);
}

/** Within half a screen of view, and inside whatever clips it: a tile wholly
    outside its row is out of reach wherever the row is. */
function inReach(video: HTMLVideoElement): boolean {
  return shownShare(video, clipsOf(video), innerHeight / 2) > 0;
}

/**
 * A live slot for this video, with its files attached: free, or taken from a
 * video that can spare it — one nobody wants, out of reach first, then the
 * farthest from the middle — or, for the hero, from the farthest tile. False
 * if there is none, and the video waits on its poster.
 */
function claim(video: HTMLVideoElement): boolean {
  if (!live.has(video)) {
    if (live.size >= LIVE_LIMIT) {
      const spare = [...live]
        .filter((v) => !wanted.has(v))
        .sort((a, b) => Number(inReach(a)) - Number(inReach(b)) || distance(b) - distance(a));
      let victim = spare[0];
      if (!victim && isHero(video)) {
        victim = [...live].filter((v) => !isHero(v)).sort((a, b) => distance(b) - distance(a))[0];
      }
      if (!victim) return false;
      victim.pause();
      release(victim);
    }
    live.add(video);
  }
  attachSources(video);
  return true;
}

/** Turned down until the visitor does something, as against interrupted. */
function refused(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotAllowedError';
}

/**
 * A script wants this video playing. It plays if it has a slot or can get
 * one; otherwise it waits on its poster, and the next slot to free up may be
 * its. play()'s answer is heard: refused, the video is marked blocked and
 * given a control; interrupted by a pause() or a reload (AbortError),
 * nothing, that is the scripts changing their minds; no playable source,
 * nothing either, since a control could not help.
 */
export function tryPlay(video: HTMLVideoElement) {
  if ((blocked.has(video) && !pressing) || !mayPlay(video)) return;
  wanted.add(video);
  const wasLive = live.has(video);
  if (!claim(video)) {
    video.pause();
    return;
  }
  if (wasLive && !video.paused) return;
  video.play()?.catch((error: unknown) => {
    if (refused(error)) block(video);
  });
}

/**
 * A script no longer wants this video playing: paused, and its slot can go
 * to a waiting video. pause() even when it is paused already: a video with
 * the autoplay attribute whose files were just attached would otherwise
 * start by itself. Its files stay for now, in case it is wanted again at
 * once; a video that may not play at all (reduced motion switched on, its
 * gate shut) lets them go straight away.
 */
export function stopPlay(video: HTMLVideoElement) {
  wanted.delete(video);
  video.pause();
  if (!mayPlay(video)) release(video);
  promote();
}

/** Waiting videos take whatever slots can be had, the hero first, then the
    nearest the middle. */
function promote() {
  const waiting = [...wanted].filter((v) => !live.has(v) && !blocked.has(v));
  if (!waiting.length) return;
  waiting.sort((a, b) => Number(isHero(b)) - Number(isHero(a)) || distance(a) - distance(b));
  for (const video of waiting) tryPlay(video);
}

/**
 * Once a second: the scripts decide who should be playing, from where things
 * are now. Then, for the videos they do not want, within reach means files
 * if a slot is free, never at another's expense, holding still until wanted;
 * out of reach for two seconds means the files go.
 */
const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')];
function tick() {
  if (document.hidden || reduceMotion.matches) return;
  settlers.forEach((settle) => settle());
  const now = performance.now();
  for (const video of videos) {
    if (wanted.has(video) || inReach(video)) gone.delete(video);
    if (wanted.has(video)) continue;
    if (inReach(video)) {
      if (!live.has(video) && live.size < LIVE_LIMIT && !blocked.has(video) && mayPlay(video)) {
        claim(video);
        video.pause();
      }
    } else if (live.has(video)) {
      if (!gone.has(video)) gone.set(video, now);
      if (now - gone.get(video)! >= RELEASE_AFTER) {
        video.pause();
        release(video);
      }
    }
  }
  promote();
}
if (videos.length) window.setInterval(tick, 1000);

/* Only a wanted video plays. Attaching files re-arms the autoplay attribute,
   and in Safari a pause() straight after does not disarm it, so a video made
   ready ahead of time ran by itself until the next tick. */
document.addEventListener(
  'play',
  (event) => {
    const video = event.target as HTMLVideoElement;
    if (videos.includes(video) && !wanted.has(video)) video.pause();
  },
  { capture: true },
);

const PLAY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>';

function block(video: HTMLVideoElement) {
  // Refused, it shows its poster and control and needs no slot or files.
  release(video);
  promote();
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

/** No handler of its own: a press anywhere plays, this one included. */
function button(): HTMLButtonElement {
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'video-play';
  control.setAttribute('aria-label', 'Play video');
  control.innerHTML = PLAY_ICON;
  return control;
}

/* The visitor's press, wherever it lands: a click (a mouse, or a key on a
   link or button), a tap (touchend, which an iPhone sends for a tap on any
   part of the page, where it sends a click only for links and buttons), or
   a key. Heard on the way down, before anything on the page can stop it.
   Once nothing is refused, a press costs a lookup.

   A tile standing in as a play control plays rather than opening its post,
   so its click is cancelled. A tap on one is left to that click: by the
   time the click arrives the video may be running, its link restored, and
   the click would open Instagram after all. */
function press(event: Event) {
  const tile = (event.target as Element | null)?.closest?.('a[data-play-label]');
  if (tile) {
    if (event.type === 'touchend') return;
    if (event.type === 'click') event.preventDefault();
  } else if (!blocked.size) return;
  playAll();
}
document.addEventListener('click', press, { capture: true });
document.addEventListener('keydown', press, { capture: true });
document.addEventListener('touchend', press, { capture: true, passive: true });

/**
 * Every video the page is showing gets a play() inside the press, which is
 * what a refusing browser asks for, video by video — with its files or
 * without, so the press costs no more than four live. Then the scripts
 * decide, still inside the press, which play, and tryPlay() lets a refused
 * video try again this once. Nothing is taken down before the browser has
 * answered: a control goes when its video plays (see block()), or when the
 * press was allowed and the scripts paused it again. A video refused even
 * now keeps its control, to be pressed again — never retried on its own.
 */
function playAll() {
  pressing = true;
  for (const video of videos) {
    if (!video.getClientRects().length || !mayPlay(video)) continue;
    attachPoster(video);
    video.play()?.catch((error: unknown) => {
      if (refused(error)) block(video);
      else unblock(video); // allowed, and paused or reloaded below
    });
  }
  settlers.forEach((settle) => settle());
  pressing = false;
}
