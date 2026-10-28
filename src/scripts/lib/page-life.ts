/**
 * Leaving the page and coming back to it, in one place.
 *
 * Added on 28 October 2026 for a frozen collage: a tile opens Instagram, and
 * whatever state the page was in at that moment — a hover, a focused link, a
 * paused video — was still there on the way back, because nothing looked
 * again. Coming back can be any of three things, and they do not all fire
 * every time:
 *
 * - `pageshow` with `persisted`: restored from the back/forward cache, where
 *   the page sat frozen. No load event, no observer callbacks; media was
 *   paused on the way in and is not resumed on the way out.
 * - `visibilitychange` to visible: its tab or app shown again.
 * - window `focus`: the window focused again, after a new tab or a popup.
 *
 * Callbacks can run several times for one return; each must be safe to
 * repeat.
 */

/**
 * Calls `fn` when the page is put away: hidden, or frozen into the
 * back/forward cache. With `blur`, also whenever the window loses focus,
 * which is the first sign of a link opening in a new tab.
 */
export function onLeave(fn: () => void, { blur = false } = {}) {
  window.addEventListener('pagehide', fn);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') fn();
  });
  if (blur) window.addEventListener('blur', fn);
}

/** Calls `fn` when the page comes back, by any of the three routes above. */
export function onReturn(fn: () => void) {
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) fn();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') fn();
  });
  window.addEventListener('focus', fn);
}

/**
 * How much of an element the window shows, from 0 to 1, optionally inside a
 * clipping box. For re-checking on return, when an IntersectionObserver's
 * last word may be from before the page was put away.
 */
export function shownShare(element: Element, clip?: Element | null): number {
  const box = element.getBoundingClientRect();
  if (!box.width || !box.height) return 0; // not displayed
  let left = Math.max(box.left, 0);
  let top = Math.max(box.top, 0);
  let right = Math.min(box.right, window.innerWidth);
  let bottom = Math.min(box.bottom, window.innerHeight);
  if (clip) {
    const c = clip.getBoundingClientRect();
    left = Math.max(left, c.left);
    top = Math.max(top, c.top);
    right = Math.min(right, c.right);
    bottom = Math.min(bottom, c.bottom);
  }
  if (right <= left || bottom <= top) return 0;
  return ((right - left) * (bottom - top)) / (box.width * box.height);
}

/** Keyboard focus, as opposed to the focus a mouse click leaves on a link. */
export function keyboardFocusIn(container: Element): boolean {
  const active = document.activeElement;
  if (!active || !container.contains(active)) return false;
  try {
    return active.matches(':focus-visible');
  } catch {
    return false; // a browser that cannot say: treat it as not keyboard
  }
}
