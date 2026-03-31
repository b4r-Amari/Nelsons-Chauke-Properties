
"use client"

import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { type BlogPost } from "@/lib/types"
import { addMarketingLead } from "@/lib/supabase/actions"


const newsletterFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
});

export function BlogSidebar({ posts }: { posts: BlogPost[] }) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof newsletterFormSchema>>({
        resolver: zodResolver(newsletterFormSchema),
        defaultValues: { email: "" },
    });

    async function onSubmit(values: z.infer<typeof newsletterFormSchema>) {
        const result = await addMarketingLead({ email: values.email, source: 'blog-sidebar-newsletter' });
        if (result.success) {
            toast({
                title: "Subscribed!",
                description: "You're now on our newsletter list for blog updates.",
            });
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error || "Could not subscribe.",
            });
        }
    }

    return (
        <div className="space-y-8">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="p-0">
                    <CardTitle className="font-headline text-2xl">Recent Articles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-0 mt-4">
                    {posts.slice(0, 3).map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex items-start gap-4">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0">
                                {post.imageUrl ? (
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-brand-bright transition-colors">{post.title}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                            </div>
                        </Link>
                    ))}
                </CardContent>
                 <CardFooter className="p-0 mt-4">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/blog">View All Articles</Link>
                    </Button>
                </CardFooter>
            </Card>

             <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="p-0">
                    <CardTitle className="font-headline text-2xl">Stay Updated</CardTitle>
                    <CardDescription>Get the latest blog posts delivered to your inbox.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-4">
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Input 
                                    type="email" 
                                    placeholder="your.email@example.com" 
                                    aria-label="Email for newsletter"
                                    {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" className="w-full bg-brand-bright hover:bg-brand-deep" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Subscribing..." : "Subscribe"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
