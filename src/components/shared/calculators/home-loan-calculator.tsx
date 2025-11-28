
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
  purchasePrice: z.number().min(50000, "Must be at least 50,000"),
  deposit: z.number().min(0),
  loanTerm: z.number().min(1, "Must be at least 1 year").max(30, "Cannot exceed 30 years"),
  interestRate: z.number().min(0.1, "Must be a positive rate"),
});

export function HomeLoanCalculator() {
  const [result, setResult] = useState({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 1500000,
      deposit: 150000,
      loanTerm: 20,
      interestRate: 11.75,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const loanAmount = values.purchasePrice - values.deposit;
    const monthlyInterestRate = values.interestRate / 100 / 12;
    const numberOfPayments = values.loanTerm * 12;

    if (loanAmount <= 0 || monthlyInterestRate <= 0 || numberOfPayments <= 0) {
        setResult({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });
        return;
    }

    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setResult({ monthlyPayment, totalPayment, totalInterest });
  };
  
  // Trigger calculation on initial render
  useEffect(() => {
    onSubmit(form.getValues());
  }, [form]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Home Loan Repayment Calculator</CardTitle>
        <CardDescription>Enter the details of your potential home loan to estimate your monthly repayments and total costs.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => form.handleSubmit(onSubmit)()} className="space-y-6">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit</FormLabel>
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

          <div className="bg-muted/50 p-8 rounded-lg space-y-6">
            <h3 className="text-xl font-bold font-headline text-center">Your Estimated Results</h3>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated Monthly Repayment</p>
              <p className="text-4xl font-bold text-brand-bright">{formatCurrency(result.monthlyPayment)}</p>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Repayment</span>
                <span className="font-mono text-lg">{formatCurrency(result.totalPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Interest Paid</span>
                <span className="font-mono text-lg">{formatCurrency(result.totalInterest)}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="font-semibold">Loan Amount</span>
                <span className="font-mono text-lg">{formatCurrency(form.getValues().purchasePrice - form.getValues().deposit)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
