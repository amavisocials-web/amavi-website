/**
 * The services row on the home page (src/components/ServicesSlider.astro).
 *
 * Layered on markup that works without it: the row is a scroll-snapping strip
 * of cards, which is what a phone keeps and what a page without JavaScript
 * gets at every width. This script marks the slider "ready" — which is what
 * turns the paged CSS on from 48em — and then drives it.
 *
 * A page is a whole view, not a card: the track moves by the viewport's width
 * plus one gap, so two cards change together on a desktop and one on a
 * tablet. How many fit is measured rather than assumed, so the breakpoints
 * live in the stylesheet alone.
 *
 * Cards that aren't on the page are `inert` — out of the tab order, so a Tab
 * can't land behind the edge — and because that changes what the polite live
 * region holds, the new cards are announced.
 */

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

for (const root of document.querySelectorAll<HTMLElement>('[data-slider]')) {
  const viewport = root.querySelector<HTMLElement>('[data-viewport]');
  const track = root.querySelector<HTMLElement>('[data-track]');
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const cards = track ? ([...track.children] as HTMLElement[]) : [];
  if (!viewport || !track || !prev || !next || !count || cards.length === 0) continue;

  /** Paged from 48em up; below that the row is swiped and nothing is driven. */
  const paged = window.matchMedia('(min-width: 48em)');
  let page = 0;

  const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;
  const cardWidth = () => cards[0].getBoundingClientRect().width;
  const step = () => viewport.clientWidth + gap();

  /** One card and one gap, kept from the last render: a swipe then reads the
      position without measuring anything and forcing a layout per frame. */
  let cardStep = 0;

  /** Measured, so the card count per view follows the CSS rather than a copy of it. */
  const perView = () => Math.max(1, Math.round(step() / (cardWidth() + gap())));
  const pages = () => Math.max(1, Math.ceil(cards.length / perView()));

  const render = () => {
    cardStep = cardWidth() + gap();

    if (!paged.matches) {
      // Swiping: the browser owns the position; the count follows the scroll.
      track.style.transform = '';
      for (const card of cards) card.inert = false;
      showCount(Math.round(viewport.scrollLeft / cardStep) + 1, cards.length);
      return;
    }

    const total = pages();
    const per = perView();
    page = clamp(page, 0, total - 1);
    const first = page * per;

    // Never past the end of the track, so a last page that isn't full stops
    // against the edge rather than opening a gap.
    const limit = Math.max(0, track.scrollWidth - viewport.clientWidth);
    track.style.transform = `translateX(${-Math.min(page * step(), limit)}px)`;

    cards.forEach((card, i) => { card.inert = i < first || i >= first + per; });
    prev.disabled = page === 0;
    next.disabled = page >= total - 1;
    showCount(page + 1, total);
  };

  const showCount = (at: number, of: number) => {
    const text = `${clamp(at, 1, of)} / ${of}`;
    if (count.textContent !== text) count.textContent = text;
  };

  const go = (delta: number) => {
    const before = page;
    page = clamp(page + delta, 0, pages() - 1);
    if (page !== before) render();
  };

  // Only now does the CSS page anything, so a page without this script keeps
  // a row it can still reach every card in.
  root.dataset.slider = 'ready';
  render();

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  // The arrow keys page it while anything inside has focus.
  root.addEventListener('keydown', (event) => {
    if (!paged.matches || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    go(event.key === 'ArrowRight' ? 1 : -1);
  });

  // A resize can change how many cards fit, and the width every page steps by.
  window.addEventListener('resize', render);
  paged.addEventListener('change', () => { page = 0; render(); });

  // Swiping: arithmetic on the cached step, so a scroll never measures.
  viewport.addEventListener('scroll', () => {
    if (paged.matches || cardStep <= 0) return;
    showCount(Math.round(viewport.scrollLeft / cardStep) + 1, cards.length);
  }, { passive: true });
}
