/**
 * The application's country field, as a combobox you can type into.
 *
 * Layered on markup that works without it: the field ships as a native select
 * with every country in it, which is the better control with no JavaScript and
 * on a phone that prefers its own picker. This script swaps in a text input
 * and a listbox — but the select stays in the form, hidden, holding the value
 * that submits. Whatever reaches the sheet is therefore a name from the list,
 * never something typed.
 *
 * Matching is case- and accent-insensitive and runs from the start of the
 * name, so "ir" is Iran, Iraq and Ireland rather than every country with
 * those letters somewhere in it, and "cot" finds Côte d'Ivoire. Nothing
 * matching shows "No matches" rather than an empty box.
 *
 * The field starts empty and nothing is highlighted until an arrow key or the
 * pointer picks something: a country in the field means the applicant chose
 * it.
 *
 * It is a combobox in the ARIA sense: the input owns the listbox through
 * aria-controls, says whether it is open, and names the option under the
 * cursor with aria-activedescendant, so a screen reader announces each one as
 * the arrow keys move. Enter takes the active option, Escape closes and puts
 * the last valid choice back, Tab closes and moves on, and a click outside
 * does what Escape does.
 *
 * The typed value is only ever a country: the input carries `required` and a
 * custom validity while it doesn't match one, so the form's own validation
 * stops the step and says so (src/scripts/creator-form.ts).
 */

interface Option {
  name: string;
  flag: string;
  /** Lower case, accents stripped: what a search runs against. */
  search: string;
  el: HTMLLIElement;
}

/** "España" → "espana", so a search can be typed on any keyboard. */
const fold = (value: string) =>
  value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const combobox = document.querySelector<HTMLElement>('[data-combobox]');
const field = combobox?.closest<HTMLElement>('[data-country]');
const select = field?.querySelector<HTMLSelectElement>('select');
const input = combobox?.querySelector<HTMLInputElement>('input[role="combobox"]');
const list = combobox?.querySelector<HTMLUListElement>('[role="listbox"]');
const empty = combobox?.querySelector<HTMLElement>('[data-combobox-empty]');
const wrapper = field?.querySelector<HTMLElement>('.select');

