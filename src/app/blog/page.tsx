
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/data';
import type { BlogPost } from '@/components/shared/blog-card';
import { BlogListings } from '@/components/sections/blog-listings';
import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Property News & Real Estate Insights | NC Properties',
    description: 'Stay informed with the latest property news, market trends, and expert real estate advice from the NC Properties blog.',
};


function BlogHero({ post }: { post: BlogPost }) {
  if (!post) return null;
  
  return (
    <section className="bg-background text-foreground pt-24 pb-12">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <article>
                <p className="font-semibold text-sm mb-2 text-brand-bright">FEATURED POST</p>
                <h1 className="text-4xl font-bold font-headline mb-4 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand-deep transition-colors">
                        {post.title}
                    </Link>
                </h1>
                <p className="text-muted-foreground mb-6">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <Button asChild variant="outline">
                    <Link href={`/blog/${post.slug}`}>Read article</Link>
                </Button>
            </article>
             <div className="relative aspect-video rounded-lg overflow-hidden hidden md:block">
                <Image 
                    src={post.imageUrl}
                    alt={`Featured image for: ${post.title}`}
                    data-ai-hint={post.imageHint}
                    fill
                    className="object-cover"
                />
            </div>
        </div>
      </div>
    </section>
  );
}


export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  const featuredPost = allPosts[0];

  return (
    <>
      <BlogHero post={featuredPost} />
      <main className="py-16 bg-white">
        <div className="container">
           <BlogListings initialPosts={allPosts} />
        </div>
      </main>
    </>
  );
}
