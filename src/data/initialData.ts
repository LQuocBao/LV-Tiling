export interface SiteSettings {
  companyName: string;
  abn: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  marqueeAnnouncement: string;
  warrantyYears: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  icon: string;
  image: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "all" | "bathroom" | "craftsmanship" | "waterproofing" | "screeding" | "standards" | string;
  image: string;
  location: string;
  tileType: string;
  aspect?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  suburb: string;
  rating: number;
  date: string;
  comment: string;
  service: string;
}

export interface QuoteLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  serviceType: string;
  approxArea: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "booked" | "completed";
  createdAt: string;
}

export const defaultSettings: SiteSettings = {
  companyName: "LV Tiling Pty Ltd",
  abn: "ABN 84 629 140 821",
  tagline: "Perth's Premier Architectural & Residential Tiling Specialists",
  heroHeadline: "At LV Tiling Pty Ltd we treat every project as a work of art, delivering quality, precision even with a small renovation or large scale jobs. Our experts will ensure every detail is done right. Let’s transform your space together.",
  heroSubheadline: "Licensed Western Australian tiling contractor providing laser-aligned screeding, AS 3740 waterproofing, and flawless tile installations backed by our 4-year comprehensive workmanship warranty.",
  phone: "0452 612 336",
  email: "lvotiling@gmail.com",
  address: "130A Crimea street Morley 6062 WA",
  facebookUrl: "https://www.facebook.com/share/lvtiling",
  marqueeAnnouncement: "4-Year Comprehensive Workmanship Warranty · AS 3958.1 & AS 3740 Compliant · Laser Leveling Guarantee · Perth & Morley WA · Call Now: 0452 612 336",
  warrantyYears: 4,
};

export const defaultServices: ServiceItem[] = [
  {
    id: "bathroom-renovations",
    title: "Luxury Bathroom & Shower Tiling",
    shortDesc: "Complete wet-area tiling with dual-layer waterproofing to AS 3740, recessed niches, and engineered falls to strip drains.",
    fullDesc: "From custom walk-in showers and mitred tile niches to freestanding bath backdrops, we handle critical workshop preparation, precision screeding, and certified waterproofing to guarantee 100% leak-proof durability.",
    features: ["Custom walk-in showers & recessed niches", "AS 3740 certified dual waterproof membrane", "45-degree hand-mitred external corners", "Mould-resistant ARDEX epoxy grout & silicone"],
    icon: "Droplets",
    image: "/media/3dc6ea8d-6e0b-4b8b-a3a6-a3c01bd0cf61.jpg",
    badge: "Most Popular",
  },
  {
    id: "floor-tiling",
    title: "Precision Floor Tiling & Lippage Tuning",
    shortDesc: "Specialist installation of large-format porcelain, marble, and terrazzo with mechanical tile leveling clips for zero-lippage.",
    fullDesc: "Our master tilers utilize advanced laser leveling clips and mechanical vibration systems to ensure completely flat, mirror-grade floor surfaces conforming to Australian Standard AS 3958.1.",
    features: ["Large-format tiles up to 1200x2400mm", "Laser-guided sub-millimeter leveling clips", "Acoustic underlayment & movement joints", "Rectified edge & symmetrical alignment"],
    icon: "Grid",
    image: "/media/b2c368ec-a5fa-4bc3-80d3-dd10d8880563.jpg",
    badge: "Zero-Lippage Guarantee",
  },
  {
    id: "master-ensuites",
    title: "Master Ensuite & Freestanding Bath Suites",
    shortDesc: "Architectural bathroom renovations featuring freestanding bathtubs, fluted glass screens, timber vanities, and feature walls.",
    fullDesc: "We bring your luxury vision for your living space to life. Turnkey bathroom transformations executed with direct trade craftsmanship in Perth and Morley.",
    features: ["Freestanding bath surrounds & plumbing drops", "Full-height porcelain slab feature walls", "Fluted glass and custom timber vanity integration", "Direct trade execution with full warranty"],
    icon: "Sparkles",
    image: "/media/9935903f-3f4e-4182-8197-19e2a50fa065.jpg",
    badge: "Architectural Finish",
  },
  {
    id: "waterproofing-systems",
    title: "Certified AS 3740 Wet Area Waterproofing",
    shortDesc: "Multi-stage wet-area protection with flexible polyurethane movement joints and Laticrete Hydro Ban seamless membrane.",
    fullDesc: "Waterproofing is the foundation of a watertight space. We seal all corners, floor-wall junctions, and internal expansion joints to ensure 100% structural leak prevention.",
    features: ["Step 1: Bostik polyurethane movement joint sealing", "Step 2 & 3: Laticrete Hydro Ban dual-coat membrane", "Reinforced internal corners & screeded floors", "Strict AS 3740 quality control & compliance"],
    icon: "Shield",
    image: "/media/6e383397-b70c-4113-841d-944e65dc8341.jpg",
    badge: "AS 3740 Certified",
  },
  {
    id: "screeding-prep",
    title: "Floor Screeding & Substrate Engineering",
    shortDesc: "Laser-engineered sand & cement screeds, polymer bonding slurries, and precision 1:60 falls to strip drains to AS 3958.1.",
    fullDesc: "The base that defines the result. We establish strong, stable foundations with precise engineered screeding to prevent water pooling and ensure a flawless floor finish.",
    features: ["Engineered 1:60 falls to strip drains & waste", "Polymer bonding slurry prior to screeding", "Substrate leveling meeting AS 3958.1", "High compression strength & fast-cure formulas"],
    icon: "Layers",
    image: "/media/9cdbf6fa-1c42-4cd0-8841-e812ade2af6f.jpg",
    badge: "Engineered Falls",
  },
  {
    id: "edge-detailing",
    title: "Architectural Trims & Natural Stone Sealing",
    shortDesc: "Refined metal tile trims, seamless hand-mitred joints, and Tenax surface treatment for long-term stone protection.",
    fullDesc: "Tile trims protect exposed edges and create clean, straight lines, while Tenax sealers enhance natural stone colour and protect against moisture and staining.",
    features: ["Hand-crafted 45-degree mitred tile edges", "Tenax protective sealing for marble & travertine", "ARDEX sanitary silicone expansion seals", "Niches, windowsills & architectural features"],
    icon: "Wrench",
    image: "/media/bec463cc-8470-4967-a0ff-f2d23ad49bf4.jpg",
    badge: "Master Detailing",
  },
];

