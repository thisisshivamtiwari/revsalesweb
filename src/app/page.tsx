import NavbarDemo from "@/components/ui/resizable-navbar-demo";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FeaturesShowcaseSection } from "@/components/landing/features-showcase-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/ui/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      {/* NavBar Integration */}
      <NavbarDemo />
      
      {/* Main content with proper spacing for fixed navbar */}
      <div className="flex-grow pt-24 md:pt-28">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* Features Showcase Section */}
        <FeaturesShowcaseSection />
        
        {/* Testimonials Section */}
        <TestimonialsSection />
        
        {/* CTA Section */}
        <CtaSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
