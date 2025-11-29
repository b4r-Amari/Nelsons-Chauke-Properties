
"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Badge } from "../ui/badge";

type PropertyImageGalleryProps = {
  images: string[];
  mainImageHint: string;
  isOnShow?: boolean;
};

export function PropertyImageGallery({ images, mainImageHint, isOnShow }: PropertyImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative h-[300px] md:h-[500px] w-full cursor-pointer group">
          <Image
            src={images[0]}
            alt={`Main image of the property, showing the ${mainImageHint}.`}
            data-ai-hint={mainImageHint}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {isOnShow && (
            <Badge className="absolute top-4 left-4 bg-brand-bright text-white border-none">
              On Show
            </Badge>
          )}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {current}/{images.length}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full h-[90vh] p-2 bg-transparent border-none">
        <DialogTitle className="sr-only">Property Image Gallery</DialogTitle>
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent className="h-full">
            {images.map((img, i) => (
              <CarouselItem key={i} className="h-full">
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Full-size view of property image ${i + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}
