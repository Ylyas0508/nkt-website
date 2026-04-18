import { notFound } from "next/navigation";
import { getCategoryOverrides } from "@/lib/data";
import { CATEGORIES } from "@/lib/constants";
import CategoryForm from "@/components/admin/CategoryForm";

// Load all 4 translation files at build/request time (server only)
import en from "@/lib/translations/en.json";
import ru from "@/lib/translations/ru.json";
import zh from "@/lib/translations/zh.json";
import tr from "@/lib/translations/tr.json";

type Dict = Record<string, string>;

function t(dict: Dict, key: string) {
  return dict[key] || "";
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const overrides = await getCategoryOverrides();
  const overrideMap = new Map(overrides.map((o) => [o.id, o]));

  const defaultCat = CATEGORIES.find((c) => c.id === id);
  const override = overrideMap.get(id);
  const customCat = overrides.find((o) => o.isCustom && o.id === id);

  if (!defaultCat && !customCat) notFound();

  const merged = defaultCat
    ? { ...defaultCat, ...override, id, isCustom: false }
    : { ...customCat!, id, isCustom: true };

  // Build name: prefer saved override, else pull from translation files
  let name: Record<string, string>;
  if (merged.name && typeof merged.name === "object" && Object.values(merged.name as Record<string,string>).some(Boolean)) {
    name = merged.name as Record<string, string>;
  } else if (defaultCat?.tKey) {
    const k = `products.${defaultCat.tKey}.name`;
    name = { en: t(en as Dict, k), ru: t(ru as Dict, k), zh: t(zh as Dict, k), tr: t(tr as Dict, k) };
  } else {
    name = { en: typeof merged.name === "string" ? merged.name : id, ru: "", zh: "", tr: "" };
  }

  // Build description: prefer saved override, else pull from translation files
  let description: Record<string, string>;
  const savedDesc = (merged as Record<string, unknown>).description as Record<string, string> | undefined;
  if (savedDesc && Object.values(savedDesc).some(Boolean)) {
    description = savedDesc;
  } else if (defaultCat?.tKey) {
    const k = `products.${defaultCat.tKey}.desc`;
    description = { en: t(en as Dict, k), ru: t(ru as Dict, k), zh: t(zh as Dict, k), tr: t(tr as Dict, k) };
  } else {
    description = { en: "", ru: "", zh: "", tr: "" };
  }

  const formData = {
    id,
    name,
    description,
    image: merged.image || "",
    color: merged.color || "#cd9e66",
    icon: merged.icon || "Package",
    isCustom: merged.isCustom,
    tKey: defaultCat?.tKey,
  };

  return <CategoryForm initial={formData} isDefault={!merged.isCustom} />;
}
