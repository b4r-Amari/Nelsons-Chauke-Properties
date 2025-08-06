
"use client"

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type PropertyImageGalleryProps = {
  images: string[];
  mainImageHint: string;
};

export function PropertyImageGallery({ images, mainImageHint }: PropertyImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [mainImageLoading, setMainImageLoading] = useState(true);

  const handleThumbnailClick = (image: string) => {
    setMainImageLoading(true);
    setMainImage(image);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
           <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg mb-4 cursor-pointer">
            <Image
              src={mainImage}
              alt="Main property view"
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
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-2 bg-transparent border-none">
            <DialogTitle className="sr-only">Enlarged Property Image</DialogTitle>
            <div className="relative aspect-video w-full">
                <Image
                    src={mainImage}
                    alt="Main property view enlarged"
                    fill
                    className="object-contain"
                />
            </div>
        </DialogContent>
      </Dialog>
     
      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(image)}
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
        ))}
      </div>
    </div>
  );
}
