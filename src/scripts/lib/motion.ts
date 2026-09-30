/**
 * One reduced-motion query for the whole site.
 *
 * Scripts that only need to know read `prefersReducedMotion()`; the one that
 * has to follow the setting while the page is open (loop-videos) listens to
 * the query itself.
 */
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => reduceMotion.matches;
