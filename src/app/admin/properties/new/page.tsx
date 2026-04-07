"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, X, UploadCloud, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Agent } from "@/lib/types"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { addProperty, uploadFile } from "@/lib/supabase/actions"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

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
  features: z.array(z.string()).optional().default([]),
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
  const [isDragging, setIsDragging] = useState(false);
  const [featureInput, setFeatureInput] = useState("");
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
      sqft: 0,
      erfSize: 0,
      description: "",
      features: [],
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
  const currentFeatures = form.watch("features");

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

  const handleFiles = async (files: FileList | null) => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    form.setValue("imageUrls", updated);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    const newFeatures = featureInput.split(',').map(f => f.trim()).filter(f => f && !currentFeatures.includes(f));
    form.setValue("features", [...currentFeatures, ...newFeatures]);
    setFeatureInput("");
  };

  const removeFeature = (feature: string) => {
    form.setValue("features", currentFeatures.filter(f => f !== feature));
  };

  const toggleQuickFeature = (feature: string) => {
    if (currentFeatures.includes(feature)) {
      removeFeature(feature);
    } else {
      form.setValue("features", [...currentFeatures, feature]);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} method="POST">
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
                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                    <FormItem><FormLabel>Video Tour URL (Optional)</FormLabel><FormControl><Input placeholder="e.g. https://www.youtube.com/watch?v=..." {...field} /></FormControl><FormDescription>Link to a YouTube or Vimeo property tour.</FormDescription><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Property Specifications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (
                        <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (
                        <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="sqft" render={({ field }) => (
                        <FormItem><FormLabel>Floor Size (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="erfSize" render={({ field }) => (
                        <FormItem><FormLabel>Erf Size (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="yearBuilt" render={({ field }) => (
                        <FormItem><FormLabel>Year Built</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="House">House</SelectItem>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                                    <SelectItem value="Cluster">Cluster</SelectItem>
                                    <SelectItem value="Duplex">Duplex</SelectItem>
                                    <SelectItem value="Villa">Villa</SelectItem>
                                    <SelectItem value="Vacant Land">Vacant Land</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Features & Amenities</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {["Swimming Pool", "Garden", "Pet Friendly", "Secure Estate", "Double Garage", "Backup Generator", "Solar Panels", "Staff Quarters"].map(feature => (
                        <Button 
                            key={feature}
                            type="button"
                            variant={currentFeatures.includes(feature) ? "default" : "outline"}
                            size="sm"
                            className={cn(currentFeatures.includes(feature) ? "bg-brand-bright" : "")}
                            onClick={() => toggleQuickFeature(feature)}
                        >
                            {feature}
                        </Button>
                    ))}
                </div>
                <div className="space-y-2">
                    <FormLabel>Add Custom Features</FormLabel>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="e.g. Borehole, Fireplace, etc." 
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); addFeature(); }}}
                        />
                        <Button type="button" variant="secondary" onClick={addFeature}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                    </div>
                    <FormDescription>Separate multiple features with commas.</FormDescription>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    {currentFeatures.map(f => (
                        <Badge key={f} variant="secondary" className="pl-3 pr-1 py-1 text-sm font-normal">
                            {f}
                            <button type="button" onClick={() => removeFeature(f)} className="ml-2 hover:bg-muted p-0.5 rounded-full"><X className="h-3 w-3" /></button>
                        </Badge>
                    ))}
                </div>
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
                
                <div 
                  className={cn(
                    "mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 transition-colors cursor-pointer",
                    isDragging ? "bg-brand-bright/10 border-brand-bright" : "bg-muted/20"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
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
              <CardHeader><CardTitle>Pricing & Status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price (ZAR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Listing Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select></FormItem>
                )} />
                <Separator />
                <FormField control={form.control} name="onShow" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>On Show</FormLabel>
                            <FormDescription>Mark as open for viewing this weekend.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="isFavorite" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Featured Property</FormLabel>
                            <FormDescription>Highlight on the homepage carousel.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
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
