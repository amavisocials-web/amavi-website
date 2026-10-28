/**
 * AMAVI Socials — creator applications → Google Sheet + email,
 * brand enquiries → email
 * ===========================================================
 *
 * A Google Apps Script web app. The /creator-network form POSTs each
 * application here; this:
 *
 *   1. appends one row to the creators database (a timestamp in column A,
 *      then one column per field, in the fixed order in COLUMNS below);
 *   2. emails NOTIFY_EMAIL a readable copy of the application;
 *   3. replies {"success":true}, or {"success":false,"error":"…"}.
 *
 * The /contact form POSTs brand enquiries here too (form-name
 * "brand-enquiry"), since 23 October 2026: those are emailed to NOTIFY_EMAIL
 * and not written to the sheet. See enquiry_ below. This replaced Netlify's
 * form notifications, which needed a paid Netlify plan.
 *
 * The row comes first and the email second, each in its own try/catch: a
 * bounced or rate-limited email can never cost you the row, and neither can
 * cost you the application — Netlify Forms keeps a backup copy of every
 * submission regardless (see scripts/README.md).
 *
 * The form shows its success message only after a confirmed reply, so this
 * script's reply is what the applicant sees.
 *
 * SETUP: scripts/README.md — create the sheet, paste this into a standalone
 * Apps Script project, deploy as a web app, put the /exec URL in Netlify as
 * PUBLIC_SHEETS_ENDPOINT, redeploy.
 *
 * This is a STANDALONE project, not bound to the sheet (Extensions → Apps
 * Script wouldn't open while several Google accounts were signed in), so it
 * opens the spreadsheet by id rather than by "the sheet I live in".
 *
 * CHANGING THIS SCRIPT LATER
 *   Deploy → Manage deployments → (pencil) → Version: "New version" → Deploy.
 *   That keeps the same URL. "New deployment" would create a different URL,
 *   and Netlify would need the new one.
 */

/** Where the notifications go, for applications and enquiries alike. */
var NOTIFY_EMAIL = 'partnerships@amavisocials.com';

/** The contact form's form-name (src/components/BrandEnquiry.astro). */
var ENQUIRY_FORM = 'brand-enquiry';

/**
 * The creators database: "AMAVI creator applications". The id is the long
 * part of its URL, docs.google.com/spreadsheets/d/<id>/edit. A standalone
 * script has no active spreadsheet, so every call opens this one by id.
 */
var SPREADSHEET_ID = '14qvzt5N94MjuSUy9SG6xtpxZr2zwuDQmqkiavY1r6fk';

/** The tab applications are written to. Created if it doesn't exist. */
var SHEET_NAME = 'Applications';

/** Long answers are capped, so one paste can't fill a cell (Sheets: 50k). */
var MAX_LENGTH = 5000;

/* --- Cell builders ---------------------------------------------------------
   Each takes the POSTed parameters (every value is an array) and returns the
   cell's text. Multi-select answers arrive as several values and join with
   ", " in one cell.
   -------------------------------------------------------------------------- */

/** One field, as submitted. */
function text_(field) {
  return function (params) { return clean_(params[field]); };
}

/** Several fields in one cell, comma-separated: "Dublin, Ireland". */
function joined_(fields) {
  return function (params) {
    return clean_([fields.map(function (f) { return clean_(params[f]); })
      .filter(function (v) { return v !== ''; })
      .join(', ')]);
  };
}

/** Several fields in one cell, each named: "X: …, LinkedIn: …". */
function labelled_(pairs) {
  return function (params) {
    return clean_([pairs
      .map(function (pair) {
        var value = clean_(params[pair[0]]);
        return value ? pair[1] + ': ' + value : '';
      })
      .filter(function (v) { return v !== ''; })
      .join(', ')]);
  };
}

/**
 * The creators database, in a fixed column order.
 *
 * The first 24 columns are the schema AMAVI asked for. Everything else the
 * form asks follows, so no answer is ever dropped; add a field to the form and
 * it needs a line here too (then deploy a new version).
 *
 * Rows are matched to columns by header text, so you can reorder, widen or add
 * your own columns (status, notes…) in the sheet freely. Don't rename the
 * headers this script writes: a renamed one is treated as missing and re-added
 * at the end.
 */
