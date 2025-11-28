
"use client"

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(value);
};

const formSchema = z.object({
  grossIncome: z.number().min(1000, "Income must be at least 1,000"),
  monthlyExpenses: z.number().min(0, "Expenses cannot be negative"),
  loanTerm: z.number().min(1, "Must be at least 1 year").max(30, "Cannot exceed 30 years"),
  interestRate: z.number().min(0.1, "Must be a positive rate"),
});

export function AffordabilityCalculator() {
  const [result, setResult] = useState({ maxLoanAmount: 0, monthlyPayment: 0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grossIncome: 50000,
      monthlyExpenses: 15000,
      loanTerm: 20,
      interestRate: 11.75,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { grossIncome, monthlyExpenses, loanTerm, interestRate } = values;
    
    // Banks typically allow 30% of gross income to go towards a bond repayment.
    const maxRepayment = grossIncome * 0.3;
    const disposableForBond = maxRepayment - monthlyExpenses;

    if (disposableForBond <= 0) {
        setResult({ maxLoanAmount: 0, monthlyPayment: 0 });
        return;
    }
    
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const maxLoanAmount = disposableForBond * ( (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) );
    
    // Calculate the actual monthly payment for the calculated max loan
    const actualMonthlyPayment = maxLoanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);


    setResult({ maxLoanAmount, monthlyPayment: actualMonthlyPayment > 0 ? actualMonthlyPayment : 0 });
  };

  useEffect(() => {
    onSubmit(form.getValues());
  }, [form]);


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Home Loan Affordability Calculator</CardTitle>
        <CardDescription>Estimate the maximum home loan amount you might qualify for based on your income and expenses.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => form.handleSubmit(onSubmit)()} className="space-y-6">
              <FormField
                control={form.control}
                name="grossIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gross Monthly Income</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyExpenses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Monthly Expenses (excluding rent)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="loanTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Term (Years): {field.value}</FormLabel>
                    <FormControl>
                      <Slider defaultValue={[field.value]} max={30} min={1} step={1} onValueChange={(vals) => field.onChange(vals[0])} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%): {field.value.toFixed(2)}</FormLabel>
                    <FormControl>
                      <Slider defaultValue={[field.value]} max={20} min={5} step={0.25} onValueChange={(vals) => field.onChange(vals[0])} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep">Calculate</Button>
            </form>
          </Form>

          <div className="bg-muted/50 p-8 rounded-lg space-y-6 flex flex-col justify-center">
            <h3 className="text-xl font-bold font-headline text-center">Your Affordability Estimate</h3>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">You could afford a property up to</p>
              <p className="text-4xl font-bold text-brand-bright">{formatCurrency(result.maxLoanAmount)}</p>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estimated Monthly Repayment</span>
                <span className="font-mono text-lg">{formatCurrency(result.monthlyPayment)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-4">This is an estimate. The final loan amount depends on the bank's assessment and your credit profile.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
