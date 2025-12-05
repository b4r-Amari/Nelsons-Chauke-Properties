
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
import { ArrowLeft, UploadCloud, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Agent } from "@/components/shared/agent-card"
import type { Property } from "@/components/shared/property-card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import placeholders from "@/lib/placeholder-images.json";
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { updateProperty } from "@/lib/firebase/firestore"

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
  agentIds: z.array(z.string()).min(1, { message: "Please assign at least one agent." }),
  imageUrls: z.array(z.string().url()).min(1, "Please provide at least one image URL."),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
  slug: z.string().min(3, "Slug is required."),
  isFavorite: z.boolean().default(false),
  yearBuilt: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
});

type EditPropertyFormProps = {
  initialData: Property;
  allAgents: Agent[];
};

export function EditPropertyForm({ initialData, allAgents }: EditPropertyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      agentIds: Array.isArray(initialData.agentIds) ? initialData.agentIds.map(String) : [],
    },
  });

  const imageUrls = form.watch("imageUrls");

  const handleAddImageUrl = () => {
    if (newImageUrl && z.string().url().safeParse(newImageUrl).success) {
      form.setValue("imageUrls", [...(form.getValues("imageUrls") || []), newImageUrl]);
      setNewImageUrl("");
    } else {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid image URL.",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const uploadedImageUrls = Array.from(files).map((file, i) => `https://picsum.photos/seed/${file.name}${i}/600/400`);
      
      const currentImages = form.getValues("imageUrls") || [];
      const isPlaceholder = currentImages.length > 0 && currentImages[0] === placeholders.propertyDefault.url;
      const updatedImages = isPlaceholder
        ? uploadedImageUrls
        : [...currentImages, ...uploadedImageUrls];
      
      form.setValue("imageUrls", updatedImages);
      toast({
        title: "Images Added",
        description: `${files.length} image(s) have been prepared for upload. URLs are placeholders.`,
      });
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("imageUrls") || [];
    form.setValue("imageUrls", currentImages.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Explicitly parse all numeric fields to ensure correct data types are sent to Firestore.
    const dataToUpdate = {
        ...values,
        price: Number(values.price),
        beds: Number(values.beds),
        baths: Number(values.baths),
        sqft: Number(values.sqft),
        erfSize: Number(values.erfSize),
        yearBuilt: Number(values.yearBuilt),
    };
    
    const result = await updateProperty(initialData.id, dataToUpdate);

    if (result.success) {
        toast({
            title: "Property Updated",
            description: `The property listing for ${values.address} has been updated.`,
        });
        router.push("/admin/properties");
        router.refresh(); // Force a server-side refresh of the properties list
    } else {
        toast({
            variant: "destructive",
            title: "Error updating property",
            description: result.error || "An unknown error occurred.",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/properties">
                <Button variant="outline" size="icon" className="h-7 w-7">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Edit Property
            </h1>
            <div className="ml-auto flex items-center gap-2">
                <Button type="submit" size="sm" className="bg-brand-bright hover:bg-brand-deep" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123 Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>URL Slug</FormLabel><FormControl><Input placeholder="123-main-street-sandton" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem><FormLabel>Location / Suburb</FormLabel><FormControl><Input placeholder="e.g. Sandton, Gauteng" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
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
              </CardContent>
            </Card>

             <Card>
              <CardHeader><CardTitle>Media Gallery</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="imageUrls"
                    render={() => (
                    <FormItem>
                        <Card className="border-dashed">
                        <CardContent className="p-4">
                            {imageUrls && imageUrls.length > 0 && imageUrls[0] !== placeholders.propertyDefault.url ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {imageUrls.map((url, index) => (
                                <div key={index} className="relative group aspect-video">
                                    <Image src={url} alt={`Property image ${'${index + 1}'}`} fill className="rounded-md object-cover" />
                                    <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                    >
                                    <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                ))}
                            </div>
                            ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                                <ImageIcon className="h-12 w-12 mb-2" />
                                <p>Your image gallery is empty.</p>
                                <p className="text-xs">Add images via URL or upload below.</p>
                            </div>
                            )}
                        </CardContent>
                        </Card>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <div className="flex items-center gap-2">
                    <Input 
                        placeholder="Add image URL" 
                        value={newImageUrl} 
                        onChange={(e) => setNewImageUrl(e.target.value)} 
                    />
                    <Button type="button" variant="outline" onClick={handleAddImageUrl}>Add URL</Button>
                </div>

                <Separator />
                
                <div>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 hover:bg-muted/50 transition-colors">
                            <div className="text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <span className="relative font-semibold text-brand-bright focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-deep focus-within:ring-offset-2 hover:text-brand-deep">
                                        Upload files
                                    </span>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG up to 10MB</p>
                            </div>
                        </div>
                    </Label>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/png, image/jpeg" />
                </div>
              </CardContent>
             </Card>

          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader><CardTitle>Pricing & Status</CardTitle></CardHeader>
              <CardContent className="grid gap-6">
                 <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price (ZAR)</FormLabel><FormControl><Input type="number" placeholder="2500000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Property Specifications</CardTitle></CardHeader>
              <CardContent className="grid gap-6">
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Property Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="House">House</SelectItem><SelectItem value="Apartment">Apartment</SelectItem><SelectItem value="Townhouse">Townhouse</SelectItem><SelectItem value="Villa">Villa</SelectItem><SelectItem value="Vacant Land">Vacant Land</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="beds" render={({ field }) => (
                      <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="baths" render={({ field }) => (
                      <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                   <FormField control={form.control} name="sqft" render={({ field }) => (
                      <FormItem><FormLabel>House Size (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                   )} />
                   <FormField control={form.control} name="erfSize" render={({ field }) => (
                      <FormItem><FormLabel>Erf Size (m²)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                   )} />
                </div>
                 <FormField control={form.control} name="yearBuilt" render={({ field }) => (
                    <FormItem><FormLabel>Year Built</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                 )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Assignment & Settings</CardTitle></CardHeader>
              <CardContent className="grid gap-6">
                 <FormField
                      control={form.control}
                      name="agentIds"
                      render={() => (
                        <FormItem>
                          <FormLabel>Assign Agent(s)</FormLabel>
                          <div className="grid grid-cols-1 gap-2">
                            {allAgents.map((agent) => (
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
                                          checked={field.value?.includes(String(agent.id))}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...(field.value || []), String(agent.id)])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== String(agent.id)
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
                  <Separator />
                  <FormField control={form.control} name="onShow" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Property is On Show</FormLabel></div><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                  )} />
                   <FormField control={form.control} name="isFavorite" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Featured Property</FormLabel></div><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
                  )} />
              </CardContent>
            </Card>

          </div>
        </div>
      </form>
    </Form>
  )
}

    