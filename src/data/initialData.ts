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
  description?: string;
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
    id: "completed-jobs",
    title: "Completed Jobs photo",
    shortDesc: "Real completed bathroom, ensuite, and floor tiling transformations delivered across Perth with meticulous finish and laser-flat alignment.",
    fullDesc: "From residential master suites to luxury renovations, every project demonstrates our master trade capability, clean lines, and strict adherence to Australian Standards.",
    features: [
      "Laser-aligned zero-lippage floor & wall tiling",
      "Consistent grout joints with mould-proof ARDEX finishes",
      "4-year comprehensive workmanship warranty",
      "High-grade porcelain, ceramic & natural stone",
    ],
    icon: "Award",
    image: "/media/completed/completed_21.jpg",
    badge: "Master Craft",
  },
  {
    id: "flashbacks",
    title: "Flashbacks",
    shortDesc: "In-depth documentation of project milestones, critical trade stages, and architectural before-and-after progressions.",
    fullDesc: "We capture step-by-step progress to give clients complete peace of mind, demonstrating transparency from initial substrate prep to the final sparkle.",
    features: [
      "Multi-stage photographic progress logs",
      "Complete subfloor restoration & prep checks",
      "Before-and-after structural transformation",
      "Proven quality track record across Western Australia",
    ],
    icon: "Sparkles",
    image: "/media/flashbacks/flashbacks_1.jpg",
    badge: "Proven Track Record",
  },
  {
    id: "screeding-prep",
    title: "Screeding and prep",
    shortDesc: "Engineered sand & cement screeding with precise 1:60 falls to strip drains, polymer slurry bonding, and laser leveling.",
    fullDesc: "A flawless tile finish starts beneath the surface. We engineer high-strength screeds with polymer bonding slurries that prevent water pooling and substrate cracking.",
    features: [
      "Engineered 1:60 falls to strip drains & puddle flanges",
      "Polymer bonding slurry prior to screeding",
      "Laser-leveled substrate meeting AS 3958.1",
      "High compression strength & fast-cure formulas",
    ],
    icon: "Layers",
    image: "/media/screeding/screeding_1.jpg",
    badge: "AS 3958.1 Compliant",
  },
  {
    id: "polyurethane-primer",
    title: "Polyurethane and Primer",
    shortDesc: "Eco Prim Grip mechanical bonding primers and heavy-duty Bostik polyurethane joint sealants for movement-proof wet areas.",
    fullDesc: "Proper priming and elastic joint expansion sealing prevent tile debonding and cracking caused by structural deflection and temperature changes.",
    features: [
      "Eco Prim Grip rough mechanical key primer",
      "Bostik polyurethane expansion joint sealing",
      "Accommodates building movement & thermal shifts",
      "Superior adhesion over porous & non-porous substrates",
    ],
    icon: "Droplets",
    image: "/media/polyurethane/polyurethane_1.jpeg",
    badge: "Advanced Bonding",
  },
  {
    id: "shower-bandages",
    title: "Shower Bandages",
    shortDesc: "High-tensile elastomeric waterproof reinforcing tape and corner bandages bridging all critical joints and wall-floor intersections.",
    fullDesc: "Crucial reinforcement installed at high-stress internal corners and transition joints to ensure the waterproof membrane remains intact under settlement.",
    features: [
      "Heavy-duty elastomeric waterproof bandages",
      "Complete internal corner & joint bridging",
      "Prevents rupture during building settlement",
      "Dual-coat liquid membrane encapsulation",
    ],
    icon: "Shield",
    image: "/media/bandages/bandages_1.jpeg",
    badge: "Critical Joint Seal",
  },
  {
    id: "waterproof",
    title: "Waterproof",
    shortDesc: "Certified AS 3740 wet area waterproofing with Laticrete Hydro Ban dual-coat membrane, guaranteed for 20 years lifetime protection.",
    fullDesc: "Waterproofing is the core foundation of every bathroom. We apply certified dual-layer membranes tested to strict Australian building codes.",
    features: [
      "LATICRETE® Hydro Ban® seamless liquid membrane",
      "100% Australian Standard AS 3740 compliance",
      "Guarantee 20 years life-time waterproofing",
      "Full photo & video compliance documentation",
    ],
    icon: "Droplets",
    image: "/media/waterproof/waterproof_1.jpg",
    badge: "AS 3740 Certified",
  },
  {
    id: "tennax-seal",
    title: "tennax seal",
    shortDesc: "Premium Tenax surface treatments and protective penetrating sealers for marble, travertine, granite, and natural stone installations.",
    fullDesc: "Protects delicate natural stone pores against stains, water ingress, and discoloration while enhancing the rich natural grain and color.",
    features: [
      "Tenax deep-penetrating stone sealer",
      "Long-term moisture, oil & stain resistance",
      "Enhances natural stone colour & veining depth",
      "Preserves tile breathability & durable luster",
    ],
    icon: "Sun",
    image: "/media/tennax/tennax_1.jpg",
    badge: "Stone Protection",
  },
];

