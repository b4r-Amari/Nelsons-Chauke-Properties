
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"

type CalculationResults = {
  transferDuty: number;
  bondRegistrationCost: number;
  propertyTransferCost: number;
  totalOnceOffCosts: number;
  monthlyRepayment: number;
};

const formSchema = z.object({
  purchasePrice: z.preprocess((a) => parseInt(z.string().parse(a)), z.number().positive("Purchase price must be a positive number")),
  loanTerm: z.preprocess((a) => parseInt(z.string().parse(a)), z.number().positive("Loan term must be a positive number")),
  interestRate: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Interest rate must be a positive number")),
});

type FormValues = z.infer<typeof formSchema>;

export function BondAndTransferCalculator() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    purchasePrice: 2000000,
    loanTerm: 20,
    interestRate: 10.5,
  }});

  const [results, setResults] = useState<CalculationResults | null>(null);

  function onSubmit(values: FormValues) {
    const { purchasePrice, loanTerm, interestRate } = values;

    // Transfer Duty Calculation
    let transferDuty = 0;
    if (purchasePrice > 1100000 && purchasePrice <= 1512500) {
        transferDuty = (purchasePrice - 1100000) * 0.03;
    } else if (purchasePrice > 1512500 && purchasePrice <= 2117500) {
        transferDuty = 12375 + (purchasePrice - 1512500) * 0.06;
    } else if (purchasePrice > 2117500 && purchasePrice <= 2722500) {
        transferDuty = 48675 + (purchasePrice - 2117500) * 0.08;
    } else if (purchasePrice > 2722500 && purchasePrice <= 12100000) {
        transferDuty = 97075 + (purchasePrice - 2722500) * 0.11;
    } else if (purchasePrice > 12100000) {
        transferDuty = 1131600 + (purchasePrice - 12100000) * 0.13;
    }

    // Bond Registration Cost Calculation (Simplified)
    const bondRegistrationCost = 5000 + (purchasePrice * 0.005); 

    // Property Transfer Cost Calculation (Simplified)
    const propertyTransferCost = 5000 + (purchasePrice * 0.007);

    const totalOnceOffCosts = transferDuty + bondRegistrationCost + propertyTransferCost;

    // Monthly Repayment Calculation
    const P = purchasePrice;
    const i = (interestRate / 100) / 12;
    const n = loanTerm * 12;
    const monthlyRepayment = P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

    setResults({
        transferDuty,
        bondRegistrationCost,
        propertyTransferCost,
        totalOnceOffCosts,
        monthlyRepayment
    });
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
  };

  return (
    <Card className="max-w-lg mx-auto">
       <CardHeader>
        <CardTitle>Bond & Transfer Cost Calculator</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price (ZAR)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loanTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Term (Years)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch">
            <Button type="submit" className="w-full bg-brand-deep hover:bg-brand-deep/90">Calculate</Button>
            {results && (
              <div className="mt-6 w-full text-sm">
                <h3 className="text-lg font-semibold mb-3 text-center">Estimated Costs</h3>
                <Separator className="mb-4" />
                <div className="space-y-2">
                    <div className="flex justify-between"><span>Monthly Repayment:</span> <span className="font-medium">{formatCurrency(results.monthlyRepayment)}</span></div>
                    <Separator className="my-1" />
                    <div className="flex justify-between"><span>Transfer Duty:</span> <span>{formatCurrency(results.transferDuty)}</span></div>
                    <div className="flex justify-between"><span>Bond Registration:</span> <span>{formatCurrency(results.bondRegistrationCost)}</span></div>
                    <div className="flex justify-between"><span>Property Transfer:</span> <span>{formatCurrency(results.propertyTransferCost)}</span></div>
                     <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-base"><span>Total Once-off Costs:</span> <span>{formatCurrency(results.totalOnceOffCosts)}</span></div>
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
