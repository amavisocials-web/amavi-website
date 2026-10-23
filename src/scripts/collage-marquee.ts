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
