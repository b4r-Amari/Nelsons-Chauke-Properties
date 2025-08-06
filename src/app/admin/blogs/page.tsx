
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import blogData from '@/data/blog.json';
import Link from 'next/link';
import Image from 'next/image';

type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  category: string;
};

const posts: BlogPost[] = blogData;

export default function AdminBlogsPage() {
  const [blogPosts, setBlogPosts] = useState(posts);

  // In a real app, you'd have delete functionality here.
  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      // setBlogPosts(blogPosts.filter(p => p.slug !== slug));
      // Here you would also update the blog.json file or call an API.
      console.log(`(Simulated) Deleting post: ${slug}`);
    }
  };

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.slug}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={post.title}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={post.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{post.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(post.slug)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
