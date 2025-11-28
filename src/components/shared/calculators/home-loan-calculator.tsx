
"use client"

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const formSchema = z.object({
  purchasePrice: z.coerce.number().min(50000, "Must be at least 50,000"),
  deposit: z.coerce.number().min(0).optional(),
  interestRate: z.coerce.number().min(0.1, "Must be a positive rate"),
  loanTerm: z.coerce.number().min(1).max(30),
});

type FormData = z.infer<typeof formSchema>;

// Constants for calculation
const transferDutyBrackets = [
    { threshold: 0, limit: 1100000, rate: 0, base: 0 },
    { threshold: 1100001, limit: 1512500, rate: 0.03, base: 0 },
    { threshold: 1512501, limit: 2117500, rate: 0.06, base: 12375 },
    { threshold: 2117501, limit: 2722500, rate: 0.08, base: 97075 },
    { threshold: 2722501, limit: 12100000, rate: 0.11, base: 97075 },
    { threshold: 12100001, limit: Infinity, rate: 0.13, base: 1128600 },
];

const calculateTransferDuty = (price: number) => {
    for (const bracket of transferDutyBrackets) {
        if (price <= bracket.limit) {
            return bracket.base + (price - (bracket.threshold > 0 ? bracket.threshold -1 : 0)) * bracket.rate;
        }
    }
    return 0;
};
  
const calculateAttorneyFee = (amount: number) => (amount * 0.0075) + 5000;


export function HomeLoanCalculator() {
  const [result, setResult] = useState({
    monthlyPayment: 0,
    onceOffCosts: 0,
    deposit: 0,
    bondRegistration: 0,
    propertyTransfer: 0,
    grossIncomeRequired: 0,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 1000000,
      deposit: 0,
      interestRate: 11.75,
      loanTerm: 20,
    },
  });

  const calculateResults = useCallback((values: FormData) => {
    const { purchasePrice, deposit = 0, interestRate, loanTerm } = values;
    const loanAmount = purchasePrice - deposit;
    
    // Monthly Payment
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = loanAmount > 0 && monthlyInterestRate > 0
      ? loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      : 0;

    // Once-off Costs
    const transferDuty = calculateTransferDuty(purchasePrice);
    const transferAttorneyFee = calculateAttorneyFee(purchasePrice);
    const deedsOfficeFeeTransfer = Math.min(1500 + (purchasePrice / 100000) * 5, 7000);
    const propertyTransfer = transferDuty + transferAttorneyFee + deedsOfficeFeeTransfer;
    
    const bondAttorneyFee = calculateAttorneyFee(loanAmount);
    const deedsOfficeFeeBond = Math.min(1000 + (loanAmount / 100000) * 4, 5000);
    const bondRegistration = loanAmount > 0 ? bondAttorneyFee + deedsOfficeFeeBond : 0;
    
    const onceOffCosts = deposit + bondRegistration + propertyTransfer;

    // Gross Income Required (assuming bond repayment is ~30% of gross income)
    const grossIncomeRequired = monthlyPayment / 0.3;

    setResult({
      monthlyPayment,
      onceOffCosts,
      deposit,
      bondRegistration,
      propertyTransfer,
      grossIncomeRequired,
    });
  }, []);

  useEffect(() => {
    const subscription = form.watch((values) => {
      calculateResults(values as FormData);
    });
    calculateResults(form.getValues());
    return () => subscription.unsubscribe();
  }, [form, calculateResults]);

  return (
    <div>
        <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8">Calculate your monthly bond repayments</h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Form {...form}>
                <form className="space-y-6">
                    <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Purchase Price</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                    <Input type="text" {...field} onChange={e => field.onChange(Number(e.target.value.replace(/\s/g, '')))} value={field.value.toLocaleString('en-ZA')} className="pl-8" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="deposit" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Deposit (Optional)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                    <Input type="text" {...field} onChange={e => field.onChange(Number(e.target.value.replace(/\s/g, '')))} value={(field.value || 0).toLocaleString('en-ZA')} className="pl-8" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="interestRate" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Interest Rate</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type="number" {...field} step="0.01" className="pr-8" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="loanTerm" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Loan Term</FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select loan term" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[...Array(30)].map((_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} year{i > 0 && 's'}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </form>
            </Form>

            <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b">
                    <span className="font-semibold text-lg">Monthly Bond Repayment</span>
                    <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.monthlyPayment)}</span>
                </div>

                <div className="space-y-4 py-4 border-b">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Once-off Costs</span>
                        <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.onceOffCosts)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                        <span>Deposit</span>
                        <span>{formatCurrency(result.deposit)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                        <span>Bond Registration</span>
                        <span>{formatCurrency(result.bondRegistration)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                        <span className="flex items-center gap-2">Property Transfer 
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Info className="h-4 w-4 text-brand-deep cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Includes transfer duty and attorney fees.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </span>
                        <span>{formatCurrency(result.propertyTransfer)}</span>
                    </div>
                    <a href="#" className="text-sm text-brand-bright hover:underline pl-4">View bond and transfer cost breakdown</a>
                </div>

                 <div className="py-4">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Gross Monthly Income Required</span>
                        <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.grossIncomeRequired)}</span>
                    </div>
                    <a href="#" className="text-sm text-brand-bright hover:underline">What do I qualify for based on my income?</a>
                </div>
            </div>
        </div>
    </div>
  );
}
