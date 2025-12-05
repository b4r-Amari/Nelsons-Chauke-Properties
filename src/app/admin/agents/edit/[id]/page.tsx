
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
import { updateAgent } from "@/lib/firebase/firestore"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { getAgentById } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
  bio: z.string().min(50, { message: "Bio must be at least 50 characters." }),
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
    getAgentById(id).then(agentData => {
      if (agentData) {
        form.reset(agentData);
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
        description: `The profile for ${values.name} has been updated.`,
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
        <div>
          <div className="mb-4">
              <Skeleton className="h-6 w-36" />
          </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Sarah Jones" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Sales Agent" {...field} />
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
                            <Input type="email" placeholder="agent@example.com" {...field} />
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
                            <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageHint"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Image Hint</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. smiling man" {...field} />
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
                      <Textarea placeholder="Write a short bio for the agent..." className="min-h-[150px]" {...field} />
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
