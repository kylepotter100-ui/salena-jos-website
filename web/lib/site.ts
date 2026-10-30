// Facts used across the page. Hours come from a public directory listing; confirm with the salon.

export const PHONE_DISPLAY = "01509 215678";
export const PHONE_HREF = "tel:+441509215678";
export const EMAIL = "salenajo7@aol.com";
export const ADDRESS_LINES = ["64 Ashby Road", "Loughborough", "LE11 3AE"];
export const MAPS_HREF =
  "https://www.google.com/maps/search/?api=1&query=Salena-Jo%27s%2C%2064%20Ashby%20Road%2C%20Loughborough%20LE11%203AE";

// Minutes from midnight. Sunday = 0. null = closed.
export const HOURS: Record<number, [number, number] | null> = {
  0: null,
  1: null,
  2: null,
  3: [570, 1200],
  4: [690, 1200],
  5: [570, 1020],
  6: [600, 960],
};

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = ((h + 11) % 12) + 1;
  const suffix = h < 12 ? "am" : "pm";
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}

export type Treatment = {
  id: string;
  name: string;
  line: string;
  image: { src: string; alt: string };
};

// Generated with Higgsfield (soul_2). Editorial imagery for each treatment, not photographs of the salon's own clients.
const cdn = "https://d8j0ntlcm91z4.cloudfront.net/user_3EDh2PpfrFYdSlBD47Uq3xVUmV8";

export const IMAGES = {
  hero: { src: `${cdn}/hf_20261030_153442_c9ff7ff9-7482-4eba-a4e7-165e3bea8dc2_min.webp`, w: 1536, h: 2048, alt: "Portrait of a woman with glowing skin and a glossy red manicure resting against her cheek" },
  polish: { src: `${cdn}/hf_20261030_153554_9364100e-414e-4db5-bcfe-f22b4418d1bd_min.webp`, w: 1536, h: 2048, alt: "Rows of nail polish in red, coral, nude and pink" },
  towels: { src: `${cdn}/hf_20261030_153634_14bcb20c-fb1d-4332-b0fc-f7166707fea8_min.webp`, w: 2048, h: 1536, alt: "Folded white towels and glass bowls on a treatment trolley" },
  tutor: { src: `${cdn}/hf_20261030_153634_accea04f-4322-446c-baad-b396cc51e9f0_min.webp`, w: 1536, h: 2048, alt: "A tutor guiding a student through a manicure on a practice hand" },
  kit: { src: `${cdn}/hf_20261030_153650_47bf0375-38d3-4ff7-89fe-d63f3b5ccb98_min.webp`, w: 2048, h: 2048, alt: "Brushes, files and cuticle tools laid out beside a notebook" },
  shopfront: { src: "/images/shopfront.jpg", w: 1179, h: 1374, alt: "The slate grey Salena-Jo's shopfront at 64 Ashby Road, with the crown monogram in the windows" },
};

export const TREATMENTS: Treatment[] = [
  {
    id: "nails",
    name: "Nails",
    line: "Manicures, pedicures and nail enhancements, with a full wall of colours to choose from.",
    image: { src: `${cdn}/hf_20261030_153442_83204647-bb9c-468e-9769-e9024fc816a5_min.webp`, alt: "Hands with a fresh glossy red manicure resting on white marble" },
  },
  {
    id: "waxing",
    name: "Advanced waxing",
    line: "Face and body, including intimate waxing, done quickly and discreetly.",
    image: { src: `${cdn}/hf_20261030_153555_c0084480-94dd-4dfb-ab3c-ea147ff40cba_min.webp`, alt: "A smooth bare leg stretched out on a white towel" },
  },
  {
    id: "facials",
    name: "Facials",
    line: "Cleansing, exfoliating and hydrating, tailored to your skin on the day.",
    image: { src: `${cdn}/hf_20261030_153441_02fc34ef-f427-42cf-86f6-e0efbf6e91be_min.webp`, alt: "A client relaxing with a cream mask during a facial" },
  },
  {
    id: "browlash",
    name: "Brows & lashes",
    line: "Shaping, tints and lifts. Tints need a patch test 48 hours before.",
    image: { src: `${cdn}/hf_20261030_153600_8d6407c0-a070-4411-b52d-0e701ce0ad0c_min.webp`, alt: "Close-up of groomed brows and lifted, tinted lashes" },
  },
  {
    id: "tans",
    name: "Spray tans",
    line: "An even, natural-looking tan in one short session.",
    image: { src: `${cdn}/hf_20261030_153604_58c4099d-03b9-42c5-a19c-b57db4074fdd_min.webp`, alt: "A shoulder and back with an even golden tan" },
  },
  {
    id: "caci",
    name: "CACI facials",
    line: "Non-surgical microcurrent toning that builds over a course of treatments.",
    image: { src: `${cdn}/hf_20261030_153441_b886cd7b-6bf3-4e77-b92f-8a534c1efacd_min.webp`, alt: "A therapist holding two small microcurrent probes against a client's cheekbone" },
  },
];

// Fired by any "Book a visit" link that names a treatment, so the booking form can preselect it.
export const CHOOSE_TREATMENT_EVENT = "salenajos:choose-treatment";
