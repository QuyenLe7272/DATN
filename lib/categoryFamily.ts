/** Một dòng danh mục Firestore (document id = id). */
export type CategoryTreeRow = {
  id: string;
  parentId: string | null;
};

export function parseCategoryParentId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return null;
}

/**
 * Family Category ID: nếu danh mục có parentId → family = parentId; không có → family = chính id danh mục đó.
 */
export function resolveFamilyCategoryId(
  categoriesById: Map<string, CategoryTreeRow>,
  productCategoryId: string,
): string {
  const id = productCategoryId.trim();
  if (!id) return "";
  const row = categoriesById.get(id);
  if (!row) return id;
  return row.parentId ?? row.id;
}

/**
 * Mọi categoryId sản phẩm có thể map vào cùng Family (cha + các con trực tiếp của cha đó).
 */
export function getFamilyMemberCategoryIds(
  rows: Iterable<CategoryTreeRow>,
  familyRootId: string,
): string[] {
  const root = familyRootId.trim();
  if (!root) return [];
  const ids = new Set<string>([root]);
  for (const c of rows) {
    if (c.parentId === root) ids.add(c.id);
  }
  return [...ids];
}

/** Firestore `in` tối đa 10 giá trị mỗi truy vấn (chuẩn). */
export const FIRESTORE_IN_MAX = 10;

export function chunkArray<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}
