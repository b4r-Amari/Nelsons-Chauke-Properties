
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
  grossIncome: z.coerce.number().min(1000, "Income must be at least 1,000"),
  monthlyExpenses: z.coerce.number().min(0, "Expenses cannot be negative").optional(),
  interestRate: z.coerce.number().min(0.1, "Must be a positive rate"),
  loanTerm: z.coerce.number().min(1).max(30),
});

type FormData = z.infer<typeof formSchema>;

export function AffordabilityCalculator() {
  const [result, setResult] = useState({
    maxLoanAmount: 0,
    monthlyPayment: 0,
    onceOffCosts: 0,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: 50000,
      monthlyExpenses: 15000,
      interestRate: 11.75,
      loanTerm: 20,
    },
  });

  const calculateResults = useCallback((values: FormData) => {
    const { grossIncome, monthlyExpenses = 0, loanTerm, interestRate } = values;
    
    const maxRepayment = grossIncome * 0.3;
    const disposableForBond = Math.max(0, maxRepayment - monthlyExpenses);
    
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const maxLoanAmount = disposableForBond > 0 && monthlyInterestRate > 0
      ? disposableForBond * ( (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) )
      : 0;
    
    const monthlyPayment = maxLoanAmount > 0 && monthlyInterestRate > 0
        ? maxLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
        : 0;

    const transferDuty = maxLoanAmount > 1100000 ? (maxLoanAmount - 1100000) * 0.03 : 0;
    const attorneyFees = maxLoanAmount * 0.01;
    const onceOffCosts = transferDuty + attorneyFees;

    setResult({ maxLoanAmount, monthlyPayment, onceOffCosts });
  }, []);

  useEffect(() => {
    const subscription = form.watch((values) => {
        const validValues = formSchema.safeParse(values);
        if (validValues.success) {
          calculateResults(validValues.data);
        }
    });
    const initialValues = formSchema.safeParse(form.getValues());
    if(initialValues.success) {
        calculateResults(initialValues.data);
    }
    return () => subscription.unsubscribe();
  }, [form, calculateResults]);

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      field.onChange(numericValue === '' ? 0 : parseInt(numericValue, 10));
  };

  return (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-headline">Calculate what you can afford</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Determine the maximum home loan you could qualify for based on your gross monthly income and expenses. This calculator provides an estimate of your purchasing power, helping you set a realistic budget for your property search.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Form {...form}>
                <form className="space-y-6">
                    <FormField control={form.control} name="grossIncome" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Gross Monthly Income</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                    <Input 
                                      type="text"
                                      inputMode="decimal"
                                      value={field.value.toLocaleString('en-ZA')}
                                      onChange={(e) => handleNumericInputChange(e, field)}
                                      className="pl-8" 
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="monthlyExpenses" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Total Monthly Expenses</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
                                    <Input 
                                      type="text"
                                      inputMode="decimal"
                                      value={(field.value || 0).toLocaleString('en-ZA')}
                                      onChange={(e) => handleNumericInputChange(e, field)}
                                      className="pl-8" 
                                    />
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
                                    <Input type="number" {...field} step="0.01" className="pr-8" onChange={e => field.onChange(parseFloat(e.target.value))}/>
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
                    <span className="font-semibold text-lg">You could afford a house up to</span>
                    <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.maxLoanAmount)}</span>
                </div>

                <div className="space-y-4 py-4 border-b">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Estimated Monthly Repayment</span>
                        <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.monthlyPayment)}</span>
                    </div>
                </div>

                <div className="py-4">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Estimated Once-off Costs</span>
                        <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.onceOffCosts)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">This is an estimate. The final loan amount depends on the bank's assessment and your credit profile.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
