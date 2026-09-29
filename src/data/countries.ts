/**
 * Every country, for the application's country select.
 *
 * Only the ISO 3166-1 alpha-2 codes are written down here: the English names
 * come from Intl at build time, and the flag is the code itself in regional
 * indicator letters (IE → 🇮🇪), so there is no list of names or emoji to keep
 * up to date. A platform without flag glyphs — Windows — shows the two
 * letters instead, which is why the name always follows the flag.
 *
 * XK (Kosovo) is a user-assigned code rather than an official one, and is
 * included deliberately: AMAVI was founded in Prishtina.
 *
 * The six uninhabited territories (Antarctica, Bouvet Island, Heard Island,
 * South Georgia, the French Southern Territories and the US Minor Outlying
 * Islands) are left out.
 */
const CODES = [
  'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
  'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR',
  'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM',
  'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ',
  'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB',
  'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW',
  'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS',
  'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY',
  'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD',
  'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU',
  'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR',
  'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT',
  'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH',
  'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC',
  'TD', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA',
  'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE',
  'YT', 'ZA', 'ZM', 'ZW',
] as const;

export interface Country {
  code: string;
  name: string;
  /** The flag as regional indicator letters. */
  flag: string;
}

const A = 0x1f1e6 - 'A'.charCodeAt(0);
const flagOf = (code: string) => String.fromCodePoint(...[...code].map((c) => c.charCodeAt(0) + A));

const names = new Intl.DisplayNames(['en'], { type: 'region' });

export const COUNTRIES: Country[] = CODES.map((code) => {
  const name = names.of(code);
  // A build without full ICU would hand back the code itself; better to fail
  // the build than to ship a list of two-letter options.
  if (!name || name === code) throw new Error(`No English name for the country code "${code}".`);
  return { code, name, flag: flagOf(code) };
}).sort((a, b) => a.name.localeCompare(b.name, 'en'));
