import type { Firestore } from "firebase/firestore";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

type SlugSource = {
  id?: string | null;
  name?: string | null;
  slug?: string | null;
};

export function createSlug(text: string): string {
  const input = String(text ?? "").trim();
  if (!input) return "";

  // Normalize Vietnamese characters and strip combining marks.
  const withoutMarks = input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d");

  return withoutMarks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateSlug(text: string): string {
  return createSlug(text);
}

export function resolveCategorySlug(source: SlugSource): string {
  const fromSlug = createSlug(source.slug ?? "");
  if (fromSlug) return fromSlug;

  const fromName = createSlug(source.name ?? "");
  if (fromName) return fromName;

  const fromId = String(source.id ?? "").trim();
  return createSlug(fromId) || fromId;
}

export function buildCategoryHref(source: SlugSource): string {
  const slug = resolveCategorySlug(source);
  return `/danh-muc/${slug || "tat-ca"}`;
}

type EnsureUniqueSlugOptions = {
  db: Firestore;
  collectionName: "products" | "categories";
  baseSlug: string;
  excludeDocId?: string;
};

export async function ensureUniqueSlug({
  db,
  collectionName,
  baseSlug,
  excludeDocId,
}: EnsureUniqueSlugOptions): Promise<string> {
  const normalizedBase = createSlug(baseSlug);
  const fallbackBase = normalizedBase || "item";

  let suffix = 0;
  // Firestore doesn't support "not equal docId" without composite indices in many cases;
  // we query by slug candidate and accept if it's either empty or only matches excludeDocId.
  // This is safe for low-collision admin writes; collisions are resolved by incrementing suffix.
  for (;;) {
    const candidate = suffix === 0 ? fallbackBase : `${fallbackBase}-${suffix}`;
    const q = query(
      collection(db, collectionName),
      where("slug", "==", candidate),
      limit(2),
    );
    const snap = await getDocs(q);
    const docs = snap.docs;

    if (docs.length === 0) return candidate;
    if (excludeDocId && docs.every((d) => d.id === excludeDocId)) return candidate;

    suffix += 1;
    if (suffix > 5000) {
      throw new Error("Không thể tạo slug duy nhất. Vui lòng thử tên khác.");
    }
  }
}

