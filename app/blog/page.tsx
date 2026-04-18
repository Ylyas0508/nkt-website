import type { Metadata } from "next";
import { getBlogPosts } from "@/lib/data";
import BlogIndexClient from "./BlogIndexClient";

export const metadata: Metadata = {
  title: "News & Deals",
  description: "Latest trade deals, market insights, and company news from Nanning Kazan Trading — your global commodity trade partner.",
  openGraph: {
    title: "News & Deals | Nanning Kazan Trading",
    description: "Latest trade deals, market insights, and company news.",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();
  const sorted = posts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return <BlogIndexClient posts={sorted} />;
}
