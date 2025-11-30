
"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Map as MapIcon, X, Plus } from "lucide-react";
import type { Property } from "./property-card";
import { useRouter, usePathname } from "next/navigation";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

export type Filters = {
  location: string;
  status: "for-sale" | "to-let" | "sold" | "any";
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  minBaths: string;
  minFloorSize: string;
  maxFloorSize: string;
  minErfSize: string;
  maxErfSize: string;
  features: {
    petFriendly: boolean;
    garden: boolean;
    pool: boolean;
    flatlet: boolean;
  };
  other: {
    retirement: boolean;
    onShow: boolean;
    securityEstate: boolean;
  };
};

const initialFilters: Filters = {
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


export function PropertyFilter({ properties, onFilterChange, initial }: { properties: Property[], onFilterChange: (filters: Filters) => void, initial?: Partial<Filters> }) {
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState({ ...initialFilters, ...initial });
  const [activeTab, setActiveTab] = useState(filters.status === 'to-let' ? 'rent' : 'buy');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchClick = () => {
    const queryParams = new URLSearchParams();
    if (filters.location) queryParams.set('location', filters.location);
    queryParams.set('status', filters.status);
    if (filters.propertyType !== 'any') queryParams.set('propertyType', filters.propertyType);
    if (filters.minPrice !== 'any') queryParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== 'any') queryParams.set('maxPrice', filters.maxPrice);
    if (filters.minBeds !== 'any') queryParams.set('minBeds', filters.minBeds);
    if (filters.minBaths !== 'any') queryParams.set('minBaths', filters.minBaths);
    if (filters.minFloorSize !== 'any') queryParams.set('minFloorSize', filters.minFloorSize);
    if (filters.maxFloorSize !== 'any') queryParams.set('maxFloorSize', filters.maxFloorSize);
    if (filters.minErfSize !== 'any') queryParams.set('minErfSize', filters.minErfSize);
    if (filters.maxErfSize !== 'any') queryParams.set('maxErfSize', filters.maxErfSize);
    queryParams.set('autoscroll', 'true');

    router.push(`/properties?${queryParams.toString()}`);
  }
  
  const handleInputChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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
    const newFilters = {...initialFilters, status };
    setFilters(newFilters);
  }

  const filteredCount = useMemo(() => {
    return properties.filter(p => {
        if (activeTab === 'buy' && p.status !== 'for-sale') return false;
        if (activeTab === 'rent' && p.status !== 'to-let') return false;
        if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase()) && !p.address.toLowerCase().includes(filters.location.toLowerCase())) return false;
        if (filters.propertyType !== 'any' && p.type !== filters.propertyType) return false;
        if (filters.minBeds !== 'any' && p.beds < parseInt(filters.minBeds)) return false;
        if (filters.minPrice !== 'any' && p.price < parseInt(filters.minPrice)) return false;
        if (filters.maxPrice !== 'any' && p.price > parseInt(filters.maxPrice)) return false;
        return true;
    }).length
  }, [filters, properties, activeTab]);

  const commonTabClass = "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-white/80 text-lg font-bold pb-3 px-5 rounded-none border-b-4 border-transparent data-[state=active]:border-brand-bright hover:text-white";
  
  return (
    <div className="font-sans max-w-[900px] mx-auto">
      <Tabs defaultValue="buy" className="w-full" value={activeTab} onValueChange={(v) => {
        if (v === 'agents') return;
        setActiveTab(v);
        const newStatus = v === 'rent' ? 'to-let' : 'for-sale';
        setFilters(prev => ({ ...prev, status: newStatus as "for-sale" | "to-let" }));
      }}>
        <TabsList className="flex justify-center bg-transparent p-0 pb-5 h-auto gap-0">
          <TabsTrigger value="buy" className={cn(commonTabClass, "inline-flex")}>Buy</TabsTrigger>
          <TabsTrigger value="rent" className={cn(commonTabClass, "inline-flex")}>Rent</TabsTrigger>
          <TabsTrigger value="agents" asChild className={cn(commonTabClass, "hidden sm:inline-flex", "data-[state=inactive]:hover:border-b-4 data-[state=inactive]:hover:border-brand-bright/50")}>
             <Link href="/about-us">Agents</Link>
          </TabsTrigger>
        </TabsList>
        <div className="space-y-[-1px]">
            <Card className="shadow-lg rounded-t-lg rounded-b-none p-2 bg-white">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="location"
                                placeholder="Search for a suburb, city or province"
                                value={filters.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="pl-10 h-12 text-base border-0 focus-visible:ring-0 shadow-none"
                            />
                            {filters.location && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => handleInputChange('location', '')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            )}
                        </div>
                        <div className="flex w-full md:w-auto gap-2">
                            <Button variant="outline" className="w-1/2 md:w-auto h-12 text-base font-normal">
                            <MapIcon className="mr-2 h-5 w-5" /> Map
                            </Button>
                            <Button className="w-1/2 md:w-auto h-12 text-base bg-accent hover:bg-accent/90" onClick={handleSearchClick}>
                            Search
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="bg-brand-deep rounded-b-lg">
                <div className="p-4 transition-all duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <Select value={filters.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                        <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50"><SelectValue placeholder="Property Type" /></SelectTrigger>
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
                        <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50"><SelectValue placeholder="Min Price" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Any Price</SelectItem>
                        <SelectItem value="500000">R 500 000</SelectItem>
                        <SelectItem value="1000000">R 1 000 000</SelectItem>
                        <SelectItem value="2000000">R 2 000 000</SelectItem>
                        <SelectItem value="5000000">R 5 000 000</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.maxPrice} onValueChange={(value) => handleSelectChange('maxPrice', value)}>
                        <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50"><SelectValue placeholder="Max Price" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Any Price</SelectItem>
                        <SelectItem value="1000000">R 1 000 000</SelectItem>
                        <SelectItem value="2000000">R 2 000 000</SelectItem>
                        <SelectItem value="5000000">R 5 000 000</SelectItem>
                        <SelectItem value="10000000">R 10 000 000</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filters.minBeds} onValueChange={(value) => handleSelectChange('minBeds', value)}>
                        <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50"><SelectValue placeholder="Beds" /></SelectTrigger>
                        <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" className="h-10 text-base bg-transparent text-white hover:bg-primary-foreground/10 border-white/50 hover:text-white">
                        More Filters
                        <Plus className="ml-2 h-4 w-4" />
                        </Button>
                    </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="mt-6 text-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                        <h4 className="font-semibold mb-3">Features</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                            <Checkbox id="pet-friendly" checked={filters.features.petFriendly} onCheckedChange={(c) => handleCheckboxChange('features', 'petFriendly', !!c)} className="border-white" />
                            <Label htmlFor="pet-friendly" className="font-normal">Pet Friendly</Label>
                            </div>
                            <div className="flex items-center gap-2">
                            <Checkbox id="garden" checked={filters.features.garden} onCheckedChange={(c) => handleCheckboxChange('features', 'garden', !!c)} className="border-white" />
                            <Label htmlFor="garden" className="font-normal">Garden</Label>
                            </div>
                            <div className="flex items-center gap-2">
                            <Checkbox id="pool" checked={filters.features.pool} onCheckedChange={(c) => handleCheckboxChange('features', 'pool', !!c)} className="border-white" />
                            <Label htmlFor="pool" className="font-normal">Pool</Label>
                            </div>
                            <div className="flex items-center gap-2">
                            <Checkbox id="flatlet" checked={filters.features.flatlet} onCheckedChange={(c) => handleCheckboxChange('features', 'flatlet', !!c)} className="border-white" />
                            <Label htmlFor="flatlet" className="font-normal">Flatlet</Label>
                            </div>
                        </div>
                        </div>
                        <div className="col-span-2">
                            <h4 className="font-semibold mb-3">Property Details</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Min Floor Size</Label>
                                  <Select value={filters.minFloorSize} onValueChange={(value) => handleSelectChange('minFloorSize', value)}>
                                    <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50">
                                      <SelectValue placeholder="Min Floor Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {floorSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Max Floor Size</Label>
                                  <Select value={filters.maxFloorSize} onValueChange={(value) => handleSelectChange('maxFloorSize', value)}>
                                    <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50">
                                      <SelectValue placeholder="Max Floor Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {floorSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Min Erf Size</Label>
                                  <Select value={filters.minErfSize} onValueChange={(value) => handleSelectChange('minErfSize', value)}>
                                    <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50">
                                      <SelectValue placeholder="Min Erf Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {erfSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Max Erf Size</Label>
                                  <Select value={filters.maxErfSize} onValueChange={(value) => handleSelectChange('maxErfSize', value)}>
                                    <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50">
                                      <SelectValue placeholder="Max Erf Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {erfSizeOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                            </div>
                        </div>
                        <div>
                        <h4 className="font-semibold mb-3">Other Filters</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="on-show" checked={filters.other.onShow} onCheckedChange={(c) => handleCheckboxChange('other', 'onShow', !!c)} className="border-white" />
                                <Label htmlFor="on-show" className="font-normal">On Show</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="retirement" checked={filters.other.retirement} onCheckedChange={(c) => handleCheckboxChange('other', 'retirement', !!c)} className="border-white" />
                                <Label htmlFor="retirement" className="font-normal">Retirement</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="security-estate" checked={filters.other.securityEstate} onCheckedChange={(c) => handleCheckboxChange('other', 'securityEstate', !!c)} className="border-white" />
                                <Label htmlFor="security-estate" className="font-normal">Security Estate</Label>
                            </div>
                        </div>
                        </div>
                    </div>
                    </CollapsibleContent>
                </div>
                <div className="bg-card/20 text-white text-sm text-center py-2 rounded-b-lg">
                    Click search to browse <span className="font-bold">{filteredCount}</span> properties
                    <span className="mx-2">•</span>
                    <Button variant="link" className="text-white h-auto p-0" onClick={clearFilters}>Clear Filters</Button>
                </div>
            </Collapsible>
        </div>
      </Tabs>
    </div>
  );
}

    