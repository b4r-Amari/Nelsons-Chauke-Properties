"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addValuationRequest, addMarketingLead } from "@/lib/supabase/actions"
import { sendValuationEmail } from "@/lib/email-actions"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  propertyAddress: z.string().min(10, { message: "Please enter a full property address." }),
  propertyType: z.string({ required_error: "Please select a property type." }),
  bedrooms: z.coerce.number().min(1, { message: "Must have at least 1 bedroom." }),
  bathrooms: z.coerce.number().min(1, { message: "Must have at least 1 bathroom." }),
})

export function SellForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fullName: "",
        email: "",
        phone: "",
        propertyAddress: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Send Email Notification
      const emailResult = await sendValuationEmail({
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.propertyAddress,
        type: values.propertyType
      });

      // 2. Save to Supabase
      const valuationResult = await addValuationRequest(values);
      await addMarketingLead({
        name: values.fullName,
        email: values.email,
        source: 'valuation-request'
      });

      if (emailResult.success && valuationResult.success) {
          toast({
              title: "Valuation Request Submitted!",
              description: "Thank you. An expert agent will contact you shortly to discuss your property valuation.",
          });
          form.reset();
      } else {
          throw new Error(emailResult.error || valuationResult.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="text-xl font-headline font-semibold sr-only">Your Contact Information</legend>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="082 123 4567" {...field} /></FormControl>
                  <FormMessage />
              </FormItem>
            )} />
        </fieldset>

        <fieldset className="space-y-4 pt-4 border-t">
          <legend className="text-xl font-headline font-semibold sr-only">Property Details</legend>
          <FormField control={form.control} name="propertyAddress" render={({ field }) => (
            <FormItem>
                <FormLabel>Full Property Address</FormLabel>
                <FormControl><Input placeholder="e.g. 123 Main Street, Sandton, 2196" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField control={form.control} name="propertyType" render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="townhouse">Townhouse / Cluster</SelectItem>
                    <SelectItem value="vacant-land">Vacant Land</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
              <FormField control={form.control} name="bedrooms" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 3" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bathrooms" render={({ field }) => (
                <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 2" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
              )} />
          </div>
        </fieldset>
        
        <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep transition-colors" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : "Request Valuation"}
        </Button>
      </form>
    </Form>
  )
}
