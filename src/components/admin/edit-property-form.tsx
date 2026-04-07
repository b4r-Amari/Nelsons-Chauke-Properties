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
import type { Agent, Property } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { updateProperty, uploadFile } from "@/lib/supabase/actions"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  title: z.string().min(5),
  location: z.string().min(2),
  price: z.coerce.number(),
  status: z.enum(["for-sale", "to-let", "sold"]),
  type: z.string().min(3),
  bedrooms: z.coerce.number().int(),
  bathrooms: z.coerce.number(),
  sqft: z.coerce.number().int().min(0),
  erfSize: z.coerce.number().int().min(0),
  description: z.string().min(20),
  features: z.array(z.string()).optional().default([]),
  onShow: z.boolean(),
  agentId: z.string().min(1, "Assign an agent"),
  imageUrls: z.array(z.string().url()).min(1),
  isFavorite: z.boolean(),
  yearBuilt: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  videoUrl: z.string().url().optional().or(z.literal("")),
});

export function EditPropertyForm({ initialData, allAgents }: { initialData: Property; allAgents: Agent[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      location: initialData.location,
      price: initialData.price,
      status: initialData.status,
      type: initialData.type,
      bedrooms: initialData.bedrooms,
      bathrooms: initialData.bathrooms,
      sqft: initialData.sqft || 0,
      erfSize: initialData.erfSize || 0,
      description: initialData.description,
      features: Array.isArray(initialData.features) ? initialData.features : [],
      onShow: initialData.onShow || false,
      isFavorite: initialData.isFavorite || false,
      agentId: initialData.agentId || '',
      imageUrls: initialData.imageUrls || [],
      yearBuilt: initialData.yearBuilt || new Date().getFullYear(),
      videoUrl: initialData.videoUrl || "",
    },
  });

  const imageUrls = form.watch("imageUrls");
  const currentFeatures = form.watch("features");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateProperty(initialData.id, values);
    if (result.success) {
        toast({ title: "Updated", description: "Property updated successfully." });
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
    form.setValue("imageUrls", imageUrls.filter((_, idx) => idx !== index));
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
                <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="flex-1 text-xl font-semibold">Edit Property</h1>
            <Button type="submit" size="sm" className="bg-brand-bright" disabled={form.formState.isSubmitting || isUploading}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Property Title / Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="videoUrl" render={({ field }) => (
                    <FormItem><FormLabel>Video Tour URL</FormLabel><FormControl><Input placeholder="YouTube or Vimeo link" {...field} /></FormControl><FormMessage /></FormItem>
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
              <CardHeader><CardTitle>Property Images</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded overflow-hidden border">
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
                        <label className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-bright hover:text-brand-deep px-2">
                            <span>Upload more photos</span>
                            <input type="file" className="sr-only" multiple accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                        </div>
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
                    <FormItem><FormLabel>Listing Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select></FormItem>
                )} />
                <Separator />
                <FormField control={form.control} name="onShow" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>On Show</FormLabel>
                            <FormDescription>Visible in "On Show" section.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
                <FormField control={form.control} name="isFavorite" render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Featured</FormLabel>
                            <FormDescription>Highlight on homepage.</FormDescription>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Assign Agent</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="agentId" render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an agent" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {allAgents.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>{agent.firstName} {agent.lastName}</SelectItem>
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
  );
}
