# 🏆 LV Tiling Pty Ltd — Premium Architectural & Residential Tiling Landing Page

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **High-converting, animation-rich, trade-compliant landing page and business presentation for LV Tiling Pty Ltd — Perth & Western Australia's Premier Architectural Tiling Specialists.**

---

## 📌 Client & Business Information

- **Company Name**: LV Tiling Pty Ltd
- **ABN**: `84 629 140 821`
- **Location**: 130A Crimea Street, Morley 6062 WA, Greater Perth
- **Hotline**: `+61 452 612 336` (0452 612 336)
- **Email**: `lvotiling@gmail.com`
- **Core Standards**: AS 3958.1 (Tile Installation) & AS 3740 (Wet Area Waterproofing)
- **Guarantee**: 4-Year Comprehensive Workmanship Warranty

---

## ✨ Key Highlights & Interactive Features

### 1. 🎬 Cinematic Hero Section
- **Dual-Line Dynamic Typewriter Effect**: Smooth character-by-character typing animation emphasizing craftsmanship and warranty values.
- **Architectural Scrim & Breathing Background**: Ken Burns zoom animation over completed luxury walk-in showers with dark vignette overlays ensuring 100% typography legibility.
- **3D Gold Foil Sweep Warranty Shield**: Custom 3D tilt card celebrating the **4-Year Comprehensive Workmanship Guarantee**.

### 2. 🎚️ Interactive Before & After Transformation Slider
- Real-time drag comparison between raw shower wall substrate preparation (`34bdf...`) and completed luxury bathroom shower suites (`3dc6e...`).
- Zero-friction pointer feedback with pulsating guidance badges.

### 3. 🛠️ Master Trade Capabilities (Services Grid)
- 6 Authentic core services with genuine 1-to-1 matching portfolio photos:
  1. **Luxury Bathroom & Shower Tiling** (Recessed niches, strip drains, ARDEX SE silicone & FG 8 grout)
  2. **Precision Floor Tiling & Lippage Tuning** (Laser leveling clips, zero-lippage guarantee, large format)
  3. **Master Ensuite & Freestanding Bath Suites** (Freestanding bath surrounds, timber vanity integration)
  4. **Certified AS 3740 Wet Area Waterproofing** (Bostik PU movement joints & Laticrete Hydro Ban dual-membrane)
  5. **Floor Screeding & Substrate Engineering** (Engineered 1:60 falls to strip drains to AS 3958.1)
  6. **Architectural Trims & Natural Stone Sealing** (Tenax protective stone enhancer & 45° mitred edge trims)
- Interactive spotlight hover illumination and instant quote inquiry shortcuts.

### 4. 📸 Workmanship & Technical Portfolio Gallery
- Complete collection of **15 authentic client slides and craftsmanship photos** categorized into:
  - 🚿 **Bathrooms & Showers**
  - 📐 **Precision Tiling & Details**
  - 🛡️ **AS 3740 Waterproofing**
  - 🏗️ **Screeding & Substrate Prep**
  - 📜 **Warranty & Standards**
- Built-in full-screen **Lightbox modal** with keyboard navigation, zoom capability, and detailed material specifications.

### 5. 💰 Instant Online Quote Estimator & Lead Capture
- Interactive trade calculator factoring in service type, area ($m^2$), and suburb selection.
- Automatic persistent lead dispatch to local storage / API endpoint with status tracking.

### 6. 🔐 Admin Control Center (`/admin`)
- Secure administrative dashboard to inspect received customer leads, manage service content, and curate portfolio projects with real-time updates.

### 7. 🚀 Micro-Animations & Ergonomics
- **Lenis Smooth Scrolling**: Silk-smooth inertia scrolling across all desktop and mobile viewports.
- **Custom Interactive Magnetic Cursor**: Dynamically transforms into pointer indicators when hovering over interactive elements.
- **Synchronized Scroll-To-Top**: Streamlined floating action trigger matching the site's sleek dark & crimson palette.

---

## 📂 Project Structure

```text
frontend/
├── data-store/                 # JSON file persistence (services, gallery, settings, leads)
│   ├── gallery.json            # 15 Authentic portfolio items matching client slides
│   ├── services.json           # 6 Trade service definitions
│   └── settings.json           # Business metadata, warranty terms & phone lines
├── public/
│   ├── logo.png                # Official LV Tiling logo
│   └── media/                  # 15 Client portfolio and technical slide assets (JPG)
├── src/
│   ├── app/
│   │   ├── admin/              # Admin management dashboard & login
│   │   ├── api/                # REST endpoints for leads, quote, services, gallery
│   │   ├── globals.css         # Custom animations, gold sweep, and scrollbar hides
│   │   ├── layout.tsx          # Root layout with SEO OpenGraph, JSON-LD Schema
│   │   └── page.tsx            # Main landing page combining all sections
│   ├── components/
│   │   ├── BeforeAfterSlider.tsx   # Interactive substrate vs completed slider
│   │   ├── CustomCursor.tsx        # Dynamic magnetic cursor with pointer detection
│   │   ├── Footer.tsx              # SEO-optimized trade footer with map coordinates
│   │   ├── Header.tsx              # Sticky glassmorphism navigation with contact CTA
│   │   ├── HeroSection.tsx         # Typewriter effect, Ken Burns background & gold badge
│   │   ├── ProjectGallery.tsx      # 15-item categorized portfolio with Lightbox
│   │   ├── QuoteSection.tsx        # Interactive area calculation & lead form
│   │   ├── ServicesGrid.tsx        # 6 Trade capabilities with Spotlight hover
│   │   ├── SmoothScrollProvider.tsx# Lenis smooth inertia scroll wrapper
│   │   ├── SpotlightCard.tsx       # Mouse-tracking radial spotlight card
│   │   ├── TestimonialsSection.tsx # Perth customer reviews & 5-star ratings
│   │   └── WelcomeSection.tsx      # Company values, ABN credentials & warranty tabs
│   ├── data/
│   │   └── initialData.ts      # TypeScript interfaces and fallback trade data
│   └── lib/
│       └── storage.ts          # Server-side data-store readers and writers
├── next.config.ts              # Next.js compiler & image optimization settings
├── package.json                # Project dependencies & npm scripts
└── tsconfig.json               # TypeScript strict configuration
```

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Framework** | [Next.js 16.3 (App Router with Turbopack)](https://nextjs.org/) |
| **Runtime** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Smooth Scroll** | [@studio-freight/lenis](https://github.com/darkroomengineering/lenis) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **SEO** | Open Graph, Twitter Cards, Schema.org `HomeAndConstructionBusiness` |

---

## ⚡ Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/LQuocBao/LV-Tiling.git
cd LV-Tiling
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the live landing page.

### 4. Build for production
```bash
npm run build
npm run start
```

---

## 🌐 Deploying to Vercel (Recommended)

1. Push your code to GitHub: `https://github.com/LQuocBao/LV-Tiling.git`
2. Go to [Vercel Dashboard](https://vercel.com/) and click **"Add New..." > "Project"**.
3. Select the repository **`LV-Tiling`**.
4. Configure Project:
   - **Framework Preset**: `Next.js` (automatically detected)
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. Click **Deploy**. Your high-performance landing page will be live globally within 1 minute!

---

## 📞 Support & Contacts

- **Developer**: Lam Quoc Bao ([@LQuocBao](https://github.com/LQuocBao))
- **Client**: LV Tiling Pty Ltd — Perth & Morley, WA
- **Email**: lvotiling@gmail.com
- **Phone**: 0452 612 336
