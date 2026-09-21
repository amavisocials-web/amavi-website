/**
 * AMAVI Socials — creator applications → Google Sheet
 * ====================================================
 *
 * A Google Apps Script web app. The /become-a-creator form POSTs each
 * application here; this appends it as one row — a timestamp, then one column
 * per field — and replies {"result":"success"}. The form only shows its
 * success message after that reply (or after Netlify Forms, which keeps a
 * backup copy of every application, has confirmed it too).
 *
 * SETUP — once, about ten minutes
 * -------------------------------
 *  1. Sign in to Google as AMAVI's Workspace account (hello@amavisocials.com),
 *     not a personal Gmail — the sheet will hold applicants' personal data,
 *     and the privacy policy names Google Workspace as where it's kept.
 *
 *  2. Create a new Google Sheet, e.g. "AMAVI creator applications".
 *
 *  3. In the sheet: Extensions → Apps Script. Delete the sample code in
 *     Code.gs, paste in this whole file, and save (⌘S / Ctrl+S).
 *
 *  4. Deploy → New deployment. Click the gear next to "Select type" and choose
 *     "Web app". Then set:
 *       Description:      Creator applications
 *       Execute as:       Me (hello@amavisocials.com)
 *       Who has access:   Anyone
 *     "Anyone" is required: applicants aren't signed in to Google, and the
 *     request comes from their browser. It lets anyone send an application —
 *     the same as the form itself — but not read the sheet, which stays
 *     private to you. Click Deploy.
 *
 *  5. Authorise when asked. Because this is your own unverified script, Google
 *     shows "Google hasn't verified this app": choose Advanced → Go to
 *     (project name) (unsafe) → Allow. It only asks for access to this
 *     spreadsheet.
 *
 *  6. Copy the "Web app" URL. It ends in /exec.
 *     Check it: open the URL in a browser. You should see
 *     {"result":"ok","message":"AMAVI creator applications endpoint. …"}
 *
 *  7. In Netlify: Site configuration → Environment variables → Add a variable
 *       Key:    PUBLIC_SHEETS_ENDPOINT
 *       Value:  the /exec URL from step 6
 *     Then Deploys → Trigger deploy → Deploy site. The URL is built into the
 *     page, so it only takes effect after a new deploy.
 *
 *  8. Test: submit the form on the deployed site. A row appears in the
 *     "Applications" tab (created on the first submission, with a header row).
 *
 * CHANGING THIS SCRIPT LATER
 *   Deploy → Manage deployments → (pencil) → Version: "New version" → Deploy.
 *   That keeps the same URL. "New deployment" would create a different URL,
 *   and Netlify would need the new one.
 *
 * COLUMNS
 *   Rows are matched to columns by header text, so you can reorder, widen or
 *   add your own columns (notes, status…) freely. Don't rename the headers
 *   this script writes: a renamed one is treated as missing and re-added at the
 *   end. A field added to the form later needs a line in FIELDS below.
 */

/** The tab applications are written to. Created if it doesn't exist. */
var SHEET_NAME = 'Applications';

/** Form field name → column header, in the order the form asks for them. */
var FIELDS = [
  ['name', 'Full name'],
  ['email', 'Email'],
  ['city', 'City'],
  ['country', 'Country'],
  ['instagram', 'Instagram'],
  ['tiktok', 'TikTok'],
  ['youtube', 'YouTube'],
  ['x', 'X'],
  ['linkedin', 'LinkedIn'],
  ['blog', 'Blog or website'],
  ['other_link', 'Other channel'],
  ['follower_range', 'Follower range'],
  ['engagement_rate', 'Engagement rate'],
  ['audience_insights', 'Audience insights'],
  ['niches[]', 'Niches'],
  ['content_formats[]', 'Content formats'],
  ['collaboration_preference', 'Collaboration preference'],
  ['rate_reels', 'Rate: reel or short-form video'],
  ['rate_static', 'Rate: static feed post'],
  ['rate_stories', 'Rate: story'],
  ['rate_ugc', 'Rate: UGC or product review'],
  ['rate_longform', 'Rate: long-form video or blog'],
  ['rate_live', 'Rate: live content'],
  ['rate_currency', 'Currency'],
  ['rate_notes', 'Rate notes'],
  ['past_collaborations', 'Past brand collaborations'],
  ['media_kit', 'Media kit'],
  ['anything_else', 'Anything else'],
  ['consent', 'Consent'],
];

var TIMESTAMP_HEADER = 'Submitted';
var MAX_LENGTH = 5000;

function doPost(e) {
  var params = (e && e.parameters) || {};

  // Netlify's spam honeypot, mirrored: people never see this field, bots fill
  // it. Answer as if it worked, and store nothing.
  if (first_(params.company_website)) return reply_({ result: 'success' });

  // The form requires these; a request without them didn't come from it.
  if (!first_(params.name) || !first_(params.email) || first_(params.consent) !== 'yes') {
    return reply_({ result: 'error', message: 'Missing name, email or consent.' });
  }

  // One writer at a time, so two applications at once can't collide.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var sheet = sheet_();
    var headers = headers_(sheet);
    var row = new Array(headers.length);
    for (var i = 0; i < row.length; i++) row[i] = '';

    row[headers.indexOf(TIMESTAMP_HEADER)] = new Date();
    FIELDS.forEach(function (field) {
      row[headers.indexOf(field[1])] = clean_(params[field[0]]);
    });

    sheet.appendRow(row);
    return reply_({ result: 'success' });
  } catch (err) {
    console.error(err);
    return reply_({ result: 'error', message: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the URL in a browser: a quick check that the deployment is live. */
function doGet() {
  return reply_({
    result: 'ok',
    message: 'AMAVI creator applications endpoint. Applications are POSTed here by the website form.',
  });
}

/** The applications tab, created with a frozen header row on first use. */
function sheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    var headers = [TIMESTAMP_HEADER].concat(FIELDS.map(function (f) { return f[1]; }));
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** The header row, with any column this script needs added at the end. */
function headers_(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
  var wanted = [TIMESTAMP_HEADER].concat(FIELDS.map(function (f) { return f[1]; }));
  wanted.forEach(function (header) {
    if (headers.indexOf(header) === -1) {
      headers.push(header);
      sheet.getRange(1, headers.length).setValue(header).setFontWeight('bold');
    }
  });
  return headers;
}

/**
 * One cell's value: multi-choice answers joined with commas, trimmed, capped
 * in length, and never read as a formula — a value starting with = + - or @
 * gets a leading apostrophe, which Sheets hides and treats as "this is text".
 */
function clean_(values) {
  var text = (values || [])
    .map(function (v) { return String(v).trim(); })
    .filter(function (v) { return v !== ''; })
    .join(', ')
    .slice(0, MAX_LENGTH);
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function first_(values) {
  return values && values.length ? String(values[0]).trim() : '';
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
