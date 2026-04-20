
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HomeLoanCalculator } from '@/components/shared/calculators/home-loan-calculator';
import { AffordabilityCalculator } from '@/components/shared/calculators/affordability-calculator';
import { AdditionalPaymentCalculator } from '@/components/shared/calculators/additional-payment-calculator';
import { BondAndTransferCalculator } from '@/components/shared/calculators/bond-and-transfer-calculator';
import { Separator } from '@/components/ui/separator';
import { Home, Calculator, Handshake, TrendingUp, Lightbulb, ArrowRight, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CalculatorsPage() {
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
                <div className="container max-w-5xl space-y-24">
                    
                    {/* 1. Bond Repayment Calculator */}
                    <section id="bond-repayment">
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
                                        <p>Understanding your monthly repayment helps you budget effectively, avoid financial strain, and compare different property price ranges.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Inputs</h3>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Property Price</li>
                                            <li>Deposit</li>
                                            <li>Interest Rate</li>
                                            <li>Loan Term (years)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <Card className="lg:col-span-3 shadow-xl">
                                <CardContent className="p-6 md:p-8">
                                    <HomeLoanCalculator />
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    <Separator />

                    {/* 2. Affordability Calculator */}
                    <section id="affordability">
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
                                        <p>Banks assess affordability before approving a loan. This tool gives you a realistic estimate of your maximum home loan and a safe monthly repayment range.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Learn more</h3>
                                        <Link href="/blog" className="text-brand-bright font-semibold flex items-center hover:underline">
                                            What do I qualify for based on my income? <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <Separator />

                    {/* 3. Bond & Transfer Cost Calculator */}
                    <section id="bond-transfer">
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
                                        <p>Many buyers only plan for the deposit, but there are additional costs like Transfer Duty and Legal Fees that can be significant.</p>
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
                    </section>

                    <Separator />

                    {/* 4. Advanced Insights */}
                    <section id="advanced-insights">
                        <div className="mb-12 text-center">
                            <div className="flex justify-center mb-4">
                                <TrendingUp className="h-12 w-12 text-brand-bright" />
                            </div>
                            <h2 className="text-3xl font-bold font-headline text-brand-deep">Advanced Insights</h2>
                            <p className="text-muted-foreground mt-2">Take your property planning to the next level with these specialized tools.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="md:col-span-2 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-headline">Extra Payment Calculator</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <AdditionalPaymentCalculator />
                                </CardContent>
                            </Card>
                            <div className="space-y-6">
                                <Card className="bg-brand-deep text-white border-none shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-headline flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5" />
                                            Interest Rate Sensitivity
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-white/80">
                                        Understand how changes in interest rates affect your monthly repayment. Even a 0.5% change can significantly impact your long-term interest costs.
                                    </CardContent>
                                </Card>
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-headline">Investment ROI</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Estimate rental returns and long-term property value growth. Use this to determine if a buy-to-let property meets your investment criteria.
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

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
                                    Transfer duty is a tax paid to the government (SARS) whenever property ownership is transferred from one person or entity to another. The amount you pay is calculated on a sliding scale based on the property's value. In South Africa, properties below a certain threshold (currently R1,100,000) are exempt from transfer duty.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">What affects my bond approval?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    Banks consider several factors when evaluating your application:
                                    <ul className="list-disc pl-5 mt-4 space-y-2">
                                        <li><strong>Income stability:</strong> Proof of steady employment or business income.</li>
                                        <li><strong>Credit score:</strong> Your track record of managing debt responsibly.</li>
                                        <li><strong>Existing debt:</strong> Your current monthly obligations relative to your income.</li>
                                        <li><strong>Deposit size:</strong> A larger deposit reduces the bank's risk and can improve your interest rate.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">How can I improve my chances of approval?</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed">
                                    <p>Start preparing early by:</p>
                                    <ul className="list-disc pl-5 mt-4 space-y-2">
                                        <li>Reducing existing debt before applying to improve your debt-to-income ratio.</li>
                                        <li>Saving for a larger deposit (10% to 20% is ideal).</li>
                                        <li>Checking your credit report and fixing any errors.</li>
                                        <li>Maintaining a stable employment record.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* 6. Next Steps */}
                    <section id="next-steps" className="text-center space-y-12">
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
                    <div className="bg-brand-bright/10 border-l-8 border-brand-bright p-8 rounded-r-lg">
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

