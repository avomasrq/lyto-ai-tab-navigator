import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import HeroV2 from '@/components/landing/HeroV2';
import { InstallButton } from '@/components/landing/InstallButton';

/**
 * Six blocks, in this order, and nothing else.
 *
 * What left the page and why:
 *  · "Trusted by teams at" with three marks — one real logo is weaker than none,
 *    and it sat above the explanation of what the product is.
 *  · Twelve of the seventeen testimonials — invented people with stock faces.
 *    The five written by people who exist are back, between memory and the
 *    no-Chrome block, which is where the plan put real ones anyway.
 *  · The feature grid — the four jobs ARE the features, told as situations. Two
 *    tellings of the same thing only pushed the button further down.
 *
 * The install button appears after blocks 2, 3 and 5: people decide at different
 * moments, and making someone scroll back up to act on a decision loses them.
 */

const JobsSection      = lazy(() => import('@/components/landing/JobsSection'));
const MemoryBand       = lazy(() => import('@/components/landing/MemoryBand'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const NoChromeSection  = lazy(() => import('@/components/landing/NoChromeSection'));
const PricingSection   = lazy(() => import('@/components/PricingSection'));
const FAQSection       = lazy(() => import('@/components/FAQSection'));
const Footer           = lazy(() => import('@/components/Footer'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <Navbar />
      <main>
        <HeroV2 />
        <Suspense fallback={null}>
          <JobsSection />
          <MemoryBand />
          <TestimonialsSection />
          <NoChromeSection />
          <PricingSection />
          <div className="pb-24 sm:pb-28">
            <InstallButton size="md" />
          </div>
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
