
"use client"

import { useState, useEffect, useMemo, useRef } from "react";
import { PropertyCard, type Property } from "@/components/shared/property-card";
import { PropertyFilter } from "@/components/shared/property-filter";
import { Button } from "../ui/button";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { Card, CardFooter } from "../ui/card";
import { type Filters, type SearchSuggestion } from "../shared/property-filter";
import { getProperties } from "@/lib/data";

type PropertyListingsProps = {
  pageDetails: {
    title: string;
    description: string;
  };
  initialProperties?: Property[];
};

const defaultFilters: Omit<Filters, 'selectedLocations'> = {
  location: "",
  status: "for-sale",
  propertyType: "any",
  minPrice: "any",
  maxPrice: "any",
  minBeds: "any",
  minBaths: "any",
  minFloorSize: "any",
  maxFloorSize: "any",
  minErfSize: "any",
  maxErfSize:"any",
  features: {
    petFriendly: false,
    garden: false,
    pool: false,
    flatlet: false,
  },
  other: {
    retirement: false,
    onShow: false,
    securityEstate: false,
  },
};

export function PropertyListings({ pageDetails, initialProperties = [] }: PropertyListingsProps) {
  const searchParams = useSearchParams();

  const [allProperties, setAllProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  const [sortOption, setSortOption] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(initialProperties.length === 0);
  const propertiesPerPage = 12;
  const resultsRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (initialProperties.length === 0) {
      setIsLoading(true);
      const fetchPageProperties = async () => {
        let props;
        if (pageDetails.title === "Properties On Show") {
          props = await getProperties({ status: 'on-show' });
        } else {
          props = await getProperties();
        }
        setAllProperties(props);
        setFilteredProperties(props);
        setIsLoading(false);
      };
      fetchPageProperties();
    }
  }, [initialProperties, pageDetails.title]);

  const initialFilters = useMemo(() => {
    const locationsParam = searchParams.get('locations');
    const location = searchParams.get('location') || "";
    const status = searchParams.get('status') || 'for-sale';
    const propertyType = searchParams.get('type') || 'any';
    const minBeds = searchParams.get('beds') || 'any';
    const minPrice = searchParams.get('minPrice') || 'any';
    const maxPrice = searchParams.get('maxPrice') || 'any';
    
    // Reconstruct selectedLocations from URL slugs
    let selectedLocations: SearchSuggestion[] = [];
    if (locationsParam && allProperties.length > 0) {
        const locationSlugs = locationsParam.split(',');
        const locationMap = new Map<string, SearchSuggestion>();

        allProperties.forEach((prop, index) => {
            const parts = prop.location.split(',').map(p => p.trim());
            parts.forEach((part, i) => {
                const slug = part.toLowerCase().replace(/\s+/g, '-');
                if (!locationMap.has(slug)) {
                    locationMap.set(slug, {
                        id: `loc-${slug}-${index}-${i}`,
                        type: i === 0 ? 'suburb' : 'city',
                        value: part,
                        slug: slug,
                        displayLabel: part,
                    });
                }
            });
        });
        
        selectedLocations = locationSlugs.map(slug => locationMap.get(slug)).filter(Boolean) as SearchSuggestion[];
    }
    
    return { location, status, propertyType, minBeds, minPrice, maxPrice, selectedLocations } as Partial<Filters>;
  }, [searchParams, allProperties]);

    // Auto-scroll logic moved to its own useEffect
    useEffect(() => {
        if (searchParams.get('autoscroll') === 'true' && resultsRef.current) {
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [searchParams]);

  useEffect(() => {
    handleFilterChange(initialFilters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters, allProperties]);
  
  const handleFilterChange = (newFiltersInput: Partial<Filters>) => {
    const newFilters = { ...defaultFilters, ...newFiltersInput };
    const locationsToFilter = newFilters.selectedLocations || [];
    
    const filtered = allProperties.filter(p => {
      if (newFilters.status && newFilters.status !== 'any' && p.status !== newFilters.status) return false;
      if (newFilters.propertyType !== 'any' && p.type !== newFilters.propertyType) return false;
      if (newFilters.minBeds !== 'any' && p.beds < parseInt(newFilters.minBeds)) return false;
      if (newFilters.minBaths !== 'any' && p.baths < parseInt(newFilters.minBaths)) return false;
      if (newFilters.minPrice !== 'any' && p.price < parseInt(newFilters.minPrice)) return false;
      if (newFilters.maxPrice !== 'any' && p.price > parseInt(newFilters.maxPrice)) return false;
      if (newFilters.features.petFriendly && !p.features.some(f => f.toLowerCase().includes('pet friendly'))) return false;
      if (newFilters.features.garden && !p.features.some(f => f.toLowerCase().includes('garden'))) return false;
      if (newFilters.features.pool && !p.features.some(f => f.toLowerCase().includes('pool'))) return false;
      if (newFilters.features.flatlet && !p.features.some(f => f.toLowerCase().includes('flatlet') || f.toLowerCase().includes('guest cottage'))) return false;
      if (newFilters.other.onShow && !p.onShow) return false;
      if (newFilters.other.retirement && !p.features.some(f => f.toLowerCase().includes('retirement'))) return false;
      if (newFilters.other.securityEstate && !p.features.some(f => f.toLowerCase().includes('secure estate') || f.toLowerCase().includes('security estate'))) return false;
      if (newFilters.minFloorSize !== 'any' && p.sqft < parseInt(newFilters.minFloorSize)) return false;
      if (newFilters.maxFloorSize !== 'any' && p.sqft > parseInt(newFilters.maxFloorSize)) return false;
      if (newFilters.minErfSize !== 'any' && p.erfSize < parseInt(newFilters.minErfSize)) return false;
      if (newFilters.maxErfSize !== 'any' && p.erfSize > parseInt(newFilters.maxErfSize)) return false;
      
      // Handle location filtering from both text input and badges
      if (locationsToFilter.length > 0) {
        const propertyMatchesLocation = locationsToFilter.some(sl => 
          p.location.toLowerCase().includes(sl.value.toLowerCase()) || 
          p.address.toLowerCase().includes(sl.value.toLowerCase())
        );
        if (!propertyMatchesLocation) return false;
      } else if (newFilters.location) {
          if (!p.location.toLowerCase().includes(newFilters.location.toLowerCase()) && !p.address.toLowerCase().includes(newFilters.location.toLowerCase())) return false;
      }

      return true;
    });
    setFilteredProperties(filtered);
    setCurrentPage(1); // Reset to first page on new filter
  };

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
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
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

  return (
    <>
      <section className="relative h-[300px] flex items-center justify-center bg-white">
        <div className="relative z-10 container text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 tracking-tight text-brand-deep">{pageDetails.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">{pageDetails.description}</p>
        </div>
      </section>

      <section className="bg-brand-deep -mt-20 relative z-20 py-6">
        <div className="container">
            <PropertyFilter 
              properties={allProperties} 
              onFilterChange={handleFilterChange}
              initial={initialFilters}
              showSearchButton={true}
            />
          </div>
      </section>

      <main className="py-8 bg-background" ref={resultsRef} id="property-results">
        <div className="container">
           <div className="flex justify-between items-center mb-6 border-b pb-4">
            <p className="text-muted-foreground text-sm">
              Showing <span className="font-bold text-foreground">{sortedAndFilteredProperties.length}</span> results
            </p>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Sort By: {sortOption.replace('-', ' ')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Sort Properties</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setSortOption('newest')}>Newest First</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortOption('price-desc')}>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSortOption('price-asc')}>Price: Low to High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          
              {isLoading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-[480px] w-full rounded-lg" />
                    ))}
                  </div>
              ) : currentProperties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          
        </div>
      </main>
    </>
  );
}

    
