import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Search } from 'lucide-react';
import { PropertyCard } from '@/components/shared/property-card';
import type { Property } from '@/components/shared/property-card';

const featuredProperties: Property[] = [
  { id: '1', imageUrl: 'https://placehold.co/300x200', imageHint: 'modern house', price: 450000, address: '123 Meadow Lane, Appleville', beds: 4, baths: 3, sqft: 2200, isFavorite: true },
  { id: '2', imageUrl: 'https://placehold.co/300x200', imageHint: 'suburban home', price: 320000, address: '456 Oak Street, Mapleton', beds: 3, baths: 2, sqft: 1800, isFavorite: false },
  { id: '3', imageUrl: 'https://placehold.co/300x200', imageHint: 'city apartment', price: 750000, address: '789 Pine Avenue, Downtown', beds: 2, baths: 2, sqft: 1250, isFavorite: false },
  { id: '4', imageUrl: 'https://placehold.co/300x200', imageHint: 'country villa', price: 1200000, address: '101 River Road, Countryside', beds: 5, baths: 5, sqft: 4500, isFavorite: true },
  { id: '5', imageUrl: 'https://placehold.co/300x200', imageHint: 'beach house', price: 950000, address: '212 Ocean Drive, Beachtown', beds: 3, baths: 3, sqft: 2000, isFavorite: false },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedPropertiesSection />
      <CtaTabsSection />
      <NewsletterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative h-[450px] w-full">
      <Image
        src="https://placehold.co/1920x450"
        alt="A beautiful modern house"
        data-ai-hint="beautiful house"
        layout="fill"
        objectFit="cover"
        className="brightness-50"
      />
      <div className="relative container h-full flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">Find Your Dream Home</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">With NC Properties, your next chapter starts here. Unforgettable homes, unparalleled service.</p>
        <Card className="absolute -bottom-16 w-full max-w-3xl mx-auto">
          <CardContent className="p-4">
            <form className="flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-2/5">
                <Input type="text" placeholder="Enter a location (e.g., 'Appleville')" className="h-12" />
              </div>
              <div className="w-full md:w-2/5">
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" size="lg" className="w-full md:w-auto h-12 bg-brand-bright hover:bg-brand-deep transition-colors duration-300">
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FeaturedPropertiesSection() {
  return (
    <section className="py-24 bg-background pt-32">
      <div className="container">
        <h2 className="text-3xl font-bold text-center font-headline mb-4">Featured Properties</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Discover our curated selection of premier properties, offering the perfect blend of luxury, comfort, and style to match your dream lifestyle.</p>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {featuredProperties.map((prop) => (
              <CarouselItem key={prop.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <PropertyCard property={prop} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-brand-deep text-white hover:bg-brand-deep/90 border-none -left-4" />
          <CarouselNext className="bg-brand-deep text-white hover:bg-brand-deep/90 border-none -right-4" />
        </Carousel>
      </div>
    </section>
  );
}

function CtaTabsSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container">
        <Tabs defaultValue="for-sale" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-muted p-1 rounded-full">
            <TabsTrigger value="for-sale" className="rounded-full data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300">For Sale</TabsTrigger>
            <TabsTrigger value="for-rent" className="rounded-full data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300">For Rent</TabsTrigger>
            <TabsTrigger value="new-developments" className="rounded-full data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300">New Developments</TabsTrigger>
          </TabsList>
          <div className="pt-12">
            <TabsContent value="for-sale">
              <CtaTabContent
                title="Your Forever Home Awaits"
                description="Explore a diverse range of properties for sale. From cozy starter homes to luxurious estates, find the perfect place to call your own."
                imageSrc="https://placehold.co/150x150"
                imageHint="smiling couple"
                buttonText="Browse Homes For Sale"
              />
            </TabsContent>
            <TabsContent value="for-rent">
              <CtaTabContent
                title="Flexible Living, Premium Spaces"
                description="Find high-quality rental properties in prime locations. Enjoy the flexibility of renting with the comfort and style you deserve."
                imageSrc="https://placehold.co/150x150"
                imageHint="happy renter"
                buttonText="Discover Rental Properties"
              />
            </TabsContent>
            <TabsContent value="new-developments">
              <CtaTabContent
                title="The Future of Living, Today"
                description="Be the first to live in a brand-new space. Our new developments feature modern design, cutting-edge amenities, and vibrant communities."
                imageSrc="https://placehold.co/150x150"
                imageHint="modern architecture"
                buttonText="Explore New Developments"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}

function CtaTabContent({ title, description, imageSrc, imageHint, buttonText }: { title: string, description: string, imageSrc: string, imageHint: string, buttonText: string }) {
  return (
    <Card>
      <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <Avatar className="w-36 h-36">
          <AvatarImage src={imageSrc} data-ai-hint={imageHint} />
          <AvatarFallback>NC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-2xl font-bold font-headline mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl">{description}</p>
          <Button variant="outline" className="border-brand-bright text-brand-bright hover:bg-brand-bright hover:text-white transition-colors">
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsletterSection() {
  return (
    <section className="py-24 bg-background relative">
       <Image
          src="https://placehold.co/1920x400"
          alt="Abstract background"
          data-ai-hint="abstract geometric"
          layout="fill"
          objectFit="cover"
          className="opacity-10"
        />
      <div className="container relative">
        <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold font-headline">Stay Ahead of the Market</h2>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest property listings, market news, and exclusive tips.</p>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input type="email" placeholder="Enter your email address" className="flex-grow h-12" />
              <Button type="submit" size="lg" className="h-12 bg-brand-deep hover:bg-brand-bright transition-colors">Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
