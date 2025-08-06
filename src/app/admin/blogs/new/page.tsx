
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
import { ArrowLeft, UploadCloud } from "lucide-react"
import Link from "next/link"
import { Label } from "@/components/ui/label"

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "NC Properties",
      category: "Buying Guide",
      excerpt: "",
      imageUrl: "https://placehold.co/800x450",
      imageHint: "real estate concept",
      content: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would submit to a backend to update the blog.json file or a database.
    console.log("New Blog Post Data:", values)
    toast({
      title: "Blog Post Created",
      description: `The post "${values.title}" has been successfully created.`,
    })
    form.reset()
  }

  return (
    <div>
      <div className="mb-4">
        <Link href="/admin/blogs" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog List
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Blog Post</CardTitle>
          <CardDescription>Fill out the form below to publish a new article.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="grid md:grid-cols-2 gap-6">
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
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
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
              </div>
               <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt / Short Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write a brief summary of the article..." className="min-h-[100px]" {...field} />
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
                      <Textarea placeholder="Write the full blog post content here. You can use HTML tags like <p>, <h3>, etc." className="min-h-[300px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <div>
                <Label>Upload Media (Images/Videos)</Label>
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
              <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep" size="lg">Publish Post</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
