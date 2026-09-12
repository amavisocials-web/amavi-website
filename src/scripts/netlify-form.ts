/**
 * Progressive enhancement for the site's two forms.
 *
 * JS justification (brief §7): the requirement is a visible success state and
 * a visible error state, and that a submission must never fail silently. A
 * plain static POST hands both outcomes to Netlify's own generic pages, which
 * loses the error case entirely. This module intercepts the submit, posts it
 * over fetch, and renders both outcomes inline.
 *
 * Without JS the form still works: it posts natively to Netlify, which is why
 * `novalidate` is set here at runtime rather than in the markup — no-JS
 * visitors keep native browser validation.
 */

type Status = 'success' | 'error';

const MESSAGES: Record<Status, { title: string; body: string }> = {
  success: {
    title: 'Thanks — that came through.',
    body: 'We have your details and will be in touch shortly.',
  },
  error: {
    title: "That didn't send.",
    body: 'Something went wrong on the way. Please try again, or email us directly and we will pick it up from there.',
  },
};

function describe(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const custom = control.dataset.error;
  if (custom) return custom;
  const v = control.validity;
  if (v.valueMissing) {
    return control.type === 'checkbox'
      ? 'Please tick this box to continue.'
      : 'This field is required.';
  }
  if (v.typeMismatch && control.type === 'email') return 'Please enter a valid email address.';
  if (v.typeMismatch && control.type === 'url') {
    return 'Please enter a full link, starting with https://';
  }
  if (v.tooShort) return 'Please add a little more detail.';
  return 'Please check this field.';
}

function fieldError(control: Element): HTMLElement | null {
  const id = control.getAttribute('aria-describedby');
  if (!id) return null;
  // A control can point at both a hint and an error node.
  for (const part of id.split(/\s+/)) {
    const node = document.getElementById(part);
    if (node?.classList.contains('field__error')) return node;
  }
  return null;
}

function clear(control: Element) {
  control.removeAttribute('aria-invalid');
  const slot = fieldError(control);
  if (slot) slot.textContent = '';
}

function mark(control: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  control.setAttribute('aria-invalid', 'true');
  const slot = fieldError(control);
  if (slot) slot.textContent = describe(control);
}

function setStatus(form: HTMLFormElement, state: Status | null) {
  const box = form.querySelector<HTMLElement>('[data-form-status]');
  if (!box) return;

  if (!state) {
    box.hidden = true;
    box.removeAttribute('data-state');
    box.replaceChildren();
    return;
  }

  const { title, body } = MESSAGES[state];
  const heading = document.createElement('strong');
  heading.textContent = title;
  const text = document.createElement('span');
  text.textContent = body;

  box.replaceChildren(heading, text);
  box.dataset.state = state;
  box.hidden = false;
  // The box is aria-live, so this announces without stealing focus mid-typing.
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function enhance(form: HTMLFormElement) {
  form.noValidate = true;

  const controls = () =>
    Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input:not([type=hidden]), select, textarea',
      ),
    );

  // Clear a field's error as soon as it becomes valid, rather than making the
  // visitor submit again to find out.
  form.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.matches('[aria-invalid="true"]') && target.checkValidity()) clear(target);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus(form, null);

    const invalid = controls().filter((control) => {
      clear(control);
      if (control.checkValidity()) return false;
      mark(control);
      return true;
    });

    if (invalid.length > 0) {
      invalid[0].focus();
      invalid[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const button = form.querySelector<HTMLButtonElement>('[data-submit]');
    const label = button?.textContent ?? '';
    if (button) {
      button.disabled = true;
      button.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });

      if (!response.ok) throw new Error(`Netlify responded ${response.status}`);

      setStatus(form, 'success');
      form.reset();
    } catch (error) {
      // Surfaced inline above; logged so a failing endpoint is debuggable.
      console.error('[amavi] form submission failed', error);
      setStatus(form, 'error');
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = label;
      }
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-netlify-form]').forEach(enhance);
