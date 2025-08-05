
"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Building, KeyRound, Handshake } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';

const heroBanners = [
  '/images/backgrounds/hero-banner-1.webp',
  '/images/backgrounds/hero-banner-2.webp',
  '/images/backgrounds/hero-banner-3.webp',
  '/images/backgrounds/hero-banner-4.webp'
];

export function HeroSection() {
  const [bannerImage, setBannerImage] = useState(heroBanners[0]);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    const randomBanner = heroBanners[Math.floor(Math.random() * heroBanners.length)];
    setBannerImage(randomBanner);
  }, []);

  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white">
      <Image
        src={bannerImage}
        alt="A beautiful, modern home interior, representing the quality properties offered by NC Properties."
        data-ai-hint="modern home interior"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 container text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 tracking-tight text-white drop-shadow-md">
          We have space for you
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl drop-shadow-md">
          Discover the finest properties for sale and rent across South Africa. Your new home is just a search away.
        </p>
        <Card className="w-full max-w-4xl mx-auto shadow-2xl bg-black/20 backdrop-blur-md border border-white/20">
          <CardContent className="p-4">
            <form className="grid md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4">
                <Select defaultValue="for-sale">
                  <SelectTrigger className="h-14 text-base bg-white text-black border-input focus:ring-2 focus:ring-brand-bright focus:ring-offset-0">
                    <SelectValue placeholder="For Sale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for-sale">For Sale</SelectItem>
                    <SelectItem value="to-let">To Let</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-6">
                <Input
                  type="text"
                  placeholder="Enter city, suburb or area"
                  className="h-14 text-base bg-white text-black border-input focus:ring-2 focus:ring-brand-bright focus:ring-offset-0 placeholder:text-gray-600"
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" size="lg" className="w-full h-14 bg-brand-bright hover:bg-brand-deep transition-colors duration-300 text-lg">
                  <Search className="mr-2 h-6 w-6" />
                  Search
                </Button>
              </div>
            </form>
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
  const isAlertForm = id === 'property-alerts';

  const cardContent = (
    <Card className="text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col bg-card h-full">
      <CardContent className="p-6 flex-grow flex flex-col items-center">
        <Image src={imageSrc} data-ai-hint={imageHint} alt={`${title} - NC Properties feature`} width={150} height={150} className="rounded-full w-32 h-32 object-cover mb-6 border-4 border-white shadow-md" />
        <h3 className="text-xl font-bold font-headline mb-2 text-brand-deep">{title}</h3>
        <p className="text-muted-foreground flex-grow mb-6">{description}</p>
        {isAlertForm ? (
          <PropertyAlertForm />
        ) : (
          <Button asChild variant="outline" className="border-brand-bright text-brand-bright hover:bg-brand-bright hover:text-white transition-colors w-full mt-auto">
            <Link href={href || '#'}>{buttonText}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
  
  if (href && !isAlertForm) {
    return <Link href={href} className="block h-full">{cardContent}</Link>
  }

  return cardContent;
}

export function CtaTabsSection() {
  const buyerOptions = [
    { id: 'property-alerts', title: "Property Alerts", description: "Get instant alerts on new properties that match your unique search criteria.", buttonText: "Sign Up Now", imageSrc: "/images/backgrounds/property-alert.webp", imageHint: "notification bell" },
    { id: 'sold-prices', title: "Sold Prices", description: "Research the value of any property in South Africa to make informed decisions.", buttonText: "View Sold Prices", imageSrc: "/images/backgrounds/sold-prices.webp", imageHint: "price tag", href: "/properties/sold" },
    { id: 'buying-guides', title: "Buying Guides", description: "Our comprehensive guides cover everything you need to know about buying a home.", buttonText: "Explore Guides", imageSrc: "/images/backgrounds/automated-property-valuations.webp", imageHint: "open book", href: "/blog" },
  ];

  const renterOptions = [
    { title: "Find Letting Agents", description: "Connect with trusted and experienced letting agents in your desired area.", buttonText: "Search Agents", imageSrc: "/images/backgrounds/find-letting-agents.webp", imageHint: "handshake professional", href: "/about-us" },
    { id: 'property-alerts', title: "Rental Alerts", description: "Be the first to know about new rental properties as soon as they hit the market.", buttonText: "Sign Up Now", imageSrc: "/images/backgrounds/property-alert.webp", imageHint: "email notification" },
    { title: "Renter's Advice", description: "Navigate the rental market with confidence using our collection of helpful articles.", buttonText: "Read Articles", imageSrc: "/images/backgrounds/rental-advice.webp", imageHint: "lightbulb idea", href: "/blog" },
  ];

  const sellerOptions = [
    { title: "Free Property Valuation", description: "Get a free, instant, and accurate valuation for your property.", buttonText: "Get Started", imageSrc: "/images/backgrounds/automated-property-valuations.webp", imageHint: "valuation chart", href: "/sell" },
    { id: 'sold-prices', title: "Sold Prices", description: "Understand market trends by viewing the latest sold prices in your neighbourhood.", buttonText: "View Sold Prices", imageSrc: "/images/backgrounds/sold-prices.webp", imageHint: "house price", href: "/properties/sold" },
    { id: 'selling-guides', title: "Selling Guides", description: "Our guides provide all the information you need to sell your property successfully.", buttonText: "View Guides", imageSrc: "/images/backgrounds/automated-property-valuations.webp", imageHint: "checklist clipboard", href: "/blog" },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline">Discover All Things Property</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Whether you're buying, renting, or selling, we have the tools and resources to help you succeed.</p>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {buyerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
            </div>
          </TabsContent>
          <TabsContent value="renting" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {renterOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
            </div>
          </TabsContent>
          <TabsContent value="selling" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {sellerOptions.map(opt => <CtaTabCard key={opt.title} {...opt} />)}
            </div>
          </TabsContent>
        </Tabs>
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
    // This effect runs only on the client, after hydration
    const shuffled = [...mailImages].sort(() => 0.5 - Math.random());
    setBgImages(shuffled.slice(0, 3).join(', '));
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
      <div className="absolute inset-0 bg-black/20" />
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
