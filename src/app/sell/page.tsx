
import type { Metadata } from "next";
import { SellForm } from "@/components/shared/sell-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
    title: 'Sell Your Property with NC Properties | Free Valuation',
    description: 'Thinking of selling your property? Get a free, no-obligation valuation from our expert real estate agents. Start the process online today.',
    openGraph: {
        title: 'Sell Your Property with NC Properties | Free Valuation',
        description: 'Thinking of selling your property? Get a free, no-obligation valuation from our expert real estate agents. Start the process online today.',
        type: 'website',
        url: '/sell',
    },
};

export default function SellPage() {
  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Sell Your Property</h1>
          <p className="text-lg mt-2 text-white/80">Get a free, no-obligation valuation from our expert team.</p>
        </div>
      </section>

      <main className="py-24 bg-background">
        <div className="container max-w-4xl">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Property Valuation Request</CardTitle>
              <CardDescription>Fill in the details below to start the process. The more information you provide, the more accurate our valuation will be.</CardDescription>
            </CardHeader>
            <CardContent>
              <SellForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
