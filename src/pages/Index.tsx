import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ShowcaseSection from '@/components/ShowcaseSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import { BackgroundPathsWrapper } from '@/components/ui/background-paths';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <BackgroundPathsWrapper>
          <ShowcaseSection />
          <FeaturesSection />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
        </BackgroundPathsWrapper>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
