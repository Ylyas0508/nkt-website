import { notFound } from "next/navigation";
import { getCategoryOverrides } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const overrides = await getCategoryOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));

  // Find default category
  const defaultCat = CATEGORIES.find((c) => c.id === id);
  // Find override
  const override = overrideMap.get(id);
  // Find custom category
  const customCat = overrides.find((o) => o.isCustom && o.id === id);

  if (!defaultCat && !customCat) notFound();

  // Merge for editing
  const merged = defaultCat
    ? { ...defaultCat, ...override, id, isCustom: false }
    : { ...customCat!, id, isCustom: true };

  // Normalize name to Record<string, string>
  const normalizedName = (merged.name && typeof merged.name === "object")
    ? merged.name as Record<string, string>
    : { en: (typeof merged.name === "string" ? merged.name : defaultCat?.tKey ? "" : id), ru: "", zh: "", tr: "" };

  const formData = {
    id,
    name: normalizedName,
    description: (merged as any).description || { en: "", ru: "", zh: "", tr: "" },
    image: merged.image || "",
    color: merged.color || "#cd9e66",
    icon: merged.icon || "Package",
    isCustom: merged.isCustom,
    tKey: defaultCat?.tKey,
  };

  return <CategoryForm initial={formData} isDefault={!merged.isCustom} />;
}
