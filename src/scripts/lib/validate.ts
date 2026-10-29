/**
 * The rules the site's forms check before anything is sent, in one place so
 * the contact form, the creator application and the subscribe block agree
 * (29 October 2026). Each form keeps its own wording for the messages.
 */

/**
 * name@domain.tld: no spaces, one @, and a dot in the domain followed by at
 * least two characters. Stricter than the browser's own `type="email"` check,
 * which lets "name@company" through.
 */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(value.trim());
}

/**
 * An Instagram or TikTok handle once tidied of its "@" and any profile link:
 * letters, numbers, dots and underscores, up to 30 — what both platforms
 * allow.
 */
export function isHandle(value: string): boolean {
  return /^[A-Za-z0-9._]{1,30}$/.test(value);
}

/**
 * A fee the way people type one: digits, thousands set off with commas, dots
 * or spaces, and up to two decimals ("250", "1,200", "1.200,50"). No currency
 * signs or words: the currency has a field of its own.
 */
export function isAmount(value: string): boolean {
  const amount = value.trim();
  return /^\d+([.,]\d{1,2})?$/.test(amount) || /^\d{1,3}([,. ]\d{3})+([.,]\d{1,2})?$/.test(amount);
}
