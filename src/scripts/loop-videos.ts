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
 */
import { reduceMotion as still } from './lib/motion';

/* Managed videos are driven by their own script — the collage's phone row,
   which caps how many play at once — and this one must not also start them. */
const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]:not([data-loop-managed])')];
const visible = new Set<HTMLVideoElement>();

function attachPoster(video: HTMLVideoElement) {
  if (video.dataset.poster && !video.getAttribute('poster')) video.poster = video.dataset.poster;
}

/** Whether this video's width gate, if it has one, is open. */
function gateOpen(video: HTMLVideoElement) {
  const query = video.dataset.loopFrom;
  return !query || window.matchMedia(query).matches;
}

function attachSources(video: HTMLVideoElement) {
  if (still.matches || !gateOpen(video) || video.dataset.sources === 'on') return;
  video.dataset.sources = 'on';
  video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src!;
  });
  video.load();
}

function sync(video: HTMLVideoElement) {
  if (visible.has(video) && !still.matches && video.dataset.sources === 'on') {
    video.play().catch(() => {});
  } else if (!video.paused) {
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
