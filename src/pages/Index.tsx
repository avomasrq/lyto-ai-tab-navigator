import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { CustomersSection } from '@/components/ui/customers-section';

const TRUSTED_LOGOS = [
  { src: '/tele2new.png', alt: 'Tele2', height: 40 },
];


// Lazy-load everything below the fold — browser renders hero instantly,
// then loads the rest in parallel as separate chunks
const FeaturesSection      = lazy(() => import('@/components/FeaturesSection'));
const ShowcaseSection      = lazy(() => import('@/components/ShowcaseSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const PricingSection      = lazy(() => import('@/components/PricingSection'));
const FAQSection          = lazy(() => import('@/components/FAQSection'));
const Footer              = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar />
      <main>
        <HeroSection />
        <Suspense fallback={null}>
          <FeaturesSection />
          <ShowcaseSection />
          <CustomersSection customers={TRUSTED_LOGOS} label="Trusted by teams at" className="py-10" />
          <TestimonialsSection />
          <PricingSection />
          <FAQSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
