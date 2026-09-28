# Creator applications → Google Sheet + email

`google-sheets-handler.gs` is a Google Apps Script web app. The
**Become a Creator** form POSTs each application to it; it appends one row to
your creators database and emails a copy to **partnerships@amavisocials.com**.

Nothing here is deployed by the site's build. It is a one-off setup in Google,
about ten minutes, then a URL pasted into Netlify.

## What happens when someone applies

1. The form POSTs the application to the Apps Script URL in
   `PUBLIC_SHEETS_ENDPOINT`.
2. The script appends a row to the **Applications** tab, then emails
   partnerships@amavisocials.com. The row is written first: a failed email never
   costs you the application.
3. At the same time the form POSTs to **Netlify Forms**, which keeps a backup
   copy of every application (Site configuration → Forms → creator-application).
4. The applicant sees "Application received" only once one of the two has
   confirmed it. If both fail, they see an error, everything they typed stays
   on screen, and they're given partnerships@amavisocials.com to send it to instead.

## Setup

1. **Sign in to Google** as the AMAVI Workspace account that should own the
   data — not a personal Gmail. The sheet holds applicants' personal details,
   and the privacy policy says they're kept in AMAVI's Google Workspace.
   Check that **partnerships@amavisocials.com** exists as a user or an alias
   before you start: the notification is sent to it, and an address that was
   never created bounces.
2. **Create a Google Sheet** and name it, e.g. "AMAVI creator applications".
   Leave it empty: the script adds the **Applications** tab and its header row
   on the first submission. Copy its **id** from the address bar — the long
   part of `docs.google.com/spreadsheets/d/<id>/edit`.
