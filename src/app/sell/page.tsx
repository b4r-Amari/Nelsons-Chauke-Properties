
import type { Metadata } from "next";
import { SellForm } from "@/components/shared/sell-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Step, StepIcon, StepLabel, StepDescription, StepContent } from "@/components/shared/stepper";
import { Home, Calculator, FileText, Handshake } from "lucide-react";

export const metadata: Metadata = {
    title: 'Sell Your Property with NC Properties | Free Valuation',
    description: 'Thinking of selling your property? Get a free, no-obligation valuation from our expert real estate agents and learn about our seamless selling process.',
    openGraph: {
        title: 'Sell Your Property with NC Properties | Free Valuation',
        description: 'Thinking of selling your property? Get a free, no-obligation valuation from our expert real estate agents and learn about our seamless selling process.',
        type: 'website',
        url: '/sell',
    },
};

const sellingProcess = [
  {
    icon: Home,
    title: "Step 1: Request a Valuation",
    description: "Start by filling out our simple online form. Provide us with your contact details and some basic information about your property. This initial step is quick, easy, and completely obligation-free."
  },
  {
    icon: Calculator,
    title: "Step 2: Expert Consultation & Market Analysis",
    description: "One of our local property experts will contact you to arrange a convenient time to visit your property. We'll conduct a thorough assessment and prepare a detailed Comparative Market Analysis (CMA) to determine the most accurate, competitive market value for your home."
  },
  {
    icon: FileText,
    title: "Step 3: Mandate & Marketing Strategy",
    description: "Once you're ready to proceed, we'll sign a mandate and craft a tailored marketing strategy for your property. This includes professional photography, compelling property descriptions, and listing your home on all major property portals to ensure maximum exposure."
  },
  {
    icon: Handshake,
    title: "Step 4: Viewings, Offers & Closing the Sale",
    description: "We manage all buyer viewings, handle negotiations on your behalf, and guide you through the offer and acceptance process. Our team will work tirelessly to secure the best possible price and ensure a smooth, successful closing."
  }
];

export default function SellPage() {
  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Sell Your Property with Confidence</h1>
          <p className="text-lg mt-2 text-white/80 max-w-3xl mx-auto">Partner with NC Properties for a seamless, professional, and rewarding selling experience. Let's start the journey together.</p>
        </div>
      </section>

      <main className="py-24 bg-background">
        <div className="container grid lg:grid-cols-2 gap-16 items-start">
            <div>
                 <h2 className="text-3xl font-bold font-headline mb-8 text-brand-deep">Our Simple 4-Step Selling Process</h2>
                 <div className="space-y-8">
                    {sellingProcess.map((step, index) => (
                      <Step key={index}>
                        <StepIcon><step.icon className="h-6 w-6"/></StepIcon>
                        <div>
                          <StepLabel>{step.title}</StepLabel>
                          <StepDescription>{step.description}</StepDescription>
                        </div>
                      </Step>
                    ))}
                 </div>
            </div>
            <div>
                <Card className="shadow-lg sticky top-24">
                    <CardHeader>
                    <CardTitle className="font-headline text-3xl">Request Your Free Valuation</CardTitle>
                    <CardDescription>Fill in your details below to get started. An expert agent will be in touch with you shortly to discuss your property.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <SellForm />
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
    </>
  )
}
