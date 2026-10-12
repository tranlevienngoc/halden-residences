/**
 * Halden Residences — content layer.
 *
 * Every image, copy string and dataset lives here so real photography,
 * video or CMS data can be swapped in without touching components.
 */

export const IMG = {
  hero: "/images/hero_villa.jpg",
  archLandscape: "/images/arch_landscape.jpg",
  archPortrait: "/images/arch_portrait.jpg",
  archPool: "/images/arch_pool_wide.jpg",
  resA: "/images/residence_a.jpg",
  resB: "/images/residence_b.jpg",
  resC: "/images/residence_c.jpg",
  silence: "/images/silence_break.jpg",
  access: "/images/access_bg.jpg",
  lifeMorning: "/images/life_morning.jpg",
  lifeNature: "/images/life_nature.jpg",
  lifeWellness: "/images/life_wellness.jpg",
  lifeDining: "/images/life_dining.jpg",
  lifeEvening: "/images/life_evening.jpg",
  matStone: "/images/mat_stone.jpg",
  matOak: "/images/mat_oak.jpg",
  matLinen: "/images/mat_linen.jpg",
  matWater: "/images/mat_water.jpg",
  matConcrete: "/images/mat_concrete.jpg",
} as const;

/** Optional: drop an mp4/webm path here to replace the hero still with video. */
export const HERO_VIDEO: string | null = null;

export const NAV = [
  { label: "Residences", href: "#residences" },
  { label: "Architecture", href: "#architecture" },
  { label: "Location", href: "#location" },
  { label: "Lifestyle", href: "#lifestyle" },
  { label: "Availability", href: "#availability" },
] as const;

export type ResidenceType = "A" | "B" | "C";

export type Residence = {
  id: ResidenceType;
  name: string;
  title: string;
  image: string;
  alt: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  pool: string;
  view: string;
  note: string;
};

export const RESIDENCES: Residence[] = [
  {
    id: "A",
    name: "Residence A",
    title: "The Forest House",
    image: IMG.resA,
    alt: "Double-height living room with oak furniture and a full glass wall to the pine forest",
    area: 320,
    bedrooms: 3,
    bathrooms: 4,
    pool: "Private pool",
    view: "Forest view",
    note: "A double-height living hall opens entirely to the pines. Morning light, all year.",
  },
  {
    id: "B",
    name: "Residence B",
    title: "The Stone House",
    image: IMG.resB,
    alt: "Bedroom with a dry-stone wall, oak floor and a floor-to-ceiling window onto misty forest",
    area: 410,
    bedrooms: 4,
    bathrooms: 5,
    pool: "Pool & spa",
    view: "Valley view",
    note: "Anchored by a hand-laid stone spine. Bedrooms face the valley mist at dawn.",
  },
  {
    id: "C",
    name: "Residence C",
    title: "The Courtyard House",
    image: IMG.resC,
    alt: "Travertine courtyard with a dark stone pool beside a board-formed concrete pavilion at golden hour",
    area: 520,
    bedrooms: 5,
    bathrooms: 6,
    pool: "Courtyard pool",
    view: "Ridge view",
    note: "Four pavilions held around a still courtyard pool. Entirely private, entirely open.",
  },
];

export const LOCATIONS = [
  { min: "03", label: "Forest trails", note: "Direct from your garden gate", x: 58, y: 34 },
  { min: "06", label: "Private golf club", note: "Halden Valley Golf, 18 holes", x: 76, y: 62 },
  { min: "12", label: "City centre", note: "Old town, galleries, dining", x: 22, y: 74 },
  { min: "18", label: "International airport", note: "Private aviation terminal", x: 12, y: 22 },
] as const;

export const LIFESTYLE = [
  {
    n: "01",
    title: "Morning",
    caption: "Coffee in the first light, before the forest wakes.",
    image: IMG.lifeMorning,
    alt: "Ceramic coffee cup on an oak sill beside a window onto the forest",
  },
  {
    n: "02",
    title: "Nature",
    caption: "Eleven kilometres of private trails through old pine.",
    image: IMG.lifeNature,
    alt: "Misty forest trail with ferns and a concrete bench",
  },
  {
    n: "03",
    title: "Wellness",
    caption: "Stone, steam and a single slit of green.",
    image: IMG.lifeWellness,
    alt: "Dark stone plunge pool with rising steam and a horizontal forest window",
  },
  {
    n: "04",
    title: "Dining",
    caption: "Long tables, low light, unhurried evenings.",
    image: IMG.lifeDining,
    alt: "Candlelit oak dining table in a concrete room facing the dusk forest",
  },
  {
    n: "05",
    title: "Evening",
    caption: "Fire, stars, and nothing else for miles.",
    image: IMG.lifeEvening,
    alt: "Concrete fire pit and lounge chairs on a terrace under a starry sky",
  },
] as const;

export const MATERIALS = [
  {
    code: "M—01",
    name: "Travertine",
    spec: "Honed · Tivoli quarry · 30 mm",
    image: IMG.matStone,
    alt: "Macro of honed travertine with natural pores and veining",
  },
  {
    code: "M—02",
    name: "European Oak",
    spec: "Rift-sawn · Hand-oiled · FSC",
    image: IMG.matOak,
    alt: "Macro of oiled oak grain",
  },
  {
    code: "M—03",
    name: "Belgian Linen",
    spec: "Undyed · Stone-washed",
    image: IMG.matLinen,
    alt: "Folds of natural undyed linen",
  },
  {
    code: "M—04",
    name: "Still Water",
    spec: "Black basalt basin · 1.4 m",
    image: IMG.matWater,
    alt: "Dark water surface rippling against a concrete edge",
  },
  {
    code: "M—05",
    name: "Board-formed Concrete",
    spec: "Spruce shuttering · Low-carbon mix",
    image: IMG.matConcrete,
    alt: "Board-formed concrete with timber grain imprint and tie hole",
  },
] as const;

export type UnitStatus = "Available" | "Reserved" | "Sold";

export type Unit = {
  id: string;
  type: ResidenceType;
  plot: string;
  level: string;
  status: UnitStatus;
  /** index on the site plan (0–17) */
  site: number;
};

export const UNITS: Unit[] = [
  { id: "H01", type: "C", plot: "North Ridge", level: "2 levels", status: "Available", site: 0 },
  { id: "H02", type: "B", plot: "North Ridge", level: "2 levels", status: "Reserved", site: 1 },
  { id: "H03", type: "A", plot: "Pine Hollow", level: "1 level", status: "Available", site: 4 },
  { id: "H04", type: "A", plot: "Pine Hollow", level: "1 level", status: "Sold", site: 5 },
  { id: "H05", type: "B", plot: "Lake Edge", level: "2 levels", status: "Available", site: 8 },
  { id: "H06", type: "C", plot: "Lake Edge", level: "2 levels", status: "Reserved", site: 9 },
  { id: "H07", type: "A", plot: "The Glade", level: "1 level", status: "Available", site: 12 },
  { id: "H08", type: "B", plot: "The Glade", level: "2 levels", status: "Sold", site: 13 },
  { id: "H09", type: "A", plot: "South Meadow", level: "1 level", status: "Available", site: 15 },
  { id: "H10", type: "C", plot: "South Meadow", level: "2 levels", status: "Available", site: 16 },
];
