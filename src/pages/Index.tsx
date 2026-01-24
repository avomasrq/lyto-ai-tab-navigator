import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhatIsLytoSection from '@/components/WhatIsLytoSection';
import FeaturesSection from '@/components/FeaturesSection';
import WhoItsForSection from '@/components/WhoItsForSection';
import PrivacySection from '@/components/PrivacySection';
import HowItWorksSection from '@/components/HowItWorksSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <WhatIsLytoSection />
        <FeaturesSection />
        <WhoItsForSection />
        <PrivacySection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
