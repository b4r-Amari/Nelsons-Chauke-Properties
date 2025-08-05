
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UploadCloud } from "lucide-react"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  propertyAddress: z.string().min(10, { message: "Please enter a full property address." }),
  propertyType: z.string({ required_error: "Please select a property type." }),
  bedrooms: z.coerce.number().min(1, { message: "Must have at least 1 bedroom." }),
  bathrooms: z.coerce.number().min(1, { message: "Must have at least 1 bathroom." }),
  size: z.coerce.number().min(20, { message: "Size must be at least 20 m²." }),
  askingPrice: z.coerce.number().min(100000, { message: "Asking price must be realistic." }),
  message: z.string().optional(),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    toast({
      title: "Valuation Request Submitted!",
      description: "Thank you for your submission. One of our agents will be in touch with you shortly.",
    })
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-xl font-headline font-semibold border-b pb-2">Your Contact Information</legend>
            <div className="grid md:grid-cols-2 gap-6">
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

        <fieldset className="space-y-4">
          <legend className="text-xl font-headline font-semibold border-b pb-2">Property Details</legend>
          <FormField control={form.control} name="propertyAddress" render={({ field }) => (
            <FormItem>
                <FormLabel>Full Property Address</FormLabel>
                <FormControl><Input placeholder="123 Main Street, Sandton, 2196" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
          )} />
          <div className="grid md:grid-cols-2 gap-6">
            <FormField control={form.control} name="propertyType" render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
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
            <FormField control={form.control} name="askingPrice" render={({ field }) => (
              <FormItem>
                  <FormLabel>Expected Asking Price (ZAR)</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g. 2500000" {...field} /></FormControl>
                  <FormMessage />
              </FormItem>
            )} />
          </div>
            <div className="grid md:grid-cols-3 gap-6">
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
              <FormField control={form.control} name="size" render={({ field }) => (
                <FormItem>
                    <FormLabel>Size (m²)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g. 150" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
              )} />
          </div>
        </fieldset>
        
        <fieldset className="space-y-4">
            <legend className="text-xl font-headline font-semibold border-b pb-2">Additional Information</legend>
            <FormField control={form.control} name="message" render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell us about any unique features, recent renovations, or other important details..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div>
              <FormLabel>Upload Property Photos</FormLabel>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                  <div className="text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-bright focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-deep focus-within:ring-offset-2 hover:text-brand-deep"
                      >
                          <span>Upload files</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
              </div>
            </div>
        </fieldset>

        <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep transition-colors" size="lg">Request Valuation</Button>
      </form>
    </Form>
  )
}
