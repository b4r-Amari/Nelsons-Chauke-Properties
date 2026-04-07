"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";

type PropertyImageGalleryProps = {
  images: string[];
  mainImageHint: string;
  isOnShow?: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PropertyImageGallery({ images, mainImageHint, isOnShow, isOpen, onOpenChange }: PropertyImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  
  const handleImageClick = (index: number) => {
    onOpenChange(true);
    setTimeout(() => {
      if(api) {
        api.scrollTo(index, true);
      }
    }, 100);
  };

  const displayImages = images.length > 0 ? images : ["https://picsum.photos/seed/placeholder/1200/800"];

  return (
    <div className="md:container">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 md:h-[500px] h-[350px] relative md:rounded-lg overflow-hidden bg-muted">
        {/* Main Image */}
        <div 
          className="md:col-span-3 md:row-span-2 relative group cursor-pointer overflow-hidden"
          onClick={() => handleImageClick(0)}
        >
          <Image
            src={displayImages[0]}
            alt={`Main image of the property: ${mainImageHint}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
          {isOnShow && (
            <Badge className="absolute top-4 left-4 bg-brand-bright text-white border-none shadow-lg">
              On Show
            </Badge>
          )}
        </div>
        
        {/* Small Image 1 */}
        {displayImages.length > 1 && (
          <div 
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => handleImageClick(1)}
          >
            <Image
              src={displayImages[1]}
              alt="Property interior view 1"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
          </div>
        )}

        {/* Small Image 2 */}
        {displayImages.length > 2 ? (
          <div 
            className="hidden md:block relative group cursor-pointer overflow-hidden"
            onClick={() => handleImageClick(2)}
          >
            <Image
              src={displayImages[2]}
              alt="Property interior view 2"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
            {displayImages.length > 3 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-xl">
                +{displayImages.length - 3}
              </div>
            )}
          </div>
        ) : (
          <div className="hidden md:block bg-muted flex items-center justify-center text-muted-foreground text-sm">
            No more photos
          </div>
        )}
        
        <div
          className="md:hidden absolute inset-0 cursor-pointer"
          onClick={() => handleImageClick(0)}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black border-none overflow-hidden rounded-none [&>button]:text-white [&>button]:opacity-100 [&>button]:hover:bg-white/20">
          <DialogHeader className="sr-only">
            <DialogTitle>Property Image Viewer</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 relative">
              <Carousel setApi={setApi} className="w-full h-full">
                <CarouselContent className="h-full" viewportClassName="h-full">
                  {displayImages.map((img, i) => (
                    <CarouselItem key={i} className="basis-full h-full flex items-center justify-center p-0">
                      <div className="relative w-full h-full">
                        <Image
                          src={img}
                          alt={`Gallery image ${i + 1}`}
                          fill
                          className="object-contain"
                          priority={i === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-8 bg-white/10 hover:bg-white/20 border-none text-white h-14 w-14" />
                  <CarouselNext className="right-8 bg-white/10 hover:bg-white/20 border-none text-white h-14 w-14" />
                </div>
              </Carousel>
            </div>
            
            <div className="bg-black/80 backdrop-blur-md p-6 text-center shrink-0 border-t border-white/10">
              <p className="text-white/90 text-sm font-bold tracking-widest uppercase">
                {current} / {count}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