// All 15 authentic slides and craftsmanship images provided by LV Tiling
export const defaultGallery: GalleryItem[] = [
  {
    "id": "gal-1",
    "title": "1200 x 600 mixed match",
    "category": "completed",
    "image": "/media/completed/completed_1.jpg",
    "location": "Dianella, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-2",
    "title": "1200x600 Grey marble floor, joint matching",
    "category": "completed",
    "image": "/media/completed/completed_2.jpg",
    "location": "Bayswater, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-3",
    "title": "1200x600 Shower seat feature",
    "category": "completed",
    "image": "/media/completed/completed_3.jpg",
    "location": "Inglewood, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-4",
    "title": "300x600 Beige marble around bathtub 1",
    "category": "completed",
    "image": "/media/completed/completed_4.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-5",
    "title": "300x600 Beige marble around bathtub 2",
    "category": "completed",
    "image": "/media/completed/completed_5.jpg",
    "location": "Bedford, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-6",
    "title": "300x600 Beige marble looks",
    "category": "completed",
    "image": "/media/completed/completed_6.jpg",
    "location": "Perth, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-7",
    "title": "300x600 Grey tiles with nib wall setup",
    "category": "completed",
    "image": "/media/completed/completed_7.jpg",
    "location": "Maylands, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-8",
    "title": "300x600 Light brown marble, feature border 1",
    "category": "completed",
    "image": "/media/completed/completed_8.jpg",
    "location": "Morley, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-9",
    "title": "300x600 Light brown marble, feature border 2",
    "category": "completed",
    "image": "/media/completed/completed_9.jpg",
    "location": "Dianella, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-10",
    "title": "600x600 full height, ceiling tile borders",
    "category": "completed",
    "image": "/media/completed/completed_10.jpg",
    "location": "Bayswater, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-11",
    "title": "Big Platform tiles shower only 3200x1600",
    "category": "completed",
    "image": "/media/completed/completed_11.jpg",
    "location": "Inglewood, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-12",
    "title": "Black subway tiles feature",
    "category": "completed",
    "image": "/media/completed/completed_12.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-13",
    "title": "Feature shower with lighting effects",
    "category": "completed",
    "image": "/media/completed/completed_13.jpg",
    "location": "Bedford, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-14",
    "title": "Marble 600x600 full height",
    "category": "completed",
    "image": "/media/completed/completed_14.jpg",
    "location": "Perth, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-15",
    "title": "Completed Job #15",
    "category": "completed",
    "image": "/media/completed/completed_15.jpg",
    "location": "Maylands, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-16",
    "title": "Completed Job #16",
    "category": "completed",
    "image": "/media/completed/completed_16.jpg",
    "location": "Morley, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-17",
    "title": "Completed Job #17",
    "category": "completed",
    "image": "/media/completed/completed_17.jpg",
    "location": "Dianella, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-18",
    "title": "Completed Job #18",
    "category": "completed",
    "image": "/media/completed/completed_18.jpg",
    "location": "Bayswater, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-19",
    "title": "Completed Job #19",
    "category": "completed",
    "image": "/media/completed/completed_19.jpg",
    "location": "Inglewood, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-20",
    "title": "Completed Job #20",
    "category": "completed",
    "image": "/media/completed/completed_20.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-21",
    "title": "Completed Job #21",
    "category": "completed",
    "image": "/media/completed/completed_21.jpg",
    "location": "Bedford, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-22",
    "title": "Completed Job #22",
    "category": "completed",
    "image": "/media/completed/completed_22.jpg",
    "location": "Perth, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-23",
    "title": "Completed Job #23",
    "category": "completed",
    "image": "/media/completed/completed_23.jpg",
    "location": "Maylands, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-24",
    "title": "Completed Job #24",
    "category": "completed",
    "image": "/media/completed/completed_24.jpg",
    "location": "Morley, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-25",
    "title": "Timber tiles 1200x200 mixed matach",
    "category": "completed",
    "image": "/media/completed/completed_25.jpg",
    "location": "Dianella, WA",
    "tileType": "Completed Job - Premium Finish"
  },
  {
    "id": "gal-26",
    "title": "300x600 Grey marble with green subway tiles",
    "category": "flashbacks",
    "image": "/media/flashbacks/flashbacks_1.jpg",
    "location": "Bayswater, WA",
    "tileType": "Flashback Project - Premium Finish"
  },
  {
    "id": "gal-27",
    "title": "Flashback Project #2",
    "category": "flashbacks",
    "image": "/media/flashbacks/flashbacks_2.jpg",
    "location": "Inglewood, WA",
    "tileType": "Flashback Project - Premium Finish"
  },
  {
    "id": "gal-28",
    "title": "Flashback Project #3",
    "category": "flashbacks",
    "image": "/media/flashbacks/flashbacks_3.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Flashback Project - Premium Finish"
  },
  {
    "id": "gal-29",
    "title": "Flashback Project #4",
    "category": "flashbacks",
    "image": "/media/flashbacks/flashbacks_4.jpg",
    "location": "Bedford, WA",
    "tileType": "Flashback Project - Premium Finish"
  },
  {
    "id": "gal-30",
    "title": "Flashback Project #5",
    "category": "flashbacks",
    "image": "/media/flashbacks/flashbacks_5.jpg",
    "location": "Perth, WA",
    "tileType": "Flashback Project - Premium Finish"
  },
  {
    "id": "gal-31",
    "title": "Screeding & Substrate Prep #1",
    "category": "screeding",
    "image": "/media/screeding/screeding_1.jpg",
    "location": "Maylands, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-32",
    "title": "Screeding & Substrate Prep #2",
    "category": "screeding",
    "image": "/media/screeding/screeding_2.jpg",
    "location": "Morley, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-33",
    "title": "Screeding & Substrate Prep #3",
    "category": "screeding",
    "image": "/media/screeding/screeding_3.jpg",
    "location": "Dianella, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-34",
    "title": "Screeding & Substrate Prep #4",
    "category": "screeding",
    "image": "/media/screeding/screeding_4.jpg",
    "location": "Bayswater, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-35",
    "title": "Screeding & Substrate Prep #5",
    "category": "screeding",
    "image": "/media/screeding/screeding_5.jpg",
    "location": "Inglewood, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-36",
    "title": "Screeding & Substrate Prep #6",
    "category": "screeding",
    "image": "/media/screeding/screeding_6.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-37",
    "title": "Screeding & Substrate Prep #7",
    "category": "screeding",
    "image": "/media/screeding/screeding_7.jpg",
    "location": "Bedford, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-38",
    "title": "Screeding & Substrate Prep #8",
    "category": "screeding",
    "image": "/media/screeding/screeding_8.jpg",
    "location": "Perth, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-39",
    "title": "Screeding & Substrate Prep #9",
    "category": "screeding",
    "image": "/media/screeding/screeding_9.jpg",
    "location": "Maylands, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-40",
    "title": "Screeding & Substrate Prep #10",
    "category": "screeding",
    "image": "/media/screeding/screeding_10.jpg",
    "location": "Morley, WA",
    "tileType": "Screeding & Substrate Prep - Premium Finish"
  },
  {
    "id": "gal-41",
    "title": "Polyurethane & Primer #1",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_1.jpeg",
    "location": "Dianella, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-42",
    "title": "Polyurethane & Primer #2",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_2.jpeg",
    "location": "Bayswater, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-43",
    "title": "Polyurethane & Primer #3",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_3.jpeg",
    "location": "Inglewood, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-44",
    "title": "Polyurethane & Primer #4",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_4.jpeg",
    "location": "Mount Lawley, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-45",
    "title": "Polyurethane & Primer #5",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_5.jpeg",
    "location": "Bedford, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-46",
    "title": "Polyurethane & Primer #6",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_6.jpeg",
    "location": "Perth, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-47",
    "title": "Polyurethane & Primer #7",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_7.jpeg",
    "location": "Maylands, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-48",
    "title": "Polyurethane & Primer #8",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_8.jpeg",
    "location": "Morley, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-49",
    "title": "Polyurethane & Primer #9",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_9.jpeg",
    "location": "Dianella, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-50",
    "title": "Polyurethane & Primer #10",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_10.jpeg",
    "location": "Bayswater, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-51",
    "title": "Polyurethane & Primer #11",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_11.jpeg",
    "location": "Inglewood, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-52",
    "title": "Polyurethane & Primer #12",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_12.jpeg",
    "location": "Mount Lawley, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-53",
    "title": "Polyurethane & Primer #13",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_13.jpeg",
    "location": "Bedford, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-54",
    "title": "Polyurethane & Primer #14",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_14.jpeg",
    "location": "Perth, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-55",
    "title": "Polyurethane & Primer #15",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_15.jpeg",
    "location": "Maylands, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-56",
    "title": "Polyurethane & Primer #16",
    "category": "polyurethane",
    "image": "/media/polyurethane/polyurethane_16.jpeg",
    "location": "Morley, WA",
    "tileType": "Polyurethane & Primer - Premium Finish"
  },
  {
    "id": "gal-57",
    "title": "Shower Bandage Detailing #1",
    "category": "bandages",
    "image": "/media/bandages/bandages_1.jpeg",
    "location": "Dianella, WA",
    "tileType": "Shower Bandage Detailing - Premium Finish"
  },
  {
    "id": "gal-58",
    "title": "Shower Bandage Detailing #2",
    "category": "bandages",
    "image": "/media/bandages/bandages_2.jpeg",
    "location": "Bayswater, WA",
    "tileType": "Shower Bandage Detailing - Premium Finish"
  },
  {
    "id": "gal-59",
    "title": "Shower Bandage Detailing #3",
    "category": "bandages",
    "image": "/media/bandages/bandages_3.jpeg",
    "location": "Inglewood, WA",
    "tileType": "Shower Bandage Detailing - Premium Finish"
  },
  {
    "id": "gal-60",
    "title": "Waterproofing Application #1",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_1.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-61",
    "title": "Waterproofing Application #2",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_2.jpg",
    "location": "Bedford, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-62",
    "title": "Waterproofing Application #3",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_3.jpg",
    "location": "Perth, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-63",
    "title": "Waterproofing Application #4",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_4.jpg",
    "location": "Maylands, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-64",
    "title": "Waterproofing Application #5",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_5.jpg",
    "location": "Morley, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-65",
    "title": "Waterproofing Application #6",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_6.jpg",
    "location": "Dianella, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-66",
    "title": "Waterproofing Application #7",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_7.jpg",
    "location": "Bayswater, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-67",
    "title": "Waterproofing Application #8",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_8.jpg",
    "location": "Inglewood, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-68",
    "title": "Waterproofing Application #9",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_9.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-69",
    "title": "Waterproofing Application #10",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_10.jpg",
    "location": "Bedford, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-70",
    "title": "Waterproofing Application #11",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_11.jpg",
    "location": "Perth, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-71",
    "title": "Waterproofing Application #12",
    "category": "waterproof",
    "image": "/media/waterproof/waterproof_12.jpg",
    "location": "Maylands, WA",
    "tileType": "Waterproofing Application - Premium Finish"
  },
  {
    "id": "gal-72",
    "title": "Tenax Sealing & Protection #1",
    "category": "tennax",
    "image": "/media/tennax/tennax_1.jpg",
    "location": "Morley, WA",
    "tileType": "Tenax Sealing & Protection - Premium Finish"
  },
  {
    "id": "gal-73",
    "title": "Tenax Sealing & Protection #2",
    "category": "tennax",
    "image": "/media/tennax/tennax_2.jpg",
    "location": "Dianella, WA",
    "tileType": "Tenax Sealing & Protection - Premium Finish"
  },
  {
    "id": "gal-74",
    "title": "Tenax Sealing & Protection #3",
    "category": "tennax",
    "image": "/media/tennax/tennax_3.jpg",
    "location": "Bayswater, WA",
    "tileType": "Tenax Sealing & Protection - Premium Finish"
  },
  {
    "id": "gal-75",
    "title": "Tenax Sealing & Protection #4",
    "category": "tennax",
    "image": "/media/tennax/tennax_4.jpg",
    "location": "Inglewood, WA",
    "tileType": "Tenax Sealing & Protection - Premium Finish"
  },
  {
    "id": "gal-76",
    "title": "Tenax Sealing & Protection #5",
    "category": "tennax",
    "image": "/media/tennax/tennax_5.jpg",
    "location": "Mount Lawley, WA",
    "tileType": "Tenax Sealing & Protection - Premium Finish"
  }
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
