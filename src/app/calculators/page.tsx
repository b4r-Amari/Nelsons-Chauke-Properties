
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Metadata } from 'next';
import { HomeLoanCalculator } from '@/components/shared/calculators/home-loan-calculator';
import { AffordabilityCalculator } from '@/components/shared/calculators/affordability-calculator';
import { AdditionalPaymentCalculator } from '@/components/shared/calculators/additional-payment-calculator';
import { BondAndTransferCalculator } from '@/components/shared/calculators/bond-and-transfer-calculator';
import { cn } from '@/lib/utils';


// export const metadata: Metadata = {
//     title: 'Real Estate Calculators | NC Properties',
//     description: 'A suite of financial calculators to help you plan your property journey, from affordability and home loans to bond and transfer costs.',
// };


export default function CalculatorsPage() {
    
    const commonTabClass = "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-brand-deep text-muted-foreground text-md font-bold pb-3 px-5 rounded-none border-b-4 border-transparent data-[state=active]:border-brand-bright hover:text-brand-deep";

    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Financial Calculators</h1>
                    <p className="text-lg mt-2 text-white/80">Tools to empower your property decisions.</p>
                </div>
            </section>
            <main className="py-12 md:py-24 bg-background">
                <div className="container max-w-5xl">
                     <Tabs defaultValue="bond-repayment" className="w-full">
                        <TabsList className="flex flex-wrap justify-center bg-transparent p-0 h-auto gap-4 md:gap-8 mb-12">
                            <TabsTrigger value="bond-repayment" className={cn(commonTabClass)}>Bond Repayment</TabsTrigger>
                            <TabsTrigger value="affordability" className={cn(commonTabClass)}>Affordability</TabsTrigger>
                            <TabsTrigger value="additional-payment" className={cn(commonTabClass)}>Additional Payment</TabsTrigger>
                            <TabsTrigger value="bond-and-transfer" className={cn(commonTabClass)}>Bond and Transfer</TabsTrigger>
                        </TabsList>

                        <Card className="shadow-2xl">
                            <CardContent className="p-4 sm:p-8 md:p-12">
                                <TabsContent value="bond-repayment">
                                    <HomeLoanCalculator />
                                </TabsContent>
                                <TabsContent value="affordability">
                                    <AffordabilityCalculator />
                                </TabsContent>
                                <TabsContent value="additional-payment">
                                    <AdditionalPaymentCalculator />
                                </TabsContent>
                                <TabsContent value="bond-and-transfer">
                                    <BondAndTransferCalculator />
                                </TabsContent>
                            </CardContent>
                        </Card>
                    </Tabs>
                </div>
            </main>
        </>
    );
}
