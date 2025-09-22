
"use client"

import { useState, useEffect, Suspense, useMemo } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import { getProperties } from '@/lib/firebase/firestore';
import { Button } from "../ui/button";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
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
        initialProps = props.filter(p => p.status !== 'sold');
      }

      setAllProperties(initialProps);
      
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
          return (b.id || 0) > (a.id || 0) ? 1 : -1;
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
        <div className="lg:hidden mb-6 flex justify-between items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex flex-col">
                <SheetHeader className="p-6 pb-2">
                    <SheetTitle className="font-headline text-2xl flex items-center gap-3">
                         <SlidersHorizontal className="h-6 w-6 text-brand-bright"/>
                         Filter Properties
                    </SheetTitle>
                    <SheetDescription>
                        Refine your search to find the perfect property.
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow">
                    <PropertyFilter 
                        properties={allProperties} 
                        onFilterChange={setFilteredProperties}
                        isMobile={true}
                    />
                </ScrollArea>
            </SheetContent>
          </Sheet>
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Order By
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
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 hidden lg:block">
            <PropertyFilter 
              properties={allProperties} 
              onFilterChange={setFilteredProperties}
            />
          </aside>
          <main className="lg:col-span-3">
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
