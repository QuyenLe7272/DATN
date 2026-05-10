import type { RelatedProductItem } from "@/components/product/RelatedProducts";

export type RelatedProductSortable = RelatedProductItem & {
  categoryId?: string;
  categoryName?: string;
  /** Family root: parentId của danh mục SP nếu là con, ngược lại chính categoryId (danh mục cha). */
  familyCategoryId?: string;
};

function norm(s: string | undefined): string {
  return (s ?? "").trim();
}

export type CurrentProductRef = {
  id: string;
  categoryId?: string;
  categoryName?: string;
  /** Phải khớp `familyCategoryId` của từng SP trong pool để xếp nhóm "cùng loại" (cùng nhánh cha). */
  familyCategoryId?: string;
};

/**
 * Loại trừ SP đang xem.
 * Ưu tiên 1: cùng `familyCategoryId` (cùng danh mục cha / cùng cây nhánh).
 * Ưu tiên 2 (trong nhóm cùng family): trùng đúng `categoryId` lá với SP hiện tại.
 * Ưu tiên 3: các SP còn lại.
 */
export function sortRelatedProductsForDetail(
  items: RelatedProductSortable[],
  current: CurrentProductRef,
  maxItems = 6,
): RelatedProductItem[] {
  const currentId = current.id;
  const curCatId = norm(current.categoryId);
  const curCatName = norm(current.categoryName);
  const curFamily = norm(current.familyCategoryId);

  const withoutSelf = items.filter((p) => p.id !== currentId);

  const sameFamily = withoutSelf.filter((p) => {
    const pf = norm(p.familyCategoryId);
    if (curFamily && pf && pf === curFamily) return true;
    return false;
  });

  const sameFamilyIds = new Set(sameFamily.map((p) => p.id));

  const sameLeafInFamily = sameFamily.filter((p) => curCatId && norm(p.categoryId) === curCatId);
  const sameFamilyOtherLeaf = sameFamily.filter((p) => !(curCatId && norm(p.categoryId) === curCatId));

  const legacySameCategory = withoutSelf.filter((p) => {
    if (sameFamilyIds.has(p.id)) return false;
    if (curCatId && norm(p.categoryId) === curCatId) return true;
    if (curCatName.length > 0 && norm(p.categoryName) === curCatName) return true;
    return false;
  });

  const prioritizedIds = new Set(
    [...sameLeafInFamily, ...sameFamilyOtherLeaf, ...legacySameCategory].map((p) => p.id),
  );
  const rest = withoutSelf.filter((p) => !prioritizedIds.has(p.id));

  const merged = [...sameLeafInFamily, ...sameFamilyOtherLeaf, ...legacySameCategory, ...rest].slice(
    0,
    maxItems,
  );

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[sortRelatedProducts] pool=%s currentFamily=%s curCatId=%s sameFamily=%s sameLeaf=%s legacySame=%s merged=%s",
      items.length,
      curFamily || "(none)",
      curCatId || "(none)",
      sameFamily.length,
      sameLeafInFamily.length,
      legacySameCategory.length,
      merged.length,
    );
    console.log(
      "[sortRelatedProducts] order",
      merged.map((p) => ({
        id: p.id,
        name: p.name,
        cat: p.categoryId ?? "-",
        fam: p.familyCategoryId ?? "-",
      })),
    );
  }

  return merged.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: p.image,
    price: p.price,
  }));
}
