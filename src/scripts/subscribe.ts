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
 * says so inline rather than through a round trip.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TIMEOUT = 15000;

const WORDS = {
  invalid: 'That does not look like an email address. Check it and try again.',
  failed: `That didn't go through. Try again in a moment, or email ${'hello@amavisocials.com'}.`,
};

for (const root of document.querySelectorAll<HTMLElement>('[data-subscribe]')) {
  const form = root.querySelector<HTMLFormElement>('[data-subscribe-form]');
  const email = root.querySelector<HTMLInputElement>('[data-subscribe-email]');
  const button = root.querySelector<HTMLButtonElement>('[data-subscribe-button]');
  const label = root.querySelector<HTMLElement>('[data-subscribe-label]');
  const status = root.querySelector<HTMLElement>('[data-subscribe-status]');
  const done = root.querySelector<HTMLElement>('[data-subscribe-done]');
  if (!form || !email || !button || !label || !status || !done) continue;

  const idleLabel = label.textContent ?? 'Subscribe';
  let sending = false;

  const say = (message: string) => { status.textContent = message; };

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

  email.addEventListener('input', () => {
    if (email.getAttribute('aria-invalid') !== 'true') return;
    email.removeAttribute('aria-invalid');
    say('');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // One submission at a time: the button is disabled too, but Enter in the
    // field can outrun a disabled button on some browsers.
    if (sending) return;

    const address = email.value.trim();
    if (!EMAIL.test(address)) {
      email.setAttribute('aria-invalid', 'true');
      say(WORDS.invalid);
      email.focus();
      return;
    }

    say('');
    setState('sending');

    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
    // Where it goes: the component's own ENDPOINT if one has been set, and
    // the form's action — Netlify Forms — until then.
    const url = root.dataset.endpoint || form.getAttribute('action') || '/';

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
