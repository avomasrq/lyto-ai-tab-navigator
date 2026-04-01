import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { BackgroundPathsWrapper } from '@/components/ui/background-paths';

// Lazy-load everything below the fold — browser renders hero instantly,
// then loads the rest in parallel as separate chunks
const ShowcaseSection    = lazy(() => import('@/components/ShowcaseSection'));
const FeaturesSection    = lazy(() => import('@/components/FeaturesSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const PricingSection     = lazy(() => import('@/components/PricingSection'));
const FAQSection         = lazy(() => import('@/components/FAQSection'));
const Footer             = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <BackgroundPathsWrapper>
            <ShowcaseSection />
            <FeaturesSection />
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
