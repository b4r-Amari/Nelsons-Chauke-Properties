
"use client"

import { useState, useEffect, Suspense, useMemo } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import { getProperties } from '@/lib/data';
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

function PropertyListingsComponent({ status }: { status?: 'on-show' | 'sold' }) {
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
    <section className="py-16 bg-background">
      <div className="container">
        <PropertyFilter 
          properties={allProperties} 
          onFilterChange={setFilteredProperties}
        />
        
        <div className="flex justify-end mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Order By: {sortOption.replace('-', ' ')}
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
  );
}

export function PropertyListings({ status }: { status?: 'on-show' | 'sold' }) {
  return (
    <Suspense>
      <PropertyListingsComponent status={status} />
    </Suspense>
  )
}
