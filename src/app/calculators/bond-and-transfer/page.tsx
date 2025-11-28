
import { BondAndTransferCalculator } from '@/components/shared/calculators/bond-and-transfer-calculator';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Bond and Transfer Cost Calculator | NC Properties',
    description: 'Estimate the bond registration and property transfer costs involved when buying a property in South Africa.',
};

export default function BondAndTransferCalculatorPage() {
    return (
        <>
            <section className="bg-brand-deep text-white py-16">
                <div className="container text-center">
                    <h1 className="text-4xl font-bold font-headline">Bond & Transfer Cost Calculator</h1>
                    <p className="text-lg mt-2 text-white/80">Calculate your once-off purchasing costs.</p>
                </div>
            </section>
            <main className="py-24 bg-background">
                <div className="container max-w-4xl">
                    <BondAndTransferCalculator />
                </div>
            </main>
        </>
    );
}
