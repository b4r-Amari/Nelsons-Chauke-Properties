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
            <section className="bg-brand-deep text-white py-16 md:py-24">
                <div className="container text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">Property Calculators</h1>
                    <p className="text-xl mt-2 text-white/80 max-w-3xl mx-auto">
                        Make confident property decisions with our easy-to-use calculators. Whether you're buying your first home, investing, or upgrading, these tools will help you understand your finances and plan ahead.
                    </p>
                </div>
            </section>

            <main className="py-12 md:py-24 bg-background">
                <div className="container max-w-5xl">
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex justify-center mb-12">
                            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-muted rounded-xl">
                                <TabsTrigger value="repayment" className="py-3 px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white">
                                    <Home className="h-4 w-4 mr-2 hidden sm:inline" /> Repayment
                                </TabsTrigger>
                                <TabsTrigger value="affordability" className="py-3 px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white">
                                    <Calculator className="h-4 w-4 mr-2 hidden sm:inline" /> Affordability
                                </TabsTrigger>
                                <TabsTrigger value="bond-transfer" className="py-3 px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white">
                                    <Handshake className="h-4 w-4 mr-2 hidden sm:inline" /> Transfer Costs
                                </TabsTrigger>
                                <TabsTrigger value="extra-payment" className="py-3 px-4 rounded-lg data-[state=active]:bg-brand-bright data-[state=active]:text-white">
                                    <TrendingUp className="h-4 w-4 mr-2 hidden sm:inline" /> Extra Payment
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* 1. Bond Repayment Calculator */}
                        <TabsContent value="repayment">
                            <div className="grid lg:grid-cols-5 gap-12 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <Home className="h-8 w-8" />
                                        <h2 className="text-3xl font-bold font-headline text-brand-deep">Bond Repayment Calculator</h2>
                                    </div>
                                    <div className="space-y-4 text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">What this does</h3>
                                            <p>This calculator estimates your monthly home loan repayment based on the property price, deposit, interest rate, and loan term.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Why it matters</h3>
                                            <p>Understanding your monthly repayment helps you budget effectively and compare different property price ranges.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Learn more</h3>
                                            <button 
                                                onClick={() => setActiveTab('bond-transfer')}
                                                className="text-brand-bright font-semibold flex items-center hover:underline text-left"
                                            >
                                                View bond and transfer cost breakdown <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <Card className="lg:col-span-3 shadow-xl">
                                    <CardContent className="p-6 md:p-8">
                                        <HomeLoanCalculator onTabChange={setActiveTab} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* 2. Affordability Calculator */}
                        <TabsContent value="affordability">
                            <div className="grid lg:grid-cols-5 gap-12 items-start">
                                <Card className="lg:col-span-3 shadow-xl order-2 lg:order-1">
                                    <CardContent className="p-6 md:p-8">
                                        <AffordabilityCalculator />
                                    </CardContent>
                                </Card>
                                <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <Calculator className="h-8 w-8" />
                                        <h2 className="text-3xl font-bold font-headline text-brand-deep">Affordability Calculator</h2>
                                    </div>
                                    <div className="space-y-4 text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">What this does</h3>
                                            <p>This calculator estimates how much you can afford to borrow based on your income and expenses.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Why it matters</h3>
                                            <p>Banks assess affordability before approving a loan. This tool gives you a realistic estimate of your maximum home loan.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Learn more</h3>
                                            <button 
                                                onClick={() => setActiveTab('affordability')}
                                                className="text-brand-bright font-semibold flex items-center hover:underline text-left"
                                            >
                                                What do I qualify for based on my income? <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* 3. Bond & Transfer Cost Calculator */}
                        <TabsContent value="bond-transfer">
                            <div className="grid lg:grid-cols-5 gap-12 items-start">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <Handshake className="h-8 w-8" />
                                        <h2 className="text-3xl font-bold font-headline text-brand-deep">Bond & Transfer Cost Calculator</h2>
                                    </div>
                                    <div className="space-y-4 text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">What this does</h3>
                                            <p>This calculator estimates all upfront costs involved when purchasing a property.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Why it matters</h3>
                                            <p>Many buyers only plan for the deposit, but additional costs like Transfer Duty and Legal Fees can be significant.</p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Costs included</h3>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Transfer Duty (government tax)</li>
                                                <li>Bond Registration Fees</li>
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
                        <TabsContent value="extra-payment">
                            <div className="grid lg:grid-cols-5 gap-12 items-start">
                                <div className="lg:col-span-3 order-2 lg:order-1">
                                    <Card className="shadow-xl">
                                        <CardContent className="p-6 md:p-8">
                                            <AdditionalPaymentCalculator />
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
                                    <div className="flex items-center gap-3 text-brand-bright">
                                        <TrendingUp className="h-8 w-8" />
                                        <h2 className="text-3xl font-bold font-headline text-brand-deep">Advanced Insights</h2>
                                    </div>
                                    <div className="space-y-4 text-muted-foreground">
                                        <div>
                                            <h3 className="font-bold text-foreground">Extra Payment Calculator</h3>
                                            <p>See how making extra payments on your home loan can save you a significant amount of interest and shorten your loan term.</p>
                                        </div>
                                        <Card className="bg-brand-deep text-white border-none shadow-lg">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg font-headline flex items-center gap-2">
                                                    <TrendingUp className="h-5 w-5" />
                                                    Interest Rate Sensitivity
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="text-sm text-white/80">
                                                Understand how changes in interest rates affect your monthly repayment. Even a 0.5% change can significantly impact your long-term interest costs.
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <Separator className="my-24" />

                    {/* 5. Helpful Guides */}
                    <section id="guides" className="bg-card p-8 md:p-12 rounded-2xl shadow-inner border">
                        <div className="flex items-center gap-3 mb-8">
                            <Lightbulb className="h-8 w-8 text-brand-bright" />
                            <h2 className="text-3xl font-bold font-headline text-brand-deep">Helpful Guides</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">What is Transfer Duty?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Transfer duty is a tax paid to the government (SARS) whenever property ownership is transferred. In South Africa, properties below a certain threshold (currently R1,100,000) are exempt from transfer duty.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">What affects my bond approval?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Banks consider income stability, credit score, existing debt, and deposit size when evaluating your application.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">How can I improve my chances of approval?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    <p>Start preparing early by reducing existing debt, saving for a larger deposit (10% to 20% is ideal), and checking your credit report.</p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* 6. Next Steps */}
                    <section id="next-steps" className="mt-24 text-center space-y-12">
                         <h2 className="text-3xl font-bold font-headline text-brand-deep">🚀 Next Steps</h2>
                         <div className="grid sm:grid-cols-3 gap-6">
                            <Button asChild size="lg" variant="outline" className="h-auto py-8 flex-col gap-4 border-2 hover:border-brand-bright hover:bg-brand-bright/5">
                                <Link href="/properties">
                                    <Building className="h-8 w-8 text-brand-bright" />
                                    <div className="text-center">
                                        <p className="font-bold">View Properties</p>
                                        <p className="text-xs text-muted-foreground">Within your budget</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-auto py-8 flex-col gap-4 border-2 hover:border-brand-bright hover:bg-brand-bright/5">
                                <Link href="/contact-us">
                                    <CheckCircle2 className="h-8 w-8 text-brand-bright" />
                                    <div className="text-center">
                                        <p className="font-bold">Get Pre-Qualified</p>
                                        <p className="text-xs text-muted-foreground">For a home loan</p>
                                    </div>
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-auto py-8 flex-col gap-4 border-2 hover:border-brand-bright hover:bg-brand-bright/5">
                                <Link href="/contact-us">
                                    <Handshake className="h-8 w-8 text-brand-bright" />
                                    <div className="text-center">
                                        <p className="font-bold">Speak to an Agent</p>
                                        <p className="text-xs text-muted-foreground">Personalised advice</p>
                                    </div>
                                </Link>
                            </Button>
                         </div>
                    </section>

                    {/* 7. Pro Tip */}
                    <div className="mt-24 bg-brand-bright/10 border-l-8 border-brand-bright p-8 rounded-r-lg">
                        <div className="flex items-start gap-4">
                            <Lightbulb className="h-10 w-10 text-brand-bright shrink-0 mt-1" />
                            <div>
                                <h4 className="text-xl font-bold text-brand-deep mb-2">💡 Pro Tip</h4>
                                <p className="text-muted-foreground">
                                    Use multiple calculators together for the best results: Start with <strong>affordability</strong> to set your budget, then check <strong>repayment estimates</strong> for specific listings, and finally calculate <strong>full purchase costs</strong> to ensure you have enough cash for the transfer.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
}
