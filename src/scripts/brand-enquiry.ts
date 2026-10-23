/**
 * The brand enquiry form (src/components/BrandEnquiry.astro): submits in place
 * and reports what actually happened.
 *
 * Four states, held on the wrapper as `data-state`: idle, sending, done,
 * error. The stylesheet reads it, so the states are not described twice.
 *
 * **Success is never assumed.** `done` is set in exactly one place, after a
 * response that `res.ok` is true for. A non-2xx status, a network failure and
 * a timeout all land in the same branch and bring the form back with every
 * field still filled in, because nothing is cleared until success.
 */
const TIMEOUT_MS = 15000;

const root = document.querySelector<HTMLElement>('[data-enquiry]');
const form = document.querySelector<HTMLFormElement>('[data-enquiry-form]');
const button = document.querySelector<HTMLButtonElement>('[data-enquiry-button]');
const label = document.querySelector<HTMLElement>('[data-enquiry-label]');
const status = document.querySelector<HTMLElement>('[data-enquiry-status]');
const done = document.querySelector<HTMLElement>('[data-enquiry-done]');

const ERROR =
  'That did not go through. Try again in a moment, or email us at ' +
  '<a href="mailto:hello@amavisocials.com">hello@amavisocials.com</a>.';

if (root && form && button && label && status && done) {
  const setState = (state: 'idle' | 'sending' | 'done' | 'error') => {
    root.dataset.state = state;
    button.disabled = state === 'sending';
    label.textContent = state === 'sending' ? 'Sending...' : 'Get started';
  };

  /** The browser's own validity, reported in our own words. */
  const firstInvalid = () => {
    for (const el of form.elements) {
      const field = el as HTMLInputElement | HTMLTextAreaElement;
      if (!field.name || field.name === 'form-name' || field.name === 'company_website') continue;
      if (typeof field.checkValidity !== 'function') continue;
      field.removeAttribute('aria-invalid');
      if (!field.checkValidity()) return field;
    }
    return null;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return; // No double submits.

    const invalid = firstInvalid();
    if (invalid) {
      invalid.setAttribute('aria-invalid', 'true');
      status.textContent =
        invalid.type === 'email' && invalid.value
          ? 'That email address does not look right.'
          : 'Please fill in every field.';
      setState('error');
      invalid.focus();
      return;
    }

    status.textContent = '';
    setState('sending');

    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(form.getAttribute('action') || '/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.signal,
      });

      /* The only place `done` is set, and only for a response the browser
         itself calls ok. A 404 from a form Netlify never registered, a 500,
         anything else: all of it falls through to the catch below. */
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setState('done');
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus();
    } catch {
      /* Fields are untouched, so the form returns exactly as it was left. */
      setState('error');
      status.innerHTML = ERROR;
    } finally {
      clearTimeout(timer);
    }
  });

  /* Typing again clears the complaint, rather than leaving it under a field
     the person has already corrected. */
  form.addEventListener('input', (event) => {
    const field = event.target as HTMLElement;
    if (field.hasAttribute('aria-invalid')) field.removeAttribute('aria-invalid');
    if (root.dataset.state === 'error') {
      status.textContent = '';
      setState('idle');
    }
  });
}
