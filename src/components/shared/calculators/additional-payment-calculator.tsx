
"use client"

import { useState } from "react";
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
  loanAmount: z.number().min(50000, "Must be at least 50,000"),
  loanTerm: z.number().min(1, "Must be at least 1 year").max(30, "Cannot exceed 30 years"),
  interestRate: z.number().min(0.1, "Must be a positive rate"),
  additionalPayment: z.number().min(0),
});

export function AdditionalPaymentCalculator() {
  const [result, setResult] = useState({ interestSaved: 0, yearsSaved: 0, monthsSaved: 0, newLoanTerm: 0 });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 1500000,
      loanTerm: 20,
      interestRate: 11.75,
      additionalPayment: 1000,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { loanAmount, loanTerm, interestRate, additionalPayment } = values;
    const monthlyInterestRate = interestRate / 100 / 12;
    const originalNumberOfPayments = loanTerm * 12;

    if (loanAmount <= 0 || monthlyInterestRate <= 0) {
        setResult({ interestSaved: 0, yearsSaved: 0, monthsSaved: 0, newLoanTerm: 0 });
        return;
    }

    const originalMonthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, originalNumberOfPayments)) / (Math.pow(1 + monthlyInterestRate, originalNumberOfPayments) - 1);
    const originalTotalPayment = originalMonthlyPayment * originalNumberOfPayments;
    const originalTotalInterest = originalTotalPayment - loanAmount;

    const newMonthlyPayment = originalMonthlyPayment + additionalPayment;

    if (newMonthlyPayment <= 0) {
        setResult({ interestSaved: 0, yearsSaved: 0, monthsSaved: 0, newLoanTerm: loanTerm });
        return;
    }
    
    // Calculate new loan term in months
    const newNumberOfPayments = -(Math.log(1 - (loanAmount * monthlyInterestRate) / newMonthlyPayment) / Math.log(1 + monthlyInterestRate));

    const newTotalPayment = newMonthlyPayment * newNumberOfPayments;
    const newTotalInterest = newTotalPayment - loanAmount;

    const interestSaved = originalTotalInterest - newTotalInterest;
    
    const monthsSavedRaw = originalNumberOfPayments - newNumberOfPayments;
    const yearsSaved = Math.floor(monthsSavedRaw / 12);
    const monthsSaved = Math.floor(monthsSavedRaw % 12);
    
    const newLoanTermYears = newNumberOfPayments / 12;

    setResult({ interestSaved: interestSaved > 0 ? interestSaved : 0, yearsSaved, monthsSaved, newLoanTerm: newLoanTermYears });
  };

  useState(() => {
    onSubmit(form.getValues());
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Additional Payment Calculator</CardTitle>
        <CardDescription>See how paying extra on your bond can save you money and shorten your loan term.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} onChange={() => form.handleSubmit(onSubmit)()} className="space-y-6">
              <FormField control={form.control} name="loanAmount" render={({ field }) => (
                <FormItem><FormLabel>Outstanding Loan Amount</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="loanTerm" render={({ field }) => (
                <FormItem><FormLabel>Remaining Loan Term (Years): {field.value}</FormLabel><FormControl><Slider defaultValue={[field.value]} max={30} min={1} step={1} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="interestRate" render={({ field }) => (
                <FormItem><FormLabel>Interest Rate (%): {field.value.toFixed(2)}</FormLabel><FormControl><Slider defaultValue={[field.value]} max={20} min={5} step={0.25} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="additionalPayment" render={({ field }) => (
                <FormItem><FormLabel>Extra Monthly Payment</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep">Calculate</Button>
            </form>
          </Form>

          <div className="bg-muted/50 p-8 rounded-lg space-y-6 flex flex-col justify-center">
            <h3 className="text-xl font-bold font-headline text-center">Your Potential Savings</h3>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Interest Saved</p>
              <p className="text-4xl font-bold text-brand-bright">{formatCurrency(result.interestSaved)}</p>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Time Saved</span>
                <span className="font-mono text-lg">{result.yearsSaved} years, {result.monthsSaved} months</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">New Loan Term</span>
                <span className="font-mono text-lg">{result.newLoanTerm.toFixed(1)} years</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
