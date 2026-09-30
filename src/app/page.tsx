import {
  getSettings,
  getServices,
  getGallery,
  getTestimonials,
} from "@/lib/storage";

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

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-[#dc2626] selection:text-white">
      {/* 1. Top Guarantee & Phone Announcement Marquee */}
      <AnnouncementBar
        announcement={settings.marqueeAnnouncement}
        phone={settings.phone}
      />

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
        <HeroSection
          headline={settings.heroHeadline}
          phone={settings.phone}
          address={settings.address}
          warrantyYears={settings.warrantyYears}
        />
      </div>

      {/* 3. About Us / Welcome Section with 3 Interactive Tabs */}
      <WelcomeSection
        headline={settings.heroHeadline}
        phone={settings.phone}
      />

      {/* 4. Core Services & Workmanship Grid */}
      <ServicesGrid services={services} gallery={gallery} />

      {/* 5. Australian Trade Standards */}
      <TradeCredentials />

      {/* 6. Why Choose Us */}
      <WhyChooseUs />

      {/* 8. Customer Testimonials (Temporarily hidden per client request) */}
      {/* <Testimonials testimonials={testimonials} /> */}

      {/* 9. Frequently Asked Questions */}
      <FAQSection />

      {/* 10. Free On-Site Measure & Quote Section */}
      <QuoteSection
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        facebookUrl={settings.facebookUrl}
      />

      {/* 11. Australian Standards Accredited Footer */}
      <Footer
        companyName={settings.companyName}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        facebookUrl={settings.facebookUrl}
        abn={settings.abn}
      />

      {/* 12. Floating Pulsing Contact Us Widget & Smooth Scroll to Top */}
      <FloatingContactWidget
        phone={settings.phone}
        email={settings.email}
        facebookUrl={settings.facebookUrl}
      />
    </main>
  );
}
