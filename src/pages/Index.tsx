import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import SocialProofBar from '@/components/SocialProofBar';
import { BackgroundPathsWrapper } from '@/components/ui/background-paths';

// Lazy-load everything below the fold — browser renders hero instantly,
// then loads the rest in parallel as separate chunks
const FeaturesSection    = lazy(() => import('@/components/FeaturesSection'));
const ShowcaseSection    = lazy(() => import('@/components/ShowcaseSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const PricingSection     = lazy(() => import('@/components/PricingSection'));
const FAQSection         = lazy(() => import('@/components/FAQSection'));
const Footer             = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <Suspense fallback={null}>
          <BackgroundPathsWrapper>
            <FeaturesSection />
            <ShowcaseSection />
            <TestimonialsSection />
            <PricingSection />
            <FAQSection />
          </BackgroundPathsWrapper>
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
