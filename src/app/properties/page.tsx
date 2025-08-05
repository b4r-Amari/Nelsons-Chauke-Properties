import { PropertyCard, type Property } from "@/components/shared/property-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import propertiesData from '@/data/properties.json';

const allProperties: Property[] = propertiesData;

export default function PropertiesPage() {
  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Properties for Sale</h1>
          <p className="text-lg mt-2 text-white/80">Find your next home from our curated listings across South Africa.</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card className="sticky top-24 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Filter Properties</CardTitle>
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
                    <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep transition-colors" size="lg">
                        <Search className="mr-2 h-5 w-5"/>
                        Search
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </aside>
            <main className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {allProperties.map((prop) => (
                        <PropertyCard key={prop.id} property={prop} />
                    ))}
                </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
