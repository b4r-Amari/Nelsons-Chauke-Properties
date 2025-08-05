
"use client"

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronsUpDown, SlidersHorizontal, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Property } from "./property-card";
import { ScrollArea } from "@/components/ui/scroll-area";

type PropertyFilterProps = {
  properties: Property[];
  onFilterChange: (filteredProperties: Property[]) => void;
};

const initialFilters = {
    location: "",
    propertyType: "any",
    minBeds: "any",
    minBaths: "any",
    minPrice: "",
    maxPrice: "",
    minParking: "any",
    minFloorSize: "",
    maxFloorSize: "",
    minErfSize: "",
    maxErfSize: "",
    features: {
        petFriendly: false,
        garden: false,
        pool: false,
        flatlet: false,
    },
    other: {
        retirement: false,
        repossessed: false,
        onShow: false,
        securityEstate: false,
        auction: false,
    },
};

export function PropertyFilter({ properties, onFilterChange }: PropertyFilterProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [filteredCount, setFilteredCount] = useState(properties.length);

  const handleFilterChange = useCallback(() => {
    const filtered = properties.filter(p => {
        const { location, propertyType, minBeds, minBaths, minPrice, maxPrice, minParking, minFloorSize, maxFloorSize, minErfSize, maxErfSize, features, other } = filters;

        // Text search
        if (location && !p.location.toLowerCase().includes(location.toLowerCase()) && !p.address.toLowerCase().includes(location.toLowerCase())) return false;

        // Selects
        if (propertyType !== 'any' && p.type !== propertyType) return false;
        if (minBeds !== 'any' && p.beds < parseInt(minBeds)) return false;
        if (minBaths !== 'any' && p.baths < parseInt(minBaths)) return false;
        if (minParking !== 'any' && (p.features.find(f => f.toLowerCase().includes('garage') || f.toLowerCase().includes('parking'))?.split(' ')[0] || 0) < minParking) return false;
        
        // Price Range
        if (minPrice && p.price < parseInt(minPrice)) return false;
        if (maxPrice && p.price > parseInt(maxPrice)) return false;

        // Size Range
        if (minFloorSize && p.sqft < parseInt(minFloorSize)) return false;
        if (maxFloorSize && p.sqft > parseInt(maxFloorSize)) return false;
        if (minErfSize && p.erfSize < parseInt(minErfSize)) return false;
        if (maxErfSize && p.erfSize > parseInt(maxErfSize)) return false;

        // Checkbox features
        if (features.petFriendly && !p.features.some(f => f.toLowerCase().includes('pet friendly'))) return false;
        if (features.garden && !p.features.some(f => f.toLowerCase().includes('garden'))) return false;
        if (features.pool && !p.features.some(f => f.toLowerCase().includes('pool'))) return false;
        if (features.flatlet && !p.features.some(f => f.toLowerCase().includes('flatlet') || f.toLowerCase().includes('guest cottage'))) return false;

        // Checkbox other
        if (other.onShow && !p.onShow) return false;
        if (other.retirement && !p.features.some(f => f.toLowerCase().includes('retirement'))) return false;
        if (other.repossessed && !p.features.some(f => f.toLowerCase().includes('repossessed'))) return false;
        if (other.securityEstate && !p.features.some(f => f.toLowerCase().includes('secure estate') || f.toLowerCase().includes('security estate'))) return false;
        if (other.auction && !p.features.some(f => f.toLowerCase().includes('auction'))) return false;

        return true;
    });
    onFilterChange(filtered);
    setFilteredCount(filtered.length);
  }, [filters, properties, onFilterChange]);


  useEffect(() => {
    handleFilterChange();
  }, [filters, handleFilterChange]);
  
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
    <Card className="lg:sticky top-24 shadow-lg lg:flex lg:flex-col lg:h-[calc(100vh-7rem)]">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3">
            <SlidersHorizontal className="h-6 w-6 text-brand-bright"/>
            Filter Properties
        </CardTitle>
      </CardHeader>
      <ScrollArea className="lg:flex-grow lg:overflow-y-auto">
        <CardContent>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. 'Cape Town'" value={filters.location} onChange={(e) => handleInputChange('location', e.target.value)} />
            </div>
            <div>
                <Label htmlFor="property-type">Property Type</Label>
                <Select value={filters.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                <SelectTrigger id="property-type">
                    <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <Label htmlFor="min-beds">Min Beds</Label>
                <Select value={filters.minBeds} onValueChange={(value) => handleSelectChange('minBeds', value)}>
                    <SelectTrigger id="min-beds">
                    <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div>
                <Label htmlFor="min-baths">Min Baths</Label>
                <Select value={filters.minBaths} onValueChange={(value) => handleSelectChange('minBaths', value)}>
                    <SelectTrigger id="min-baths">
                    <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            <div>
                <Label>Price Range (ZAR)</Label>
                <div className="flex gap-2">
                <Input placeholder="Min price" type="number" step="100000" value={filters.minPrice} onChange={(e) => handleInputChange('minPrice', e.target.value)} />
                <Input placeholder="Max price" type="number" step="100000" value={filters.maxPrice} onChange={(e) => handleInputChange('maxPrice', e.target.value)} />
                </div>
            </div>

            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-center gap-2 text-brand-bright hover:bg-muted hover:text-brand-bright">
                    <ChevronsUpDown className="h-4 w-4" />
                    <span>{isAdvancedOpen ? "Hide" : "Show"} More Filters</span>
                </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <Label htmlFor="min-parking">Parking</Label>
                            <Select value={filters.minParking} onValueChange={(value) => handleSelectChange('minParking', value)}>
                                <SelectTrigger id="min-parking"><SelectValue placeholder="Any" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any</SelectItem>
                                    <SelectItem value="1">1+</SelectItem>
                                    <SelectItem value="2">2+</SelectItem>
                                    <SelectItem value="3">3+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label>Floor Size (m²)</Label>
                        <div className="flex gap-2">
                            <Input placeholder="Min" type="number" step="10" value={filters.minFloorSize} onChange={(e) => handleInputChange('minFloorSize', e.target.value)} />
                            <Input placeholder="Max" type="number" step="10" value={filters.maxFloorSize} onChange={(e) => handleInputChange('maxFloorSize', e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <Label>Erf Size (m²)</Label>
                        <div className="flex gap-2">
                            <Input placeholder="Min" type="number" step="50" value={filters.minErfSize} onChange={(e) => handleInputChange('minErfSize', e.target.value)} />
                            <Input placeholder="Max" type="number" step="50" value={filters.maxErfSize} onChange={(e) => handleInputChange('maxErfSize', e.target.value)} />
                        </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                        <Label className="mb-2 block font-medium">Features</Label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pet-friendly" checked={filters.features.petFriendly} onCheckedChange={(checked) => handleCheckboxChange('features', 'petFriendly', !!checked)} />
                                <label htmlFor="pet-friendly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pet Friendly</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="garden" checked={filters.features.garden} onCheckedChange={(checked) => handleCheckboxChange('features', 'garden', !!checked)} />
                                <label htmlFor="garden" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Garden</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="pool" checked={filters.features.pool} onCheckedChange={(checked) => handleCheckboxChange('features', 'pool', !!checked)} />
                                <label htmlFor="pool" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pool</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="flatlet" checked={filters.features.flatlet} onCheckedChange={(checked) => handleCheckboxChange('features', 'flatlet', !!checked)} />
                                <label htmlFor="flatlet" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Flatlet</label>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <Label className="mb-2 block font-medium">Other</Label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="on-show" checked={filters.other.onShow} onCheckedChange={(checked) => handleCheckboxChange('other', 'onShow', !!checked)} />
                                <label htmlFor="on-show" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">On Show</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="security-estate" checked={filters.other.securityEstate} onCheckedChange={(checked) => handleCheckboxChange('other', 'securityEstate', !!checked)} />
                                <label htmlFor="security-estate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Security Estate</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="retirement" checked={filters.other.retirement} onCheckedChange={(checked) => handleCheckboxChange('other', 'retirement', !!checked)} />
                                <label htmlFor="retirement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Retirement</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="repossessed" checked={filters.other.repossessed} onCheckedChange={(checked) => handleCheckboxChange('other', 'repossessed', !!checked)} />
                                <label htmlFor="repossessed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Repossessed</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="auction" checked={filters.other.auction} onCheckedChange={(checked) => handleCheckboxChange('other', 'auction', !!checked)} />
                                <label htmlFor="auction" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Auction</label>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            </form>
        </CardContent>
      </ScrollArea>
       <CardFooter className="flex-col gap-4 pt-6 border-t">
          <Button className="w-full bg-brand-bright hover:bg-brand-deep transition-colors" size="lg">
              <Search className="mr-2 h-5 w-5"/>
              Search {filteredCount} {filteredCount === 1 ? 'property' : 'properties'}
          </Button>
          <Button type="reset" variant="link" className="w-full text-muted-foreground flex items-center" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
          </Button>
      </CardFooter>
    </Card>
  );
}
