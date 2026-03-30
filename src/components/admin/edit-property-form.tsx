
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
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Agent, Property } from "@/lib/types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { updateProperty } from "@/lib/supabase/actions"

const formSchema = z.object({
  address: z.string().min(5),
  location: z.string().min(2),
  price: z.coerce.number(),
  status: z.enum(["for-sale", "to-let", "sold"]),
  type: z.string().min(3),
  beds: z.coerce.number().int(),
  baths: z.coerce.number().int(),
  sqft: z.coerce.number().int(),
  erfSize: z.coerce.number().int(),
  description: z.string().min(20),
  features: z.array(z.string()),
  onShow: z.boolean(),
  agentIds: z.array(z.string()).min(1),
  imageUrls: z.array(z.string().url()),
  slug: z.string().min(3),
  isFavorite: z.boolean(),
  yearBuilt: z.coerce.number().int(),
  videoUrl: z.string().url().optional().or(z.literal("")),
});

export function EditPropertyForm({ initialData, allAgents }: { initialData: Property; allAgents: Agent[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [newImageUrl, setNewImageUrl] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      beds: initialData.bedrooms, // UI uses .bedrooms, form uses .beds
      baths: initialData.bathrooms,
      agentIds: initialData.agentIds || [],
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin/properties">
                <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="flex-1 text-xl font-semibold">Edit Property</h1>
            <Button type="submit" size="sm" className="bg-brand-bright" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardContent className="space-y-4 pt-6">
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="slug" render={({ field }) => (
                    <FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea className="min-h-[150px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Images</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative aspect-video rounded overflow-hidden">
                      <Image src={url} alt="" fill className="object-cover" />
                      <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => form.setValue("imageUrls", imageUrls.filter((_, idx) => idx !== i))}><X className="h-3 w-3"/></Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                  <Button type="button" onClick={() => { if(newImageUrl) form.setValue("imageUrls", [...imageUrls, newImageUrl]); setNewImageUrl(""); }}>Add</Button>
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
                  <FormField control={form.control} name="beds" render={({ field }) => (
                      <FormItem><FormLabel>Beds</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="baths" render={({ field }) => (
                      <FormItem><FormLabel>Baths</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {allAgents.map(agent => (
                  <div key={agent.id} className="flex items-center gap-2">
                    <Checkbox checked={form.watch("agentIds").includes(agent.id)} onCheckedChange={(checked) => {
                      const current = form.getValues("agentIds");
                      form.setValue("agentIds", checked ? [...current, agent.id] : current.filter(id => id !== agent.id));
                    }} />
                    <Label className="font-normal">{agent.name}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
