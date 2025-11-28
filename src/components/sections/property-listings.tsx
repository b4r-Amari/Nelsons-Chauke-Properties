
"use client"

import { useState, useEffect, Suspense, useMemo } from "react";
import Image from "next/image";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import { getProperties } from '@/lib/data';
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

type PropertyListingsProps = {
  status?: 'on-show' | 'sold';
  pageDetails: {
    title: string;
    description: string;
  };
};

function PropertyListingsComponent({ status, pageDetails }: PropertyListingsProps) {
  const searchParams = useSearchParams();
  const locationSearch = searchParams.get('location');
  const statusSearch = searchParams.get('status');

  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      const props = await getProperties();
      
      let initialProps = props;
      if (status) {
        if (status === 'on-show') {
          initialProps = props.filter(p => p.onShow && p.status !== 'sold');
        } else {
          initialProps = props.filter(p => p.status === status);
        }
      } else {
        // On main properties page, show for-sale and to-let
        initialProps = props.filter(p => p.status === 'for-sale' || p.status === 'to-let');
      }

      setAllProperties(initialProps);
      
      // Apply initial search params from URL
      if (locationSearch || statusSearch) {
        const filtered = initialProps.filter(p => {
          const locationMatch = locationSearch ? p.location.toLowerCase().includes(locationSearch.toLowerCase()) || p.address.toLowerCase().includes(locationSearch.toLowerCase()) : true;
          const statusMatch = statusSearch ? p.status === statusSearch : true;
          return locationMatch && statusMatch;
        });
        setFilteredProperties(filtered);
      } else {
        setFilteredProperties(initialProps);
      }

      setIsLoading(false);
    }

    fetchProperties();
  }, [status, locationSearch, statusSearch]);

  const sortedAndFilteredProperties = useMemo(() => {
    let sortableProperties = [...filteredProperties];
    
    sortableProperties.sort((a, b) => {
      switch (sortOption) {
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return sortableProperties;
  }, [filteredProperties, sortOption]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[250px] w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );

  return (
    <>
       <section className="relative bg-brand-deep text-white py-16">
        <div className="absolute inset-0">
            <Image
            src="/images/backgrounds/hero-banner-2.webp"
            alt="A beautiful modern home"
            fill
            className="object-cover"
            priority
            />
            <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 container text-center">
            <h1 className="text-4xl font-bold font-headline">{pageDetails.title}</h1>
            <p className="text-lg mt-2 text-white/80">{pageDetails.description}</p>
        </div>
      </section>

      <div className="bg-brand-deep relative z-20 py-6">
        <div className="container">
           <PropertyFilter 
            properties={allProperties} 
            onFilterChange={setFilteredProperties}
          />
        </div>
      </div>

      <section className="py-8 bg-background">
        <div className="container">
           <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
            <p className="text-muted-foreground text-sm mb-4 sm:mb-0">
              Showing <span className="font-bold text-foreground">{sortedAndFilteredProperties.length}</span> results
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort By: {sortOption.replace('-', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort Properties</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setSortOption('newest')}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortOption('price-desc')}>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortOption('price-asc')}>Price: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <main>
              {isLoading ? (
                <LoadingSkeleton />
              ) : sortedAndFilteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedAndFilteredProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-card rounded-lg shadow-md p-12">
                  <p className="text-xl text-muted-foreground text-center">No properties match your current filters. Try adjusting your search criteria.</p>
                </div>
              )}
          </main>
        </div>
      </section>
    </>
  );
}

export function PropertyListings(props: PropertyListingsProps) {
  return (
    <Suspense>
      <PropertyListingsComponent {...props} />
    </Suspense>
  )
}
