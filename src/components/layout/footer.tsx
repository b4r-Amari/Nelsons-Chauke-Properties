
"use client";

import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { addMarketingLead } from '@/lib/firebase/firestore';

const newsletterFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function Footer() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newsletterFormSchema>>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof newsletterFormSchema>) {
    const result = await addMarketingLead({ email: values.email, source: 'footer-newsletter' });
    if (result.success) {
      toast({
        title: "Subscribed!",
        description: "You're now on our newsletter list. Welcome!",
      });
      form.reset();
    } else {
       toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Could not subscribe to the newsletter.",
      });
    }
  }

  return (
    <footer className="bg-[#03132b] text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2 col-span-full sm:col-span-2">
            <Logo className="text-white" />
            <p className="mt-4 text-sm text-gray-400 max-w-xs">Your trusted partner in finding the perfect property. We are committed to excellence and customer satisfaction.</p>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-headline font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties?status=for-sale" className="hover:text-white transition-colors">For Sale</Link></li>
              <li><Link href="/properties?status=to-let" className="hover:text-white transition-colors">To Let</Link></li>
              <li><Link href="/sell" className="hover:text-white transition-colors">Sell a Property</Link></li>
              <li><Link href="/calculators" className="hover:text-white transition-colors">Calculators</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 col-span-full sm:col-span-2">
            <h4 className="font-headline font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest property news and updates.</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Your email address" 
                          className="bg-gray-800 border-gray-600 text-white h-11"
                          aria-label="Email for newsletter"
                          {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button type="submit" size="lg" className="h-11 bg-brand-bright hover:bg-brand-deep transition-colors" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "..." : "Subscribe"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} NC Properties. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
