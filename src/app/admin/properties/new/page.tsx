
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
import { ArrowLeft, UploadCloud, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { getAgents } from "@/lib/data"
import type { Agent } from "@/lib/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import placeholders from "@/lib/placeholder-images.json";
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { addProperty } from "@/lib/supabase/actions"

const formSchema = z.object({
  address: z.string().min(5, "Address is too short."),
  location: z.string().min(2, "Location is too short."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  status: z.enum(["for-sale", "to-let", "sold"]),
  type: z.string().min(3, "Type is required."),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().int().min(0),
  sqft: z.coerce.number().int().min(0),
  erfSize: z.coerce.number().int().min(0),
  description: z.string().min(20, "Description must be at least 20 characters."),
  features: z.array(z.string()).optional().default([]),
  onShow: z.boolean().default(false),
  agentIds: z.array(z.string()).min(1, { message: "Assign at least one agent." }),
  imageUrls: z.array(z.string().url()).min(1, "Provide at least one image URL."),
  slug: z.string().min(3, "Slug is required."),
  isFavorite: z.boolean().default(false),
  yearBuilt: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  videoUrl: z.string().url().optional().or(z.literal("")),
})

export default function NewPropertyPage() {
  const { toast } = useToast()
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    async function fetchAgents() {
      const fetchedAgents = await getAgents();
      setAgents(fetchedAgents);
    }
    fetchAgents();
  }, []);

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
      features: ["Swimming Pool", "Garden"],
      onShow: false,
      agentIds: [],
      imageUrls: [placeholders.propertyDefault.url],
      slug: "",
      isFavorite: false,
      yearBuilt: 2024,
      videoUrl: "",
    },
  })

  const imageUrls = form.watch("imageUrls");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addProperty(values);
    if (result.success) {
        toast({ title: "Property Created", description: `Property at ${values.address} added.` });
        router.push("/admin/properties");
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  }

  const handleAddImageUrl = () => {
    if (newImageUrl && z.string().url().safeParse(newImageUrl).success) {
      form.setValue("imageUrls", [...imageUrls, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    form.setValue("imageUrls", imageUrls.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/properties">
                <Button variant="outline" size="icon" className="h-7 w-7"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="flex-1 text-xl font-semibold">Add New Property</h1>
            <Button type="submit" size="sm" className="bg-brand-bright" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Property"}
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle>Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="Suburb, City" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="features" render={({ field }) => (
                    <FormItem><FormLabel>Features (comma separated)</FormLabel><FormControl><Textarea onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} value={field.value.join(', ')} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Media</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-video bg-muted rounded flex items-center justify-center overflow-hidden">
                      <Image src={url} alt="" fill className="object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(i)}><X className="h-3 w-3"/></Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                  <Button type="button" onClick={handleAddImageUrl}>Add</Button>
                </div>
                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                    <FormItem><FormLabel>Video URL</FormLabel><FormControl><Input placeholder="YouTube link" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Status & Specs</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-2">
                  <FormField control={form.control} name="beds" render={({ field }) => (
                      <FormItem><FormLabel>Beds</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="baths" render={({ field }) => (
                      <FormItem><FormLabel>Baths</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FormField control={form.control} name="sqft" render={({ field }) => (
                      <FormItem><FormLabel>House Size</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="erfSize" render={({ field }) => (
                      <FormItem><FormLabel>Erf Size</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Agents</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {agents.map(agent => (
                  <FormField key={agent.id} control={form.control} name="agentIds" render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <Checkbox checked={field.value.includes(agent.id)} onCheckedChange={(checked) => field.onChange(checked ? [...field.value, agent.id] : field.value.filter(id => id !== agent.id))} />
                      <FormLabel className="font-normal">{agent.name}</FormLabel>
                    </FormItem>
                  )} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
