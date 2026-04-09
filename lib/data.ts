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

// --- Category Overrides ---

export interface CategoryOverride {
  id: string;
  image: string;
  color: string;
  icon?: string;
  name?: Record<string, string>;
  description?: Record<string, string>;
  isCustom?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export async function getCategoryOverrides(): Promise<CategoryOverride[]> {
  return getData<CategoryOverride>("categoryOverrides", "categoryOverrides.json");
}

export async function upsertCategoryOverride(id: string, data: Partial<CategoryOverride>): Promise<void> {
  const overrides = await getCategoryOverrides();
  const idx = overrides.findIndex((o) => o.id === id);
  if (idx >= 0) {
    overrides[idx] = { ...overrides[idx], ...data };
  } else {
    overrides.push({ id, image: "", color: "#cd9e66", ...data });
  }
  await setData("categoryOverrides", "categoryOverrides.json", overrides);
}

export async function createCustomCategory(data: Omit<CategoryOverride, "id">): Promise<CategoryOverride> {
  const overrides = await getCategoryOverrides();
  const cat: CategoryOverride = {
    ...data,
    id: `cat-${crypto.randomUUID().slice(0, 8)}`,
    isCustom: true,
  };
  await setData("categoryOverrides", "categoryOverrides.json", [cat, ...overrides]);
  return cat;
}

export async function deleteCustomCategory(id: string): Promise<boolean> {
  const overrides = await getCategoryOverrides();
  const filtered = overrides.filter((o) => o.id !== id);
  if (filtered.length === overrides.length) return false;
  await setData("categoryOverrides", "categoryOverrides.json", filtered);
  return true;
}

// --- Contact Messages ---

export async function getContactMessages(): Promise<ContactMessage[]> {
  return getData<ContactMessage>("messages", "messages.json");
}

export async function createContactMessage(data: Omit<ContactMessage, "id" | "createdAt" | "read">): Promise<ContactMessage> {
  const messages = await getContactMessages();
  const msg: ContactMessage = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  await setData("messages", "messages.json", [msg, ...messages]);
  return msg;
}

export async function markMessageRead(id: string): Promise<void> {
  const messages = await getContactMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return;
  messages[idx] = { ...messages[idx], read: true };
  await setData("messages", "messages.json", messages);
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const messages = await getContactMessages();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;
  await setData("messages", "messages.json", filtered);
  return true;
}

// --- About Stats ---

export interface AboutStats {
  years: number;
  countries: number;
  deals: number;
  aboutImage?: string;
}

const DEFAULT_STATS: AboutStats = {
  years: 5,
  countries: 50,
  deals: 500,
  aboutImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
};

async function getSingleValue<T>(key: string): Promise<T | null> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    return kv.get<T>(key);
  }
  return null;
}

async function setSingleValue<T>(key: string, value: T): Promise<void> {
  if (useKV) {
    const { kv } = await import("@vercel/kv");
    await kv.set(key, value);
  }
}

export async function getAboutStats(): Promise<AboutStats> {
  return (await getSingleValue<AboutStats>("aboutStats")) ?? DEFAULT_STATS;
}

export async function updateAboutStats(data: Partial<AboutStats>): Promise<AboutStats> {
  const current = await getAboutStats();
  const updated = { ...current, ...data };
  await setSingleValue("aboutStats", updated);
  return updated;
}
