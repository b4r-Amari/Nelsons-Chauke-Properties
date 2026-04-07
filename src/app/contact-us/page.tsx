
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
    title: 'Contact Us | Get In Touch with NC Properties',
    description: 'Contact Nelson Chauke Properties for all your real estate needs. Send us a message, find our office in Pretoria, or give us a call. We are here to help you.',
    alternates: {
        canonical: '/contact-us',
    },
    openGraph: {
        title: 'Contact NC Properties | Get In Touch',
        description: 'Need help with property? Reach out to our expert team for inquiries, support, and professional advice.',
        type: 'website',
        url: '/contact-us',
    },
};

export default function ContactUsPage() {
  const contactPointSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nelson Chauke Properties",
    "url": "https://nc-properties.vercel.app",
    "logo": "https://nc-properties.vercel.app/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+27-76-290-6426",
      "contactType": "customer service",
      "areaServed": "ZA",
      "availableLanguage": "en"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Property Avenue, Suite 100",
      "addressLocality": "Pretoria",
      "addressRegion": "Gauteng",
      "postalCode": "0181",
      "addressCountry": "ZA"
    }
  };

  return (
    <>
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPointSchema) }}
      />
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Get In Touch</h1>
          <p className="text-lg mt-2 text-white/80">We're here to help. Contact us for any inquiries or support.</p>
        </div>
      </section>

      <main className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="shadow-lg border-t-4 border-brand-bright">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Contact Information</CardTitle>
                  <CardDescription>Reach out to us directly through our channels.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-brand-bright mt-1" />
                    <div>
                      <h4 className="font-semibold">Email Us</h4>
                      <a href="mailto:contact@nelsonchaukeproperties.co.za" className="text-muted-foreground hover:text-brand-bright transition-colors">contact@nelsonchaukeproperties.co.za</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-brand-bright mt-1" />
                    <div>
                      <h4 className="font-semibold">Call Us</h4>
                      <a href="tel:+27762906426" className="text-muted-foreground hover:text-brand-bright transition-colors">076 290 6426</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
