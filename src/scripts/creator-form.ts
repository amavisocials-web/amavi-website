/**
 * The creator application's behaviour: six steps in one card, each checked
 * before the next, a review of every answer, and a submission that lands in
 * Google Sheets with Netlify Forms as the backup.
 *
 * Layered on a form that already works without it. The markup is one long
 * form that posts natively to Netlify Forms under the browser's own
 * validation. An inline script marks it data-stepper="pending" before first
 * paint, so the CSS lays it out as steps straight away; this module then takes
 * over ("ready"). If this module never arrives, the inline script's timer puts
 * the long form back ("off"). If it arrives after that, it leaves the long
 * form in place and handles only validation and sending.
 *
 * Sending (JS justification, brief §7: a visible success state, a visible
 * error state, never a silent failure): the application is POSTed to the
 * Google Apps Script web app in data-sheets-endpoint, which appends the row to
 * the creators database and emails AMAVI a copy
 * (scripts/google-sheets-handler.gs), and, at the same time, to Netlify Forms,
 * which keeps the backup copy.
 *
 * Only the endpoint's reply decides what the applicant sees: "Application
 * received" appears after {"success":true} and nothing else. A refusal, a
 * non-2xx, a dropped connection or the 20-second timeout all show the error
 * state instead, with everything typed still in place. The backup copy is
 * attempted either way and its outcome is logged, never shown — a page served
 * from anywhere but Netlify would otherwise "confirm" an application that
 * never reached AMAVI.
 */

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

import { prefersReducedMotion as reducedMotion } from './lib/motion';
import { deliver } from './lib/send';

/* --- Field errors ------------------------------------------------------------ */

function errorSlot(el: Element): HTMLElement | null {
  for (const id of (el.getAttribute('aria-describedby') ?? '').split(/\s+/)) {
    const node = id ? document.getElementById(id) : null;
    if (node?.classList.contains('field__error')) return node;
  }
  return null;
}

function setError(el: Element, message: string) {
  el.setAttribute('aria-invalid', 'true');
  const slot = errorSlot(el);
  if (slot) slot.textContent = message;
}

function clearError(el: Element) {
  el.removeAttribute('aria-invalid');
  const slot = errorSlot(el);
  if (slot) slot.textContent = '';
}

/* --- Links ------------------------------------------------------------------- */

/** "@name" or "name" → the platform's link; "site.com/x" → "https://site.com/x". */
function toLink(raw: string, base?: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (base && (value.startsWith('@') || !/[./]/.test(value))) return base + value.replace(/^@/, '');
  return /^https?:\/\//i.test(value) ? value : `https://${value.replace(/^\/+/, '')}`;
}

/**
 * A handle, without the "@" and without the profile URL someone pasted:
 * "@name", "instagram.com/name" and "https://www.tiktok.com/@name" all become
 * "name". The field shows its own "@", so one typed here would double it.
 */
