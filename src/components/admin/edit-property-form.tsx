
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
import { ArrowLeft, X, UploadCloud, Loader2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Agent, Property } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { updateProperty, uploadFile } from "@/lib/supabase/actions"

const formSchema = z.object({
  title: z.string().min(5),
  location: z.string().min(2),
  price: z.coerce.number(),
  status: z.enum(["for-sale", "to-let", "sold"]),
  type: z.string().min(3),
  bedrooms: z.coerce.number().int(),
  bathrooms: z.coerce.number(),
  description: z.string().min(20),
  features: z.array(z.string()).optional().default([]),
  onShow: z.boolean(),
  agentId: z.string().min(1, "Assign an agent"),
  imageUrls: z.array(z.string().url()).min(1),
  isFavorite: z.boolean(),
  videoUrl: z.string().url().optional().or(z.literal("")),
});

export function EditPropertyForm({ initialData, allAgents }: { initialData: Property; allAgents: Agent[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

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
      description: initialData.description,
      features: Array.isArray(initialData.features) ? initialData.features : [],
      onShow: initialData.onShow || false,
      isFavorite: initialData.isFavorite || false,
      agentId: initialData.agentId || '',
      imageUrls: initialData.imageUrls || [],
      videoUrl: initialData.videoUrl || "",
    },
  });

  const imageUrls = form.watch("imageUrls");

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <CardContent className="space-y-4 pt-6">
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Property Title / Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Property Images</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded overflow-hidden border">
                      <Image src={url} alt="" fill className="object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => form.setValue("imageUrls", imageUrls.filter((_, idx) => idx !== i))}><X className="h-3 w-3"/></Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10 bg-muted/20">
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
              <CardContent className="space-y-4 pt-6">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="for-sale">For Sale</SelectItem><SelectItem value="to-let">To Let</SelectItem><SelectItem value="sold">Sold</SelectItem></SelectContent></Select></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-2">
                  <FormField control={form.control} name="bedrooms" render={({ field }) => (
                      <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="bathrooms" render={({ field }) => (
                      <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" step="0.5" {...field} /></FormControl></FormItem>
                  )} />
                </div>
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
  )
}
