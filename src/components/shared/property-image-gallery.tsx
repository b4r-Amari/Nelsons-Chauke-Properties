
"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

type PropertyImageGalleryProps = {
  images: string[];
  mainImageHint: string;
};

export function PropertyImageGallery({ images, mainImageHint }: PropertyImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
      setMainImage(images[api.selectedScrollSnap()]);
    })
  }, [api, images])


  const handleThumbnailClick = (index: number) => {
    if (!api) {
      return;
    }
    setMainImageLoading(true);
    setMainImage(images[index]);
    api.scrollTo(index);
  };

  return (
    <div>
       <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-4 hidden md:block">
        <Image
          src={mainImage}
          alt={`Main image of the property, showing the ${mainImage === images[0] ? mainImageHint : "property interior"}.`}
          data-ai-hint={mainImage === images[0] ? mainImageHint : "property interior"}
          fill
          className={cn(
            "object-cover transition-opacity duration-500",
            mainImageLoading ? "opacity-50" : "opacity-100"
          )}
          onLoad={() => setMainImageLoading(false)}
          priority
        />
      </div>
     
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
            <Dialog key={index}>
                <DialogTrigger asChild>
                    <div
                        onClick={() => handleThumbnailClick(index)}
                        className={cn(
                        "relative aspect-video w-full rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                        mainImage === image ? "border-brand-bright scale-105" : "border-transparent hover:border-brand-bright/50"
                        )}
                    >
                        <Image
                        src={image}
                        alt={`Property thumbnail ${index + 1}`}
                        data-ai-hint="property interior"
                        fill
                        className="object-cover"
                        />
                        {mainImage !== image && <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />}
                    </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-2 bg-transparent border-none">
                    <DialogTitle className="sr-only">Property Image Gallery</DialogTitle>
                     <Carousel setApi={setApi} className="w-full" opts={{startIndex: index}}>
                        <CarouselContent>
                        {images.map((img, i) => (
                            <CarouselItem key={i}>
                                <div className="relative aspect-video w-full">
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
        ))}
      </div>
    </div>
  );
}