function toHandle(raw: string): string {
  let value = raw.trim();
  if (/^https?:\/\//i.test(value) || /^[\w-]+(\.[\w-]+)+\//.test(value)) {
    value = (value.split(/[?#]/)[0].replace(/\/+$/, '').split('/').pop() ?? '').trim();
  }
  return value.replace(/^@+/, '').trim();
}

function isLink(value: string): boolean {
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && url.hostname.includes('.');
  } catch {
    return false;
  }
}

function describe(control: Control): string {
  if (control.type === 'email' && control.validity.typeMismatch) {
    return 'Please enter a valid email address, like name@example.com.';
  }
  return control.dataset.error ?? 'This field is required.';
}

function reasonFor(error: unknown): string {
  if (!navigator.onLine) return 'You appear to be offline.';
  if (error instanceof DOMException && error.name === 'AbortError') return 'It took too long to reach us.';
  return 'Something went wrong on the way.';
}

/* --- Validation --------------------------------------------------------------- */

/** Every problem inside `scope` — one step, or the whole form — in page order. */
function validate(scope: HTMLElement): HTMLElement[] {
  const problems: HTMLElement[] = [];

  // Required and typed fields (radios and link fields are handled below).
  const simple = scope.querySelectorAll<Control>(
    'input:not([type=hidden]):not([type=radio]):not([data-link]):not([name=company_website]), select, textarea',
  );
  for (const control of simple) {
    clearError(control);
    if (!control.checkValidity()) {
      setError(control, describe(control));
      problems.push(control);
    }
  }

  // Radio groups: one choice required.
  for (const group of scope.querySelectorAll<HTMLElement>('[data-radio-group]')) {
    clearError(group);
    const chips = group.querySelector('.chips');
    chips?.removeAttribute('aria-invalid');
    if (!group.querySelector('input:checked')) {
      setError(group, 'Please choose how you like to collaborate.');
      chips?.setAttribute('aria-invalid', 'true');
      const first = group.querySelector<HTMLInputElement>('input');
      if (first) problems.push(first);
    }
  }

  // Links: normalise each one given; flag, without rewriting, any that aren't.
  const links = [...scope.querySelectorAll<HTMLInputElement>('[data-link]')];
  for (const input of links) {
    clearError(input);
    if (!input.value.trim()) continue;
    const link = toLink(input.value, input.dataset.handleBase);
    if (isLink(link)) {
      input.value = link;
    } else {
      setError(input, 'That doesn’t look like a link or an @handle.');
      problems.push(input);
    }
  }

  // At least one channel, so a brand has something to look at.
  const channelSet = scope.querySelector<HTMLElement>('[data-channels]');
  if (channelSet) {
    clearError(channelSet);
    const fields = [...channelSet.querySelectorAll<HTMLInputElement>('input[name]')];
    if (!fields.some((field) => field.value.trim()) && fields[0]) {
      setError(channelSet, 'Add at least one channel, so brands can see your work.');
      problems.push(fields[0]);
    }
  }

  // Rates: asked for only once the answer is Paid or Both, which is also the
  // only time they're on screen.
  const rateGroup = scope.querySelector<HTMLElement>('[data-rate-group]');
  const ratesShown = rateGroup && !rateGroup.closest<HTMLElement>('[data-rates]')?.hidden;
  if (rateGroup && ratesShown) {
    clearError(rateGroup);
    const rates = [...rateGroup.querySelectorAll<HTMLInputElement>('[data-rate]')];
    if (!rates.some((rate) => rate.value.trim()) && rates[0]) {
      setError(rateGroup, 'Add at least one rate, or choose Gifted above.');
      problems.push(rates[0]);
    }
  }

  return problems.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  );
}

/* --- Review ------------------------------------------------------------------- */

/** A label's text without its "(optional)" aside. */
function labelText(el: Element | null | undefined): string {
  if (!el) return '';
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll('.field__optional, .visually-hidden').forEach((n) => n.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function labelFor(control: Control): string {
  if (control.type === 'checkbox' || control.type === 'radio') {
    const id = control.closest('[role=group], [role=radiogroup]')?.getAttribute('aria-labelledby');
    return labelText(id ? document.getElementById(id) : null);
  }
  return labelText(control.labels?.[0]);
}

/** A step's answers as [label, value] pairs, in order, leaving out blanks. */
function answers(step: HTMLElement): Array<[string, string]> {
  const rows: Array<[string, string]> = [];
  const seen = new Set<string>();
  for (const control of step.querySelectorAll<Control>('input[name], select[name], textarea[name]')) {
    const { name } = control;
    if (seen.has(name) || control.type === 'hidden') continue;
    seen.add(name);

    // e.g. the currency only matters when at least one rate was given.
    const onlyIf = control.dataset.reviewIf;
    if (onlyIf && ![...step.querySelectorAll<Control>(onlyIf)].some((c) => c.value.trim())) continue;

    const value =
      control.type === 'checkbox' || control.type === 'radio'
        ? [...step.querySelectorAll<HTMLInputElement>(`input[name="${CSS.escape(name)}"]:checked`)]
            .map((c) => c.value)
            .join(', ')
        : control.value.trim();
    if (value) rows.push([labelFor(control), value]);
  }
  return rows;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* --- Sending ------------------------------------------------------------------ */

// src/scripts/lib/send.ts, shared with the brand enquiry on /contact.

/* --- The form ------------------------------------------------------------------ */

function enhance(form: HTMLFormElement) {
  form.noValidate = true;

  const stepped = form.dataset.stepper === 'pending';
  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  const viewport = form.querySelector<HTMLElement>('[data-viewport]');
  const track = form.querySelector<HTMLElement>('[data-track]');
  const count = form.querySelector<HTMLElement>('[data-progress-count]');
  const segments = [...form.querySelectorAll<HTMLElement>('[data-segment]')];
  const review = form.querySelector<HTMLElement>('[data-review]');
  const back = form.querySelector<HTMLButtonElement>('[data-back]');
  const next = form.querySelector<HTMLButtonElement>('[data-next]');
  const hint = form.querySelector<HTMLElement>('[data-form-hint]');
  const failBox = form.querySelector<HTMLElement>('[data-form-error]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const links = [...form.querySelectorAll<HTMLInputElement>('[data-link]')];
  const handles = [...form.querySelectorAll<HTMLInputElement>('[data-handle]')];
  const rates = form.querySelector<HTMLElement>('[data-rates]');
  const rateInputs = [...form.querySelectorAll<HTMLInputElement>('[data-rate]')];
  const preference = [...form.querySelectorAll<HTMLInputElement>('input[name="collaboration_preference"]')];
  const endpoint = form.dataset.sheetsEndpoint;
  const last = steps.length - 1;

  let current = 0;
  let sending = false;

  // A typed "@" goes as it's typed; a pasted profile link is cut back to the
  // handle when the field is left, where rewriting mid-word would fight the
  // person typing.
  for (const input of handles) {
    input.addEventListener('input', () => {
      if (input.value.startsWith('@')) input.value = input.value.replace(/^@+/, '');
    });
    input.addEventListener('blur', () => {
      const handle = toHandle(input.value);
      if (handle !== input.value) input.value = handle;
    });
  }

  /**
   * Rates belong to Paid and Both. On Gifted they leave the step altogether,
   * and anything typed goes with them: a hidden field must never decide
   * whether the step passes, or turn up in the application.
   */
  const syncRates = () => {
    if (!rates) return;
    const charging = preference.some((option) => option.checked && option.value !== 'Gifted');
    rates.hidden = !charging;
    if (charging) return;
    rateInputs.forEach((input) => { input.value = ''; });
    const group = form.querySelector<HTMLElement>('[data-rate-group]');
    if (group) clearError(group);
  };
  preference.forEach((option) => option.addEventListener('change', syncRates));
  syncRates();

  // Show the link that will actually be sent as soon as the field is left —
  // but only when it is one. Anything else stays exactly as typed, to be
  // flagged, rather than rewritten into something the person didn't enter.
  for (const input of links) {
    input.addEventListener('blur', () => {
      const link = toLink(input.value, input.dataset.handleBase);
      if (link && isLink(link)) input.value = link;
    });
  }

  // Clear each error the moment it's fixed, rather than on the next attempt.
  form.addEventListener('input', (event) => {
    const target = event.target as Control;
    if (target.type === 'radio') {
      const group = target.closest<HTMLElement>('[data-radio-group]');
      if (group) {
        clearError(group);
        group.querySelector('.chips')?.removeAttribute('aria-invalid');
      }
      return;
    }
    if (target.getAttribute('aria-invalid') === 'true') {
      const fixed = target.hasAttribute('data-link')
        ? !target.value.trim() || isLink(toLink(target.value, (target as HTMLInputElement).dataset.handleBase))
        : target.checkValidity();
      if (fixed) clearError(target);
    }
    const channelSet = target.closest<HTMLElement>('[data-channels]');
    if (channelSet && target.value.trim()) clearError(channelSet);
  });

  const setLabel = (text: string) => {
    if (next) next.textContent = text;
  };

  const reveal = (target: HTMLElement) => {
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  /* --- Steps ------------------------------------------------------------------ */

  const fitHeight = () => {
    if (viewport && steps[current]) viewport.style.height = `${steps[current].offsetHeight}px`;
  };

  const renderReview = () => {
    if (!review) return;
    review.replaceChildren();
    steps.slice(0, last).forEach((step, index) => {
      const group = el('div', 'review__group');
      const head = el('div', 'review__head');
      const title = labelText(step.querySelector('[data-step-title]'));
      const edit = el('button', 'review__edit', 'Edit');
      edit.type = 'button';
      edit.append(el('span', 'visually-hidden', ` ${title}`));
      edit.addEventListener('click', () => show(index));
      head.append(el('h3', 'review__title', title), edit);
      group.append(head);

      const rows = answers(step);
      if (rows.length) {
        const list = el('dl', 'review__list');
        for (const [label, value] of rows) {
          const row = el('div', 'review__row');
          row.append(el('dt', undefined, label), el('dd', undefined, value));
          list.append(row);
        }
        group.append(list);
      } else {
        group.append(el('p', 'review__empty', 'Nothing added.'));
      }
      review.append(group);
    });
    review.hidden = false;
  };

  function show(index: number, { focus = true } = {}) {
    current = Math.max(0, Math.min(index, last));
    if (hint) hint.textContent = '';
    if (failBox) failBox.hidden = true;

    steps.forEach((step, i) => {
      step.inert = i !== current;
    });
    if (current === last) renderReview();

    if (track) track.style.transform = `translateX(${-100 * current}%)`;
    fitHeight();

    if (count) count.textContent = `Step ${current + 1} of ${steps.length}`;
    segments.forEach((segment, i) => segment.classList.toggle('is-on', i <= current));
    if (back) back.hidden = current === 0;
    setLabel(current === last ? 'Send application' : 'Next');

    if (!focus) return;
    steps[current].querySelector<HTMLElement>('[data-step-title]')?.focus({ preventScroll: true });
    // Bring the top of the card back into view if a long step left it above
    // the screen.
    if (form.getBoundingClientRect().top < 0) {
      form.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }

  // The button's two layout-driven labels become one, set from here on.
  if (!stepped) setLabel('Send application');

  if (stepped) {
    form.dataset.stepper = 'ready';
    // First layout without a slide; transitions come back on the next frame.
    form.classList.add('is-instant');
    show(0, { focus: false });
    requestAnimationFrame(() => requestAnimationFrame(() => form.classList.remove('is-instant')));

    // Follow the current step's height as errors appear or the screen resizes.
    const resize = new ResizeObserver(() => fitHeight());
    steps.forEach((step) => resize.observe(step));

    back?.addEventListener('click', () => show(current - 1));
  }

  /* --- Submit: next step, or send ---------------------------------------------- */

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    if (hint) hint.textContent = '';
    if (failBox) failBox.hidden = true;

    const problems = validate(stepped ? steps[current] : form);
    if (problems.length > 0) {
      if (hint) {
        hint.textContent = problems.length === 1
          ? 'One field needs attention — we’ve taken you to it.'
          : `${problems.length} fields need attention — we’ve taken you to the first.`;
      }
      reveal(problems[0]);
      return;
    }

    if (stepped && current < last) {
      show(current + 1);
      return;
    }

    await send();
  });

  async function send() {
    sending = true;
    if (next) {
      next.disabled = true;
      setLabel('Sending…');
    }
    if (back) back.disabled = true;

    const body = new URLSearchParams();
    for (const [key, value] of new FormData(form)) {
      body.append(key, typeof value === 'string' ? value : value.name);
    }

    try {
      await deliver(body, endpoint);
    } catch (reason) {
      console.error(`[amavi] creator application not sent. ${reasonFor(reason)}`, reason);
      if (failBox) {
        failBox.hidden = false;
        reveal(failBox);
      }
      sending = false;
      if (next) {
        next.disabled = false;
        setLabel('Send application');
      }
      if (back) back.disabled = false;
      return;
    }

    // Confirmed by whichever copy decides, and only then.
    setLabel('Sent');
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    form.hidden = true;
    form.reset();
    if (success) {
      success.hidden = false;
      reveal(success);
    }
  }
}

document.querySelectorAll<HTMLFormElement>('form[data-creator-form]').forEach(enhance);
