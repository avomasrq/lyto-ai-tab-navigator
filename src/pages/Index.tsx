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
 *  · The testimonials, all of them, for now. Twelve of the seventeen were
 *    invented people with stock faces; the five real ones were not, on their
 *    own, worth the block between the pitch and the memory beat. Commented
 *    out rather than deleted — put the section back when there is enough
 *    real feedback to fill it.
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
// Pulled from the page for now, not deleted — see the note above.
// const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
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
          {/* <TestimonialsSection /> */}
          <MemoryBand />
          <OdysseyClose />
          <NoChromeSection />
          <PricingSection />
          {/* The button is the tail of the pricing block, not a section of its
              own, so it does not need its own section-sized bottom margin —
              FAQ's 96px top already draws that boundary. With both, the two
              stacked to 252px of white between the sign-in line and "FAQ",
              which reads as the page having ended. */}
          <div className="pb-3 sm:pb-4">
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
