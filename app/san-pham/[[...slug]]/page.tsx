import type { Metadata } from "next";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSlug } from "@/lib/slug";
import ProductDetailClient from "./ProductDetailClient";

type ProductRouteParams = {
  slug?: string[];
};

export const metadata: Metadata = {
  title: "Sản phẩm | In1991",
  description: "Khám phá danh mục sản phẩm và dịch vụ tại In1991.",
};

// Chế độ dev/SSR: cho phép Next.js render bất kỳ slug nào tại request-time.
// Sản phẩm mới thêm vào Firestore (sau lần build gần nhất) vẫn truy cập được
// ngay mà không cần rebuild. Khi quay lại Static Export, đổi thành `false`.
export const dynamicParams = true;

// Số slug pre-render tối đa cho `next build` và `next dev`. Giới hạn này
// giúp dev server khởi động nhanh và tránh đọc toàn bộ collection products
// cho mỗi lần build. Slug ngoài danh sách vẫn render được nhờ
// `dynamicParams = true`.
const STATIC_PARAMS_LIMIT = 30;

// Pre-render trước một số slug để vào trang nhanh, tốt cho SEO; số còn lại
// được render lười tại request-time.
export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(
      query(collection(db, "products"), limit(STATIC_PARAMS_LIMIT)),
    );
    const params = snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data() as { slug?: unknown; name?: unknown };
        const rawSlug =
          typeof data.slug === "string" ? data.slug.trim() : "";
        const slug = rawSlug || createSlug(String(data.name ?? "")) || docSnap.id;
        return { slug: [slug] };
      })
      .filter((entry) => entry.slug[0]);

    return [{ slug: [] }, ...params];
  } catch (err) {
    console.error(
      "[generateStaticParams] /san-pham/[[...slug]]: không fetch được products:",
      err,
    );
    return [{ slug: [] }];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<ProductRouteParams>;
}) {
  const { slug } = await params;
  const id = slug?.[0] || "";
  return <ProductDetailClient id={id} />;
}
