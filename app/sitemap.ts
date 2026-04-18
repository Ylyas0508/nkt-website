import type { MetadataRoute } from "next";
import { getProducts, getBlogPosts } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";

const BASE = "https://nanning-kazan-trading.online";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const posts = await getBlogPosts();

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/products/${cat.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.category}/${p.id}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.id}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
