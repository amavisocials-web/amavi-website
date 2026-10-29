/**
 * The subscribe block, submitting in place.
 *
 * Layered on a form that already works: the markup posts to Netlify Forms on
 * its own, so with no JavaScript an address is still captured. This only
 * takes over to keep the reader on the page, which is the whole reason the
 * four states exist.
 *
 * The one rule it holds to: **success is only ever shown when the submission
 * actually succeeded.** Anything else — a rejected status, a network failure,
 * a timeout — puts the form back with a way to reach a human.
 *
 * The address is checked before anything is sent, so a typo costs nothing and
 * says so inline rather than through a round trip: a short line right under
 * the field (since 28 October 2026), one for an empty field and one for an
 * address that is not one. A failed send is said under the button instead.
 */
import { isEmail } from './lib/validate';

const TIMEOUT = 15000;

const WORDS = {
  empty: 'Please add your email address.',
  invalid: 'That email address does not look right.',
  failed: `That didn't go through. Try again in a moment, or email ${'hello@amavisocials.com'}.`,
};

for (const root of document.querySelectorAll<HTMLElement>('[data-subscribe]')) {
  const form = root.querySelector<HTMLFormElement>('[data-subscribe-form]');
  const email = root.querySelector<HTMLInputElement>('[data-subscribe-email]');
  const button = root.querySelector<HTMLButtonElement>('[data-subscribe-button]');
  const label = root.querySelector<HTMLElement>('[data-subscribe-label]');
  const status = root.querySelector<HTMLElement>('[data-subscribe-status]');
  const error = root.querySelector<HTMLElement>('[data-subscribe-error]');
  const done = root.querySelector<HTMLElement>('[data-subscribe-done]');
  if (!form || !email || !button || !label || !status || !error || !done) continue;

  const idleLabel = label.textContent ?? 'Subscribe';
  let sending = false;

  const say = (message: string) => { status.textContent = message; };

  /** The line under the field, and the field marked to match. */
  const complain = (message: string) => {
    error.textContent = message;
    if (message) email.setAttribute('aria-invalid', 'true');
    else email.removeAttribute('aria-invalid');
  };

  const setState = (state: 'idle' | 'sending' | 'done' | 'error') => {
    root.dataset.state = state;
    sending = state === 'sending';
    button.disabled = sending;
    label.textContent = sending ? 'Subscribing...' : idleLabel;
    done.hidden = state !== 'done';
  };

  // The browser's own bubble says nothing useful here, and the message below
  // is in the page where a screen reader will read it.
  form.noValidate = true;

  // Typing again clears the complaint rather than leaving it under an
  // address that may already be right.
  email.addEventListener('input', () => {
    if (email.getAttribute('aria-invalid') === 'true') complain('');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // One submission at a time: the button is disabled too, but Enter in the
    // field can outrun a disabled button on some browsers.
    if (sending) return;

    const address = email.value.trim();
    if (!isEmail(address)) {
      complain(address ? WORDS.invalid : WORDS.empty);
      email.focus();
      return;
    }

    complain('');
    say('');
    setState('sending');

    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
    // Where it goes: the component's own ENDPOINT if one has been set, and
    // Netlify Forms until then, which by fetch means the site root, not the
    // page's action.
    const url = root.dataset.endpoint || '/';

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Subscribe responded ${response.status}`);
      setState('done');
      done.focus?.();
    } catch {
      setState('error');
      say(WORDS.failed);
    } finally {
      window.clearTimeout(timer);
    }
  });
}
