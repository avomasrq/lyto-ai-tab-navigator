import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  image: string;
}

interface Gallery6Props {
  heading?: ReactNode;
  subheading?: string;
  items?: GalleryItem[];
}

const Gallery6 = ({
  heading = "Features",
  subheading,
  items = [],
}: Gallery6Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on("select", update);
    return () => { carouselApi.off("select", update); };
  }, [carouselApi]);

  return (
    <section className="py-12 sm:py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex flex-col justify-between md:mb-12 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-3xl sm:text-4xl md:text-5xl font-serif leading-tight">
              {heading}
            </h2>
            {subheading && (
              <p className="text-base text-muted-foreground max-w-sm">{subheading}</p>
            )}
          </div>
          <div className="mt-6 flex shrink-0 items-center gap-2 md:mt-0">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": { dragFree: true },
            },
          }}
          className="relative left-[-1rem]"
        >
          <CarouselContent className="-mr-4 ml-8 2xl:ml-[max(8rem,calc(50vw-700px+1rem))] 2xl:mr-[max(0rem,calc(50vw-700px-1rem))]">
            {items.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:max-w-[420px]">
                <div className="flex flex-col">
                  <div className="flex aspect-[3/2] overflow-clip rounded-2xl border border-border/40">
                    <div className="flex-1">
                      <div className="relative h-full w-full origin-bottom transition duration-300 hover:scale-105">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 pb-1 text-lg font-semibold md:text-xl">
                    {item.title}
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export { Gallery6 };
