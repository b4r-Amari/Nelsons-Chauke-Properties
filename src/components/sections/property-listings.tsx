

"use client"

import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import Image from "next/image";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import { getProperties } from '@/lib/data';
import { Button } from "../ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { Card, CardFooter } from "../ui/card";

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
  const typeSearch = searchParams.get('type');
  const bedsSearch = searchParams.get('beds');
  const minPriceSearch = searchParams.get('minPrice');
  const maxPriceSearch = searchParams.get('maxPrice');
  const shouldScroll = searchParams.get('autoscroll');


  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 12;
  const resultsRef = useRef<HTMLElement>(null);

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

      setAllProperties(props); // Set all properties for the filter
      
      // Apply initial search params from URL
      const urlFiltered = initialProps.filter(p => {
        const locationMatch = locationSearch ? p.location.toLowerCase().includes(locationSearch.toLowerCase()) || p.address.toLowerCase().includes(locationSearch.toLowerCase()) : true;
        const statusMatch = statusSearch ? p.status === statusSearch : true;
        const typeMatch = typeSearch ? p.type === typeSearch : true;
        const bedsMatch = bedsSearch ? p.beds >= parseInt(bedsSearch) : true;
        const minPriceMatch = minPriceSearch ? p.price >= parseInt(minPriceSearch) : true;
        const maxPriceMatch = maxPriceSearch ? p.price <= parseInt(maxPriceSearch) : true;
        return locationMatch && statusMatch && typeMatch && bedsMatch && minPriceMatch && maxPriceMatch;
      });
      setFilteredProperties(urlFiltered);
      setIsLoading(false);
    }

    fetchProperties();
  }, [status, locationSearch, statusSearch, typeSearch, bedsSearch, minPriceSearch, maxPriceSearch]);
  
  useEffect(() => {
    if (shouldScroll === 'true' && resultsRef.current) {
      setTimeout(() => {
         resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [shouldScroll]);

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
  
  const totalPages = Math.ceil(sortedAndFilteredProperties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedAndFilteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
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
      <div className="bg-background relative z-20 pt-10">
        <div className="container">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold font-headline text-brand-deep">{pageDetails.title}</h1>
              <p className="text-lg mt-2 text-muted-foreground">{pageDetails.description}</p>
            </div>
        </div>
        <div className="bg-primary py-10">
            <div className="container">
              <PropertyFilter properties={allProperties} onFilterChange={setFilteredProperties}/>
            </div>
        </div>
      </div>

      <section className="py-8 bg-background" ref={resultsRef} id="property-results">
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
              ) : currentProperties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentProperties.map((prop) => (
                      <PropertyCard key={prop.id} property={prop} />
                    ))}
                  </div>
                   {totalPages > 1 && (
                     <Card className="mt-12">
                        <CardFooter className="flex-col sm:flex-row items-center justify-between py-4">
                            <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                                Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sm:inline ml-1">Previous</span>
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                    <span className="sm:inline mr-1">Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                      </Card>
                    )}
                </>
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
