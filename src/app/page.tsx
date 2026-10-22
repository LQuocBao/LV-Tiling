import {
  getSettings,
  getServices,
  getGallery,
  getTestimonials,
} from "@/lib/storage";
import { defaultSectionVisibility } from "@/data/initialData";

import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WelcomeSection from "@/components/WelcomeSection";
import ServicesGrid from "@/components/ServicesGrid";
import TradeCredentials from "@/components/TradeCredentials";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import QuoteSection from "@/components/QuoteSection";
import Footer from "@/components/Footer";
import FloatingContactWidget from "@/components/FloatingContactWidget";

// Revalidate every 60 seconds if data changes via storage
export const revalidate = 60;

export default function HomePage() {
  const settings = getSettings();
  const services = getServices();
  const gallery = getGallery();
  const testimonials = getTestimonials();

  // Merge with defaults to handle older stored settings without sectionVisibility
  const vis = { ...defaultSectionVisibility, ...(settings.sectionVisibility ?? {}) };

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-[#dc2626] selection:text-white">
      {/* 1. Top Guarantee & Phone Announcement Marquee */}
      {vis.announcementBar && (
        <AnnouncementBar
          announcement={settings.marqueeAnnouncement}
          phone={settings.phone}
        />
      )}

      {/* Hero Banner Area: Header sits over banner and sticks on scroll */}
      <div className="relative">
        <Navbar
          companyName={settings.companyName}
          phone={settings.phone}
          email={settings.email}
          address={settings.address}
          facebookUrl={settings.facebookUrl}
        />

        {/* 2. Hero Slider with 4-Year Gold Warranty Badge */}
        {vis.hero && (
          <HeroSection
            headline={settings.heroHeadline}
            phone={settings.phone}
            address={settings.address}
            warrantyYears={settings.warrantyYears}
            heroImage={settings.heroImage}
          />
        )}
      </div>

      {/* 3. About Us / Welcome Section */}
      {vis.welcome && (
        <WelcomeSection
          headline={settings.heroHeadline}
          phone={settings.phone}
        />
      )}

      {/* 4. Core Services & Workmanship Grid */}
      {vis.services && <ServicesGrid services={services} gallery={gallery} />}

      {/* 5. Australian Trade Standards */}
      {vis.tradeCredentials && <TradeCredentials />}

      {/* 6. Why Choose Us */}
      {vis.whyChooseUs && <WhyChooseUs />}

      {/* 7. Customer Testimonials (toggle-able) */}
      {vis.testimonials && <Testimonials testimonials={testimonials} />}

      {/* 8. Frequently Asked Questions */}
      {vis.faq && <FAQSection />}

      {/* 9. Free On-Site Measure & Quote Section */}
      {vis.quote && (
        <QuoteSection
          phone={settings.phone}
          email={settings.email}
          address={settings.address}
          facebookUrl={settings.facebookUrl}
        />
      )}

      {/* 10. Australian Standards Accredited Footer */}
      <Footer
        companyName={settings.companyName}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        facebookUrl={settings.facebookUrl}
        abn={settings.abn}
      />

      {/* 11. Floating Pulsing Contact Us Widget & Smooth Scroll to Top */}
      <FloatingContactWidget
        phone={settings.phone}
        email={settings.email}
        facebookUrl={settings.facebookUrl}
      />
    </main>
  );
}