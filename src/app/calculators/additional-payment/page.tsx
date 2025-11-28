
import { AdditionalPaymentCalculator } from '@/components/shared/calculators/additional-payment-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Additional Payment Calculator | NC Properties',
    description: 'Calculate how much interest you can save and how much sooner you can pay off your home loan by making additional payments.',
};

export default function AdditionalPaymentCalculatorPage() {
    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Additional Payment Calculator</h1>
                    <p className="text-lg mt-2 text-white/80">See how extra payments can save you thousands.</p>
                </div>
            </section>
            <main className="py-24 bg-background">
                <div className="container max-w-4xl">
                    <AdditionalPaymentCalculator />
                </div>
            </main>
        </>
    );
}
