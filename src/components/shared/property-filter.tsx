
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
import { useSearchParams, useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

export function PropertyFilter({ properties, onFilterChange }: { properties: Property[], onFilterChange: (filtered: Property[]) => void }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [filters, setFilters] = useState(() => {
    const location = searchParams.get("location") || "";
    const status = searchParams.get("status") || "for-sale";
    return {...initialFilters, location, status };
  });

  const [activeTab, setActiveTab] = useState(filters.status === 'to-let' ? 'rent' : 'buy');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const applyFilters = useCallback(() => {
    const { location, propertyType, minBeds, minBaths, minPrice, maxPrice, features, other } = filters;
    const queryParams = new URLSearchParams();

    if (location) queryParams.set('location', location);
    queryParams.set('status', activeTab === 'buy' ? 'for-sale' : 'to-let');
    if (propertyType !== 'any') queryParams.set('type', propertyType);
    if (minBeds !== 'any') queryParams.set('beds', minBeds);
    if (minPrice !== 'any') queryParams.set('minPrice', minPrice);
    if (maxPrice !== 'any') queryParams.set('maxPrice', maxPrice);
    
    // For client-side filtering (if not navigating away)
    const filtered = properties.filter(p => {
        if (activeTab === 'buy' && p.status !== 'for-sale') return false;
        if (activeTab === 'rent' && p.status !== 'to-let') return false;
        if (location && !p.location.toLowerCase().includes(location.toLowerCase()) && !p.address.toLowerCase().includes(location.toLowerCase())) return false;
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

    // If on homepage, navigate to listings page with filters
    if (window.location.pathname === '/') {
        router.push(`/properties?${queryParams.toString()}`);
    }

  }, [filters, properties, onFilterChange, activeTab, router]);

  useEffect(() => {
    applyFilters();
  }, [filters, properties, applyFilters]);

  const handleInputChange = (field: string, value: string) => {
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
    const status = activeTab === 'buy' ? 'for-sale' : 'to-let';
    setFilters({...initialFilters, status });
  }

  const filteredCount = useMemo(() => {
    return properties.filter(p => {
        const { location, propertyType, minBeds, minPrice, maxPrice } = filters;
        if (activeTab === 'buy' && p.status !== 'for-sale') return false;
        if (activeTab === 'rent' && p.status !== 'to-let') return false;
        if (location && !p.location.toLowerCase().includes(location.toLowerCase()) && !p.address.toLowerCase().includes(location.toLowerCase())) return false;
        if (propertyType !== 'any' && p.type !== propertyType) return false;
        if (minBeds !== 'any' && p.beds < parseInt(minBeds)) return false;
        if (minPrice !== 'any' && p.price < parseInt(minPrice)) return false;
        if (maxPrice !== 'any' && p.price > parseInt(maxPrice)) return false;
        return true;
    }).length
  }, [filters, properties, activeTab]);

  useEffect(() => {
      const location = searchParams.get("location") || '';
      const status = searchParams.get('status') || 'for-sale';
      setFilters(prev => ({...prev, location, status}));
      setActiveTab(status === 'to-let' ? 'rent' : 'buy');
  }, [searchParams]);

  const commonTabClass = "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-white text-white/80 text-lg font-bold pb-3 px-5 rounded-none border-b-4 border-transparent data-[state=active]:border-brand-bright hover:text-white";

  return (
    <div className="font-sans max-w-[900px] mx-auto">
      <Tabs defaultValue="buy" className="w-full" value={activeTab} onValueChange={(v) => {
        if (v === 'agents') return;
        setActiveTab(v);
        const newStatus = v === 'rent' ? 'to-let' : 'for-sale';
        setFilters(prev => ({ ...prev, status: newStatus }));
      }}>
        <TabsList className="flex justify-center bg-transparent p-0 h-auto gap-0 pb-5">
            <TabsTrigger value="buy" className={cn(commonTabClass, "inline-flex")}>Buy</TabsTrigger>
            <TabsTrigger value="rent" className={cn(commonTabClass, "inline-flex")}>Rent</TabsTrigger>
            <Link href="/about-us" className={cn(commonTabClass, "hidden sm:inline-flex", "border-b-4 border-transparent hover:border-brand-bright/50")}>Agents</Link>
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
                            <Button className="w-1/2 md:w-auto h-12 text-base bg-accent hover:bg-accent/90" onClick={applyFilters}>
                            Search
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="rounded-b-lg">
                <div className="p-4 transition-all duration-300 bg-transparent">
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
                        <div>
                        <h4 className="font-semibold mb-3">Property Details</h4>
                        <div className="space-y-2">
                            <Select value={filters.minBaths} onValueChange={(value) => handleSelectChange('minBaths', value)}>
                                <SelectTrigger className="h-10 bg-primary-foreground/10 text-white border-white/50"><SelectValue placeholder="Baths" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any</SelectItem>
                                    <SelectItem value="1">1+</SelectItem>
                                    <SelectItem value="2">2+</SelectItem>
                                    <SelectItem value="3">3+</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input className="h-10 bg-primary-foreground/10 text-white border-white/50 placeholder:text-white/70" placeholder="Min Floor Size (m²)" />
                            <Input className="h-10 bg-primary-foreground/10 text-white border-white/50 placeholder:text-white/70" placeholder="Min Erf Size (m²)" />
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

    