/**
 * The service areas on /services, as an accordion.
 *
 * Layered on markup that works without it: every panel is in the page, open,
 * so with no JavaScript the page reads as four sections under their headings.
 * This script marks the list "ready" — which is what turns the collapsing CSS
 * on — and then closes them all.
 *
 * Each trigger is a real button inside its heading, so Enter and Space toggle
 * and Tab moves between them. A closed panel is `inert`: its links leave the
 * tab order and the accessibility tree, rather than sitting invisible but
 * reachable behind a collapsed row.
 *
 * One open at a time. A link from elsewhere — /services/#creator-marketing —
 * opens that one and scrolls it into view.
 */

interface Item {
  root: HTMLElement;
  trigger: HTMLButtonElement;
  panel: HTMLElement;
}

import { prefersReducedMotion as reducedMotion } from './lib/motion';

const list = document.querySelector<HTMLElement>('[data-accordion]');

if (list) {
  const items: Item[] = [...list.querySelectorAll<HTMLElement>('[data-area]')].flatMap((root) => {
    const trigger = root.querySelector<HTMLButtonElement>('[data-trigger]');
    const panel = root.querySelector<HTMLElement>('[data-panel]');
    return trigger && panel ? [{ root, trigger, panel }] : [];
  });

  const setOpen = (item: Item, open: boolean) => {
    item.root.dataset.open = String(open);
    item.trigger.setAttribute('aria-expanded', String(open));
    item.panel.inert = !open;
  };

  /** Opening one closes the rest; passing null closes everything. */
  const openOnly = (chosen: Item | null) => items.forEach((item) => setOpen(item, item === chosen));

  // Only now does the CSS collapse anything, so a page without this script
  // never hides content it can't reopen.
  list.dataset.accordion = 'ready';
  openOnly(null);

  for (const item of items) {
    item.trigger.addEventListener('click', () => {
      const isOpen = item.trigger.getAttribute('aria-expanded') === 'true';
      openOnly(isOpen ? null : item);
    });
  }

  const openFromHash = ({ focus = false } = {}) => {
    const id = decodeURIComponent(location.hash.slice(1));
    const match = items.find((item) => item.root.id === id);
    if (!match) return;
    openOnly(match);
    if (focus) match.trigger.focus({ preventScroll: true });
    match.root.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  openFromHash();
  window.addEventListener('hashchange', () => openFromHash({ focus: true }));
}
