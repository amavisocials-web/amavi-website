/**
 * Every looping background video on the site (`video[data-loop]`): lazy and
 * visible-only.
 *
 * - Lazy: the markup carries no poster and no source URLs, only data-poster
 *   and data-src. They're attached as the video comes within a screen's
 *   height of view, so a video far down the page costs nothing until then.
 * - Visible-only: it plays while at least a quarter of it is on screen, and
 *   pauses as soon as it isn't — saving battery and data on phones.
 * - Reduced motion: the poster is attached, the sources never are, and
 *   nothing plays. If the setting changes while the page is open, it follows.
 * - A video that isn't displayed (the hero's desktop cut on a phone, and the
 *   other way round) never intersects, so it never loads at all.
 * - `data-loop-from` holds a media query a video waits for before it loads
 *   anything but its poster, for a frame that is shown at every width but
 *   should only play at some of them. It follows the query while the page is
 *   open, so widening the window starts it.
 * - Leaving the page pauses them; coming back — another tab, another app, or
 *   the back button restoring the page from the back/forward cache — looks
 *   again at which are on screen and plays those (28 October 2026). The
 *   browser pauses them on the way out and nothing used to restart them,
 *   because the observers had nothing new to say.
 * - A video the browser refuses to play (Low Power Mode, Safari set to Never
 *   Auto-Play) is not asked again; it keeps its poster and gets a play button
 *   that starts every video on the page (src/scripts/lib/playback.ts, 30
 *   October 2026).
 * - The first decision is made on setup, from where everything is, rather
 *   than left to the observers' first report.
 */
import { reduceMotion as still } from './lib/motion';
import { onLeave, onReturn, shownShare } from './lib/page-life';
import { attachPoster, attachSources, onUnlock, tryPlay } from './lib/playback';

/* Managed videos are driven by their own script — the collage's phone row,
   which caps how many play at once — and this one must not also start them. */
const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]:not([data-loop-managed])')];
const visible = new Set<HTMLVideoElement>();

function sync(video: HTMLVideoElement) {
  if (visible.has(video) && !still.matches && video.dataset.sources === 'on') {
    // Refused (Low Power Mode, a strict setting): blocked, poster and button.
    tryPlay(video);
  } else {
    /* Even when already paused: a video carrying the autoplay attribute
       whose sources were just attached would otherwise start by itself as
       soon as it could, on screen or not. pause() also cancels that. */
    video.pause();
  }
}

const near = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const video = entry.target as HTMLVideoElement;
      attachPoster(video);
      attachSources(video);
      sync(video);
      near.unobserve(video);
    }
  },
  { rootMargin: '100% 0px' },
);

const onScreen = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) visible.add(video);
      else visible.delete(video);
      sync(video);
    }
  },
  { threshold: 0.25 },
);

for (const video of videos) {
  if (video.dataset.observed) continue;
  video.dataset.observed = 'true';
  near.observe(video);
  onScreen.observe(video);
}

/* Crossing a gate's width. The `near` observer let go of these the first time
   they came close, so without this nothing would ever attach them. */
for (const query of new Set(videos.map((v) => v.dataset.loopFrom).filter(Boolean) as string[])) {
  window.matchMedia(query).addEventListener('change', () => {
    for (const video of videos) {
      if (video.dataset.loopFrom !== query) continue;
      if (video.getAttribute('poster')) attachSources(video);
      sync(video);
    }
  });
}

still.addEventListener('change', () => {
  for (const video of videos) {
    if (video.getAttribute('poster')) attachSources(video);
    sync(video);
  }
});

/** Where everything is now, decided afresh: the same rules as the observers,
    read from the page rather than from their last report. */
function settle() {
  for (const video of videos) {
    const box = video.getBoundingClientRect();
    // Within a screen's height, as the `near` observer's margin.
    if (box.width && box.bottom > -innerHeight && box.top < innerHeight * 2) {
      attachPoster(video);
      attachSources(video);
    }
    // The same quarter-on-screen rule as `onScreen`.
    if (shownShare(video) >= 0.25) visible.add(video);
    else visible.delete(video);
    sync(video);
  }
}

onLeave(() => videos.forEach((video) => video.pause()));
onReturn(settle);
onUnlock(settle);
// On setup, rather than waiting on a first report that some setups never get.
settle();
