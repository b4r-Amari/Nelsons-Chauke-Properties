
import { AffordabilityCalculator } from '@/components/shared/calculators/affordability-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home Loan Affordability Calculator | NC Properties',
    description: 'Determine how much you can afford to borrow for a home loan based on your monthly income and expenses.',
};

export default function AffordabilityCalculatorPage() {
    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Affordability Calculator</h1>
                    <p className="text-lg mt-2 text-white/80">Find out what you can afford to buy.</p>
                </div>
            </section>
            <main className="py-24 bg-background">
                <div className="container max-w-4xl">
                    <AffordabilityCalculator />
                </div>
            </main>
        </>
    );
}
