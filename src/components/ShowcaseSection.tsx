import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const ShowcaseSection = () => {
  return (
    <section id="showcase" className="scroll-mt-24 overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="text-center">
            {/* <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-3">
              See it in action
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
              your browser,{' '}
              <span className="italic text-gradient">finally intelligent</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Watch Lyto handle research, form-filling, and tab chaos — all from one sidebar.
            </p> */}
          </div>
        }
      >
        <img
          src="/lytoscreen.png"
          alt="Lyto AI Dashboard"
          className="w-full h-full object-fill"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
};

export default ShowcaseSection;
