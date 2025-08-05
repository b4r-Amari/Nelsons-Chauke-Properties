
"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function PropertyFilter() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <Card className="sticky top-24 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <SlidersHorizontal className="h-6 w-6 text-brand-bright"/>
            Filter Properties
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. 'Cape Town'" />
          </div>
          <div>
            <Label htmlFor="property-type">Property Type</Label>
            <Select>
              <SelectTrigger id="property-type">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="min-beds">Min Beds</Label>
              <Select>
                <SelectTrigger id="min-beds">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="min-baths">Min Baths</Label>
              <Select>
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
              <Input placeholder="Min price" type="number" step="100000" />
              <Input placeholder="Max price" type="number" step="100000" />
             </div>
          </div>

          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-center gap-2 text-brand-bright hover:bg-muted">
                <ChevronsUpDown className="h-4 w-4" />
                <span>{isAdvancedOpen ? "Hide" : "Show"} More Filters</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="min-parking">Parking</Label>
                        <Select>
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
                        <Input placeholder="Min" type="number" step="10" />
                        <Input placeholder="Max" type="number" step="10" />
                    </div>
                </div>
                <div>
                    <Label>Erf Size (m²)</Label>
                    <div className="flex gap-2">
                        <Input placeholder="Min" type="number" step="50" />
                        <Input placeholder="Max" type="number" step="50" />
                    </div>
                </div>
                
                <Separator />
                
                <div>
                    <Label className="mb-2 block">Features</Label>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="pet-friendly" />
                            <label htmlFor="pet-friendly" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pet Friendly</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="garden" />
                            <label htmlFor="garden" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Garden</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="pool" />
                            <label htmlFor="pool" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pool</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="flatlet" />
                            <label htmlFor="flatlet" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Flatlet</label>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <Label className="mb-2 block">Other</Label>
                    <div className="space-y-3">
                         <div className="flex items-center space-x-2">
                            <Checkbox id="on-show" />
                            <label htmlFor="on-show" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">On Show</label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="security-estate" />
                            <label htmlFor="security-estate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Security Estate</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="retirement" />
                            <label htmlFor="retirement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Retirement</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="repossessed" />
                            <label htmlFor="repossessed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Repossessed</label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Checkbox id="auction" />
                            <label htmlFor="auction" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Auction</label>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator className="my-6"/>

          <div className="space-y-4">
            <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep transition-colors" size="lg">
                <Search className="mr-2 h-5 w-5"/>
                Search 42 properties
            </Button>
            <Button type="reset" variant="link" className="w-full text-muted-foreground">Clear Filters</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
