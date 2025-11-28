
import { HomeLoanCalculator } from '@/components/shared/calculators/home-loan-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home Loan Repayment Calculator | NC Properties',
    description: 'Calculate your estimated monthly home loan repayments, total payment, and total interest payable with our easy-to-use calculator.',
};

export default function HomeLoanCalculatorPage() {
    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Home Loan Calculator</h1>
                    <p className="text-lg mt-2 text-white/80">Estimate your monthly repayments.</p>
                </div>
            </section>
            <main className="py-24 bg-background">
                <div className="container max-w-4xl">
                    <HomeLoanCalculator />
                </div>
            </main>
        </>
    );
}
