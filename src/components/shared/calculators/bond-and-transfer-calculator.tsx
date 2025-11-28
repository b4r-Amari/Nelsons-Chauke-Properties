
"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(value);
};

// Transfer duty brackets (2024, for natural persons)
const transferDutyBrackets = [
    { threshold: 0, limit: 1100000, rate: 0, base: 0 },
    { threshold: 1100001, limit: 1512500, rate: 0.03, base: 0 },
    { threshold: 1512501, limit: 2117500, rate: 0.06, base: 12375 },
    { threshold: 2117501, limit: 2722500, rate: 0.08, base: 48675 },
    { threshold: 2722501, limit: 12100000, rate: 0.11, base: 97075 },
    { threshold: 12100001, limit: Infinity, rate: 0.13, base: 1128600 },
];

const formSchema = z.object({
  purchasePrice: z.number().min(50000, "Must be at least 50,000"),
  loanAmount: z.number().min(0),
  isFirstTimeBuyer: z.boolean().default(false),
});

export function BondAndTransferCalculator() {
  const [result, setResult] = useState({ transferCost: 0, bondCost: 0, totalCost: 0, transferDuty: 0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 2500000,
      loanAmount: 2000000,
      isFirstTimeBuyer: false,
    },
  });

  const calculateTransferDuty = (price: number) => {
    for (const bracket of transferDutyBrackets) {
        if (price < bracket.limit) {
            return bracket.base + (price - (bracket.threshold - 1)) * bracket.rate;
        }
    }
    return 0;
  };
  
  // Simplified fee structure for demonstration. Real fees are complex.
  const calculateAttorneyFee = (amount: number) => (amount * 0.0075) + 5000;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { purchasePrice, loanAmount, isFirstTimeBuyer } = values;

    // 1. Calculate Transfer Costs
    let transferDuty = 0;
    // First-time buyer relief applies up to R1,100,000
    if (!isFirstTimeBuyer || purchasePrice > 1100000) {
        transferDuty = calculateTransferDuty(purchasePrice);
    }
    const transferAttorneyFee = calculateAttorneyFee(purchasePrice);
    const deedsOfficeFeeTransfer = Math.min(1500 + (purchasePrice / 100000) * 5, 7000); // Simplified
    const transferCost = transferDuty + transferAttorneyFee + deedsOfficeFeeTransfer;

    // 2. Calculate Bond Registration Costs
    let bondCost = 0;
    if (loanAmount > 0) {
        const bondAttorneyFee = calculateAttorneyFee(loanAmount);
        const deedsOfficeFeeBond = Math.min(1000 + (loanAmount / 100000) * 4, 5000); // Simplified
        bondCost = bondAttorneyFee + deedsOfficeFeeBond;
    }
    
    const totalCost = transferCost + bondCost;

    setResult({ transferCost, bondCost, totalCost, transferDuty });
  };
  
  useState(() => {
    onSubmit(form.getValues());
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Bond and Transfer Cost Calculator</CardTitle>
        <CardDescription>Estimate the once-off costs associated with buying a property, including lawyer fees and government taxes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => form.handleSubmit(onSubmit)()} className="space-y-6">
              <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                <FormItem><FormLabel>Purchase Price</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="loanAmount" render={({ field }) => (
                <FormItem><FormLabel>Loan Amount (if applicable)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="isFirstTimeBuyer" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel>I am a first-time home buyer</FormLabel>
                        <FormMessage />
                    </div>
                </FormItem>
              )} />
              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep">Calculate</Button>
            </form>
          </Form>

          <div className="bg-muted/50 p-8 rounded-lg space-y-6">
            <h3 className="text-xl font-bold font-headline text-center">Estimated Total Cost</h3>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Estimated Once-Off Costs</p>
              <p className="text-4xl font-bold text-brand-bright">{formatCurrency(result.totalCost)}</p>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Transfer Costs</span>
                <span className="font-mono text-lg">{formatCurrency(result.transferCost)}</span>
              </div>
              <div className="flex justify-between items-center pl-4 text-sm">
                <span className="text-muted-foreground"> incl. Transfer Duty</span>
                <span className="font-mono text-muted-foreground">{formatCurrency(result.transferDuty)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Bond Costs</span>
                <span className="font-mono text-lg">{formatCurrency(result.bondCost)}</span>
              </div>
            </div>
             <p className="text-xs text-muted-foreground text-center pt-4">These are estimates. Your conveyancer will provide a final statement of account.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
