
"use client"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { BedDouble, Bath, Home, LandPlot, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export type Property = {
  id: number;
  slug: string;
  imageUrl: string;
  imageHint: string;
  price: number;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  erfSize: number;
  isFavorite: boolean;
  status: 'for-sale' | 'to-let' | 'sold';
  type: string;
  location: string;
  description: string;
  features: string[];
  yearBuilt: number;
  onShow?: boolean;
  agentId: number;
};

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = wishlist.includes(property.id.toString());

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to property page
    e.stopPropagation();

    if (!user) {
      // In a real app, you would probably trigger a login modal here
      alert("Please log in to use the wishlist feature.");
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(property.id.toString());
    } else {
      addToWishlist(property.id.toString());
    }
  };
  
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
        <Card className="w-[350px] min-h-[480px] h-full rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col mx-auto cursor-pointer overflow-hidden">
        <div className="relative w-full h-[250px] overflow-hidden">
            <Image
            src={property.imageUrl}
            alt={`View of ${property.address}`}
            data-ai-hint={property.imageHint}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
             <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="bg-black/70 text-white px-4 py-1.5 rounded-md font-roboto font-bold text-lg w-fit">
                {formatPrice(property.price)}
              </div>
              {property.onShow && (
                 <Badge className="bg-brand-bright text-white border-none w-fit">On Show</Badge>
              )}
            </div>
            {property.status !== 'sold' && (
              <Button
                size="icon"
                className={cn(
                  "absolute top-4 right-4 rounded-full bg-white/80 hover:bg-white text-brand-deep transition-all duration-300 scale-100 hover:scale-110",
                  { "text-red-500": isWishlisted }
                )}
                onClick={handleWishlistClick}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-6 w-6", { "fill-current": isWishlisted })} />
              </Button>
            )}
            {property.status === 'sold' && (
              <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-md font-semibold text-sm">
                  SOLD
              </div>
            )}
        </div>
        <CardContent className="p-6 bg-white flex flex-col flex-grow">
            <h3 className="font-headline text-brand-deep font-semibold text-xl mb-2 truncate">{property.address}</h3>
            <p className="text-sm text-muted-foreground mb-4">{property.location}</p>
            
            <div className="grid grid-cols-4 gap-2 border-y border-gray-200 py-4 my-auto">
                <div className="text-center flex flex-col items-center gap-1">
                    <BedDouble className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.beds}</span>
                    <span className="text-xs text-gray-500">Beds</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                    <Bath className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.baths}</span>
                    <span className="text-xs text-gray-500">Baths</span>
                </div>
                <div className="text-center flex flex-col items-center gap-1">
                    <Home className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.sqft} m²</span>
                     <span className="text-xs text-gray-500">House</span>
                </div>
                 <div className="text-center flex flex-col items-center gap-1">
                    <LandPlot className="h-5 w-5 text-brand-bright"/>
                    <span className="text-sm text-gray-600">{property.erfSize} m²</span>
                    <span className="text-xs text-gray-500">Erf</span>
                </div>
            </div>

            <p className="text-[15px] text-gray-700 leading-relaxed mt-4 h-[60px] overflow-hidden text-ellipsis">
              {property.description}
            </p>

        </CardContent>
        </Card>
    </Link>
  );
}
