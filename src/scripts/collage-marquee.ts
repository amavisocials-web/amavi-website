/**
 * The collage's mobile marquee (src/components/Numbers.astro, `.collage-row`).
 *
 * The drift itself is CSS: a transform animation on the track, translating by
 * exactly one run's width. This file only decides when it runs, and lets the
 * row be dragged.
 *
 * - **Touch pauses it.** Pointer down pauses the animation and starts a drag;
 *   pointer up resumes. The animation keeps its own progress across a pause,
 *   so it picks up where it was rather than snapping back, and the drag the
 *   person made stays as an offset on a wrapper above it. Two elements,
 *   because one cannot carry an animated transform and a script-set one.
 * - **Off screen pauses it.** An IntersectionObserver, so a row nobody is
 *   looking at is not compositing.
 * - **Reduced motion means none of it.** The animation is off in CSS, the row
 *   becomes a plain scroll container, and this file leaves it alone.
 *
 * The drag offset is kept modulo one run's width. Without that it wanders off
 * with every swipe and the row eventually drags out of its own box.
 */
const still = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const row of document.querySelectorAll<HTMLElement>('[data-marquee]')) {
  const drag = row.querySelector<HTMLElement>('[data-marquee-drag]');
  const track = row.querySelector<HTMLElement>('[data-marquee-track]');
  const firstRun = row.querySelector<HTMLElement>('.collage-row__run');
  if (!drag || !track || !firstRun) continue;

  let onScreen = false;
  let dragging = false;
  let startX = 0;
  let offset = 0;

  /** Paused unless it is on screen and nobody has hold of it. */
  const sync = () => {
    track.style.animationPlayState = onScreen && !dragging ? 'running' : 'paused';
  };

  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onScreen = entry.isIntersecting;
      sync();
    },
    { threshold: 0 },
  ).observe(row);

  row.addEventListener(
    'pointerdown',
    (event) => {
      if (still.matches) return;
      dragging = true;
      startX = event.clientX;
      /* Capture keeps the drag alive if the finger leaves the row. It throws
         on a pointer the browser no longer considers active, which must not
         take the drag down with it. */
      try {
        row.setPointerCapture(event.pointerId);
      } catch {
        /* Carry on uncaptured. */
      }
      sync();
    },
    { passive: true },
  );

  row.addEventListener(
    'pointermove',
    (event) => {
      if (!dragging) return;
      const width = firstRun.getBoundingClientRect().width;
      /* Wrapped to one run, so repeated swipes cannot walk the row away. */
      offset = width ? (((offset + event.clientX - startX) % width) + width) % width - width : 0;
      startX = event.clientX;
      drag.style.transform = `translate3d(${offset}px, 0, 0)`;
    },
    { passive: true },
  );

  const release = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    try {
      if (row.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
    } catch {
      /* Already gone. */
    }
    sync();
  };
  row.addEventListener('pointerup', release, { passive: true });
  row.addEventListener('pointercancel', release, { passive: true });

  /* Following the setting while the page is open, rather than only at load. */
  still.addEventListener('change', () => {
    if (still.matches) {
      dragging = false;
      drag.style.transform = '';
      offset = 0;
    }
    sync();
  });

  sync();
}

/* --- Playback on a phone: two at a time, the two nearest the centre --------
 *
 * Added on 23 October 2026; until then the phone row showed posters only. The
 * videos here are `managed` (src/components/LoopVideo.astro), so the generic
 * loop script leaves them alone and this decides instead:
 *
 * - Any tile the screen shows part of is a candidate, and of those only the
 *   two nearest the centre of the screen play. The rest keep their poster.
 * - The row drifts, so the nearest two change as it goes. IntersectionObserver
 *   only speaks when a tile crosses the row's edge, so the choice is also
 *   re-ranked once a second while any tile is on screen. With the section off
 *   screen no tile is, so everything is paused and nothing is re-ranked.
 * - Posters go on every tile once the row is within a screen's height, as the
 *   generic loop script does, so a tile drifting in is never blank. Not tile by
 *   tile: the row's overflow: hidden clips a tile outside it to nothing, so no
 *   observer margin sees one coming. Five files between the two runs, ~200KB.
 * - A video has its poster before it is asked to play, so if the browser
 *   refuses (iOS Low Power Mode does), the refusal is caught and the picture
 *   stays rather than a black box.
 * - Under reduced motion nothing plays and no video file is fetched.
 * - At 64em and up this row is display: none, so none of it intersects and
 *   none of it runs: desktop keeps the columns and their own behaviour.
 *
 * Cost: the two runs share their five files, so watching a full cycle fetches
 * each clip about once, ~9MB, and never more than two are decoding at once.
 */
const MAX_PLAYING = 2;

for (const row of document.querySelectorAll<HTMLElement>('[data-marquee]')) {
  const videos = [...row.querySelectorAll<HTMLVideoElement>('video[data-loop-managed]')];
  if (!videos.length) continue;

  const attachPoster = (video: HTMLVideoElement) => {
    if (video.dataset.poster && !video.getAttribute('poster')) video.poster = video.dataset.poster;
  };
  const attachSources = (video: HTMLVideoElement) => {
    if (video.dataset.sources === 'on') return;
    video.dataset.sources = 'on';
    video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
      source.src = source.dataset.src!;
    });
    video.load();
  };
  const start = (video: HTMLVideoElement) => {
    // The poster first, so a refused play() still leaves a picture.
    attachPoster(video);
    attachSources(video);
    if (!video.paused) return;
    video.play().catch(() => {
      /* Refused: Low Power Mode, data saver, a strict browser. The poster stays. */
    });
  };
  const stop = (video: HTMLVideoElement) => {
    if (!video.paused) video.pause();
  };

  const visible = new Set<HTMLVideoElement>();

  const choose = () => {
    if (still.matches || !visible.size) {
      videos.forEach(stop);
      return;
    }
    const middle = window.innerWidth / 2;
    const nearest = [...visible]
      .map((video) => {
        const box = video.getBoundingClientRect();
        return { video, distance: Math.abs(box.left + box.width / 2 - middle) };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, MAX_PLAYING)
      .map(({ video }) => video);
    const keep = new Set(nearest);
    videos.forEach((video) => (keep.has(video) ? start(video) : stop(video)));
  };

  let rerank = 0;
  const follow = () => {
    window.clearInterval(rerank);
    if (visible.size && !still.matches) rerank = window.setInterval(choose, 1000);
    choose();
  };

  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      videos.forEach(attachPoster);
      near.disconnect();
    },
    { rootMargin: '100% 0px' },
  );
  near.observe(row);

  // The row's overflow: hidden clips the tiles, and IntersectionObserver
  // honours that, so a tile slid out of the box counts as gone even while it
  // is still inside the window.
  const onScreen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const video = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) visible.add(video);
      else visible.delete(video);
    }
    follow();
  });
  videos.forEach((video) => onScreen.observe(video));

  still.addEventListener('change', follow);
}
