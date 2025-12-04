
"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Map as MapIcon, X, Plus, Building, MapPin, Loader2 } from "lucide-react";
import type { Property, Filters, SearchSuggestion } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MapDialog } from "./map-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "../ui/badge";

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const initialFilters: Omit<Filters, 'selectedLocations'> = {
  location: "",
  status: "for-sale",
  propertyType: "any",
  minPrice: "any",
  maxPrice: "any",
  minBeds: "any",
  minBaths: "any",
  minFloorSize: "any",
  maxFloorSize: "any",
  minErfSize:"any",
  maxErfSize:"any",
  features: { petFriendly: false, garden: false, pool: false, flatlet: false },
  other: { retirement: false, onShow: false, securityEstate: false },
};

const floorSizeOptions = [
    { value: 'any', label: 'Any' }, { value: '50', label: '50 m²' },
    { value: '100', label: '100 m²' }, { value: '150', label: '150 m²' },
    { value: '200', label: '200 m²' }, { value: '300', label: '300 m²' },
    { value: '500', label: '500 m²' }, { value: '750', label: '750 m²' },
    { value: '1000', label: '1000 m²' },
];

const erfSizeOptions = [
    { value: 'any', label: 'Any' }, { value: '200', label: '200 m²' },
    { value: '400', label: '400 m²' }, { value: '600', label: '600 m²' },
    { value: '800', label: '800 m²' }, { value: '1000', label: '1000 m²' },
    { value: '2000', label: '2000 m²' }, { value: '5000', label: '5000 m²' },
    { value: '10000', label: '1 Ha+' },
];


