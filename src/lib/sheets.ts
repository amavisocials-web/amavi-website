/**
 * The Google Apps Script web app both forms send to
 * (scripts/google-sheets-handler.gs; setup in scripts/README.md): creator
 * applications become a row in the Google Sheet and an email, brand enquiries
 * an email. Read once, at build time. It is public by design: the visitor's
 * browser calls it directly, so it ends up in each form's markup.
 *
 * Unset, both forms fall back to Netlify Forms alone, and nobody is emailed.
 * Set but malformed, the build fails and the previous deploy stays live.
 */
const value = import.meta.env.PUBLIC_SHEETS_ENDPOINT?.trim() || undefined;

if (!value) {
  console.warn('[amavi] PUBLIC_SHEETS_ENDPOINT is not set, so creator applications and brand enquiries go to Netlify Forms only, and nobody is emailed. See README → "Creator applications → Google Sheets".');
} else if (!/^https:\/\/script\.google\.com\/.+\/exec$/.test(value)) {
  /* What is wrong with the value, without printing it. Netlify masks it in
     the build log, so on 23 October 2026 the whole clue was 'got "****"'. */
  const clues = [
    `it is ${value.length} characters long`,
    /^PUBLIC_SHEETS_ENDPOINT\s*=/.test(value) &&
      'it starts with the variable name and "=": paste only what comes after the =',
    /^["'‘“]|["'’”]$/.test(value) && 'it has quote marks around it',
    /\s/.test(value) && 'it has a space or line break inside it',
    !value.includes('script.google.com') && 'it does not contain script.google.com',
    !/\/exec["'’”]?$/.test(value) && 'it does not end in /exec',
  ].filter(Boolean);
  throw new Error(`PUBLIC_SHEETS_ENDPOINT should be the Apps Script web app URL, https://script.google.com/…/exec, and the value set is not: ${clues.join('; ')}.`);
}

export const SHEETS_ENDPOINT = value;
