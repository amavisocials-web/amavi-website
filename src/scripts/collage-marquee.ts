/**
 * The collage's mobile marquee (src/components/Numbers.astro, `.collage-row`).
 *
 * The drift itself is CSS: a transform animation on the track, translating by
 * exactly one run's width. This file only decides when it runs, and lets the
 * row be dragged.
 *
 * - **Touch pauses it.** Pointer down pauses the animation; once it has moved
 *   a few pixels it is a drag, and pointer up resumes. A press that never
 *   moved is a tap, which opens the tile's Instagram post. The animation keeps its own progress across a pause,
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
 *
 * - **Leaving the page lets go, and coming back looks again** (28 October
 *   2026). A tap opens a tile's post; whatever held the row at that moment —
 *   a press, the focus the tap left on the link — used to still hold it on the
 *   way back, so it came back frozen. Now only keyboard focus holds it, a
 *   press is dropped when the page is put away, and on return the row checks
 *   again whether it is on screen (src/scripts/lib/page-life.ts).
 */
import { onLeave, onReturn, shownShare, keyboardFocusIn } from './lib/page-life';
import { attachPoster, attachSources, onUnlock, tryPlay } from './lib/playback';

const still = window.matchMedia('(prefers-reduced-motion: reduce)');

/** How far a press may move, in CSS pixels, and still count as a tap. */
const TAP_SLOP = 8;

for (const row of document.querySelectorAll<HTMLElement>('[data-marquee]')) {
  const drag = row.querySelector<HTMLElement>('[data-marquee-drag]');
  const track = row.querySelector<HTMLElement>('[data-marquee-track]');
  const firstRun = row.querySelector<HTMLElement>('.collage-row__run');
  if (!drag || !track || !firstRun) continue;

  let onScreen = false;
  let pressed = false; // a pointer is down on the row
  let dragging = false; // ...and has moved far enough to be a swipe
  let swiped = false; // the last press was a swipe, so its click opens nothing
  let downX = 0;
  let startX = 0;
  let offset = 0;

  /** Paused unless it is on screen, nobody has hold of it and no tile has
      keyboard focus. Not any focus: the one a tap leaves on a link outlasts
      the visit to Instagram. */
  const sync = () => {
    const held = pressed || keyboardFocusIn(row);
    track.style.animationPlayState = onScreen && !held ? 'running' : 'paused';
  };

  new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onScreen = entry.isIntersecting;
      sync();
    },
    { threshold: 0 },
  ).observe(row);

  /* A press is a tap until it moves TAP_SLOP pixels: only then does it become
     a drag and take pointer capture. Capturing at once would route the
     release to the row, and a tap would never reach the tile's link. */
  row.addEventListener(
    'pointerdown',
    (event) => {
      if (still.matches) return;
      pressed = true;
      dragging = false;
      swiped = false;
      downX = startX = event.clientX;
      sync();
    },
    { passive: true },
  );

  row.addEventListener(
    'pointermove',
    (event) => {
      if (!pressed) return;
      if (!dragging) {
        if (Math.abs(event.clientX - downX) < TAP_SLOP) return;
        dragging = swiped = true;
        /* Capture keeps the drag alive if the finger leaves the row. It throws
           on a pointer the browser no longer considers active, which must not
           take the drag down with it. */
        try {
          row.setPointerCapture(event.pointerId);
        } catch {
          /* Carry on uncaptured. */
        }
      }
      const width = firstRun.getBoundingClientRect().width;
      /* Wrapped to one run, so repeated swipes cannot walk the row away. */
      offset = width ? (((offset + event.clientX - startX) % width) + width) % width - width : 0;
      startX = event.clientX;
      drag.style.transform = `translate3d(${offset}px, 0, 0)`;
    },
    { passive: true },
  );

  const release = (event: PointerEvent) => {
    if (!pressed) return;
    pressed = dragging = false;
    try {
      if (row.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
    } catch {
      /* Already gone. */
    }
    sync();
  };
  row.addEventListener('pointerup', release, { passive: true });
  row.addEventListener('pointercancel', release, { passive: true });

  /* A swipe that ends over a tile must not open its post. Caught on the way
     down, before the link sees it. */
  row.addEventListener(
    'click',
    (event) => {
      if (!swiped) return;
      swiped = false;
      event.preventDefault();
      event.stopPropagation();
    },
    { capture: true },
  );

  /* A tile with keyboard focus holds the row still, as the columns do. Checked
     once focus has landed wherever it went next. */
  row.addEventListener('focusin', sync);
  row.addEventListener('focusout', () => setTimeout(sync));

  /* Put away mid-press, the release never arrives: drop the press. Back
     again, the observer's last word may be from before, so look. */
  onLeave(() => {
    pressed = dragging = swiped = false;
    sync();
  }, { blur: true });
  onReturn(() => {
    pressed = dragging = swiped = false;
    onScreen = shownShare(row) > 0;
    sync();
  });

  /* Following the setting while the page is open, rather than only at load. */
  still.addEventListener('change', () => {
    if (still.matches) {
      pressed = dragging = swiped = false;
      drag.style.transform = '';
      offset = 0;
    }
    sync();
  });

  sync();
}

