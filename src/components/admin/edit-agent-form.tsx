
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, UploadCloud, Loader2 } from "lucide-react"
import Link from "next/link"
import { updateAgent, uploadFile } from "@/lib/supabase/actions"
import { useRouter } from "next/navigation"
import type { Agent } from "@/lib/types"
import { useState } from "react"
import Image from "next/image"

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  photoUrl: z.string().url(),
})

export function EditAgentForm({ initialData }: { initialData: Agent }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      phone: initialData.phone || "",
      photoUrl: initialData.photoUrl || "",
    },
  })

  const photoUrl = form.watch("photoUrl");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateAgent(initialData.id, values);
    if (result.success) {
        toast({ title: "Agent Updated", description: `The profile for ${values.firstName} has been updated.` });
        router.push('/admin/agents');
        router.refresh();
    } else {
        toast({ variant: "destructive", title: "Error", description: result.error });
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const result = await uploadFile('agent-photos', file);
    if (result.success && result.url) {
      form.setValue("photoUrl", result.url);
    }
    setIsUploading(false);
  };

  return (
    <div>
       <div className="mb-4">
            <Link href="/admin/agents" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents List
            </Link>
        </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Edit Agent Profile</CardTitle>
          <CardDescription>Update the details for this agent below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <Input type="email" {...field} />
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
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              
              <div className="space-y-4">
                <FormLabel>Agent Photo</FormLabel>
                <div className="flex items-center gap-6">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden border">
                        <Image src={photoUrl || placeholders.agentProfile.url} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="flex-1 max-w-sm">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-brand-bright" /> : <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />}
                                <p className="text-sm text-gray-500">Change photo</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                        </label>
                    </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep" size="lg" disabled={form.formState.isSubmitting || isUploading}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
