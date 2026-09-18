/**
 * Behaviour for the creator application, layered on a form that already works
 * without it.
 *
 * JS justification (brief §7): the requirement is a visible success state, a
 * visible error state, and a submission that never fails silently. A native
 * POST hands both outcomes to Netlify's generic pages and loses the failure
 * case entirely; this posts over fetch and shows either result in place, with
 * everything the person typed kept on failure.
 *
 * It also validates inline, and turns "@name" into a full link for that
 * platform — on a phone, typing "https://" is the slowest part of the form.
 *
 * Without JS the form still posts natively under the browser's own validation,
 * which is why `novalidate` is set here at runtime rather than in the markup.
 */

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Long enough for a slow mobile connection; short enough not to hang. */
const TIMEOUT_MS = 20_000;

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

/** "@name" or "name" → the platform's link; "site.com/x" → "https://site.com/x". */
function toLink(raw: string, base?: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (base && (value.startsWith('@') || !/[./]/.test(value))) return base + value.replace(/^@/, '');
  return /^https?:\/\//i.test(value) ? value : `https://${value.replace(/^\/+/, '')}`;
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

function enhance(form: HTMLFormElement) {
  form.noValidate = true;

  const hint = form.querySelector<HTMLElement>('[data-form-hint]');
  const failBox = form.querySelector<HTMLElement>('[data-form-error]');
  const failReason = form.querySelector<HTMLElement>('[data-form-error-reason]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const success = document.querySelector<HTMLElement>('[data-form-success]');
  const channelSet = form.querySelector<HTMLElement>('[data-channels]');
  const links = [...form.querySelectorAll<HTMLInputElement>('[data-link]')];
  const channelLinks = links.filter((l) => channelSet?.contains(l));

  // Show the link that will actually be sent as soon as the field is left —
  // but only when it is one. Anything else stays exactly as typed, to be
  // flagged, rather than rewritten into something the person didn't enter.
  for (const input of links) {
    input.addEventListener('blur', () => {
      const link = toLink(input.value, input.dataset.handleBase);
      if (link && isLink(link)) input.value = link;
    });
  }

  // Clear each error the moment it's fixed, rather than on the next submit.
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
    if (channelSet && channelSet.contains(target) && channelLinks.some((l) => l.value.trim())) {
      clearError(channelSet);
    }
  });

  /** Every problem on the form, in page order. */
  function validate(): HTMLElement[] {
    const problems: HTMLElement[] = [];

    // Required and typed fields (radios and link fields are handled below).
    const simple = form.querySelectorAll<Control>(
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
    for (const group of form.querySelectorAll<HTMLElement>('[data-radio-group]')) {
      clearError(group);
      const chips = group.querySelector('.chips');
      chips?.removeAttribute('aria-invalid');
      if (!form.querySelector(`input[name="${group.dataset.radioGroup}"]:checked`)) {
        setError(group, 'Please choose how you like to collaborate.');
        chips?.setAttribute('aria-invalid', 'true');
        const first = group.querySelector<HTMLInputElement>('input');
        if (first) problems.push(first);
      }
    }

    // Links: normalise each one given; flag, without rewriting, any that aren't.
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
    if (channelSet) {
      clearError(channelSet);
      if (!channelLinks.some((l) => l.value.trim()) && channelLinks[0]) {
        setError(channelSet, 'Add at least one channel, so brands can see your work.');
        problems.push(channelLinks[0]);
      }
    }

    return problems.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    );
  }

  const reveal = (el: HTMLElement) => {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (failBox) failBox.hidden = true;
    if (hint) hint.textContent = '';

    const problems = validate();
    if (problems.length > 0) {
      // On a phone the submit button is far from the first mistake: say so here,
      // then go to it.
      if (hint) {
        hint.textContent = problems.length === 1
          ? 'One field needs attention — we’ve taken you to it.'
          : `${problems.length} fields need attention — we’ve taken you to the first.`;
      }
      reveal(problems[0]);
      return;
    }

    const label = submit?.textContent ?? '';
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      if (!navigator.onLine) throw new Error('offline');

      const body = new URLSearchParams();
      for (const [key, value] of new FormData(form)) {
        body.append(key, typeof value === 'string' ? value : value.name);
      }

      const response = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`Netlify responded ${response.status}`);

      form.hidden = true;
      form.reset();
      if (success) {
        success.hidden = false;
        reveal(success);
      }
    } catch (error) {
      // Shown on the page below; logged so a failing endpoint can be diagnosed.
      console.error('[amavi] creator application not sent', error);
      if (failReason) failReason.textContent = reasonFor(error);
      if (failBox) {
        failBox.hidden = false;
        reveal(failBox);
      }
    } finally {
      window.clearTimeout(timer);
      if (submit) {
        submit.disabled = false;
        submit.textContent = label;
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-creator-form]').forEach(enhance);