/* --- Keyboard focus on a tile ---------------------------------------------
 *
 * The tiles are links (27 October 2026). With keyboard focus on one, CSS parks
 * the loop at its start (Numbers.astro); this then brings the tile into view
 * inside its clipped column or row, and puts the scroll back when focus
 * leaves. Without it, a tab could land on a tile outside the window.
 */
/** A focused tile, inside its clipped frame and on the page clear of the
    sticky header. Two steps rather than scrollIntoView, which knows nothing
    of the header and would tuck the top of the tile, ring and all, under it. */
const reveal = (tile: HTMLElement, frame: HTMLElement) => {
  const t = tile.getBoundingClientRect();
  const f = frame.getBoundingClientRect();
  if (t.top < f.top) frame.scrollTop -= f.top - t.top;
  else if (t.bottom > f.bottom) frame.scrollTop += t.bottom - f.bottom;
  if (t.left < f.left) frame.scrollLeft -= f.left - t.left;
  else if (t.right > f.right) frame.scrollLeft += t.right - f.right;

  const gap = 16;
  const top = (document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0) + gap;
  const r = tile.getBoundingClientRect();
  const by = r.top < top ? r.top - top : r.bottom > innerHeight - gap ? r.bottom - (innerHeight - gap) : 0;
  if (by) window.scrollTo(0, window.scrollY + by);
};

for (const frame of document.querySelectorAll<HTMLElement>('.collage__column, [data-marquee]')) {
  frame.addEventListener('focusin', (event) => {
    const tile = event.target as HTMLElement;
    if (!tile.matches('a:focus-visible')) return;
    // After the style change that parks the loop has laid out, and only if
    // focus has not already moved on: a late reveal would undo the reset below.
    requestAnimationFrame(() => {
      if (document.activeElement === tile) reveal(tile, frame);
    });
  });
  frame.addEventListener('focusout', (event) => {
    if (frame.contains(event.relatedTarget as Node | null)) return;
    frame.scrollTop = 0;
    frame.scrollLeft = 0;
  });
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
 *   refuses (Low Power Mode, Safari set to Never Auto-Play), the picture
 *   stays rather than a black box, the video is not asked again, and a play
 *   button over the row starts every video on the page
 *   (src/scripts/lib/playback.ts, 30 October 2026).
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

  const start = (video: HTMLVideoElement) => {
    // The poster first, so a refused play() still leaves a picture.
    attachPoster(video);
    attachSources(video);
    if (!video.paused) return;
    // Refused: marked, not asked again, and the row gets a play button.
    tryPlay(video);
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

  /* Put away: stop. Back again: work out afresh which tiles the row shows,
     since the browser paused the videos on the way out and the observer's
     list is from before, then play the nearest two. */
  onLeave(() => {
    window.clearInterval(rerank);
    videos.forEach(stop);
  });
  /** Which tiles the row shows, read from the page, then the nearest two play. */
  const settle = () => {
    visible.clear();
    videos.forEach((video) => {
      if (shownShare(video, row) > 0) visible.add(video);
    });
    follow();
  };
  onReturn(settle);
  onUnlock(settle);
  // On setup too, rather than only on the observer's first report.
  settle();
}
