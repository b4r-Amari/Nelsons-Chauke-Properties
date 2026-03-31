
import { getBlogPostById } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditBlogForm } from "@/components/admin/edit-blog-form";
import type { BlogPost } from "@/lib/types";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const postData = await getBlogPostById(id);

  if (!postData) {
    notFound();
  }

  return (
    <EditBlogForm initialData={postData as BlogPost} />
  );
}
