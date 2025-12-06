
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
    <section className="relative text-white py-24 md:py-32 flex items-center min-h-[50vh]">
        <Image 
            src={post.imageUrl}
            alt={`Featured image for: ${post.title}`}
            data-ai-hint={post.imageHint}
            fill
            className="object-cover"
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="container relative">
            <div className="max-w-2xl">
                <p className="font-semibold text-sm mb-2 text-brand-bright uppercase tracking-wider">FEATURED POST</p>
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 leading-tight">
                    <Link href={`/blog/${post.slug}`} className="hover:text-white/80 transition-colors">
                        {post.title}
                    </Link>
                </h1>
                <p className="text-white/80 mb-6">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <Button asChild size="lg" className="bg-brand-bright hover:bg-brand-deep text-white">
                    <Link href={`/blog/${post.slug}`}>Read article</Link>
                </Button>
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
      <main className="py-16 bg-background">
        <div className="container">
           <BlogListings initialPosts={allPosts} />
        </div>
      </main>
    </>
  );
}