3. **Create the script.** The usual route is **Extensions → Apps Script** from
   inside the sheet, which binds the script to it. That fails with "Page Not
   Found" while several Google accounts are signed in, which is why this one
   is a **standalone project** instead: go to
   [script.google.com](https://script.google.com) → **New project**. Either
   kind works; standalone is what's deployed today.
4. **Delete the sample `myFunction`** in `Code.gs`, paste in the whole of
   `google-sheets-handler.gs`, and save (⌘S / Ctrl+S). Check that
   `SPREADSHEET_ID` near the top matches the id from step 2 — a standalone
   script has no sheet of its own, so it opens that one by id.
5. **Deploy → New deployment.** Click the gear beside "Select type" and choose
   **Web app**, then set:
   - **Description:** Creator applications
   - **Execute as:** Me
   - **Who has access:** **Anyone**

   "Anyone" is required — applicants aren't signed in to Google and the
   request comes from their browser. It lets anyone *send* an application, as
   the form already does; it does not let anyone read the sheet, which stays
   private to you.
6. **Authorise it.** Because it's your own unverified script, Google shows
   "Google hasn't verified this app": **Advanced → Go to … (unsafe) → Allow**.
   It asks for permission to open your spreadsheets and to send email as you —
   that second one is the notification.
7. **Copy the Web app URL.** It ends in `/exec`. To check it, use an
   **incognito window** or `curl`, not your normal browser: signed into
   several Google accounts, the URL answers "Page Not Found" even when the
   deployment is fine. You should see `{"success":true,"message":"AMAVI
   creator applications endpoint. …"}`.

   ```bash
   curl -sL "https://script.google.com/macros/s/<your-deployment>/exec"
   ```
8. **In Netlify:** Site configuration → Environment variables → Add a
   variable:

   | Key | Value |
   |---|---|
   | `PUBLIC_SHEETS_ENDPOINT` | the `/exec` URL from step 7 |

9. **Redeploy:** Deploys → Trigger deploy → Deploy site. The URL is built into
   the page, so it only takes effect on the next deploy.

For local development, copy `.env.example` to `.env` and set the same value.
`.env` is gitignored, and the dev server only reads it at startup — restart
`npm run dev` after changing it.

**The deployment in use today** (standalone project, executing as
partnerships@amavisocials.com, sheet id `14qvzt5N94MjuSUy9SG6xtpxZr2zwuDQmqkiavY1r6fk`):

```
https://script.google.com/macros/s/AKfycbxXsh5XTTlTlcr6R616vcajyilvHLZ7JEv7yU8YIC3RlRj3zEupxN0oBoV5HS8V28otCw/exec
```

It is public by design — the applicant's browser calls it directly, so it is
in the page source. It accepts applications; it grants no read access to the
sheet.

The build checks the value: if it isn't a `https://script.google.com/…/exec`
URL — the script editor's own address is the usual mistake — the build fails
with a message saying so, and the previous deploy stays live. If the variable
is missing, the build warns and applications go to Netlify Forms only.

## Test it

**Without the website first.** In the Apps Script editor, choose
**testApplication** in the toolbar dropdown and press **Run**. It writes one
row and sends one email exactly as a real application would, so you can see
the sheet and the notification working before the site is deployed. The
execution log prints `{"success":true}`. Delete the test row afterwards.

**Then end to end:**

1. Open `/become-a-creator/` on the deployed site and send a dummy
   application. Use a real email address you can check.
2. The **Applications** tab gets a row: timestamp in column A, the answers in
   the fixed order below, and "Yes — <date time>" in **Consent given**.
3. **partnerships@amavisocials.com** gets *New creator application — <name>*, one
   line per answered field, with the Instagram and media kit links clickable.
4. Delete the test row when you're done.

If the row appears but no email does, open **Executions** in the Apps Script
editor: the notification is logged there and never blocks the row.

## The columns

One row per application, in this order. The first 24 are the agreed schema;
the rest are everything else the form asks, so no answer is dropped.

| # | Column | From the form |
|---|---|---|
| A | Timestamp | when it arrived |
| B | Full name | Full name |
| C | Email | Email |
| D | Phone | — *not asked yet* |
| E | Location | City + Country |
| F | Instagram handle | Instagram |
| G | TikTok handle | TikTok |
| H | YouTube channel | YouTube |
| I | Other platforms | X, LinkedIn, Blog or website, Other — each labelled |
| J | Follower tier | Follower range |
| K | Engagement rate | Engagement rate |
| L | Audience location | — *not asked separately* |
| M | Audience age range | — *not asked separately* |
| N | Audience gender split | — *not asked separately* |
| O | Niches | Niches (joined with ", ") |
| P | Content types | Content formats (joined with ", ") |
| Q | Gifted or paid | Collaboration preference |
| R | Rate — static post | Static feed post |
| S | Rate — reel | Reel or short-form video |
| T | Rate — story | Story |
| U | Rate — UGC | UGC or product review |
| V | Media kit link | Media kit link |
| W | Notes | Anything else |
| X | Consent given | "Yes — <date time>", never blank |
| Y | Audience insights | Audience insights (the free-text answer) |
| Z | Rate — long-form | Long-form video or blog |
| AA | Rate — live | Live content |
| AB | Currency | Currency |
| AC | Rate notes | Rate notes |
| AD | Past collaborations | Past brand collaborations |

Three columns stay empty until the form asks for them: **Phone**, **Audience
age range** and **Audience gender split**. Audience make-up is one free-text
answer today, which lands in **Audience insights**. Adding those fields to the
form is a small change — ask, and they'll fill themselves.

## Changing it later

- **Editing the script:** paste the new version into the editor, save, then
  **Deploy → Manage deployments → pencil → Version: New version → Deploy**.
  That keeps the same URL, so nothing else has to change. **Never use "New
  deployment"** — it mints a different URL, and Netlify and `.env` would both
  need updating. Keep this repo's copy of the file in step with whatever is
  deployed.
- **Where the email goes:** `NOTIFY_EMAIL`, at the top of the script.
- **Adding a form field:** add a line to `COLUMNS` with the field's `name`
  attribute, then deploy a new version.
- **Your own columns** (status, fee agreed, notes) are safe to add anywhere:
  rows are matched to columns by header text, not position. Don't rename the
  headers the script writes — a renamed one is treated as missing and re-added
  at the end.
- Values starting with `=`, `+`, `-` or `@` are stored as text, so a pasted
  answer can never run as a formula.

## A second safety net

Netlify can email you whenever a backup copy arrives, which covers the case
where the Apps Script is down: **Site configuration → Forms → Form
notifications → Add notification → Email notification**, form
`creator-application`, to partnerships@amavisocials.com.
