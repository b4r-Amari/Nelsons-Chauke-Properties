
"use client"

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

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

const formSchema = z.object({
  purchasePrice: z.coerce.number().min(50000, "Must be at least 50,000"),
  loanAmount: z.coerce.number().min(0).optional(),
  isFirstTimeBuyer: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;


export function BondAndTransferCalculator() {
  const [result, setResult] = useState({
    totalCost: 0,
    transferCost: 0,
    bondCost: 0,
    transferDuty: 0,
    propertyTransferFee: 0,
    bondRegistrationFee: 0
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 1000000,
      loanAmount: 1000000,
      isFirstTimeBuyer: false,
    },
  });

  const calculateResults = useCallback((values: FormData) => {
    const { purchasePrice, loanAmount = purchasePrice, isFirstTimeBuyer } = values;

    let transferDuty = 0;
    if (!isFirstTimeBuyer || purchasePrice > 1100000) {
        transferDuty = calculateTransferDuty(purchasePrice);
    }
    
    const transferAttorneyFee = calculateAttorneyFee(purchasePrice);
    const deedsOfficeFeeTransfer = Math.min(1500 + (purchasePrice / 100000) * 5, 7000);
    const propertyTransferFee = transferAttorneyFee + deedsOfficeFeeTransfer;
    const transferCost = transferDuty + propertyTransferFee;

    let bondCost = 0;
    let bondRegistrationFee = 0;
    if (loanAmount > 0) {
        const bondAttorneyFee = calculateAttorneyFee(loanAmount);
        const deedsOfficeFeeBond = Math.min(1000 + (loanAmount / 100000) * 4, 5000);
        bondRegistrationFee = bondAttorneyFee + deedsOfficeFeeBond;
        bondCost = bondRegistrationFee;
    }
    
    const totalCost = transferCost + bondCost;

    setResult({ totalCost, transferCost, bondCost, transferDuty, propertyTransferFee, bondRegistrationFee });
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
            <h2 className="text-2xl md:text-3xl font-bold font-headline">Calculate your bond and transfer costs</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Get a detailed breakdown of the once-off costs involved in buying a property, including bond registration fees, transfer duty, and attorney fees. This helps you budget for the upfront expenses beyond the purchase price.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Form {...form}>
                <form className="space-y-6">
                    <FormField control={form.control} name="purchasePrice" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Purchase Price</FormLabel>
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
                    <FormField control={form.control} name="loanAmount" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-brand-deep font-semibold">Loan Amount (Optional)</FormLabel>
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
                    <FormField control={form.control} name="isFirstTimeBuyer" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="first-time-buyer" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <label htmlFor="first-time-buyer" className="font-medium cursor-pointer">I am a first-time home buyer</label>
                            </div>
                        </FormItem>
                    )} />
                </form>
            </Form>

            <div className="space-y-6">
                <div className="flex justify-between items-center py-4 border-b">
                    <span className="font-semibold text-lg">Total Once-off Cost</span>
                    <span className="font-bold text-2xl text-brand-bright">{formatCurrency(result.totalCost)}</span>
                </div>

                <div className="space-y-4 py-4 border-b">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Property Transfer Costs</span>
                        <span className="font-bold text-xl text-brand-bright">{formatCurrency(result.transferCost)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                        <span>Transfer Duty</span>
                        <span>{formatCurrency(result.transferDuty)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                        <span>Transfer Attorney Fee (Est.)</span>
                        <span>{formatCurrency(result.propertyTransferFee)}</span>
                    </div>
                </div>

                 <div className="py-4">
                     <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">Bond Registration Costs</span>
                        <span className="font-bold text-xl text-brand-bright">{formatCurrency(result.bondCost)}</span>
                    </div>
                     <div className="flex justify-between items-center text-sm text-muted-foreground pl-4">
                        <span>Bond Attorney Fee (Est.)</span>
                        <span>{formatCurrency(result.bondRegistrationFee)}</span>
                    </div>
                     <p className="text-xs text-muted-foreground text-left pt-4">These are estimates. Your conveyancer will provide a final statement of account.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
