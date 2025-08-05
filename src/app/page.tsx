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
import Link from 'next/link';
import propertiesData from '@/data/properties.json';

const featuredProperties: Property[] = propertiesData.filter(p => p.isFavorite && p.status === 'for-sale').slice(0, 8);

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
    <section className="relative h-[550px] w-full">
      <Image
        src="https://placehold.co/1920x550"
        alt="A beautiful modern house in South Africa"
        data-ai-hint="beautiful house south africa"
        fill
        objectFit="cover"
        className="brightness-50"
      />
      <div className="relative container h-full flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Find Your Dream Home</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">With NC Properties, your next chapter starts here. Unforgettable homes, unparalleled service.</p>
        <Card className="absolute -bottom-16 w-full max-w-4xl mx-auto shadow-2xl">
          <CardContent className="p-6">
            <form className="grid md:grid-cols-4 gap-4 items-center">
              <div className="md:col-span-2">
                <Input type="text" placeholder="Enter a location (e.g., 'Sandton')" className="h-14 text-lg" />
              </div>
              <div>
                <Select>
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" size="lg" className="w-full h-14 bg-brand-bright hover:bg-brand-deep transition-colors duration-300 text-lg">
                <Search className="mr-2 h-6 w-6" />
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
    <section className="py-24 bg-background pt-40">
      <div className="container">
        <h2 className="text-3xl font-bold text-center font-headline mb-4">Featured Properties</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">Discover our curated selection of premier properties in South Africa, offering the perfect blend of luxury, comfort, and style.</p>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2">
            {featuredProperties.map((prop) => (
              <CarouselItem key={prop.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <PropertyCard property={prop} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-brand-deep text-white hover:bg-brand-deep/90 border-none -left-4" />
          <CarouselNext className="bg-brand-deep text-white hover:bg-brand-deep/90 border-none -right-4" />
        </Carousel>
        <div className="text-center mt-12">
          <Link href="/properties">
            <Button size="lg" className="bg-brand-bright hover:bg-brand-deep transition-colors">
              View All Properties <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CtaTabsSection() {
  return (
    <section className="py-24 bg-card">
      <div className="container">
        <Tabs defaultValue="for-sale" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted p-1 rounded-full">
            <TabsTrigger value="for-sale" className="rounded-full data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300">Buying</TabsTrigger>
            <TabsTrigger value="for-rent" className="rounded-full data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300">Selling</TabsTrigger>
          </TabsList>
          <div className="pt-12">
            <TabsContent value="for-sale">
              <CtaTabContent
                title="Your Forever Home Awaits"
                description="Explore a diverse range of properties for sale. From cozy starter homes to luxurious estates, find the perfect place to call your own in South Africa."
                imageSrc="https://placehold.co/150x150"
                imageHint="smiling couple"
                buttonText="Browse Homes For Sale"
                buttonLink="/properties"
              />
            </TabsContent>
            <TabsContent value="for-rent">
              <CtaTabContent
                title="Sell Your Property with Confidence"
                description="Ready to sell? Our expert team provides unparalleled market knowledge and a seamless selling process to get you the best value for your home."
                imageSrc="https://placehold.co/150x150"
                imageHint="happy homeowner"
                buttonText="Sell Your Property"
                buttonLink="/sell"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
}

function CtaTabContent({ title, description, imageSrc, imageHint, buttonText, buttonLink }: { title: string, description: string, imageSrc: string, imageHint: string, buttonText: string, buttonLink: string }) {
  return (
    <Card>
      <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <Avatar className="w-36 h-36 border-4 border-brand-bright/20">
          <AvatarImage src={imageSrc} data-ai-hint={imageHint} />
          <AvatarFallback>NC</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-2xl font-bold font-headline mb-2">{title}</h3>
          <p className="text-muted-foreground mb-4 max-w-2xl">{description}</p>
          <Link href={buttonLink}>
            <Button variant="outline" className="border-brand-bright text-brand-bright hover:bg-brand-bright hover:text-white transition-colors">
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
          fill
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