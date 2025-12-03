
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogCard, type BlogPost } from '@/components/shared/blog-card';
import { getBlogPosts } from '@/lib/data';

export default async function BlogPage() {
  const allPosts = await getBlogPosts();

  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(1);

  return (
    <>
      <section className="bg-brand-deep text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold font-headline">Property News</h1>
          <p className="text-lg mt-2 text-white/80">Insights, tips, and stories from the world of real estate.</p>
        </div>
      </section>
      
      <main className="py-24 bg-background">
        <div className="container">
          {featuredPost && (
            <article className="mb-20">
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="grid lg:grid-cols-2 gap-12 items-center bg-card p-8 rounded-lg shadow-lg transition-shadow hover:shadow-2xl">
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    <Image 
                      src={featuredPost.imageUrl}
                      alt={`Featured image for blog post titled: ${featuredPost.title}`}
                      data-ai-hint={featuredPost.imageHint}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm text-brand-bright font-semibold mb-2">{featuredPost.category}</p>
                    <h2 className="text-3xl font-headline font-bold text-brand-deep mb-4 group-hover:text-brand-bright transition-colors">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                    <div className="flex items-center text-sm text-muted-foreground mb-6">
                      <span>By {featuredPost.author}</span>
                      <span className="mx-2">|</span>
                      <span>{featuredPost.date}</span>
                    </div>
                     <Button variant="link" className="p-0 text-brand-bright group-hover:underline">
                      Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </article>
          )}
          
          <h2 className="text-3xl font-bold text-center font-headline mb-12">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
        </div>
      </main>
    </>
  );
}
