import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustBar from '@/components/TrustBar';
import ShowcaseSection from '@/components/ShowcaseSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative noise">
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <TrustBar />
        <ShowcaseSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
