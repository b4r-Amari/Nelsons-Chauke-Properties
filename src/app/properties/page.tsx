import { PropertyCard, type Property } from "@/components/shared/property-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const allProperties: Property[] = [
  { id: '1', imageUrl: 'https://placehold.co/300x200', imageHint: 'modern house sandton', price: 7200000, address: '12 Sandhurst, Sandton', beds: 4, baths: 3, sqft: 350, isFavorite: true },
  { id: '2', imageUrl: 'https://placehold.co/300x200', imageHint: 'sea point apartment', price: 5100000, address: '45 Ocean View Dr, Sea Point', beds: 3, baths: 2, sqft: 180, isFavorite: false },
  { id: '3', imageUrl: 'https://placehold.co/300x200', imageHint: 'umhlanga apartment', price: 4800000, address: '78 Marine Way, Umhlanga', beds: 2, baths: 2, sqft: 125, isFavorite: false },
  { id: '4', imageUrl: 'https://placehold.co/300x200', imageHint: 'stellenbosch villa', price: 15000000, address: '101 Wine Estate, Stellenbosch', beds: 5, baths: 5, sqft: 500, isFavorite: true },
  { id: '5', imageUrl: 'https://placehold.co/300x200', imageHint: 'constantia home', price: 9500000, address: '212 Forest Drive, Constantia', beds: 3, baths: 3, sqft: 280, isFavorite: false },
  { id: '6', imageUrl: 'https://placehold.co/300x200', imageHint: 'pretoria east house', price: 3400000, address: '55 Silver Lakes, Pretoria East', beds: 4, baths: 2, sqft: 310, isFavorite: false },
  { id: '7', imageUrl: 'https://placehold.co/300x200', imageHint: 'durbanville home', price: 2900000, address: '88 Aurora, Durbanville', beds: 3, baths: 2, sqft: 220, isFavorite: false },
  { id: '8', imageUrl: 'https://placehold.co/300x200', imageHint: 'joburg city loft', price: 1800000, address: 'Maboneng Precinct, Johannesburg', beds: 1, baths: 1, sqft: 90, isFavorite: true },
  { id: '9', imageUrl: 'https://placehold.co/300x200', imageHint: 'cape town cbd apartment', price: 2500000, address: 'Bree Street, Cape Town CBD', beds: 2, baths: 1, sqft: 100, isFavorite: false },
];

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
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
