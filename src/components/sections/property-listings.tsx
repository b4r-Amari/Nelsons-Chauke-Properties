

"use client"

import { useState, useEffect, Suspense, useMemo } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import propertiesData from '@/data/properties.json';
import { Button } from "../ui/button";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";


const allProperties: Property[] = (propertiesData as Property[]).filter(p => p.status !== 'sold');

function PropertyListingsComponent() {
  const searchParams = useSearchParams();
  const locationSearch = searchParams.get('location');
  const statusSearch = searchParams.get('status');

  const getInitialProperties = () => {
    let properties = allProperties;

    if (locationSearch || statusSearch) {
      return properties.filter(p => {
        const locationMatch = locationSearch ? p.location.toLowerCase().includes(locationSearch.toLowerCase()) || p.address.toLowerCase().includes(locationSearch.toLowerCase()) : true;
        const statusMatch = statusSearch ? p.status === statusSearch : true;
        return locationMatch && statusMatch;
      });
    }
    return properties;
  }
  
  const [initialProperties] = useState(allProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(getInitialProperties());
  const [sortOption, setSortOption] = useState('newest');

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
          return b.id - a.id; // Assuming higher ID is newer
      }
    });

    return sortableProperties;
  }, [filteredProperties, sortOption]);


  useEffect(() => {
    setFilteredProperties(getInitialProperties());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


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
                        properties={initialProperties} 
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
              properties={initialProperties} 
              onFilterChange={setFilteredProperties}
            />
          </aside>
          <main className="lg:col-span-3">
            {sortedAndFilteredProperties.length > 0 ? (
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

export function PropertyListings() {
  return (
    <Suspense>
      <PropertyListingsComponent />
    </Suspense>
  )
}
