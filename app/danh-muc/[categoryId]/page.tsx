import CategoryProductsClient from "./CategoryProductsClient";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/** Slug dành cho trang tĩnh riêng `app/danh-muc/tat-ca` — không pre-render trùng qua [categoryId]. */
const RESERVED_CATEGORY_SLUG = "tat-ca";

export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    const params = snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data() as { slug?: unknown };
        const slug = typeof data.slug === "string" ? data.slug.trim() : "";
        return { categoryId: slug || docSnap.id };
      })
      .filter(({ categoryId }) => categoryId !== RESERVED_CATEGORY_SLUG);

    return params;
  } catch (err) {
    console.error("[generateStaticParams] /danh-muc/[categoryId]: không fetch được categories:", err);
    return [];
  }
}

export default function CategoryProductsPage() {
  return <CategoryProductsClient />;
}
