
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Real Estate Calculators | NC Properties',
    description: 'A suite of financial calculators to help you plan your property journey, from affordability and home loans to bond and transfer costs.',
};

const calculatorLinks = [
    {
        href: '/calculators/home-loan',
        title: 'Home Loan Calculator',
        description: 'Estimate your monthly repayments on a home loan based on the property price, deposit, interest rate, and loan term.',
    },
    {
        href: '/calculators/mortgage-bond',
        title: 'Mortgage Bond Calculator',
        description: 'Calculate the total cost of your mortgage bond over the entire loan term, including total interest paid.',
    },
    {
        href: '/calculators/affordability',
        title: 'Affordability Calculator',
        description: 'Determine the maximum home loan you could qualify for based on your monthly income and expenses.',
    },
    {
        href: '/calculators/additional-payment',
        title: 'Additional Payment Calculator',
        description: 'See how making extra payments on your home loan can help you save on interest and pay it off sooner.',
    },
    {
        href: '/calculators/bond-and-transfer',
        title: 'Bond & Transfer Cost Calculator',
        description: 'Calculate the estimated bond registration and property transfer costs, including attorney fees and transfer duty.',
    },
];

export default function CalculatorsPage() {
    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Financial Calculators</h1>
                    <p className="text-lg mt-2 text-white/80">Tools to empower your property decisions.</p>
                </div>
            </section>
            <main className="py-24 bg-background">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {calculatorLinks.map((calc) => (
                            <Link href={calc.href} key={calc.href} className="group block">
                                <Card className="h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-brand-bright/10 p-3 rounded-full">
                                                <Calculator className="h-6 w-6 text-brand-bright" />
                                            </div>
                                            <CardTitle className="font-headline text-xl text-brand-deep group-hover:text-brand-bright transition-colors">{calc.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <CardDescription>{calc.description}</CardDescription>
                                    </CardContent>
                                    <div className="p-6 pt-0">
                                        <span className="font-semibold text-brand-bright flex items-center gap-2">
                                            Open Calculator <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
