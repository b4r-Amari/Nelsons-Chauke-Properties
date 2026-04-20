'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HomeLoanCalculator } from '@/components/shared/calculators/home-loan-calculator';
import { AffordabilityCalculator } from '@/components/shared/calculators/affordability-calculator';
import { AdditionalPaymentCalculator } from '@/components/shared/calculators/additional-payment-calculator';
import { BondAndTransferCalculator } from '@/components/shared/calculators/bond-and-transfer-calculator';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Calculator, Handshake, TrendingUp, Lightbulb, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CalculatorsPage() {
    const [activeTab, setActiveTab] = useState("repayment");

    return (
        <>
            <section className="bg-brand-deep text-white py-10 md:py-20">
                <div className="container text-center">
                    <h1 className="text-3xl md:text-6xl font-bold font-headline mb-4">Property Calculators</h1>
                    <p className="text-lg md:text-xl mt-2 text-white/80 max-w-3xl mx-auto px-4">
                        Make confident property decisions with our easy-to-use calculators. Plan your finances with precision.
                    </p>
                </div>
            </section>

            <main className="py-6 md:py-16 bg-background">
                <div className="container max-w-5xl">
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex justify-center mb-8 md:mb-12">
                            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted rounded-xl">
                                <TabsTrigger value="repayment" className="py-2.5 md:py-3 px-2 md:px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white text-xs sm:text-sm">
                                    <Home className="h-4 w-4 mr-2 hidden sm:inline" /> Repayment
                                </TabsTrigger>
                                <TabsTrigger value="affordability" className="py-2.5 md:py-3 px-2 md:px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white text-xs sm:text-sm">
                                    <Calculator className="h-4 w-4 mr-2 hidden sm:inline" /> Affordability
                                </TabsTrigger>
                                <TabsTrigger value="bond-transfer" className="py-2.5 md:py-3 px-2 md:px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white text-xs sm:text-sm">
                                    <Handshake className="h-4 w-4 mr-2 hidden sm:inline" /> Transfer Costs
                                </TabsTrigger>
                                <TabsTrigger value="extra-payment" className="py-2.5 md:py-3 px-2 md:px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white text-xs sm:text-sm">
                                    <TrendingUp className="h-4 w-4 mr-2 hidden sm:inline" /> Extra Payment
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* 1. Bond Repayment Calculator */}
                        <TabsContent value="repayment" className="focus-visible:ring-0">
                            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-start">
                                <div className="lg:col-span-2 space-y-4 md:space-y-6 px-1">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <Home className="h-6 w-6 md:h-8 md:w-8" />
                                        <h2 className="text-2xl md:text-3xl font-bold font-headline text-brand-deep">Bond Repayment</h2>
                                    </div>
                                    <div className="space-y-4 text-sm md:text-base text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">What this does</h3>
                                            <p>Estimates your monthly home loan repayment based on price, deposit, rate, and term.</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <h3 className="font-bold text-foreground">Why it matters</h3>
                                            <p>Helps you budget effectively and compare price ranges.</p>
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => setActiveTab('bond-transfer')}
                                                className="text-brand-bright font-semibold flex items-center hover:underline text-left"
                                            >
                                                View transfer cost breakdown <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Card className="lg:col-span-3 shadow-lg md:shadow-xl border-none sm:border">
                                    <CardContent className="p-4 md:p-8">
                                        <HomeLoanCalculator onTabChange={setActiveTab} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* 2. Affordability Calculator */}
                        <TabsContent value="affordability" className="focus-visible:ring-0">
                            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-start">
                                <Card className="lg:col-span-3 shadow-lg md:shadow-xl order-2 lg:order-1 border-none sm:border">
                                    <CardContent className="p-4 md:p-8">
                                        <AffordabilityCalculator />
                                    </CardContent>
                                </Card>
                                <div className="lg:col-span-2 space-y-4 md:space-y-6 order-1 lg:order-2 px-1">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <Calculator className="h-6 w-6 md:h-8 md:w-8" />
                                        <h2 className="text-2xl md:text-3xl font-bold font-headline text-brand-deep">Affordability</h2>
                                    </div>
                                    <div className="space-y-4 text-sm md:text-base text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">What this does</h3>
                                            <p>Estimates how much you can afford to borrow based on your income and expenses.</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <h3 className="font-bold text-foreground">Why it matters</h3>
                                            <p>Banks assess affordability before approving a loan. This gives you a realistic estimate.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* 3. Bond & Transfer Cost Calculator */}
                        <TabsContent value="bond-transfer" className="focus-visible:ring-0">
                            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-start">
                                <div className="lg:col-span-2 space-y-4 md:space-y-6 px-1">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <Handshake className="h-6 w-6 md:h-8 md:w-8" />
                                        <h2 className="text-2xl md:text-3xl font-bold font-headline text-brand-deep">Transfer Costs</h2>
                                    </div>
                                    <div className="space-y-4 text-sm md:text-base text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">What this does</h3>
                                            <p>Estimates all upfront costs involved when purchasing a property.</p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <h3 className="font-bold text-foreground">Costs included</h3>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Transfer Duty (tax)</li>
                                                <li>Registration Fees</li>
                                                <li>Conveyancing Fees</li>
                                                <li>Deeds Office Fees</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    <BondAndTransferCalculator />
                                </div>
                            </div>
                        </TabsContent>

                        {/* 4. Extra Payment Calculator */}
                        <TabsContent value="extra-payment" className="focus-visible:ring-0">
                            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-start">
                                <div className="lg:col-span-3 order-2 lg:order-1">
                                    <Card className="shadow-lg md:shadow-xl border-none sm:border">
                                        <CardContent className="p-4 md:p-8">
                                            <AdditionalPaymentCalculator />
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="lg:col-span-2 space-y-4 md:space-y-6 order-1 lg:order-2 px-1">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />
                                        <h2 className="text-2xl md:text-3xl font-bold font-headline text-brand-deep">Extra Payments</h2>
                                    </div>
                                    <div className="space-y-4 text-sm md:text-base text-muted-foreground">
                                        <div>
                                            <p>See how making extra payments can save you significant interest and shorten your loan term.</p>
                                        </div>
                                        <Card className="bg-brand-deep text-white border-none shadow-md">
                                            <CardHeader className="p-4 pb-2">
                                                <CardTitle className="text-base md:text-lg font-headline flex items-center gap-2">
                                                    <TrendingUp className="h-4 w-4" />
                                                    Rate Sensitivity
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 text-xs md:text-sm text-white/80">
                                                A 0.5% change can significantly impact your long-term interest costs.
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Separator className="my-12 md:my-20" />

                    {/* 5. Helpful Guides */}
                    <section id="guides" className="bg-card p-5 md:p-10 rounded-xl md:rounded-2xl shadow-sm border mx-1">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <Lightbulb className="h-6 w-6 md:h-8 md:w-8 text-brand-bright" />
                            <h2 className="text-2xl md:text-3xl font-bold font-headline text-brand-deep">Helpful Guides</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-b">
                                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4">What is Transfer Duty?</AccordionTrigger>
                                <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Transfer duty is a tax paid to SARS when you buy a property. It's usually payable before transfer. The amount depends on the property value; lower-value properties may be exempt.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-b">
                                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4">What affects my bond approval?</AccordionTrigger>
                                <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Banks look at income stability, credit record, and existing debt. Lenders want to ensure you can manage repayments comfortably over time.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-none">
                                <AccordionTrigger className="text-base md:text-lg font-semibold hover:no-underline py-4">How can I improve my chances?</AccordionTrigger>
                                <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    Reduce existing debt, maintain a good credit record, and save for a larger deposit to lower your borrowing amount and risk profile.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* 6. Next Steps */}
                    <section id="next-steps" className="mt-16 md:mt-24 text-center space-y-8 md:space-y-12">
                         <h2 className="text-2xl md:text-3xl font-bold font-headline text-brand-deep px-4">🚀 Next Steps</h2>
                         <div className="grid gap-4 sm:grid-cols-3 px-1">
                            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-3 border-2 hover:border-brand-bright hover:bg-brand-bright/5 whitespace-normal">
                                <Link href="/properties">
                                    <Building className="h-6 w-6 text-brand-bright" />
                                    <div>
                                        <p className="font-bold text-sm md:text-base">View Properties</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground">Within your budget</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-3 border-2 hover:border-brand-bright hover:bg-brand-bright/5 whitespace-normal">
                                <Link href="/contact-us">
                                    <CheckCircle2 className="h-6 w-6 text-brand-bright" />
                                    <div>
                                        <p className="font-bold text-sm md:text-base">Get Pre-Qualified</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground">For a home loan</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-auto py-6 flex-col gap-3 border-2 hover:border-brand-bright hover:bg-brand-bright/5 whitespace-normal">
                                <Link href="/contact-us">
                                    <Handshake className="h-6 w-6 text-brand-bright" />
                                    <div>
                                        <p className="font-bold text-sm md:text-base">Speak to an Agent</p>
                                        <p className="text-[10px] md:text-xs text-muted-foreground">Personalised advice</p>
                                    </div>
                                </Link>
                            </Button>
                         </div>
                    </section>
                </div>
            </main>
        </>
    );
}