// All 15 authentic slides and craftsmanship images provided by LV Tiling
export const defaultGallery: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Master Ensuite with Freestanding Bathtub",
    category: "bathroom",
    image: "/media/9935903f-3f4e-4182-8197-19e2a50fa065.jpg",
    location: "Morley, WA",
    tileType: "Freestanding Oval Bath, Fluted Screen & Porcelain Suite",
  },
  {
    id: "gal-2",
    title: "Walk-in Showers with Recessed Niches & Strip Drains",
    category: "bathroom",
    image: "/media/3dc6ea8d-6e0b-4b8b-a3a6-a3c01bd0cf61.jpg",
    location: "Perth, WA",
    tileType: "ARDEX SE Sanitary Silicone & ARDEX FG 8 Grout Detailing",
  },
  {
    id: "gal-3",
    title: "Where Design Meets Precision - Tile Levelling System",
    category: "craftsmanship",
    image: "/media/b2c368ec-a5fa-4bc3-80d3-dd10d8880563.jpg",
    location: "Dianella, WA",
    tileType: "Precision Tile Clips for Symmetrical Zero-Lippage Finish",
  },
  {
    id: "gal-4",
    title: "Refined Edge Trims & Clean Straight Lines",
    category: "craftsmanship",
    image: "/media/bfb0c196-58dc-4d1a-bb98-bff12d0915b0.jpg",
    location: "Bayswater, WA",
    tileType: "Architectural Tile Trims for Exposed Edges & Corner Durability",
  },
  {
    id: "gal-5",
    title: "Tenax Surface Treatment & Natural Stone Sealing",
    category: "craftsmanship",
    image: "/media/bec463cc-8470-4967-a0ff-f2d23ad49bf4.jpg",
    location: "Mount Lawley, WA",
    tileType: "Tenax Enhancer & Stain Sealer for Niches, Windowsills & Stone",
  },
  {
    id: "gal-6",
    title: "Step 1: Flexible Polyurethane Movement Joint Sealing",
    category: "waterproofing",
    image: "/media/4fb93e8c-0742-47e4-80f2-4088788b18de.jpg",
    location: "Morley, WA",
    tileType: "Bostik Seal'n'Flex 1 Movement Joint & Corner Sealing (AS 3740)",
  },
  {
    id: "gal-7",
    title: "Step 2: Hydro Ban Waterproofing System Application",
    category: "waterproofing",
    image: "/media/6e383397-b70c-4113-841d-944e65dc8341.jpg",
    location: "Inglewood, WA",
    tileType: "Seamless Flexible Membrane on Screeded Floors & Gyprock",
  },
  {
    id: "gal-8",
    title: "Step 3: Two-Coat System for Maximum Coverage",
    category: "waterproofing",
    image: "/media/49c4380f-b1a6-4335-8e6c-ec22a3d47da0.jpg",
    location: "Bedford, WA",
    tileType: "Multi-Coat Wet Area Waterproofing to Australian Standard AS 3740",
  },
  {
    id: "gal-9",
    title: "The Base That Defines The Result: Engineered Screeding",
    category: "screeding",
    image: "/media/9cdbf6fa-1c42-4cd0-8841-e812ade2af6f.jpg",
    location: "Perth, WA",
    tileType: "Laser Screeding for Optimal Levelness & Falls to Waste (AS 3958.1)",
  },
  {
    id: "gal-10",
    title: "Bonding Slurry Application Prior to Floor Screeding",
    category: "screeding",
    image: "/media/a9f91438-b2d3-4a0d-895d-744cd1fd8569.jpg",
    location: "Maylands, WA",
    tileType: "Polymer-Modified Adhesive Slurry for Maximum Slab Adhesion",
  },
  {
    id: "gal-11",
    title: "Shower Wall Preparation & Substrate Remediation",
    category: "screeding",
    image: "/media/34bdf219-c1c5-410a-a1a1-a140f08a4f87.jpg",
    location: "Morley, WA",
    tileType: "Surface Scraping & Priming for Flat Base Adhesive Performance",
  },
  {
    id: "gal-12",
    title: "Eco Prim Grip Mechanical Bonding for Non-Porous Surfaces",
    category: "screeding",
    image: "/media/9c19a153-828a-4937-abf2-b1a56ca85e56.jpg",
    location: "North Perth, WA",
    tileType: "Rough Mechanical Key Bonding Layer for Tiles, Metal & Paint",
  },
  {
    id: "gal-13",
    title: "Ardex Multiprimer Sealing for Porous Render Walls",
    category: "screeding",
    image: "/media/b20b1850-4d2c-45bd-a9e9-02f4ab943916.jpg",
    location: "Osborne Park, WA",
    tileType: "Deep Penetration Sealer for Dusty & Absorbent Masonry Walls",
  },
  {
    id: "gal-14",
    title: "More Than Just Tiling: Company Standards & Values",
    category: "standards",
    image: "/media/e9d95888-ee09-466c-884e-f2c1a8519b64.jpg",
    location: "Perth & Morley, WA",
    tileType: "Transparent Process, Respect for Space & Durable Craftsmanship",
  },
  {
    id: "gal-15",
    title: "4-Year Comprehensive Workmanship Warranty Certificate",
    category: "standards",
    image: "/media/fc906945-b180-444b-b818-7f0a709dc091.jpg",
    location: "Morley Workshop, WA",
    tileType: "Guaranteed Workmanship & Multi-Stage Video/Photo Documentation",
  },
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: "t-1",
    name: "Lachlan Campbell",
    suburb: "Morley, WA",
    rating: 5,
    date: "February 2026",
    comment: "LV Tiling transformed our 1980s brick home with 130sqm of 600x1200 porcelain tiles. Absolute perfection — perfectly flat, laser-level, clean lines, and no mess left behind. Best trade team in Perth.",
    service: "Full Home Floor Tiling",
  },
  {
    id: "t-2",
    name: "Sarah & David O'Connor",
    suburb: "Dianella, WA",
    rating: 5,
    date: "January 2026",
    comment: "We had a severe shower leak from an old builder's work. LV Tiling stripped it back, re-waterproofed to AS 3740 standard, and tiled a gorgeous master ensuite. 10-year warranty gave us total peace of mind.",
    service: "Bathroom Waterproofing & Renovation",
  },
  {
    id: "t-3",
    name: "Mark Henderson (Apex Builders)",
    suburb: "Bayswater, WA",
    rating: 5,
    date: "December 2025",
    comment: "As a builder, I need trade specialists who understand Australian Standards and don't take shortcuts. LV Tiling Pty Ltd are our #1 tiling partners. On-time, accurate screeding, and impeccable finish.",
    service: "Commercial & Residential Subcontracting",
  },
  {
    id: "t-4",
    name: "Elena Rossi",
    suburb: "Mount Lawley, WA",
    rating: 5,
    date: "November 2025",
    comment: "Our herringbone kitchen splashback turned out like a masterpiece. The cuts around power points and benchtops are millimeter-exact. Friendly, punctual, and highly professional.",
    service: "Kitchen Splashback Tiling",
  },
];

export const defaultLeads: QuoteLead[] = [
  {
    id: "lead-1",
    name: "Jason Miller",
    phone: "0412 889 201",
    email: "jason.miller@gmail.com",
    suburb: "Morley",
    serviceType: "Luxury Bathroom & Shower Tiling",
    approxArea: "25 m²",
    message: "Need complete bathroom renovation including waterproofing and floor to ceiling tiles. Looking to start late this month.",
    status: "new",
    createdAt: "2026-09-08 14:20",
  },
  {
    id: "lead-2",
    name: "Claire Jenkins",
    phone: "0423 710 449",
    email: "claire.j@outlook.com.au",
    suburb: "Dianella",
    serviceType: "Precision Floor Tiling",
    approxArea: "85 m²",
    message: "Living room, dining and hallway large format porcelain. Concrete slab is already cleared.",
    status: "quoted",
    createdAt: "2026-09-07 09:15",
  },
];
