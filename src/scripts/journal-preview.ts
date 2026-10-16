/**
 * The cover image, as a preview that follows the cursor across the journal
 * list.
 *
 * The rows never show a cover: the list stays a list of words, and the picture
 * is the reward for hovering one. A row that has no image does nothing, and a
 * list where no post has an image behaves exactly as if this file did not
 * exist.
 *
 * It is a pointer affordance, so it is off wherever there is no pointer worth
 * following: a coarse pointer (a finger), a device that cannot hover, and
 * anyone who has asked for reduced motion. On those it never even builds the
 * element.
 *
 * Position is written inside one requestAnimationFrame per frame rather than
 * on every pointermove, and the element is moved with a transform, so nothing
 * is laid out again as the cursor travels.
 */
import { prefersReducedMotion } from './lib/motion';

const rows = [...document.querySelectorAll<HTMLAnchorElement>('[data-preview]')];
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (rows.length > 0 && fine && !prefersReducedMotion()) {
  const preview = document.createElement('div');
  preview.className = 'journal-preview';
  preview.setAttribute('aria-hidden', 'true');

  const img = document.createElement('img');
  img.alt = '';
  img.decoding = 'async';
  preview.append(img);
  document.body.append(preview);

  let x = 0;
  let y = 0;
  let queued = false;
  /** Which row the cursor is in, so a late frame cannot revive a stale image. */
  let active: HTMLAnchorElement | null = null;

  const place = () => {
    queued = false;
    // Offset from the cursor rather than centred on it, so the pointer is
    // never sitting on top of the picture it is showing.
    preview.style.transform = `translate3d(${x + 24}px, ${y - 90}px, 0)`;
  };

  const onMove = (event: PointerEvent) => {
    x = event.clientX;
    y = event.clientY;
    if (queued) return;
    queued = true;
    requestAnimationFrame(place);
  };

  for (const row of rows) {
    const src = row.dataset.preview;
    if (!src) continue;

    row.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      active = row;
      img.src = src;
      x = event.clientX;
      y = event.clientY;
      place();
      preview.dataset.shown = 'true';
      window.addEventListener('pointermove', onMove, { passive: true });
    });

    row.addEventListener('pointerleave', () => {
      if (active !== row) return;
      active = null;
      delete preview.dataset.shown;
      window.removeEventListener('pointermove', onMove);
    });
  }

  // A row can be left by scrolling rather than by moving the cursor off it.
  window.addEventListener('scroll', () => {
    if (!active) return;
    active = null;
    delete preview.dataset.shown;
    window.removeEventListener('pointermove', onMove);
  }, { passive: true });
}
