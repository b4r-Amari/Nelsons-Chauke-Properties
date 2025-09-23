
"use client";

import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProperties } from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { wishlist, isLoading: wishlistLoading } = useWishlist();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchAllProperties() {
      if (user) {
        setDataLoading(true);
        try {
            const props = await getProperties();
            setAllProperties(props);
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        } finally {
            setDataLoading(false);
        }
      }
    }
    fetchAllProperties();
  }, [user]);

  const wishlistedProperties = allProperties.filter(property => wishlist.includes(property.id.toString()));
  
  const isLoading = authLoading || wishlistLoading || dataLoading;

  if (!user && !authLoading) {
    return null; 
  }
  
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );


  return (
    <div className="bg-background min-h-[calc(100vh-80px)]">
        <section className="bg-brand-deep text-white py-12">
            <div className="container">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">My Wishlist</h1>
                <p className="text-lg mt-1 text-white/80">Your saved properties for future viewing.</p>
            </div>
        </section>
        <main className="container py-12 md:py-16">
        {isLoading ? (
            <LoadingSkeleton />
        ) : wishlistedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistedProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
            ))}
            </div>
        ) : (
            <div className="text-center py-16 border-dashed border-2 rounded-lg bg-card">
            <h2 className="text-2xl font-headline font-semibold text-brand-deep">Your Wishlist is Empty</h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">You haven't added any properties yet. Start browsing to find homes you love and save them here for later.</p>
            <Button asChild className="mt-6 bg-brand-bright hover:bg-brand-deep transition-colors">
                <Link href="/properties">
                    Browse Properties
                </Link>
            </Button>
            </div>
        )}
        </main>
    </div>
  );
}
