
import { MortgageBondCalculator } from '@/components/shared/calculators/mortgage-bond-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mortgage Bond Cost Calculator | NC Properties',
    description: 'Calculate the total cost of your mortgage bond over the loan term, including principal and total interest payments.',
};

export default function MortgageBondCalculatorPage() {
    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Mortgage Bond Calculator</h1>
                    <p className="text-lg mt-2 text-white/80">Understand the total cost of your bond.</p>
                </div>
            </section>
            <main className="py-24 bg-background">
                <div className="container max-w-4xl">
                    <MortgageBondCalculator />
                </div>
            </main>
        </>
    );
}
