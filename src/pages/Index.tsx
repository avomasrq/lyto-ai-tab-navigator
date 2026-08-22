import { Suspense, lazy } from 'react';
import Navbar from '@/components/Navbar';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import HeroV2 from '@/components/landing/HeroV2';
import { InstallButton } from '@/components/landing/InstallButton';

/**
 * Seven blocks, in this order, and nothing else.
 *
 * What left the page and why:
 *  · "Trusted by teams at" with three marks — one real logo is weaker than none,
 *    and it sat above the explanation of what the product is.
 *  · Twelve of the seventeen testimonials — invented people with stock faces.
 *    The five written by people who exist are back, right after the four jobs:
 *    proof straight after the pitch, before the emotional memory beat.
 *  · The feature grid — the four jobs ARE the features, told as situations. Two
 *    tellings of the same thing only pushed the button further down.
 *
 * Memory's own closing beat (the Odyssey line the name comes from) used to sit
 * directly under it, and the testimonial carousel that followed cut the mood
 * off mid-breath. It is now OdysseyClose, its own section, running straight out
 * of the memory band — the two halves of the same thought, back together.
 *
 * The door for people without Chrome follows it rather than preceding it, so
 * the last thing before price is a practical answer ("you can still run this
 * without the extension") instead of a closing line the ask then talks over.
 *
 * The install button appears after blocks 2, 4 and 6: people decide at different
 * moments, and making someone scroll back up to act on a decision loses them.
 */

const JobsSection      = lazy(() => import('@/components/landing/JobsSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const MemoryBand       = lazy(() => import('@/components/landing/MemoryBand'));
const NoChromeSection  = lazy(() => import('@/components/landing/NoChromeSection'));
const OdysseyClose     = lazy(() => import('@/components/landing/OdysseyClose'));
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
          <TestimonialsSection />
          <MemoryBand />
          <OdysseyClose />
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
