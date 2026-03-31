
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
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { updateAgent } from "@/lib/supabase/actions"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getAgentById } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

// Utility to get agent by ID from client side
async function fetchAgent(id: string) {
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  const { data } = await supabase.from('estate_agents').select('*').eq('id', id).single();
  return data;
}

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  photoUrl: z.string().url(),
  slug: z.string().min(2),
  bio: z.string().min(10),
})

export default function EditAgentPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchAgent(id).then(agentData => {
      if (agentData) {
        form.reset({
          firstName: agentData.first_name,
          lastName: agentData.last_name,
          email: agentData.email,
          phone: agentData.phone,
          photoUrl: agentData.photo_url,
          slug: agentData.slug,
          bio: agentData.bio
        });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Agent not found." });
        router.push("/admin/agents");
      }
      setIsLoading(false);
    });
  }, [id, router, toast, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateAgent(id, values);
    if (result.success) {
        toast({
        title: "Agent Updated",
        description: `The profile for ${values.firstName} has been updated.`,
        });
        router.push('/admin/agents');
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "An unknown error occurred.",
        });
    }
  }

  if (isLoading) {
    return (
        <div className="p-8">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
    )
  }

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Biography</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
