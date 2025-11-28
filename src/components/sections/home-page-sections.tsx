
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';
import { PropertyFilter } from '../shared/property-filter';
import { getProperties } from '@/lib/data';
import type { Property } from '../shared/property-card';
import placeholders from '@/lib/placeholder-images.json';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, KeyRound, Handshake } from 'lucide-react';


const heroBanners = [
  '/images/backgrounds/hero-banner-1.webp',
  '/images/backgrounds/hero-banner-2.webp',
  '/images/backgrounds/hero-banner-3.webp',
  '/images/backgrounds/hero-banner-4.webp'
];

export function HeroSection() {
  const [bannerImage, setBannerImage] = useState(heroBanners[0]);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const randomBanner = heroBanners[Math.floor(Math.random() * heroBanners.length)];
      setBannerImage(randomBanner);
    }
    
    async function fetchProps() {
        const props = await getProperties();
        setProperties(props);
    }
    fetchProps();
  }, []);
  
  return (
    <section className="relative h-[70vh] min-h-[550px] flex items-center justify-center text-white">
      <Image
        src={bannerImage}
        alt="A beautiful, modern home interior, representing the quality properties offered by NC Properties."
        data-ai-hint="modern home interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container text-center flex flex-col items-center">
        <div className="bg-black/30 backdrop-blur-sm p-6 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white drop-shadow-md">
            We have space for you
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl drop-shadow-md">
            Discover the finest properties for sale and rent across South Africa. Your new home is just a search away.
          </p>
        </div>
        <Card className="w-full max-w-4xl mx-auto shadow-2xl bg-black/20 backdrop-blur-md border border-white/20 mt-8">
          <CardContent className="p-4">
             <PropertyFilter properties={properties} onFilterChange={() => {}} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

const alertFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

function PropertyAlertForm() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof alertFormSchema>) {
    console.log(values);
    toast({
      title: "Subscribed!",
      description: "You've been signed up for property alerts.",
    });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-brand-bright text-brand-bright hover:bg-brand-bright hover:text-white transition-colors w-full mt-auto">
          Sign Up Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Property Alerts</DialogTitle>
          <DialogDescription>
            Get notified about new properties that match your criteria. Fill out your details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep">Send</Button>
             </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


function CtaTabCard({ id, title, description, buttonText, imageSrc, imageHint, href }: { id?:string, title: string, description: string, buttonText: string, imageSrc: string, imageHint: string, href?: string }) {
  const isAlertForm = id === 'property-alerts' || id === 'rental-alerts';

  return (
    <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card h-full group">
      <CardContent className="p-6 flex-grow flex flex-col items-center">
        <Image src={imageSrc} data-ai-hint={imageHint} alt={description} width={150} height={150} className="rounded-full w-32 h-32 object-cover mb-6 border-4 border-white shadow-md" />
        <h3 className="text-xl font-bold font-headline mb-2 text-brand-deep group-hover:text-brand-bright transition-colors">{title}</h3>
        <p className="text-muted-foreground flex-grow mb-6">{description}</p>
        {isAlertForm ? (
          <PropertyAlertForm />
        ) : (
          <Link href={href || '#'}><Button variant="outline" className="border-brand-bright text-brand-bright hover:bg-brand-bright hover:text-white transition-colors w-full mt-auto">
             {buttonText}
          </Button></Link>
        )}
      </CardContent>
    </Card>
  );
}

export function CtaTabsSection() {
  const buyerOptions = [
    { id: 'property-alerts', title: "Property Alerts", description: "Get instant alerts on new properties that match your unique search criteria.", buttonText: "Sign Up Now", imageSrc: placeholders.propertyAlert.url, imageHint: placeholders.propertyAlert.hint },
    { id: 'buying-guides', title: "Buying Guides", description: "Our comprehensive guides cover everything you need to know about buying a home.", buttonText: "Explore Guides", imageSrc: placeholders.buyingGuides.url, imageHint: placeholders.buyingGuides.hint, href: "/blog" },
  ];

  const renterOptions = [
    { title: "Find Letting Agents", description: "Connect with trusted and experienced letting agents in your desired area.", buttonText: "Search Agents", imageSrc: placeholders.findLettingAgents.url, imageHint: placeholders.findLettingAgents.hint, href: "/about-us" },
    { id: 'rental-alerts', title: "Rental Alerts", description: "Be the first to know about new rental properties as soon as they hit the market.", buttonText: "Sign Up Now", imageSrc: placeholders.rentalAlerts.url, imageHint: placeholders.rentalAlerts.hint },
    { title: "Renter's Advice", description: "Navigate the rental market with confidence using our collection of helpful articles.", buttonText: "Read Articles", imageSrc: placeholders.rentersAdvice.url, imageHint: placeholders.rentersAdvice.hint, href: "/blog" },
  ];

  const sellerOptions = [
    { title: "Free Property Valuation", description: "Get a free, instant, and accurate valuation for your property.", buttonText: "Get Started", imageSrc: placeholders.freePropertyValuation.url, imageHint: placeholders.freePropertyValuation.hint, href: "/sell" },
    { id: 'selling-guides', title: "Selling Guides", description: "Our guides provide all the information you need to sell your property successfully.", buttonText: "View Guides", imageSrc: placeholders.sellingGuides.url, imageHint: placeholders.sellingGuides.hint, href: "/blog" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">Discover All Things Property</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Whether you're buying, renting, or selling, we have the tools and resources to help you succeed.</p>
        </div>
        <div className="bg-card p-4 sm:p-8 rounded-lg shadow-lg">
          <Tabs defaultValue="buying" className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 bg-muted p-1 h-12 rounded-full">
              <TabsTrigger value="buying" className="rounded-full text-md data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
                <Building className="h-5 w-5" /> Buying
              </TabsTrigger>
              <TabsTrigger value="renting" className="rounded-full text-md data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
                <KeyRound className="h-5 w-5" /> Renting
              </TabsTrigger>
              <TabsTrigger value="selling" className="rounded-full text-md data-[state=active]:bg-brand-bright data-[state=active]:text-white transition-all duration-300 flex items-center gap-2">
                <Handshake className="h-5 w-5" /> Selling
              </TabsTrigger>
            </TabsList>
            <TabsContent value="buying" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {buyerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
            <TabsContent value="renting" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {renterOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
            <TabsContent value="selling" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sellerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const mailImages = [
    'url("/images/backgrounds/mail-image.webp")',
    'url("/images/backgrounds/mail-image-2.webp")',
    'url("/images/backgrounds/mail-image-3.webp")',
    'url("/images/backgrounds/mail-image-4.webp")',
  ];
  
  const [bgImages, setBgImages] = useState(mailImages.slice(0,3).join(', '));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shuffled = [...mailImages].sort(() => 0.5 - Math.random());
      setBgImages(shuffled.slice(0, 3).join(', '));
    }
  }, []);

  return (
    <section 
      className="py-24 bg-card relative"
      style={{
        backgroundImage: bgImages,
        backgroundSize: '300px, 250px, 200px',
        backgroundPosition: 'right bottom, left top, center center',
        backgroundRepeat: 'no-repeat',
      }}
      aria-label="Newsletter subscription section"
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="container relative">
        <Card className="max-w-2xl mx-auto shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold font-headline">Stay Ahead of the Market</h2>
            <p className="text-muted-foreground">Subscribe to our newsletter for the latest property listings, market news, and exclusive tips.</p>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col sm:flex-row gap-4">
              <Input type="email" placeholder="Enter your email address" className="flex-grow h-12" aria-label="Email for newsletter"/>
              <Button type="submit" size="lg" className="h-12 bg-brand-bright hover:bg-brand-deep transition-colors">Subscribe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

    
    