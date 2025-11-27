
"use client"

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Map, X, ChevronsUpDown } from "lucide-react";
import type { Property } from "./property-card";
import { useSearchParams } from "next/navigation";
import { Label } from "../ui/label";

type PropertyFilterProps = {
  properties: Property[];
  onFilterChange: (filteredProperties: Property[]) => void;
};

const initialFilters = {
    location: "",
    status: "for-sale",
    propertyType: "any",
    minPrice: "any",
    maxPrice: "any",
    minBeds: "any",
    minBaths: "any",
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

export function PropertyFilter({ properties, onFilterChange }: PropertyFilterProps) {
  const searchParams = useSearchParams();
  const locationSearch = searchParams.get('location');
  const statusSearch = searchParams.get('status');

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState({...initialFilters, location: locationSearch || "", status: statusSearch || "for-sale" });
  const [filteredCount, setFilteredCount] = useState(properties.length);

  const applyFilters = useCallback(() => {
    const filtered = properties.filter(p => {
        const { location, status, propertyType, minBeds, minBaths, minPrice, maxPrice, features, other } = filters;

        if (location && !p.location.toLowerCase().includes(location.toLowerCase()) && !p.address.toLowerCase().includes(location.toLowerCase())) return false;
        if (status !== 'any' && p.status !== status) return false;
        if (propertyType !== 'any' && p.type !== propertyType) return false;
        if (minBeds !== 'any' && p.beds < parseInt(minBeds)) return false;
        if (minBaths !== 'any' && p.baths < parseInt(minBaths)) return false;
        if (minPrice !== 'any' && p.price < parseInt(minPrice)) return false;
        if (maxPrice !== 'any' && p.price > parseInt(maxPrice)) return false;
        if (features.petFriendly && !p.features.some(f => f.toLowerCase().includes('pet friendly'))) return false;
        if (features.garden && !p.features.some(f => f.toLowerCase().includes('garden'))) return false;
        if (features.pool && !p.features.some(f => f.toLowerCase().includes('pool'))) return false;
        if (features.flatlet && !p.features.some(f => f.toLowerCase().includes('flatlet') || f.toLowerCase().includes('guest cottage'))) return false;
        if (other.onShow && !p.onShow) return false;
        if (other.retirement && !p.features.some(f => f.toLowerCase().includes('retirement'))) return false;
        if (other.securityEstate && !p.features.some(f => f.toLowerCase().includes('secure estate') || f.toLowerCase().includes('security estate'))) return false;

        return true;
    });
    onFilterChange(filtered);
    setFilteredCount(filtered.length);
  }, [filters, properties, onFilterChange]);


  useEffect(() => {
    applyFilters();
  }, [filters, properties, applyFilters]);
  
  useEffect(() => {
    setFilters(prev => ({...prev, location: locationSearch || "", status: statusSearch || "for-sale"}));
  }, [locationSearch, statusSearch]);
  
  const handleInputChange = (field: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSelectChange = (field: string, value: string) => {
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
    setFilters(initialFilters);
  }

  return (
    <div className="mb-8">
        <Card className="shadow-lg bg-white p-4">
          <CardContent className="p-2">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="location" placeholder="Search by city, suburb or address" value={filters.location} onChange={(e) => handleInputChange('location', e.target.value)} className="pl-10 h-12 text-base"/>
                    {filters.location && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleInputChange('location', '')}><X className="h-4 w-4"/></Button>}
                </div>
                <Button variant="outline" className="w-full md:w-auto h-12 text-base">
                    <Map className="mr-2 h-5 w-5" /> Map
                </Button>
                <Button className="w-full md:w-auto h-12 text-base bg-brand-bright hover:bg-brand-deep" onClick={applyFilters}>
                    Search
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <div className="bg-primary p-6 transition-all duration-300">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <Select value={filters.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Property Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Type</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Townhouse">Townhouse</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Vacant Land">Vacant Land</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={filters.minPrice} onValueChange={(value) => handleSelectChange('minPrice', value)}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Min Price" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any Price</SelectItem>
                            <SelectItem value="500000">R 500 000</SelectItem>
                            <SelectItem value="1000000">R 1 000 000</SelectItem>
                            <SelectItem value="2000000">R 2 000 000</SelectItem>
                            <SelectItem value="5000000">R 5 000 000</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.maxPrice} onValueChange={(value) => handleSelectChange('maxPrice', value)}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Max Price" /></SelectTrigger>
                        <SelectContent>
                           <SelectItem value="any">Any Price</SelectItem>
                           <SelectItem value="1000000">R 1 000 000</SelectItem>
                           <SelectItem value="2000000">R 2 000 000</SelectItem>
                           <SelectItem value="5000000">R 5 000 000</SelectItem>
                           <SelectItem value="10000000">R 10 000 000</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.minBeds} onValueChange={(value) => handleSelectChange('minBeds', value)}>
                        <SelectTrigger className="h-12"><SelectValue placeholder="Beds" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="h-12 text-base bg-primary/20 text-white hover:bg-primary/40 border-white/50 hover:text-white">
                            {isAdvancedOpen ? "Less Filters" : "More Filters"}
                            <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                         <Select value={filters.minBaths} onValueChange={(value) => handleSelectChange('minBaths', value)}>
                            <SelectTrigger className="h-12"><SelectValue placeholder="Baths" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input className="h-12" placeholder="Min Floor Size (m²)" />
                        <Input className="h-12" placeholder="Min Erf Size (m²)" />
                    </div>
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Features</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                           <div className="flex items-center gap-2">
                                <Checkbox id="pet-friendly" className="border-white" checked={filters.features.petFriendly} onCheckedChange={(c) => handleCheckboxChange('features', 'petFriendly', !!c)} />
                                <Label htmlFor="pet-friendly">Pet Friendly</Label>
                           </div>
                           <div className="flex items-center gap-2">
                                <Checkbox id="garden" className="border-white" checked={filters.features.garden} onCheckedChange={(c) => handleCheckboxChange('features', 'garden', !!c)} />
                                <Label htmlFor="garden">Garden</Label>
                           </div>
                           <div className="flex items-center gap-2">
                                <Checkbox id="pool" className="border-white" checked={filters.features.pool} onCheckedChange={(c) => handleCheckboxChange('features', 'pool', !!c)} />
                                <Label htmlFor="pool">Pool</Label>
                           </div>
                           <div className="flex items-center gap-2">
                                <Checkbox id="flatlet" className="border-white" checked={filters.features.flatlet} onCheckedChange={(c) => handleCheckboxChange('features', 'flatlet', !!c)} />
                                <Label htmlFor="flatlet">Flatlet</Label>
                           </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="text-lg font-semibold text-white mb-3">Other</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
                           <div className="flex items-center gap-2">
                                <Checkbox id="retirement" className="border-white" checked={filters.other.retirement} onCheckedChange={(c) => handleCheckboxChange('other', 'retirement', !!c)} />
                                <Label htmlFor="retirement">Retirement</Label>
                           </div>
                           <div className="flex items-center gap-2">
                                <Checkbox id="on-show" className="border-white" checked={filters.other.onShow} onCheckedChange={(c) => handleCheckboxChange('other', 'onShow', !!c)} />
                                <Label htmlFor="on-show">On Show</Label>
                           </div>
                           <div className="flex items-center gap-2">
                                <Checkbox id="security-estate" className="border-white" checked={filters.other.securityEstate} onCheckedChange={(c) => handleCheckboxChange('other', 'securityEstate', !!c)} />
                                <Label htmlFor="security-estate">Security Estate</Label>
                           </div>
                        </div>
                    </div>
                </CollapsibleContent>
                 <div className="mt-6 flex items-center justify-center">
                    <p className="text-white/80 text-sm">
                        Click search to browse <span className="font-bold text-white">{filteredCount}</span> properties
                    </p>
                    <span className="text-white/50 mx-2">•</span>
                    <Button variant="link" className="p-0 h-auto text-white/80 hover:text-white" onClick={clearFilters}>Clear Filters</Button>
                </div>
            </div>
        </Collapsible>
    </div>
  );
}
