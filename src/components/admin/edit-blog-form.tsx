
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
import { ArrowLeft, UploadCloud } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateBlogPost } from "@/lib/supabase/actions"
import { useRouter } from "next/navigation"
import RichTextEditor from "@/components/shared/rich-text-editor"
import type { BlogPost } from "@/lib/types"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  category: z.string().min(3, { message: "Category is required." }),
  excerpt: z.string().min(20, { message: "Excerpt must be at least 20 characters." }).max(200, { message: "Excerpt must be less than 200 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  content: z.string().min(100, { message: "Content must be at least 100 characters." }),
})

export function EditBlogForm({ initialData }: { initialData: BlogPost }) {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      author: initialData.author || "",
      category: initialData.category || "",
      excerpt: initialData.excerpt || "",
      imageUrl: initialData.imageUrl || "",
      content: initialData.content,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await updateBlogPost(initialData.id, values);
    if (result.success) {
        toast({
            title: "Blog Post Updated",
            description: `The post "${values.title}" has been successfully updated.`,
        })
        router.push('/admin/blogs');
        router.refresh();
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "An unknown error occurred.",
        });
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blogs">
                    <Button variant="outline" size="icon" className="h-7 w-7">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                </Link>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Edit Blog Post
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
                        <CardHeader>
                            <CardTitle>Post Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Post Title</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g. The Ultimate Guide to Buying Your First Home" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Post Content</FormLabel>
                                    <FormControl>
                                      <RichTextEditor {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Post Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="author"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Natalia Cromwell" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Selling Guide" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="excerpt"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Excerpt</FormLabel>
                                    <FormControl>
                                    <Textarea placeholder="Write a brief summary..." className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-6">
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
                            <Separator />
                            <div>
                                <Label>Upload Media</Label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                                    <div className="text-center">
                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-brand-bright focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-deep focus-within:ring-offset-2 hover:text-brand-deep"
                                        >
                                            <span>Upload files</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, MP4 up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    </Form>
  )
}
