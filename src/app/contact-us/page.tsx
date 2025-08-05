
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import type { Metadata } from "next";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata: Metadata = {
    title: 'Contact NC Properties | Get In Touch',
    description: 'Contact NC Properties for all your real estate needs. Send us a message, find our office, or give us a call. We are here to help you.',
    openGraph: {
        title: 'Contact NC Properties | Get In Touch',
        description: 'Contact NC Properties for all your real estate needs. Send us a message, find our office, or give us a call. We are here to help you.',
        type: 'website',
        url: '/contact-us',
    },
};

export default function ContactUsPage() {
  const contactPointSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPoint",
    "telephone": "+1-123-456-7890",
    "contactType": "customer service",
    "areaServed": "ZA",
    "availableLanguage": "en"
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
                    <MapPin className="h-6 w-6 text-brand-bright mt-1" />
                    <div>
                      <h4 className="font-semibold">Our Office</h4>
                      <p className="text-muted-foreground">123 Property Avenue, Suite 100<br/>Realty City, RC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-brand-bright mt-1" />
                    <div>
                      <h4 className="font-semibold">Email Us</h4>
                      <a href="mailto:contact@ncproperties.com" className="text-muted-foreground hover:text-brand-bright transition-colors">contact@ncproperties.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-brand-bright mt-1" />
                    <div>
                      <h4 className="font-semibold">Call Us</h4>
                      <a href="tel:+1234567890" className="text-muted-foreground hover:text-brand-bright transition-colors">(123) 456-7890</a>
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
