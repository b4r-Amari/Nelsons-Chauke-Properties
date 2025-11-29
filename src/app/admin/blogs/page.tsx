
"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts } from '@/lib/data';
import { type BlogPost } from '@/components/shared/blog-card';
import { useToast } from '@/hooks/use-toast';
import { deleteBlogPost } from '@/lib/firebase/firestore';

export default function AdminBlogsPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  async function fetchData() {
      setIsLoading(true);
      const posts = await getBlogPosts();
      setBlogPosts(posts);
      setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete this blog post: "${title}"?`)) {
      const result = await deleteBlogPost(id);
      if (result.success) {
        toast({
          title: "Post Deleted",
          description: `The post "${title}" has been successfully deleted.`,
        });
        fetchData();
      } else {
         toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Could not delete the post.",
        });
      }
    }
  };
  
  if (isLoading) {
      return <div>Loading blog posts...</div>
  }

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
                <TableHead className="hidden lg:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.slug}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={`Featured image for blog post titled: ${post.title}`}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={post.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{post.author}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{post.date}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleDelete(post.id, post.title)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