var COLUMNS = [
  { header: 'Timestamp',             value: function (params, ctx) { return ctx.now; } },
  { header: 'Full name',             value: text_('name') },
  { header: 'Email',                 value: text_('email') },
  // TODO(client): the form doesn't ask for a phone number, so this column
  // stays empty. Add a phone field to step 1 and it fills itself.
  { header: 'Phone',                 value: text_('phone') },
  { header: 'Location',              value: joined_(['city', 'country']) },
  { header: 'Instagram handle',      value: text_('instagram') },
  { header: 'TikTok handle',         value: text_('tiktok') },
  { header: 'YouTube channel',       value: text_('youtube') },
  { header: 'Other platforms',       value: labelled_([['x', 'X'], ['linkedin', 'LinkedIn'], ['blog', 'Blog or website'], ['other_link', 'Other']]) },
  { header: 'Follower tier',         value: text_('follower_range') },
  { header: 'Engagement rate',       value: text_('engagement_rate') },
  // TODO(client): the form asks for audience make-up as one free-text answer,
  // which lands in "Audience insights" below. These three stay empty until the
  // form asks for them separately.
  { header: 'Audience location',     value: text_('audience_location') },
  { header: 'Audience age range',    value: text_('audience_age_range') },
  { header: 'Audience gender split', value: text_('audience_gender_split') },
  { header: 'Niches',                value: text_('niches[]') },
  { header: 'Content types',         value: text_('content_formats[]') },
  { header: 'Gifted or paid',        value: text_('collaboration_preference') },
  { header: 'Rate — static post',    value: text_('rate_static') },
  { header: 'Rate — reel',           value: text_('rate_reels') },
  { header: 'Rate — story',          value: text_('rate_stories') },
  { header: 'Rate — UGC',            value: text_('rate_ugc') },
  { header: 'Media kit link',        value: text_('media_kit') },
  { header: 'Notes',                 value: text_('anything_else') },
  // Never blank: an application without consent is refused below.
  { header: 'Consent given',         value: function (params, ctx) { return 'Yes — ' + ctx.stamp; } },

  // The rest of the form, so nothing is lost.
  { header: 'Audience insights',     value: text_('audience_insights') },
  { header: 'Rate — long-form',      value: text_('rate_longform') },
  { header: 'Rate — live',           value: text_('rate_live') },
  { header: 'Currency',              value: text_('rate_currency') },
  { header: 'Rate notes',            value: text_('rate_notes') },
  { header: 'Past collaborations',   value: text_('past_collaborations') },
];

/** Sent as links in the email, rather than as plain text. */
var LINK_COLUMNS = ['Instagram handle', 'Media kit link'];

/* --- The endpoint ---------------------------------------------------------- */

