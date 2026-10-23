/**
 * Sending a form, the same way for the creator application and the brand
 * enquiry.
 *
 * With the Apps Script URL in the form's data-sheets-endpoint
 * (scripts/google-sheets-handler.gs), that is where it goes, and only its
 * {"success":true} counts: the script has then written the row or sent the
 * email. Netlify Forms gets a copy alongside, whose outcome is logged and
 * never decides anything. Without the URL, Netlify Forms is the only copy, so
 * its answer is the outcome.
 *
 * `deliver` resolves only once the copy that decides has confirmed it, and
 * rejects on anything else: a refusal, a non-2xx, a dropped connection or the
 * timeout. Nothing is ever assumed to have arrived.
 */

/** Long enough for a slow mobile connection; short enough not to hang. */
const TIMEOUT_MS = 20_000;

async function post(url: string, body: URLSearchParams, confirm: (response: Response) => Promise<void>) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // A form-encoded body is a CORS "simple request": no preflight, which an
    // Apps Script web app could not answer.
    const response = await fetch(url, { method: 'POST', body, signal: controller.signal });
    await confirm(response);
  } finally {
    window.clearTimeout(timer);
  }
}

const toSheets = (endpoint: string, body: URLSearchParams) =>
  post(endpoint, body, async (response) => {
    if (!response.ok) throw new Error(`Sheets responded ${response.status}`);
    // {"success":true}. Deployments of the script from before the email
    // notification replied {"result":"success"}, so both are accepted: an old
    // deployment left in place keeps working until it is updated.
    const reply = (await response.json()) as { success?: boolean; error?: string; result?: string; message?: string };
    if (reply.success !== true && reply.result !== 'success') {
      throw new Error(`Sheets refused: ${reply.error ?? reply.message ?? 'no reason given'}`);
    }
  });

/* To "/", not the page's path: Netlify's form handling takes a POST to the
   site root with the form-name in the body, and that is the documented route
   for submitting by fetch. */
const toNetlify = (body: URLSearchParams) =>
  post('/', body, async (response) => {
    if (!response.ok) throw new Error(`Netlify responded ${response.status}`);
  });

export async function deliver(body: URLSearchParams, endpoint: string | undefined) {
  if (!endpoint) return toNetlify(body);
  const copy = toNetlify(body).catch((reason) => {
    console.error(`[amavi] ${body.get('form-name')}: copy not sent to Netlify Forms`, reason);
  });
  try {
    await toSheets(endpoint, body);
  } finally {
    void copy;
  }
}
