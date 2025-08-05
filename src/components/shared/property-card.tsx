"use client"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Bath, Ruler, MapPin } from 'lucide-react';

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
  status: 'for-sale' | 'to-let' | 'sold';
  type: string;
  location: string;
  description: string;
  features: string[];
  yearBuilt: number;
};

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  
  const formatPrice = (price: number) => {
    const isRental = property.status === 'to-let';
    const formattedPrice = new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return isRental ? `${formattedPrice} /month` : formattedPrice;
  }

  return (
    <Link href={`/properties/${property.id}`} className="block group">
        <Card className="w-full max-w-[300px] min-h-[480px] h-full rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col mx-auto cursor-pointer overflow-hidden">
        <div className="relative w-full h-[250px] overflow-hidden">
            <Image
            src={property.imageUrl}
            alt={`View of ${property.address}`}
            data-ai-hint={property.imageHint}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-1.5 rounded-md font-roboto font-bold text-lg">
            {formatPrice(property.price)}
            </div>
            {property.status === 'sold' && (
            <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md font-semibold text-sm">
                SOLD
            </div>
            )}
        </div>
        <CardContent className="p-6 bg-white flex flex-col flex-grow">
            <h3 className="font-headline text-brand-deep font-semibold text-xl mb-2 truncate">{property.address}</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin className="h-4 w-4" />
              <p className="text-sm">{property.location}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 border-y border-gray-200 py-4 my-auto">
                <div className="text-center flex flex-col items-center gap-1">
                    <BedDouble className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.beds} Beds</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                    <Bath className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.baths} Baths</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                    <Ruler className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.sqft} m²</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-brand-bright"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                    <span className="text-sm text-gray-600">{property.yearBuilt}</span>
                </div>
            </div>

            <p className="text-[15px] text-gray-700 leading-relaxed my-4 h-[60px] overflow-hidden text-ellipsis">
              {property.description}
            </p>

        </CardContent>
        </Card>
    </Link>
  );
}
