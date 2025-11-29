
"use client"

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";

type PropertyImageGalleryProps = {
  images: string[];
  mainImageHint: string;
  isOnShow?: boolean;
};

export function PropertyImageGallery({ images, mainImageHint, isOnShow }: PropertyImageGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

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
  
  const handleImageClick = (index: number) => {
    setIsOpen(true);
    setTimeout(() => {
      if(api) {
        api.scrollTo(index, true);
      }
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="container">
         <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[500px] relative overflow-hidden rounded-lg">
          {/* Main Image */}
          <div 
            className="md:col-span-3 md:row-span-2 relative group cursor-pointer"
            onClick={() => handleImageClick(0)}
          >
            <Image
              src={images[0]}
              alt={`Main image of the property, showing the ${mainImageHint}.`}
              data-ai-hint={mainImageHint}
              fill
              className="object-cover"
              priority
            />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
             {isOnShow && (
              <Badge className="absolute top-4 left-4 bg-brand-bright text-white border-none">
                On Show
              </Badge>
            )}
          </div>
          
          {/* Small Image 1 */}
          <div 
            className="hidden md:block relative group cursor-pointer"
            onClick={() => handleImageClick(1)}
          >
             <Image
              src={images[1]}
              alt="Additional property image 1"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </div>

          {/* Small Image 2 with Overlay */}
          <div 
            className="hidden md:block relative group cursor-pointer"
            onClick={() => handleImageClick(2)}
          >
             <Image
              src={images[2]}
              alt="Additional property image 2"
              fill
              className="object-cover"
            />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          </div>
          
           {/* Mobile view trigger */}
          <div
            className="md:hidden absolute inset-0 cursor-pointer"
            onClick={() => handleImageClick(0)}
          />

        </div>
      </div>

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
