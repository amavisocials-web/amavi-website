/**
 * The brand enquiry form (src/components/BrandEnquiry.astro): submits in place
 * and reports what actually happened.
 *
 * Four states, held on the wrapper as `data-state`: idle, sending, done,
 * error. The stylesheet reads it, so the states are not described twice.
 *
 * Sent the same way as a creator application (src/scripts/lib/send.ts): to
 * the Apps Script, which emails it to partnerships@, with a copy to Netlify
 * Forms. Until 23 October 2026 it went to Netlify Forms alone, whose email
 * notifications need a paid plan, so nobody was told an enquiry had arrived.
 *
 * **Success is never assumed.** `done` is set in exactly one place, after the
 * copy that decides has confirmed it: the script's {"success":true}, meaning
 * the email went, or Netlify's 2xx when no script URL is set. A refusal, a
 * non-2xx, a network failure and a timeout all land in the same branch and
 * bring the form back with every field still filled in, because nothing is
 * cleared until success.
 */
import { deliver } from './lib/send';

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

    try {
      /* The only place `done` is set. The form's own `action` still points at
         /contact/ for the no-JavaScript fallback, which reaches Netlify Forms
         but emails nobody. */
      await deliver(body, form.dataset.sheetsEndpoint);

      setState('done');
      done.hidden = false;
      done.setAttribute('tabindex', '-1');
      done.focus();
    } catch (reason) {
      /* Fields are untouched, so the form returns exactly as it was left. */
      console.error('[amavi] brand enquiry not sent.', reason);
      setState('error');
      status.innerHTML = ERROR;
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
