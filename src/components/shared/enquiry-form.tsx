
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { sendEnquiryEmail } from "@/lib/email-actions"
import { addMarketingLead } from "@/lib/supabase/actions"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export function EnquiryForm({ propertyId }: { propertyId: string }) {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "Hi, I am interested in this property and would like to arrange a viewing.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Send email via Resend
      const emailResult = await sendEnquiryEmail({ ...values, propertyId });
      
      // 2. Save lead to Supabase
      await addMarketingLead({
        name: values.name,
        email: values.email,
        source: `property-enquiry-${propertyId}`
      });

      if (emailResult.success) {
        toast({
          title: "Enquiry Sent!",
          description: "An agent will be in touch with you shortly.",
        })
        form.reset()
      } else {
        throw new Error(emailResult.error);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Enquiry Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  }

  return (
    <Card className="shadow-lg border-t-4 border-brand-bright">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Make an Enquiry</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="082 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep transition-colors" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : "Send Enquiry"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