export function PropertyFilter({ properties, onFilterChange, initial, showSearchButton = false }: { properties: Property[], onFilterChange?: (filters: Filters) => void, initial?: Partial<Filters>, showSearchButton?: boolean }) {
  const router = useRouter();
  const [filters, setFilters] = useState({ ...initialFilters, ...initial });
  const [activeTab, setActiveTab] = useState(filters.status === 'to-let' ? 'rent' : 'buy');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSuggestionsLoading, setSuggestionsLoading] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<SearchSuggestion[]>(initial?.selectedLocations || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchSuggestionsData = useMemo(() => {
    const locations = new Map<string, SearchSuggestion>();

    properties.forEach((prop, index) => {
      const locationParts = prop.location.split(',').map(p => p.trim());
      
      locationParts.forEach((part, i) => {
        const slug = part.toLowerCase().replace(/\s+/g, '-');
        if (!locations.has(slug)) {
          locations.set(slug, {
            id: `loc-${slug}-${index}-${i}`,
            type: i === 0 ? 'suburb' : 'city', 
            value: part,
            slug: slug,
            displayLabel: part,
          });
        }
      });
    });

    return Array.from(locations.values());
  }, [properties]);


  const handleSearchClick = () => {
    const finalFilters = { ...filters, selectedLocations };
    if (onFilterChange) {
      onFilterChange(finalFilters);
      return;
    }
    
    const queryParams = new URLSearchParams();
    if (selectedLocations.length > 0) {
      queryParams.set('locations', selectedLocations.map(l => l.slug).join(','));
    } else if (filters.location) {
      queryParams.set('location', filters.location);
    }
    
    queryParams.set('status', filters.status);
    queryParams.set('autoscroll', 'true');
    router.push(`/properties?${queryParams.toString()}`);
  }

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    console.log("Location selected from map:", location);
    handleInputChange('location', `Map: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    setIsMapOpen(false);
  };
  
  const handleInputChange = (field: keyof Omit<Filters, 'selectedLocations'>, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSelectedLocations(prev => [...prev, suggestion]);
    handleInputChange('location', '');
    setSuggestions([]);
  };

  const removeLocation = (locationToRemove: SearchSuggestion) => {
    setSelectedLocations(prev => prev.filter(loc => loc.id !== locationToRemove.id));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && filters.location === '' && selectedLocations.length > 0) {
      setSelectedLocations(prev => prev.slice(0, prev.length - 1));
    }
  };


  const handleSelectChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

   const handleCheckboxChange = (category: 'features' | 'other', field: string, checked: boolean) => {
    setFilters(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            [field]: checked,
        }
    }));
  };
  
  const clearFilters = () => {
    const status = activeTab === 'buy' ? 'for-sale' : 'to-let';
    const newFilters = {...initialFilters, status: status as "for-sale" | "to-let" };
    setFilters(newFilters);
    setSelectedLocations([]);
    if (onFilterChange) {
      onFilterChange({ ...newFilters, selectedLocations: [] });
    }
  }

  const filteredCount = useMemo(() => {
    return properties.filter(p => {
        if (filters.status && filters.status !== 'any' && p.status !== filters.status) return false;
        
        if (selectedLocations.length > 0) {
          const propertyMatchesLocation = selectedLocations.some(sl => 
            p.location.toLowerCase().includes(sl.value.toLowerCase()) || 
            p.address.toLowerCase().includes(sl.value.toLowerCase())
          );
          if (!propertyMatchesLocation) return false;
        } else if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase()) && !p.address.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
        
        if (filters.propertyType !== 'any' && p.type !== filters.propertyType) return false;
        if (filters.minBeds !== 'any' && p.beds < parseInt(filters.minBeds)) return false;
        if (filters.minBaths !== 'any' && p.baths < parseInt(filters.minBaths)) return false;
        if (filters.minPrice !== 'any' && p.price < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice !== 'any' && p.price > parseInt(filters.maxPrice)) return false;
        if (filters.minFloorSize !== 'any' && p.sqft < parseInt(filters.minFloorSize)) return false;
        if (filters.maxFloorSize !== 'any' && p.sqft > parseInt(filters.maxFloorSize)) return false;
        if (filters.minErfSize !== 'any' && p.erfSize < parseInt(filters.minErfSize)) return false;
        if (filters.maxErfSize !== 'any' && p.erfSize > parseInt(filters.maxErfSize)) return false;
        if (filters.features.petFriendly && !p.features.some(f => f.toLowerCase().includes('pet friendly'))) return false;
        if (filters.features.garden && !p.features.some(f => f.toLowerCase().includes('garden'))) return false;
        if (filters.features.pool && !p.features.some(f => f.toLowerCase().includes('pool'))) return false;
        if (filters.features.flatlet && !p.features.some(f => f.toLowerCase().includes('flatlet'))) return false;
        if (filters.other.onShow && !p.onShow) return false;
        if (filters.other.retirement && !p.features.some(f => f.toLowerCase().includes('retirement'))) return false;
        if (filters.other.securityEstate && !p.features.some(f => f.toLowerCase().includes('secure estate'))) return false;
        return true;
    }).length
  }, [filters, properties, selectedLocations]);

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      setSuggestionsLoading(true);
      
      const selectedIds = new Set(selectedLocations.map(l => l.id));
      const filteredSuggestions = searchSuggestionsData.filter(s => 
        !selectedIds.has(s.id) &&
        s.value.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);

      setSuggestionsLoading(false);
    }, 300),
    [selectedLocations, searchSuggestionsData]
  );

  useEffect(() => {
    debouncedFetchSuggestions(filters.location);
  }, [filters.location, debouncedFetchSuggestions]);

  const parentBg = 'dark';
  const isDarkBg = parentBg === 'dark';
  const commonTabClass = "data-[state=active]:bg-transparent data-[state=active]:shadow-none text-lg font-bold pb-3 px-5 rounded-none border-b-4 data-[state=active]:border-brand-bright border-transparent";
  const textColorClass = isDarkBg ? "text-white/80 hover:text-white data-[state=active]:text-white" : "text-foreground/70 hover:text-foreground data-[state=active]:text-foreground";
  const selectTriggerClass = isDarkBg ? "bg-primary-foreground/10 text-white border-white/50" : "bg-background text-foreground border-input";
  const moreFiltersClass = isDarkBg ? "bg-transparent text-white hover:bg-primary-foreground/10 border-white/50 hover:text-white" : "bg-background text-foreground";
  const checkboxBorderClass = isDarkBg ? "border-white" : "border-primary";
  const filterTextColor = isDarkBg ? "text-white" : "text-foreground";

  return (
    <>
      <div className="font-sans w-full max-w-[900px] mx-auto">
        <Tabs defaultValue="buy" className="w-full" value={activeTab} onValueChange={(v) => {
          if (v === 'agents') return;
          setActiveTab(v);
          const newStatus = v === 'rent' ? 'to-let' : 'for-sale';
          setFilters(prev => ({ ...prev, status: newStatus as "for-sale" | "to-let" }));
        }}>
          <TabsList className="flex justify-center bg-transparent p-0 pb-5 h-auto gap-0">
            <TabsTrigger value="buy" className={cn(commonTabClass, textColorClass, "data-[state=inactive]:hover:border-b-0")}>Buy</TabsTrigger>
            <TabsTrigger value="rent" className={cn(commonTabClass, textColorClass, "data-[state=inactive]:hover:border-b-0")}>Rent</TabsTrigger>
            <TabsTrigger value="agents" asChild className={cn(commonTabClass, textColorClass, "data-[state=inactive]:hover:border-b-0")}>
               <Link href="/about-us#team">Agents</Link>
            </TabsTrigger>
          </TabsList>
          <div className="space-y-[-1px]">
              <Card className="shadow-lg rounded-t-lg rounded-b-none p-2 bg-white">
                  <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                           <Popover open={suggestions.length > 0 && filters.location.length > 1} onOpenChange={() => setSuggestions([])}>
                            <PopoverTrigger asChild>
                              <div className="relative w-full flex-grow flex items-center flex-wrap gap-x-2 p-2 rounded-md" onClick={() => inputRef.current?.focus()}>
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                                  <div className="flex-1 flex items-center gap-2 pl-7 flex-nowrap">
                                      {selectedLocations.map(location => (
                                        <Badge key={location.id} variant="secondary" className="pl-2 pr-1 py-1 text-sm font-normal whitespace-nowrap shrink-0">
                                          {location.displayLabel}
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeLocation(location);
                                            }}
                                            className="ml-1 rounded-full hover:bg-black/10 dark:hover:bg-white/20"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </Badge>
                                      ))}
                                      <Input
                                          ref={inputRef}
                                          id="location"
                                          placeholder={selectedLocations.length === 0 ? "Search for a suburb, city or province" : ""}
                                          value={filters.location}
                                          onChange={(e) => handleInputChange('location', e.target.value)}
                                          onKeyDown={handleKeyDown}
                                          className="pl-0 h-9 flex-1 border-0 shadow-none bg-transparent min-w-[200px] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [outline:none!important] focus:[outline:none!important] focus-visible:[outline:none!important]"
                                          autoComplete="off"
                                      />
                                  </div>
                                  {isSuggestionsLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                                <ul className="space-y-1 py-2">
                                  {suggestions.map((suggestion, index) => (
                                    <li key={index} 
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                                    >
                                      {suggestion.type === 'property-type' ? <Building className="h-4 w-4 text-muted-foreground" /> : <MapPin className="h-4 w-4 text-muted-foreground" />}
                                      <span>{suggestion.displayLabel}</span>
                                    </li>
                                  ))}
                                </ul>
                            </PopoverContent>
                          </Popover>

                          <div className="flex w-full sm:w-auto gap-2">
                              <Button variant="outline" className="w-1/2 sm:w-auto h-12 text-base font-normal" onClick={() => setIsMapOpen(true)}>
                                <MapIcon className="mr-2 h-5 w-5" /> Map
                              </Button>
                              <Button className="w-1/2 sm:w-auto h-12 text-base bg-accent hover:bg-accent/90" onClick={handleSearchClick}>
                              Search
                              </Button>
                          </div>
                      </div>
                  </CardContent>
              </Card>
              <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className={cn(isDarkBg ? 'bg-transparent' : 'bg-background', 'rounded-b-lg')}>
                <div className={cn("p-4 transition-all duration-300", filterTextColor)}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <Select value={filters.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                        <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue placeholder="Property Type" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Property Type</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Townhouse">Townhouse</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Vacant Land">Vacant Land</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.minPrice} onValueChange={(value) => handleSelectChange('minPrice', value)}>
                        <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue placeholder="Min Price" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Min Price</SelectItem>
                        <SelectItem value="500000">R 500 000</SelectItem>
                        <SelectItem value="1000000">R 1 000 000</SelectItem>
                        <SelectItem value="2000000">R 2 000 000</SelectItem>
                        <SelectItem value="5000000">R 5 000 000</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.maxPrice} onValueChange={(value) => handleSelectChange('maxPrice', value)}>
                        <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue placeholder="Max Price" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Max Price</SelectItem>
                        <SelectItem value="1000000">R 1 000 000</SelectItem>
                        <SelectItem value="2000000">R 2 000 000</SelectItem>
                        <SelectItem value="5000000">R 5 000 000</SelectItem>
                        <SelectItem value="10000000">R 10 000 000</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.minBeds} onValueChange={(value) => handleSelectChange('minBeds', value)}>
                        <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue placeholder="Beds" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Beds</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className={cn("h-10 text-base", moreFiltersClass)}>
                        More Filters
                        <Plus className="ml-2 h-4 w-4" />
                        </Button>
                    </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className={cn("mt-6", filterTextColor)}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                        <h4 className="font-semibold mb-3">Features</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                            <Checkbox id="pet-friendly" checked={filters.features.petFriendly} onCheckedChange={(c) => handleCheckboxChange('features', 'petFriendly', !!c)} className={checkboxBorderClass} />
                            <Label htmlFor="pet-friendly" className="font-normal">Pet Friendly</Label>
                            </div>
                            <div className="flex items-center gap-2">
                            <Checkbox id="garden" checked={filters.features.garden} onCheckedChange={(c) => handleCheckboxChange('features', 'garden', !!c)} className={checkboxBorderClass} />
                            <Label htmlFor="garden" className="font-normal">Garden</Label>
                            </div>
                            <div className="flex items-center gap-2">
                            <Checkbox id="pool" checked={filters.features.pool} onCheckedChange={(c) => handleCheckboxChange('features', 'pool', !!c)} className={checkboxBorderClass} />
                            <Label htmlFor="pool" className="font-normal">Pool</Label>
                            </div>
                            <div className="flex items-center gap-2">
                            <Checkbox id="flatlet" checked={filters.features.flatlet} onCheckedChange={(c) => handleCheckboxChange('features', 'flatlet', !!c)} className={checkboxBorderClass} />
                            <Label htmlFor="flatlet" className="font-normal">Flatlet</Label>
                            </div>
                        </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Min Floor Size</Label>
                                <Select value={filters.minFloorSize} onValueChange={(value) => handleSelectChange('minFloorSize', value)}>
                                <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue /></SelectTrigger>
                                <SelectContent>{floorSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Max Floor Size</Label>
                                <Select value={filters.maxFloorSize} onValueChange={(value) => handleSelectChange('maxFloorSize', value)}>
                                <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue /></SelectTrigger>
                                <SelectContent>{floorSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Min Erf Size</Label>
                                <Select value={filters.minErfSize} onValueChange={(value) => handleSelectChange('minErfSize', value)}>
                                <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue /></SelectTrigger>
                                <SelectContent>{erfSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Max Erf Size</Label>
                                <Select value={filters.maxErfSize} onValueChange={(value) => handleSelectChange('maxErfSize', value)}>
                                <SelectTrigger className={cn("h-10", selectTriggerClass)}><SelectValue /></SelectTrigger>
                                <SelectContent>{erfSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                        <h4 className="font-semibold mb-3">Other Filters</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="on-show" checked={filters.other.onShow} onCheckedChange={(c) => handleCheckboxChange('other', 'onShow', !!c)} className={checkboxBorderClass} />
                                <Label htmlFor="on-show" className="font-normal">On Show</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="retirement" checked={filters.other.retirement} onCheckedChange={(c) => handleCheckboxChange('other', 'retirement', !!c)} className={checkboxBorderClass} />
                                <Label htmlFor="retirement" className="font-normal">Retirement</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="security-estate" checked={filters.other.securityEstate} onCheckedChange={(c) => handleCheckboxChange('other', 'securityEstate', !!c)} className={checkboxBorderClass} />
                                <Label htmlFor="security-estate" className="font-normal">Security Estate</Label>
                            </div>
                        </div>
                        </div>
                    </div>
                    </CollapsibleContent>
                </div>
                <div className="bg-card/20 text-white text-sm text-center py-2 rounded-b-lg">
                    Click search to see <span className="font-bold">{filteredCount}</span> properties
                    <span className="mx-2">•</span>
                    <Button variant="link" className="text-white h-auto p-0" onClick={clearFilters}>Clear Filters</Button>
                </div>
            </Collapsible>
          </div>
        </Tabs>
      </div>

      <MapDialog
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onLocationSelect={handleLocationSelect}
        properties={properties}
      />
    </>
  );
}
