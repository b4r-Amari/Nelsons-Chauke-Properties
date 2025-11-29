
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormDesc } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, UploadCloud } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import placeholders from "@/lib/placeholder-images.json";
import { addBlogPost } from "@/lib/firebase/firestore"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  author: z.string().min(2, { message: "Author name must be at least 2 characters." }),
  category: z.string().min(3, { message: "Category is required." }),
  excerpt: z.string().min(20, { message: "Excerpt must be at least 20 characters." }).max(200, { message: "Excerpt must be less than 200 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
  content: z.string().min(100, { message: "Content must be at least 100 characters." }),
})

export default function NewBlogPage() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "NC Properties",
      category: "Buying Guide",
      excerpt: "",
      imageUrl: placeholders.blogDefault.url,
      imageHint: placeholders.blogDefault.hint,
      content: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addBlogPost(values);
    if (result.success) {
        toast({
            title: "Blog Post Created",
            description: `The post "${values.title}" has been successfully created.`,
        })
        form.reset();
        router.push('/admin/blogs');
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
                    Add New Blog Post
                </h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button type="submit" size="sm" className="bg-brand-bright hover:bg-brand-deep" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Publishing..." : "Publish Post"}
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
                                      <Textarea placeholder="Write the full blog post content here..." className="min-h-[400px]" {...field} />
                                    </FormControl>
                                     <FormDesc>
                                        You can use Markdown for formatting and standard HTML to embed images (&lt;img src="..."&gt;) or videos (&lt;iframe...&gt;).
                                    </FormDesc>
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
                            <FormField
                                control={form.control}
                                name="imageHint"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Image AI Hint</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. happy couple new home" {...field} />
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
