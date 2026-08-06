import { FadeIn, FadeInStagger, FadeInItem } from '@/components/ui/fade-in';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Install & connect',
      description: "Add Lyto to Chrome and it instantly connects with Google Docs, Gmail, and Google Sheets — no setup required.",
    },
    {
      number: '02',
      title: 'Give it a task',
      description: 'Ask Lyto to research a topic, automate a workflow, fill a form, or work through a question bank — it handles the browser for you.',
    },
    {
      number: '03',
      title: 'Results in one click',
      description: 'Lyto finds sources, compares data, and presents structured results with graphs and visuals — everything organized in one place.',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-20 px-4 sm:px-6 border-t border-border scroll-mt-24">
      <div className="container mx-auto">
        <FadeIn className="max-w-2xl mb-12 sm:mb-20">
          <span className="text-[8px] sm:text-xs uppercase tracking-[0.25em] text-primary font-medium">
            How it works
          </span>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-serif mt-4 leading-[1.5]">
            Simple to use,
            <br />
            <span className="italic text-gradient">powerful by design</span>
          </h2>
          <p className="text-muted-foreground mt-6 sm:mt-8 text-xs sm:text-sm xl:text-base leading-relaxed max-w-md xl:max-w-lg">
            Lyto runs directly inside Chrome, giving you full control over every tab, form, and page — without leaving your browser.
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 2xl:gap-8" staggerDelay={0.12}>
          {steps.map((step) => (
            <FadeInItem key={step.number}>
              <div className="h-full p-6 sm:p-8 rounded-2xl border border-border bg-card">
                <div className="relative">
                  <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium border border-primary/20 mb-6 sm:mb-8">
                    {step.number}
                  </span>
                  <h3 className="text-xs sm:text-sm md:text-base font-serif mb-3 sm:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
};

export default HowItWorksSection;
