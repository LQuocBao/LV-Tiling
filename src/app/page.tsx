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
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ProjectGallery from "@/components/ProjectGallery";
import WhyChooseUs from "@/components/WhyChooseUs";
import WorkProcess from "@/components/WorkProcess";
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

        {/* 3. Hero Slider with 4-Year Gold Warranty Badge & "Expert Tiling With An Artistic Touch" */}
        <HeroSection
          headline={settings.heroHeadline}
          phone={settings.phone}
          address={settings.address}
          warrantyYears={settings.warrantyYears}
        />
      </div>

      {/* 4. Welcome Section / "What We Do" with 3 Interactive Tabs (Designing, Approved, Guaranteed) */}
      <WelcomeSection
        headline={settings.heroHeadline}
        phone={settings.phone}
      />

      {/* 5. Core Services Grid: "Services We Do - Our Featured Services" */}
      <ServicesGrid services={services} />

      {/* 6. Australian Trade Standards: Specialist Workshop vs Subcontractor Broker */}
      <TradeCredentials />

      {/* 7. Interactive Before & After Precision Screeding Slider */}
      <BeforeAfterSlider />

      {/* 8. Representative Projects Portfolio (All 15 Client Photos from media/) */}
      <ProjectGallery gallery={gallery} />

      {/* 9. Why Choose Us (4-Year Guarantee, Zero-Lippage, Dust Extraction, Direct Trade) */}
      <WhyChooseUs />

      {/* 10. 5-Step Precision Trade Workflow */}
      <WorkProcess />

      {/* 11. "What People Say - Words Of Our Clients" (Perth & Morley Feedback) */}
      <Testimonials testimonials={testimonials} />

      {/* 12. Frequently Asked Questions (SEO Google Rich Snippets) */}
      <FAQSection />

      {/* 13. Free On-Site Measure & Quote Section + Morley WA Google Map */}
      <QuoteSection
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        facebookUrl={settings.facebookUrl}
      />

      {/* 14. Australian Standards Accredited High-Contrast Footer */}
      <Footer
        companyName={settings.companyName}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        facebookUrl={settings.facebookUrl}
        abn={settings.abn}
      />

      {/* 15. Floating Pulsing Contact Us Widget & Smooth Scroll to Top */}
      <FloatingContactWidget
        phone={settings.phone}
        email={settings.email}
        facebookUrl={settings.facebookUrl}
      />
    </main>
  );
}
