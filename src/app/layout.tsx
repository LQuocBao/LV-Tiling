import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://lvtiling.com.au"),
  title: "LV Tiling Pty Ltd | Perth Master Tilers & Bathroom Renovations | Morley WA",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  description:
    "At LV Tiling Pty Ltd we treat every project as a work of art, delivering quality, precision even with a small renovation or large scale jobs. 4-Year Workmanship Warranty & 20-Year Waterproofing Guarantee.",
  keywords: [
    "tiling Perth",
    "tiler Morley WA",
    "bathroom renovation Perth",
    "floor tiling Western Australia",
    "screeding Morley",
    "waterproofing AS 3740 Perth",
    "AS 3958.1 tiling",
    "LV Tiling Pty Ltd",
    "regrouting Morley",
  ],
  authors: [{ name: "LV Tiling Pty Ltd" }],
  creator: "LV Tiling Pty Ltd",
  publisher: "LV Tiling Pty Ltd",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LV Tiling Pty Ltd | Perth Master Tilers & Bathroom Renovations",
    description:
      "At LV Tiling Pty Ltd we treat every project as a work of art, delivering quality, precision even with a small renovation or large scale jobs. Licensed WA Trade Specialists.",
    url: "https://lvtiling.com.au",
    siteName: "LV Tiling Pty Ltd",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "LV Tiling Pty Ltd - Luxury Bathroom and Floor Tiling Perth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LV Tiling Pty Ltd | Perth Master Tilers",
    description: "At LV Tiling Pty Ltd we treat every project as a work of art. 4-Year Workmanship Warranty. Call 0452 612 336.",
    images: ["/logo.png"],
  },
  alternates: {
    canonical: "https://lvtiling.com.au",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org LocalBusiness JSON-LD for Australian Trade Contractor
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "LV Tiling Pty Ltd",
    legalName: "LV Tiling Pty Ltd",
    vatID: "ABN 84 629 140 821",
    image: "https://lvtiling.com.au/logo.png",
    logo: "https://lvtiling.com.au/logo.png",
    telephone: "+61452612336",
    email: "lvotiling@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "130A Crimea street",
      addressLocality: "Morley",
      addressRegion: "WA",
      postalCode: "6062",
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -31.8986,
      longitude: 115.8942,
    },
    url: "https://lvtiling.com.au",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "48",
      bestRating: "5",
      worstRating: "1",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "17:30",
      },
    ],
    areaServed: [
      "Morley",
      "Dianella",
      "Bayswater",
      "Noranda",
      "Mount Lawley",
      "Inglewood",
      "Bedford",
      "Stirling",
      "Perth Metro",
      "Western Australia",
    ],
    sameAs: ["https://www.facebook.com/share/lvtiling"],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-slate-900 min-h-screen">
        <CustomCursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
