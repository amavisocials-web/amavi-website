/**
 * How far through the article you are, as a line along the bottom edge of the
 * header.
 *
 * It measures the article itself, not the document: the progress reaches full
 * when the last line of the piece has been read, rather than when the footer
 * has been scrolled past.
 *
 * Reading and writing happen once per frame, inside one requestAnimationFrame,
 * because scroll fires far more often than the screen is painted. The fill is
 * a transform, so a frame costs no layout.
 *
 * Under prefers-reduced-motion the bar is never built: the markup ships with
 * it hidden, and only this script reveals it, so there is nothing to undo.
 */
import { prefersReducedMotion } from './lib/motion';

const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
const article = document.querySelector<HTMLElement>('[data-article]');

if (bar && article && !prefersReducedMotion()) {
  const fill = bar.firstElementChild as HTMLElement | null;

  if (fill) {
    let queued = false;

    const sync = () => {
      queued = false;
      const box = article.getBoundingClientRect();
      // The distance over which the article is being read: from its top
      // reaching the top of the screen to its last line leaving it.
      const travel = box.height - window.innerHeight;
      const read = travel > 0 ? -box.top / travel : 1;
      const progress = Math.min(1, Math.max(0, read));
      fill.style.transform = `scaleX(${progress})`;
    };

    bar.hidden = false;
    sync();

    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(sync);
    };

    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
  }
}
