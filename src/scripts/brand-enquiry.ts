/**
 * The brand enquiry form (src/components/BrandEnquiry.astro): two steps in
 * place, then one submission, reporting what actually happened.
 *
 * Steps (27 October 2026): step 1 asks who you are, step 2 what the brief
 * is. "Get started" checks step 1 and swaps in step 2; Back swaps step 1 back
 * with everything still filled in. Each step is checked before it is left,
 * with a message under any field that stops it; step 2 has no required
 * fields since 28 October 2026, so its check always passes and it can be
 * sent empty. Both steps are one form, so the send at the end carries every
 * field from both, and the step 2 ones are sent blank rather than left out
 * when nothing was chosen, so every enquiry has the same fields.
 *
 * Four states, held on the wrapper as `data-state`: idle, sending, done,
 * error. The stylesheet reads it, so the states are not described twice.
 *
 * Sent the same way as a creator application (src/scripts/lib/send.ts): to
 * the Apps Script, which emails it to partnerships@, with a copy to Netlify
 * Forms. The script's email prints a name, an email and a message, so step 2
 * and the company are also written into `message`; Netlify Forms only keeps
 * the fields in the form's markup, so it stores each answer on its own and
 * ignores that summary.
 *
 * **Success is never assumed.** `done` is set in exactly one place, after the
 * copy that decides has confirmed it: the script's {"success":true}, meaning
 * the email went, or Netlify's 2xx when no script URL is set. A refusal, a
 * non-2xx, a network failure and a timeout all land in the same branch and
 * bring the form back with every field still filled in, because nothing is
 * cleared until success.
 */
import { deliver } from './lib/send';

type Control = HTMLInputElement | HTMLTextAreaElement;

const root = document.querySelector<HTMLElement>('[data-enquiry]');
const form = document.querySelector<HTMLFormElement>('[data-enquiry-form]');
const button = document.querySelector<HTMLButtonElement>('[data-enquiry-button]');
const label = document.querySelector<HTMLElement>('[data-enquiry-label]');
const back = document.querySelector<HTMLButtonElement>('[data-enquiry-back]');
const count = document.querySelector<HTMLElement>('[data-enquiry-count]');
const status = document.querySelector<HTMLElement>('[data-enquiry-status]');
const done = document.querySelector<HTMLElement>('[data-enquiry-done]');

const ERROR =
  'That did not go through. Try again in a moment, or email us at ' +
  '<a href="mailto:hello@amavisocials.com">hello@amavisocials.com</a>.';

if (root && form && button && label && back && count && status && done) {
  const steps = [...form.querySelectorAll<HTMLElement>('[data-enquiry-step]')];
  const segments = [...form.querySelectorAll<HTMLElement>('[data-enquiry-segment]')];
  let current = 1;

  const show = (step: number, { focus = true } = {}) => {
    current = step;
    form.dataset.steps = 'ready';
    form.dataset.current = String(step);
    count.textContent = `Step ${step} of ${steps.length}`;
    segments.forEach((segment, i) => segment.classList.toggle('is-on', i < step));
    back.hidden = step === 1;
    label.textContent = step === steps.length ? 'Send enquiry' : 'Get started';
    if (focus) {
      // The first thing to answer on the step that just came in.
      steps[step - 1].querySelector<HTMLElement>('input:not([type=hidden]), textarea')?.focus();
    }
  };

  const setState = (state: 'idle' | 'sending' | 'done' | 'error') => {
    root.dataset.state = state;
    button.disabled = state === 'sending';
    back.disabled = state === 'sending';
    label.textContent = state === 'sending' ? 'Sending...' : current === steps.length ? 'Send enquiry' : 'Get started';
  };

  const errorFor = (field: Control) =>
    document.getElementById(field.getAttribute('aria-describedby') ?? '');

  /** Every required field on one step that fails, each told why under it. */
  const check = (step: HTMLElement) => {
    const problems: Control[] = [];
    step.querySelectorAll<Control>('input[required], textarea[required]').forEach((field) => {
      const slot = errorFor(field);
      field.value = field.value.trim() === '' ? '' : field.value;
      if (field.checkValidity()) {
        field.removeAttribute('aria-invalid');
        if (slot) slot.textContent = '';
        return;
      }
      field.setAttribute('aria-invalid', 'true');
      if (slot) {
        slot.textContent =
          field.type === 'email' && field.value ? 'That email address does not look right.' : (field.dataset.error ?? 'Please fill this in.');
      }
      problems.push(field);
    });
    return problems;
  };

  /** The step 2 fields, sent blank when nothing was chosen or typed. */
  const BRIEF = ['needs[]', 'creators_per_month', 'start', 'brand'];

  /**
   * Step 2 and the company as one readable message, for the email. The
   * company is required, so the message is never empty, which the script's
   * enquiry_ insists on; anything on step 2 left blank is simply left out.
   */
  const summary = (data: FormData) => {
    const line = (name: string, value: string) => (value ? `${name}: ${value}` : '');
    const needs = data.getAll('needs[]').map(String).filter(Boolean).join(', ');
    const brand = String(data.get('brand') ?? '').trim();
    return [
      line('Company', String(data.get('company') ?? '')),
      line('Needs help with', needs),
      line('Creators per month', String(data.get('creators_per_month') ?? '')),
      line('Wants to start', String(data.get('start') ?? '')),
      ...(brand ? ['', 'About the brand:', brand] : []),
    ]
      .filter((text, i, all) => text !== '' || (i > 0 && all[i - 1] !== ''))
      .join('\n')
      .trim();
  };

  back.addEventListener('click', () => {
    status.textContent = '';
    if (root.dataset.state === 'error') setState('idle');
    show(1);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return; // No double submits.

    const problems = check(steps[current - 1]);
    if (problems.length) {
      problems[0].focus();
      return;
    }

    if (current < steps.length) {
      show(current + 1);
      return;
    }

    status.textContent = '';
    setState('sending');

    const data = new FormData(form);
    const body = new URLSearchParams();
    for (const [key, value] of data) body.append(key, String(value));
    for (const key of BRIEF) if (!body.has(key)) body.append(key, '');
    body.set('message', summary(data));

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
    const field = event.target as Control;
    if (field.hasAttribute('aria-invalid')) {
      field.removeAttribute('aria-invalid');
      const slot = errorFor(field);
      if (slot) slot.textContent = '';
    }
    if (root.dataset.state === 'error') {
      status.textContent = '';
      setState('idle');
    }
  });

  show(1, { focus: false });
}
