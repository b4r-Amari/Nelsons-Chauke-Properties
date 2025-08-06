

"use client"

import { useState, useEffect } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import propertiesData from '@/data/properties.json';
import { Button } from "../ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { useSearchParams } from "next/navigation";

interface PropertyListingsProps {
  status: 'for-sale' | 'on-show' | 'to-let';
}

const allProperties: Property[] = (propertiesData as Property[]);

export function PropertyListings({ status }: PropertyListingsProps) {
  const searchParams = useSearchParams();
  const locationSearch = searchParams.get('location');

  const getInitialProperties = () => {
    let properties = allProperties;
    if (status === 'for-sale') {
      properties = properties.filter(p => p.status === 'for-sale');
    } else if (status === 'to-let') {
      properties = properties.filter(p => p.status === 'to-let');
    } else if (status === 'on-show') {
      properties = properties.filter(p => p.onShow && p.status !== 'sold');
    }

    if (locationSearch) {
      return properties.filter(p => 
        p.location.toLowerCase().includes(locationSearch.toLowerCase()) || 
        p.address.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }
    return properties;
  }
  
  const [initialProperties, setInitialProperties] = useState(getInitialProperties());
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);

  useEffect(() => {
    const newInitialProperties = getInitialProperties();
    setInitialProperties(newInitialProperties);
    setFilteredProperties(newInitialProperties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, status]);


  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="lg:hidden mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter Properties
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
        </div>
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 hidden lg:block">
            <PropertyFilter 
              properties={initialProperties} 
              onFilterChange={setFilteredProperties}
            />
          </aside>
          <main className="lg:col-span-3">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProperties.map((prop) => (
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
