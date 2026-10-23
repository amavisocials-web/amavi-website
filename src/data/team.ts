import type { ImageMetadata } from 'astro';

import rinaBulliqi from '../assets/team/rina-bulliqi.jpg';
import lirikaBulliqi from '../assets/team/lirika-bulliqi.jpg';
import eldaAjvazi from '../assets/team/elda-ajvazi.jpg';
import veneraBulliqi from '../assets/team/venera-bulliqi.jpg';

/**
 * The people on the About page, in the order they appear.
 *
 * The section renders from this array (src/pages/about.astro → "Meet the
 * team"), so someone can be added, removed or reordered here without
 * touching the layout.
 *
 * Each portrait is cut to 4:3 from the supplied frame at 1400x1050, well
 * above the 560px the card asks for at its largest.
 *
 * **Each person imports the file with their own name, and that file is their
 * photograph.** Keep it that way: to move a picture to someone else, rename
 * the file, do not cross the imports.
 *
 * This is written down because Elda and Venera were swapped twice on 23
 * October 2026 — once by renaming the files and once by crossing the `photo:`
 * references below — and the two swaps cancelled out, putting each of them
 * back on the other's card. Checked against the pictures themselves:
 * elda-ajvazi.jpg is the blonde portrait in a black blazer over a white top,
 * venera-bulliqi.jpg is the portrait in a navy blazer with arms folded. The
 * alt text describes what each is wearing, so it has to move with them.
 */
export interface TeamMember {
  /** As it should read on the page. Set in capitals by the stylesheet. */
  name: string;
  /** One line. Wraps to two in the narrower columns, which the card allows for. */
  role: string;
  /** The portrait, 4:3. `null` renders the placeholder block. */
  photo: ImageMetadata | null;
  /** Describes the person for anyone who can't see the picture. */
  alt?: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Rina Bulliqi',
    role: 'Founder and CEO',
    photo: rinaBulliqi,
    alt: 'Rina Bulliqi, arms folded, in front of the studio blinds',
  },
  {
    name: 'Lirika Bulliqi',
    role: 'Partnerships Coordinator',
    photo: lirikaBulliqi,
    alt: 'Lirika Bulliqi in a dark blazer, in front of the studio blinds',
  },
  {
    name: 'Elda Ajvazi',
    role: 'Content Direction',
    photo: eldaAjvazi,
    alt: 'Elda Ajvazi in a black blazer over a white top, in front of the studio blinds',
  },
  {
    name: 'Venera Bulliqi',
    role: 'Office Coordinator',
    photo: veneraBulliqi,
    alt: 'Venera Bulliqi, arms folded in a navy blazer, in front of the studio blinds',
  },
];
