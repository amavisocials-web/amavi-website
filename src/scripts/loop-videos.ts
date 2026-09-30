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
 */
import { reduceMotion as still } from './lib/motion';

const videos = [...document.querySelectorAll<HTMLVideoElement>('video[data-loop]')];
const visible = new Set<HTMLVideoElement>();

function attachPoster(video: HTMLVideoElement) {
  if (video.dataset.poster && !video.getAttribute('poster')) video.poster = video.dataset.poster;
}

function attachSources(video: HTMLVideoElement) {
  if (still.matches || video.dataset.sources === 'on') return;
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

still.addEventListener('change', () => {
  for (const video of videos) {
    if (video.getAttribute('poster')) attachSources(video);
    sync(video);
  }
});