if (combobox && field && select && input && list && empty && wrapper) {
  /* --- Build the list from the select, so the countries stay in one place -- */
  const options: Option[] = [...select.options]
    .filter((option) => option.value)
    .map((option, i) => {
      const name = option.value;
      // The option reads "🇮🇪 Ireland": the flag is whatever precedes the name.
      const flag = (option.textContent ?? '').replace(name, '').trim();
      const el = document.createElement('li');
      el.className = 'combobox__option';
      el.id = `cf-country-option-${i}`;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', 'false');
      el.dataset.value = name;
      el.innerHTML = '<span class="combobox__flag" aria-hidden="true"></span>';
      el.firstElementChild!.textContent = flag;
      el.append(name);
      return { name, flag, search: fold(name), el };
    });

  list.append(...options.map((option) => option.el));

  /* --- The swap: the select keeps the value, the input takes the field ----- */
  wrapper.hidden = true;
  select.required = false;
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  combobox.hidden = false;
  input.required = true;
  input.value = select.value;

  let shown: Option[] = options;
  let active = -1;
  /** The last country actually chosen: what Escape and a click outside restore. */
  let chosen = select.value;

  const isOpen = () => input.getAttribute('aria-expanded') === 'true';

  const setActive = (index: number) => {
    shown[active]?.el.removeAttribute('data-active');
    active = index;
    const option = shown[active];
    if (!option) {
      input.removeAttribute('aria-activedescendant');
      return;
    }
    option.el.dataset.active = 'true';
    input.setAttribute('aria-activedescendant', option.el.id);
    option.el.scrollIntoView({ block: 'nearest' });
  };

  const filter = (query: string) => {
    const needle = fold(query);
    shown = needle ? options.filter((option) => option.search.startsWith(needle)) : options;
    for (const option of options) option.el.hidden = !shown.includes(option);
    empty.hidden = shown.length > 0;
    list.hidden = shown.length === 0;
    // Nothing highlighted, and back to the top of the list: what opens is the
    // list itself, not a suggestion.
    setActive(-1);
    list.scrollTop = 0;
  };

  const open = () => {
    if (isOpen()) return;
    input.setAttribute('aria-expanded', 'true');
    filter(input.value === chosen ? '' : input.value);
  };

  const close = () => {
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    shown[active]?.el.removeAttribute('data-active');
    active = -1;
    list.hidden = true;
    empty.hidden = true;
  };

  /**
   * Only a name from the list is a value; anything else fails on submit. A
   * name typed in full counts as a choice, so `chosen` keeps it — half-typed
   * text leaves the last real choice alone, which is what Escape and a click
   * outside put back.
   */
  const sync = () => {
    const match = options.find((option) => fold(option.name) === fold(input.value));
    if (match) chosen = match.name;
    select.value = match ? match.name : '';
    for (const option of options) {
      option.el.setAttribute('aria-selected', String(option.name === select.value));
    }
    input.setCustomValidity(
      match || !input.value.trim() ? '' : 'Choose a country from the list.',
    );
    select.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const choose = (option: Option) => {
    input.value = option.name;
    sync();
    close();
    input.focus();
  };

  /** Back to the last valid choice, leaving nothing half-typed behind. */
  const restore = () => {
    input.value = chosen;
    sync();
    close();
  };

  sync();

  /* --- Pointer ------------------------------------------------------------- */
  input.addEventListener('input', () => {
    if (!isOpen()) input.setAttribute('aria-expanded', 'true');
    filter(input.value);
    sync();
  });

  input.addEventListener('focus', () => {
    open();
    // On a phone the keyboard covers the lower half of the screen; bringing the
    // field up first leaves the list where it can be seen.
    input.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  input.addEventListener('mousedown', () => { if (!isOpen()) open(); });

  list.addEventListener('mousedown', (event) => {
    // Keep the field's focus: the click is the choice, not a focus change.
    event.preventDefault();
    const el = (event.target as HTMLElement).closest<HTMLLIElement>('.combobox__option');
    const option = options.find((o) => o.el === el);
    if (option) choose(option);
  });

  list.addEventListener('mousemove', (event) => {
    const el = (event.target as HTMLElement).closest<HTMLLIElement>('.combobox__option');
    const index = shown.findIndex((option) => option.el === el);
    if (index >= 0 && index !== active) setActive(index);
  });

  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !combobox.contains(event.target as Node)) restore();
  });

  /* --- Keyboard ------------------------------------------------------------ */
  input.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        if (!isOpen()) { open(); return; }
        if (shown.length === 0) return;
        // From nothing, Down takes the first and Up the last.
        if (active < 0) { setActive(event.key === 'ArrowDown' ? 0 : shown.length - 1); break; }
        const step = event.key === 'ArrowDown' ? 1 : -1;
        setActive((active + step + shown.length) % shown.length);
        break;
      }
      case 'Home':
      case 'End':
        if (!isOpen() || shown.length === 0) return;
        event.preventDefault();
        setActive(event.key === 'Home' ? 0 : shown.length - 1);
        break;
      case 'Enter':
        if (!isOpen()) return;
        event.preventDefault();
        if (shown[active]) choose(shown[active]);
        break;
      case 'Escape':
        if (!isOpen() && !input.value) return;
        event.preventDefault();
        restore();
        break;
      case 'Tab':
        if (isOpen()) close();
        break;
    }
  });

  input.addEventListener('blur', () => {
    // A blur that isn't a click inside the list is the end of the edit.
    window.setTimeout(() => {
      if (!combobox.contains(document.activeElement)) restore();
    }, 0);
  });
}
