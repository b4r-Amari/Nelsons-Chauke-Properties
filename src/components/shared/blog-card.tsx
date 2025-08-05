
"use client"

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  imageHint: string;
  excerpt: string;
  content: string;
  category: string;
};

type BlogCardProps = {
  post: BlogPost;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="h-full flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video">
            <Image
              src={post.imageUrl}
              alt={post.title}
              data-ai-hint={post.imageHint}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          <Badge variant="outline" className="mb-2 text-sm text-brand-bright border-brand-bright">{post.category}</Badge>
          <h3 className="text-xl font-bold font-headline text-brand-deep mb-2 line-clamp-2 group-hover:text-brand-bright transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardContent>
        <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
          <span>{post.date}</span>
           <span className="flex items-center text-brand-bright font-semibold invisible group-hover:visible transition-all">
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
