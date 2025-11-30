"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getBlogPosts } from '@/lib/data';
import { BlogsTable } from '@/components/admin/blogs-table';
import { useEffect, useState } from 'react';
import { type BlogPost } from '@/components/shared/blog-card';

export default function AdminBlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getBlogPosts();
      setBlogPosts(posts);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold font-headline">Manage Blog Posts</h1>
        <Button asChild className="bg-brand-bright hover:bg-brand-deep">
          <Link href="/admin/blogs/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Post
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Blog Post List</CardTitle>
          <CardDescription>Here you can view, edit, and delete blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
            <BlogsTable initialPosts={blogPosts} />
        </CardContent>
      </Card>
    </div>
  );
}
