
"use client";

import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FeaturedOfferCard } from "./featured-offer-card";

type OfferCarouselProps = {
  offers: any[];
};

export const OfferCarousel: React.FC<OfferCarouselProps> = ({ offers }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: UseEmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const getScale = (index: number) => {
    if (index === selectedIndex) return 1.2; // Center slide
    const diff = Math.abs(selectedIndex - index);

    if (emblaApi && emblaApi.internalEngine().options.loop) {
        const wrapDiff = Math.abs(selectedIndex - (index + offers.length));
        const wrapDiff2 = Math.abs(selectedIndex + offers.length - index);
        const minDiff = Math.min(diff, wrapDiff, wrapDiff2);

        if (minDiff === 1) return 0.9;
        if (minDiff === 2) return 0.8;
        return 0.7;
    }

    if (diff === 1) return 0.9;
    if (diff === 2) return 0.8;
    return 0.7;
  };
  
  const getRotation = (index: number) => {
    if (index === selectedIndex) return 0;
    const isLeft = index < selectedIndex;
    
    let diff = selectedIndex - index;

    if (emblaApi && emblaApi.internalEngine().options.loop) {
        const directDiff = selectedIndex - index;
        const wrapAroundDiff = selectedIndex - (index + offers.length);
        const inverseWrapAroundDiff = selectedIndex - (index - offers.length);
        
        if (Math.abs(directDiff) < Math.abs(wrapAroundDiff) && Math.abs(directDiff) < Math.abs(inverseWrapAroundDiff)) {
            diff = directDiff;
        } else if (Math.abs(wrapAroundDiff) < Math.abs(inverseWrapAroundDiff)) {
            diff = wrapAroundDiff;
        } else {
            diff = inverseWrapAroundDiff;
        }
    }
    
    return -diff * 10;
  };

  const getZIndex = (index: number) => {
    if (index === selectedIndex) return offers.length;
    return offers.length - Math.abs(selectedIndex - index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex h-96 items-center">
          {offers.map((offer, index) => (
            <div
              className="relative flex-[0_0_200px] transition-transform duration-300 ease-out"
              key={offer.offer_id}
              style={{
                transform: `rotateY(${getRotation(index)}deg) scale(${getScale(index)})`,
                zIndex: getZIndex(index),
                opacity: index === selectedIndex ? 1 : 0.7,
              }}
            >
              <FeaturedOfferCard offer={offer} scale={1} />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-between w-full px-4">
        <Button
          onClick={scrollPrev}
          variant="ghost"
          size="icon"
          className="bg-background/50 hover:bg-background/80 rounded-full h-10 w-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          onClick={scrollNext}
          variant="ghost"
          size="icon"
          className="bg-background/50 hover:bg-background/80 rounded-full h-10 w-10"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === selectedIndex ? "bg-primary scale-125" : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};
