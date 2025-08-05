
"use client";

import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import propertiesData from "@/data/properties.json";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const allProperties: Property[] = propertiesData;

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { wishlist, isLoading: wishlistLoading } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const wishlistedProperties = allProperties.filter(property => wishlist.includes(property.id));
  
  if (authLoading || wishlistLoading || !user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold font-headline mb-8">My Wishlist</h1>
      {wishlistedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <p className="text-xl text-muted-foreground">Your wishlist is empty.</p>
          <p className="mt-2 text-muted-foreground">Start browsing properties to add them to your list.</p>
          <Button asChild className="mt-6 bg-brand-bright hover:bg-brand-deep">
            <Link href="/properties">
                Browse Properties
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
