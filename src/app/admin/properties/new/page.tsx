
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
import { ArrowLeft, X, UploadCloud, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Agent } from "@/lib/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { addProperty, uploadFile } from "@/lib/supabase/actions"

const formSchema = z.object({
  title: z.string().min(5, "Title/Address is too short."),
  location: z.string().min(2, "Location is too short."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  status: z.enum(["for-sale", "to-let", "sold"]),
  type: z.string().min(3, "Type is required."),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  sqft: z.coerce.number().int().min(0),
  erfSize: z.coerce.number().int().min(0),
  description: z.string().min(20, "Description must be at least 20 characters."),
  features: z.any().optional().default({}),
  onShow: z.boolean().default(false),
  agentId: z.string().min(1, { message: "Assign an agent." }),
  imageUrls: z.array(z.string().url()).min(1, "Provide at least one image."),
  slug: z.string().min(3, "Slug is required."),
  isFavorite: z.boolean().default(false),
  yearBuilt: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  videoUrl: z.string().url().optional().or(z.literal("")),
})

export default function NewPropertyPage() {
  const { toast } = useToast()
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAgents() {
      const { data, error } = await supabase.from('estate_agents').select('*');
      if (!error && data) {
        setAgents(data.map((a: any) => ({
          id: String(a.id),
          firstName: a.first_name,
          lastName: a.last_name,
          name: `${a.first_name} ${a.last_name}`,
          email: a.email,
          photoUrl: a.photo_url
        })));
      }
    }
    fetchAgents();
  }, [supabase]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      price: 0,
      status: "for-sale",
      type: "House",
      bedrooms: 3,
      bathrooms: 2,
      sqft: 180,
      erfSize: 500,
      description: "",
      features: {},
      onShow: false,
      agentId: "",
      imageUrls: [],
      slug: "",
      isFavorite: false,
      yearBuilt: new Date().getFullYear(),
      videoUrl: "",
    },
  })

  const imageUrls = form.watch("imageUrls");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addProperty(values);
    if (result.success) {
        toast({ title: "Property Created", description: `Property added successfully.` });
        router.push("/admin/properties");
        router.refresh();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newUrls = [...imageUrls];

    for (let i = 0; i < files.length; i++) {
      const result = await uploadFile('property-images', files[i]);
      if (result.success && result.url) {
        newUrls.push(result.url);
      } else {
        toast({ variant: "destructive", title: "Upload Failed", description: result.error });
      }
    }

    form.setValue("imageUrls", newUrls);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    form.setValue("imageUrls", updated);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/properties">
                <Button variant="outline" size="icon" className="h-7 w-7"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="flex-1 text-xl font-semibold">Add New Property</h1>
            <Button type="submit" size="sm" className="bg-brand-bright" disabled={form.formState.isSubmitting || isUploading}>
              {form.formState.isSubmitting ? "Creating..." : "Create Property"}
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Address / Title</FormLabel><FormControl><Input placeholder="e.g. 123 Luxury Lane" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="slug" render={({ field }) => (
                        <FormItem><FormLabel>Slug (URL Friendly)</FormLabel><FormControl><Input {...field} placeholder="e.g. luxury-villa-sandton" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="Suburb, City" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Media Gallery</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-video bg-muted rounded flex items-center justify-center overflow-hidden border">
                      <Image src={url} alt="" fill className="object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(i)}><X className="h-3 w-3"/></Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 bg-muted/20">
                    <div className="text-center">
                        {isUploading ? <Loader2 className="mx-auto h-12 w-12 text-brand-bright animate-spin" /> : <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-bright focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-deep focus-within:ring-offset-2 hover:text-brand-deep px-2"
                        >
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 5MB</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Pricing & Stats</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price (ZAR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-2">
                  <FormField control={form.control} name="bedrooms" render={({ field }) => (
                      <FormItem><FormLabel>Beds</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="bathrooms" render={({ field }) => (
                      <FormItem><FormLabel>Baths</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Agent Assignment</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="agentId" render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an agent" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {agents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
