import fs from "fs";
import path from "path";
import crypto from "crypto";

const useKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const dataDir = path.join(process.cwd(), "data");

async function getData<T>(key: string, file: string): Promise<T[]> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    return (await kv.get<T[]>(key)) ?? [];
  }
  const filePath = path.join(dataDir, file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T[];
}

async function setData<T>(key: string, file: string, data: T[]): Promise<void> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    await kv.set(key, data);
    return;
  }
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2));
}

// --- Products ---

export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: string;
  category: string;
  image: string;
  createdAt: string;
}

export async function getProducts(): Promise<Product[]> {
  return getData<Product>("products", "products.json");
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

export async function createProduct(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
  const products = await getProducts();
  const product: Product = {
    ...data,
    id: `prod-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  await setData("products", "products.json", [product, ...products]);
  return product;
}

export async function updateProduct(id: string, data: Partial<Omit<Product, "id" | "createdAt">>): Promise<Product | null> {
  const products = await getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  await setData("products", "products.json", products);
  return products[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  await setData("products", "products.json", filtered);
  return true;
}

// --- Blog ---

export interface BlogPost {
  id: string;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  content: Record<string, string>;
  image: string;
  date: string;
  category: string;
  createdAt: string;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return getData<BlogPost>("blog", "blog.json");
}

export async function getBlogPostById(id: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.id === id);
}

export async function createBlogPost(data: Omit<BlogPost, "id" | "createdAt">): Promise<BlogPost> {
  const posts = await getBlogPosts();
  const post: BlogPost = {
    ...data,
    id: `blog-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
  };
  await setData("blog", "blog.json", [post, ...posts]);
  return post;
}

export async function updateBlogPost(id: string, data: Partial<Omit<BlogPost, "id" | "createdAt">>): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...data };
  await setData("blog", "blog.json", posts);
  return posts[idx];
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const posts = await getBlogPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  await setData("blog", "blog.json", filtered);
  return true;
}
