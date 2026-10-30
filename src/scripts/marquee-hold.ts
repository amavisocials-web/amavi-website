/**
 * Holding a moving strip still while someone is using it, and never after
 * they have gone: the collage's columns (src/components/Numbers.astro) and
 * the client logos (src/components/LogoWall.astro), each marked `data-hold`.
 *
 * The movement is CSS. This only sets `data-held`, which the stylesheet reads
 * as `animation-play-state: paused`, so nothing here ever starts a second
 * animation, and calling any of it twice changes nothing.
 *
 * **Why it is not CSS any more** (28 October 2026). The strips paused on
 * `:hover` and `:focus-within`. Clicking a tile to open Instagram focuses the
 * link (Chrome does, on a click) and leaves the pointer over the strip, and
 * neither clears while the reader is in the other tab, so they came back to a
 * frozen collage. Now:
 *
 * - A **mouse** holds it by moving over it, not by resting there, so a pointer
 *   left where the click was does not hold it on return.
 * - **Keyboard** focus inside holds it; the focus a click leaves on a link
 *   does not.
 * - Leaving the page — hidden, frozen into the back/forward cache, or the
 *   window losing focus to a new tab — lets go, and so does coming back.
 */
import { onLeave, onReturn, keyboardFocusIn } from './lib/page-life';

for (const strip of document.querySelectorAll<HTMLElement>('[data-hold]')) {
  let hovering = false;

  const sync = () => {
    strip.toggleAttribute('data-held', hovering || keyboardFocusIn(strip));
  };
  const letGo = () => {
    hovering = false;
    sync();
  };
  /**
   * Back on the page — restored by the back button, its tab shown again, or
   * the window focused — the strip runs: nothing from before holds it. There
   * is no animation loop to cancel or restart and no timestamp to reset: the
   * movement is a CSS animation, which keeps its own time, so it cannot jump
   * or run twice. Only the hold could outlive the visit, and this drops it.
   */
  const resume = () => {
    hovering = false;
    sync();
  };

  strip.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || hovering) return;
    hovering = true;
    sync();
  });
  strip.addEventListener('pointerleave', letGo);
  strip.addEventListener('pointercancel', letGo);

  strip.addEventListener('focusin', sync);
  // Once focus has landed wherever it went next.
  strip.addEventListener('focusout', () => setTimeout(sync));

  onLeave(letGo, { blur: true });
  onReturn(resume);
}
