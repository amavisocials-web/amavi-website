/**
 * Every accordion on the site: the practice areas on the home page and
 * /services (src/components/ServiceList.astro), and the two routes on Get in
 * touch (src/components/ContactRoutes.astro). One list is one accordion, and
 * a page may carry several.
 *
 * The markup contract: [data-accordion] on the list, [data-accordion-item] on
 * each row, with [data-trigger] and [data-panel] inside it. The script sets
 * data-open on the row and marks the list ready, which is what the component's
 * own CSS collapses on.
 *
 * Layered on markup that works without it: every panel is in the page, open,
 * so with no JavaScript the page reads as a set of sections under their
 * headings. This script marks each list "ready" — which is what turns the
 * collapsing CSS on — and then closes them all.
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

/** Every accordion on the page, each opening and closing on its own. */
for (const list of document.querySelectorAll<HTMLElement>('[data-accordion]')) {
  const items: Item[] = [...list.querySelectorAll<HTMLElement>('[data-accordion-item]')].flatMap((root) => {
    const trigger = root.querySelector<HTMLButtonElement>('[data-trigger]');
    const panel = root.querySelector<HTMLElement>('[data-panel]');
    return trigger && panel ? [{ root, trigger, panel }] : [];
  });

  const setOpen = (item: Item, open: boolean) => {
    item.root.dataset.open = String(open);
    item.trigger.setAttribute('aria-expanded', String(open));
    item.panel.inert = !open;
  };

  /** Opening one closes the rest of that list; passing null closes everything. */
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
    // No hash is not a match for a row without an id: without this, an empty
    // string finds the first row whose id is "" and opens it on every load.
    if (!id) return;
    const match = items.find((item) => item.root.id === id);
    if (!match) return;
    openOnly(match);
    if (focus) match.trigger.focus({ preventScroll: true });
    match.root.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  openFromHash();
  window.addEventListener('hashchange', () => openFromHash({ focus: true }));
}
