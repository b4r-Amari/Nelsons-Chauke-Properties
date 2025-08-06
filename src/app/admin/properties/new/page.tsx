
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, PlusCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import agentsData from "@/data/agents.json"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  address: z.string().min(5, "Address is too short."),
  location: z.string().min(2, "Location is too short."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  status: z.enum(["for-sale", "to-let", "sold"]),
  type: z.string().min(3, "Type is required."),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().int().min(0),
  sqft: z.coerce.number().int().min(0, "Square footage must be positive."),
  erfSize: z.coerce.number().int().min(0, "Erf size must be positive."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  features: z.array(z.string()).optional().default([]),
  onShow: z.boolean().default(false),
  agentIds: z.array(z.coerce.number()).min(1, { message: "Please assign at least one agent." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
})

export default function NewPropertyPage() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      location: "",
      price: 0,
      status: "for-sale",
      type: "House",
      beds: 3,
      baths: 2,
      sqft: 180,
      erfSize: 500,
      description: "",
      features: ["Swimming Pool", "Garden", "Secure Estate"],
      onShow: false,
      agentIds: [],
      imageUrl: "https://placehold.co/300x200",
      imageHint: "modern house exterior",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would submit to a backend to update the properties.json file or a database.
    console.log("New Property Data:", values)
    toast({
      title: "Property Created",
      description: `A new property listing for ${values.address} has been created.`,
    })
    form.reset()
  }

  return (
    <div>
       <div className="mb-4">
            <Link href="/admin/properties" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties List
            </Link>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Property</CardTitle>
          <CardDescription>Fill out the form below to create a new property listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold font-headline">Basic Information</h3>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123 Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location / Suburb</FormLabel><FormControl><Input placeholder="e.g. Sandton, Gauteng" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price (ZAR)</FormLabel><FormControl><Input type="number" placeholder="2500000" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="House">House</SelectItem><SelectItem value="Apartment">Apartment</SelectItem><SelectItem value="Townhouse">Townhouse</SelectItem><SelectItem value="Villa">Villa</SelectItem><SelectItem value="Vacant Land">Vacant Land</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>

                {/* Property Specs */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold font-headline">Property Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                         <FormField control={form.control} name="beds" render={({ field }) => (
                            <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                         )} />
                         <FormField control={form.control} name="baths" render={({ field }) => (
                            <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                         )} />
                         <FormField control={form.control} name="sqft" render={({ field }) => (
                            <FormItem><FormLabel>House Size (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                         )} />
                         <FormField control={form.control} name="erfSize" render={({ field }) => (
                            <FormItem><FormLabel>Erf Size (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                         )} />
                    </div>
                </div>

                {/* Description & Features */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold font-headline">Description & Features</h3>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the property..." className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="features" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Features</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter features, separated by commas (e.g., Swimming Pool, Garden)" onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                
                 {/* Image & Agent */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold font-headline">Media & Assignment</h3>
                     <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageHint" render={({ field }) => (
                            <FormItem><FormLabel>Image Hint</FormLabel><FormControl><Input placeholder="e.g. modern house exterior" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                    <FormField
                      control={form.control}
                      name="agentIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign Agent(s)</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {agentsData.map((agent) => (
                              <FormField
                                key={agent.id}
                                control={form.control}
                                name="agentIds"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={agent.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(agent.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), agent.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== agent.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {agent.name}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                {/* Other */}
                <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold font-headline">Other Details</h3>
                    <FormField control={form.control} name="onShow" render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Property is On Show</FormLabel></div></FormItem>
                    )} />
                </div>
              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep" size="lg">Create Property</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
