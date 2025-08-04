"use client"

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, Ruler, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useState } from "react";

export type Property = {
  id: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  isFavorite: boolean;
};

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(property.isFavorite);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
      <CardHeader className="p-0 relative">
        <Image
          src={property.imageUrl}
          alt={`View of ${property.address}`}
          data-ai-hint={property.imageHint}
          width={300}
          height={200}
          className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute bottom-2 left-2 bg-[#d4af37] text-black font-bold text-sm">
          ${property.price.toLocaleString()}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white"
          onClick={toggleFavorite}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={cn("h-5 w-5 text-gray-500", isFavorite ? "fill-red-500 text-red-500" : "hover:text-red-500")} />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-bold font-headline text-lg truncate">{property.address}</h3>
        <p className="text-sm text-muted-foreground">{property.address.split(',').slice(1).join(', ').trim()}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-around bg-muted/50">
        <div className="flex items-center gap-2 text-sm">
          <BedDouble className="h-4 w-4 text-primary" />
          <span>{property.beds} Beds</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Bath className="h-4 w-4 text-primary" />
          <span>{property.baths} Baths</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Ruler className="h-4 w-4 text-primary" />
          <span>{property.sqft} sqft</span>
        </div>
      </CardFooter>
    </Card>
  );
}
