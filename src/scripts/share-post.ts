/**
 * "Copy link", and the brief confirmation that it worked.
 *
 * The label changes to "Copied" for a moment and then returns, so the row
 * ends up as it started. It is announced too, through a polite live region,
 * because a label changing back and forth says nothing to a screen reader on
 * its own.
 *
 * The clipboard is not always available — an insecure origin, a browser that
 * refuses, a permission denied — so a failure says so rather than claiming a
 * copy that did not happen.
 *
 * The LinkedIn and X links need nothing from here: they are ordinary links.
 */
const HOLD = 2000;

for (const root of document.querySelectorAll<HTMLElement>('[data-share]')) {
  const button = root.querySelector<HTMLButtonElement>('[data-share-copy]');
  const label = root.querySelector<HTMLElement>('[data-share-copy-label]');
  const status = root.querySelector<HTMLElement>('[data-share-status]');
  const url = root.dataset.url;
  if (!button || !label || !status || !url) continue;

  const idle = label.textContent ?? 'Copy link';
  let timer = 0;

  const announce = (message: string) => {
    label.textContent = message;
    status.textContent = message;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      label.textContent = idle;
      status.textContent = '';
    }, HOLD);
  };

  button.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(url);
      announce('Copied');
    } catch {
      announce('Press Ctrl C to copy');
    }
  });
}
