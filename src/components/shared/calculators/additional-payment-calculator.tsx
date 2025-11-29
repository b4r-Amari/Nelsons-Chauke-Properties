
"use client"

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

const formSchema = z.object({
  loanAmount: z.coerce.number().min(50000, "Must be at least 50,000"),
  interestRate: z.coerce.number().min(0.1, "Must be a positive rate"),
  loanTerm: z.coerce.number().min(1).max(30),
  additionalPayment: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AdditionalPaymentCalculator() {
  const [result, setResult] = useState({
    interestSaved: 0,
    yearsSaved: "0",
    newTotalPayment: 0,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 1000000,
      interestRate: 11.75,
      loanTerm: 20,
      additionalPayment: 1000,
    },
  });

  const calculateResults = useCallback((values: FormData) => {
    const { loanAmount, loanTerm, interestRate, additionalPayment = 0 } = values;
    const monthlyInterestRate = interestRate / 100 / 12;
    const originalNumberOfPayments = loanTerm * 12;

    if (loanAmount <= 0 || monthlyInterestRate <= 0) {
        setResult({ interestSaved: 0, yearsSaved: "0", newTotalPayment: 0 });
        return;
    }

    const originalMonthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, originalNumberOfPayments)) / (Math.pow(1 + monthlyInterestRate, originalNumberOfPayments) - 1);
    const originalTotalPayment = originalMonthlyPayment * originalNumberOfPayments;

    const newMonthlyPayment = originalMonthlyPayment + additionalPayment;
    
    if (newMonthlyPayment <= 0 || additionalPayment <= 0) {
        setResult({ interestSaved: 0, yearsSaved: "0", newTotalPayment: originalTotalPayment });
        return;
    }
    
    const newNumberOfPayments = -(Math.log(1 - (loanAmount * monthlyInterestRate) / newMonthlyPayment) / Math.log(1 + monthlyInterestRate));
    const newTotalPayment = newMonthlyPayment * newNumberOfPayments;

    const interestSaved = originalTotalPayment - newTotalPayment;
    
    const monthsSavedRaw = originalNumberOfPayments - newNumberOfPayments;
    const years = Math.floor(monthsSavedRaw / 12);
    const months = Math.round(monthsSavedRaw % 12);
    const yearsSaved = `${years} years, ${months} months`;

    setResult({ interestSaved: interestSaved > 0 ? interestSaved : 0, yearsSaved, newTotalPayment });
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
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">See what you'll save with extra payments</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Discover how making extra payments on your home loan can save you a significant amount of interest and shorten your loan term. Enter an additional monthly payment amount to see the long-term financial benefits.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Form {...form}>
                <form className="space-y-6">
                    <FormField control={form.control} name="loanAmount" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Outstanding Loan Amount</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                    <Input type="text" {...field} onChange={e => field.onChange(Number(e.target.value.replace(/\s/g, '')))} value={field.value.toLocaleString('en-ZA')} className="pl-8" />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="additionalPayment" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Additional Monthly Payment</FormLabel>
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
                            <FormLabel className="text-brand-deep font-semibold">Remaining Loan Term</FormLabel>
                            <Select onValueChange={(val) => field.onChange(Number(val))} defaultValue={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select loan term" /></SelectTrigger>
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
                    <span className="font-semibold text-lg">Interest Saved</span>
                    <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.interestSaved)}</span>
                </div>
                 <div className="flex justify-between items-center py-4 border-b">
                    <span className="font-semibold text-lg">Term Reduced By</span>
                    <span className="font-bold text-2xl text-brand-bright">{result.yearsSaved}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b">
                    <span className="font-semibold text-lg">New Total Repayment</span>
                    <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.newTotalPayment)}</span>
                </div>
            </div>
        </div>
    </div>
  );
}
