import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/data";
import BlogForm from "@/components/admin/BlogForm";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();
  return <BlogForm initial={post} />;
}
