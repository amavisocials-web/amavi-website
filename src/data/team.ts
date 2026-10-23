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
 * The names were matched to the faces by the client on 23 October 2026. They
 * had first been guessed from the order the pictures arrived in, which put
 * Elda and Venera the wrong way round; the two files were swapped on disk
 * rather than crossing the imports, so each filename still names the person
 * in it. The alt text swapped with them, because it describes what each of
 * them is wearing.
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
    photo: veneraBulliqi,
    alt: 'Elda Ajvazi in a dark blazer, in front of the studio blinds',
  },
  {
    name: 'Venera Bulliqi',
    role: 'Office Coordinator',
    photo: eldaAjvazi,
    alt: 'Venera Bulliqi in a dark blazer, in front of the studio blinds',
  },
];
