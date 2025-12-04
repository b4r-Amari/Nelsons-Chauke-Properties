
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, User, Calendar } from 'lucide-react';
import { getBlogPost } from '@/lib/data';
import { type BlogPost } from '@/components/shared/blog-card';
import { Badge } from '@/components/ui/badge';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) {
    return {
      title: 'Blog Post Not Found'
    }
  }
  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
        title: post.title,
        description: post.content.substring(0, 160),
        images: [post.imageUrl]
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPost(params.slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container py-12 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-brand-deep hover:text-brand-bright transition-colors font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property News
            </Link>
          </div>
          <article>
            <header className="mb-8">
              <Badge variant="outline" className="text-brand-bright border-brand-bright mb-4">{post.category}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-brand-deep leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
              </div>
            </header>

            <div className="relative aspect-video w-full rounded-lg overflow-hidden my-8 shadow-lg">
              <Image
                src={post.imageUrl}
                alt={`Featured image for blog post titled: ${post.title}`}
                data-ai-hint={post.imageHint}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-muted-foreground prose-a:text-brand-bright prose-strong:text-brand-deep"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}
