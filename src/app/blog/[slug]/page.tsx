import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBlogPost, getBlogPosts } from '@/lib/data';
import type { BlogPost } from '@/lib/types';
import { BlogSidebar } from '@/components/shared/blog-sidebar';
import { Metadata } from 'next';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [
            {
                url: post.imageUrl || '',
                width: 1200,
                height: 630,
                alt: post.title,
            },
        ],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const allPosts = await getBlogPosts();

  if (!post) {
    notFound();
  }

  const otherPosts = allPosts.filter((p: BlogPost) => p.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.imageUrl,
    "datePublished": post.createdAt,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "NC Properties",
      "logo": {
        "@type": "ImageObject",
        "url": "https://nc-properties.vercel.app/images/logo.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white">
        <div className="container py-12 md:py-16">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property News
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            <div className="lg:col-span-2">
              <article>
                <header className="mb-6">
                  <Badge variant="outline" className="text-brand-bright border-brand-bright mb-4">{post.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold font-headline text-brand-deep leading-tight mb-4">
                    {post.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <time>{post.date}</time>
                    </div>
                  </div>
                </header>

                {post.imageUrl && (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden my-6 shadow-md">
                    <Image
                      src={post.imageUrl}
                      alt={`Featured image for blog post titled: ${post.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div
                  className="prose prose-xs xs:prose-base dark:prose-invert max-w-none prose-p:text-foreground prose-headings:text-primary prose-a:text-brand-bright prose-ul:text-foreground prose-li:text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

              </article>
            </div>
            <aside className="lg:col-span-1 lg:sticky top-14 self-start bg-card p-6 rounded-lg">
              <BlogSidebar posts={otherPosts} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