function doPost(e) {
  try {
    var params = (e && e.parameters) || {};

    // Netlify's spam honeypot, mirrored: people never see this field, bots
    // fill it. Answer as if it worked, and store nothing.
    if (first_(params.company_website)) return reply_({ success: true });

    // A brand enquiry from /contact is emailed, not stored. Everything else
    // is a creator application, as it always was.
    if (first_(params['form-name']) === ENQUIRY_FORM) return enquiry_(params);

    // The form requires these; a request without them didn't come from it.
    if (!first_(params.name) || !first_(params.email) || first_(params.consent) !== 'yes') {
      return reply_({ success: false, error: 'Missing name, email or consent.' });
    }

    var now = new Date();
    var ctx = { now: now, stamp: stamp_(now) };
    var cells = COLUMNS.map(function (column) { return column.value(params, ctx); });

    appendRow_(cells);

    // The row is safe. A failed email must never cost the application, so it
    // is sent after the append and swallowed if it throws.
    try {
      notify_(cells);
    } catch (err) {
      console.error('Creator application saved, but the notification email failed: ' + err);
    }

    return reply_({ success: true });
  } catch (err) {
    console.error(err);
    return reply_({ success: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * A dry run from the editor, before the website is wired up: choose
 * testApplication in the toolbar and press Run. It writes one row and sends
 * one email, exactly as a real application would, and prints the reply in the
 * execution log. Delete the test row afterwards.
 */
function testApplication() {
  var reply = doPost({
    parameters: {
      name: ['Test Applicant'],
      email: ['test@example.com'],
      city: ['Galway'],
      country: ['Ireland'],
      instagram: ['https://www.instagram.com/amavi.socials/'],
      follower_range: ['Micro — 5K to 15K'],
      engagement_rate: ['4% – 7%'],
      'niches[]': ['Fashion', 'Beauty'],
      'content_formats[]': ['Reels / Short-form video'],
      collaboration_preference: ['Both'],
      rate_reels: ['250'],
      rate_currency: ['EUR (€)'],
      media_kit: ['https://example.com/media-kit.pdf'],
      anything_else: ['This is a test row — delete it.'],
      consent: ['yes'],
    },
  });
  console.log(reply.getContent());
}

/**
 * The same dry run for a brand enquiry: choose testEnquiry and press Run. It
 * sends one email to NOTIFY_EMAIL, as the contact form would, and writes
 * nothing to the sheet.
 */
function testEnquiry() {
  var reply = doPost({
    parameters: {
      'form-name': [ENQUIRY_FORM],
      name: ['Test Enquirer'],
      email: ['test@example.com'],
      message: ['This is a test enquiry from the Apps Script editor. Ignore it.'],
    },
  });
  console.log(reply.getContent());
}

/** Opening the URL in a browser: a quick check that the deployment is live. */
function doGet() {
  return reply_({
    success: true,
    message: 'AMAVI form endpoint. Creator applications and brand enquiries are POSTed here by the website.',
  });
}

/**
 * A brand enquiry: one email to NOTIFY_EMAIL, with Reply-To set to the
 * enquirer, so answering is just Reply. Nothing goes in the sheet; Netlify
 * Forms keeps the copy.
 *
 * Unlike an application, where the row is what matters and the email is a
 * courtesy, here the email IS the delivery. So it is not swallowed: if it
 * fails, the reply says so and the contact form shows its error, which gives
 * the enquirer an address to write to instead.
 */
function enquiry_(params) {
  var name = first_(params.name);
  var email = first_(params.email);
  // Trimmed and capped, but not clean_()ed: that guards sheet cells against
  // formulas, and would put a stray apostrophe in front of "- we sell…".
  var message = first_(params.message).slice(0, MAX_LENGTH);
  if (!name || !email || !message) {
    return reply_({ success: false, error: 'Missing name, email or message.' });
  }

  var lines = [['Name', name], ['Email', email], ['Message', message]];
  var options = {
    to: NOTIFY_EMAIL,
    subject: 'New brand enquiry — ' + name,
    body: lines.map(function (line) { return line[0] + ': ' + line[1]; }).join('\n'),
    htmlBody: '<div style="font:14px/1.5 Helvetica,Arial,sans-serif">' +
      lines.map(function (line) {
        return '<p style="margin:0 0 6px"><strong>' + escape_(line[0]) + ':</strong> ' +
          escape_(line[1]).replace(/\r?\n/g, '<br>') + '</p>';
      }).join('\n') +
      '</div>',
  };
  // Only an address that looks like one: a malformed Reply-To would make
  // MailApp refuse the whole email.
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) options.replyTo = email;

  MailApp.sendEmail(options);
  return reply_({ success: true });
}

/** One writer at a time, so two applications at once can't collide. */
function appendRow_(cells) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var sheet = sheet_();
    var headers = headers_(sheet);
    var row = [];
    for (var i = 0; i < headers.length; i++) row.push('');
    COLUMNS.forEach(function (column, i) {
      row[headers.indexOf(column.header)] = cells[i];
    });
    sheet.appendRow(row);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

/**
 * The notification: every answered field, label then value, one per line.
 * Blank fields are left out, so the email is the application rather than the
 * schema. The Instagram and media kit links are clickable in the HTML part;
 * the plain-text part carries the same URLs for any client that shows it.
 */
function notify_(cells) {
  var name = cells[headerIndex_('Full name')] || 'an applicant';
  var lines = [];
  COLUMNS.forEach(function (column, i) {
    if (column.header === 'Timestamp') return;
    var value = cells[i];
    if (value === '' || value === null || value === undefined) return;
    lines.push({ label: column.header, value: String(value), link: LINK_COLUMNS.indexOf(column.header) !== -1 });
  });

  var plain = lines.map(function (line) { return line.label + ': ' + line.value; }).join('\n');
  var html = lines
    .map(function (line) {
      var value = escape_(line.value);
      if (line.link && /^https?:\/\//i.test(line.value)) {
        value = '<a href="' + escape_(line.value) + '">' + value + '</a>';
      }
      return '<p style="margin:0 0 6px"><strong>' + escape_(line.label) + ':</strong> ' + value + '</p>';
    })
    .join('\n');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New creator application — ' + name,
    body: plain,
    htmlBody: '<div style="font:14px/1.5 Helvetica,Arial,sans-serif">' + html + '</div>',
  });
}

/* --- The sheet -------------------------------------------------------------- */

/** The applications tab, created with a frozen header row on first use. */
function sheet_() {
  var book = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    var headers = COLUMNS.map(function (column) { return column.header; });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** The header row, with any column this script needs added at the end. */
function headers_(sheet) {
  var width = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, width).getValues()[0].map(String);
  COLUMNS.forEach(function (column) {
    if (headers.indexOf(column.header) === -1) {
      headers.push(column.header);
      sheet.getRange(1, headers.length).setValue(column.header).setFontWeight('bold');
    }
  });
  return headers;
}

function headerIndex_(header) {
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i].header === header) return i;
  return -1;
}

/* --- Values ----------------------------------------------------------------- */

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

/** The submission time, in the sheet's own timezone, for the consent stamp. */
function stamp_(date) {
  var zone = SpreadsheetApp.openById(SPREADSHEET_ID).getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  return Utilities.formatDate(date, zone, 'yyyy-MM-dd HH:mm');
}

function escape_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
