/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /**
   * The Google Apps Script web app that saves creator applications to a
   * Google Sheet (…/exec). Public by design: the browser calls it. See README.
   */
  readonly PUBLIC_SHEETS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
