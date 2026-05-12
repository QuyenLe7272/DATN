"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductInteractive, { type ProductData } from "@/components/product/ProductInteractive";
import {
  RelatedProductsMobile,
  RelatedProductsSidebar,
  type RelatedProductItem,
} from "@/components/product/RelatedProducts";
import {
  chunkArray,
  FIRESTORE_IN_MAX,
  getFamilyMemberCategoryIds,
  parseCategoryParentId,
  resolveFamilyCategoryId,
  type CategoryTreeRow,
} from "@/lib/categoryFamily";
import {
  sortRelatedProductsForDetail,
  type RelatedProductSortable,
} from "@/lib/sortRelatedProducts";
import { buildCategoryHref } from "@/lib/slug";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import "react-quill-new/dist/quill.snow.css";

const MAX_RELATED_PRODUCTS = 6;

type CategoryLookupRow = CategoryTreeRow & {
  name?: string;
  slug?: string;
};

type ProductRecord = ProductData & {
  categoryId?: string;
  longDescription?: string;
};

// generateStaticParams removed because this page now fetches product data dynamically on the client.

function LoadingView() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="grow">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="flex min-w-0 flex-col gap-10 md:col-span-3">
            <div className="h-5 w-56 animate-pulse rounded bg-slate-200" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              <div className="aspect-square w-full animate-pulse rounded-2xl bg-slate-200 md:col-span-1" />
              <div className="space-y-4 md:col-span-2">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
                <div className="rounded-2xl border border-slate-100 bg-white p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white px-6 py-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-red-600" />
                <span>Đang tải chi tiết sản phẩm...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function MessageView({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="grow flex items-center justify-center px-4 py-24">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-800">{message}</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const slug = String(params.id ?? "").trim();

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [categories, setCategories] = useState<CategoryLookupRow[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProductItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "not-found" | "error">("loading");

  useEffect(() => {
    let isActive = true;

    async function fetchProductDetail() {
      if (!slug) {
        if (isActive) {
          setProduct(null);
          setCategories([]);
          setRelatedProducts([]);
          setStatus("not-found");
        }
        return;
      }

      setStatus("loading");
      setProduct(null);
      setCategories([]);
      setRelatedProducts([]);

      try {
        const slugQuery = query(collection(db, "products"), where("slug", "==", slug), limit(1));
        const slugSnap = await getDocs(slugQuery);
        const fallbackSnap = slugSnap.docs[0] ?? (await getDoc(doc(db, "products", slug)));

        if (!isActive) return;

        if (!fallbackSnap || !fallbackSnap.exists()) {
          setStatus("not-found");
          return;
        }

        const nextProduct = {
          id: fallbackSnap.id,
          ...(fallbackSnap.data() ?? {}),
        } as ProductRecord;

        setProduct(nextProduct);

        let nextCategories: CategoryLookupRow[] = [];
        let nextRelatedProducts: RelatedProductItem[] = [];

        try {
          const categoriesSnap = await getDocs(collection(db, "categories"));
          if (!isActive) return;

          nextCategories = categoriesSnap.docs.map((catDoc) => {
            const data = catDoc.data() as Record<string, unknown>;
            return {
              id: catDoc.id,
              name: typeof data.name === "string" ? data.name.trim() : undefined,
              parentId: parseCategoryParentId(data.parentId),
              slug: typeof data.slug === "string" ? data.slug.trim() : undefined,
            };
          });

          const categoriesById = new Map<string, CategoryLookupRow>(
            nextCategories.map((item) => [item.id, item]),
          );

          const categoryIdRaw = nextProduct.categoryId;
          const categoryId =
            typeof categoryIdRaw === "string"
              ? categoryIdRaw.trim()
              : categoryIdRaw != null && String(categoryIdRaw).length > 0
                ? String(categoryIdRaw)
                : "";
          const currentCategoryName =
            typeof nextProduct.categoryName === "string"
              ? nextProduct.categoryName.trim()
              : undefined;
          const currentFamilyCategoryId = categoryId
            ? resolveFamilyCategoryId(categoriesById, categoryId)
            : "";
          const familyMemberCategoryIds = currentFamilyCategoryId
            ? getFamilyMemberCategoryIds(categoriesById.values(), currentFamilyCategoryId)
            : [];

          const mapRelatedDoc = (d: QueryDocumentSnapshot): RelatedProductSortable => {
            const data = d.data() as Record<string, unknown>;
            const rawCatId = data.categoryId;
            const categoryIdDoc =
              typeof rawCatId === "string"
                ? rawCatId.trim()
                : rawCatId != null && String(rawCatId).length > 0
                  ? String(rawCatId)
                  : undefined;
            const familyCategoryId =
              categoryIdDoc && categoryIdDoc.length > 0
                ? resolveFamilyCategoryId(categoriesById, categoryIdDoc)
                : undefined;

            return {
              id: d.id,
              name: typeof data.name === "string" ? data.name : undefined,
              slug: typeof data.slug === "string" ? data.slug.trim() : undefined,
              image: typeof data.image === "string" ? data.image : undefined,
              price: typeof data.price === "string" ? data.price : undefined,
              categoryId: categoryIdDoc,
              categoryName:
                typeof data.categoryName === "string" ? data.categoryName.trim() : undefined,
              familyCategoryId,
            };
          };

          let pool: RelatedProductSortable[] = [];
          const byDocId = new Map<string, QueryDocumentSnapshot>();

          if (familyMemberCategoryIds.length > 0) {
            const idChunks = chunkArray(familyMemberCategoryIds, FIRESTORE_IN_MAX);
            for (const catChunk of idChunks) {
              const familyProductsQuery = query(
                collection(db, "products"),
                where("categoryId", "in", catChunk),
                limit(80),
              );
              const familySnap = await getDocs(familyProductsQuery);
              if (!isActive) return;
              familySnap.docs.forEach((docItem) => {
                byDocId.set(docItem.id, docItem);
              });
            }
          } else if (categoryId) {
            const leafQuery = query(
              collection(db, "products"),
              where("categoryId", "==", categoryId),
              limit(80),
            );
            const leafSnap = await getDocs(leafQuery);
            if (!isActive) return;
            leafSnap.docs.forEach((docItem) => {
              byDocId.set(docItem.id, docItem);
            });
          }

          const broadSnap = await getDocs(query(collection(db, "products"), limit(150)));
          if (!isActive) return;
          broadSnap.docs.forEach((docItem) => {
            if (!byDocId.has(docItem.id)) {
              byDocId.set(docItem.id, docItem);
            }
          });

          pool = Array.from(byDocId.values()).map(mapRelatedDoc);

          nextRelatedProducts = sortRelatedProductsForDetail(
            pool,
            {
              id: nextProduct.id,
              categoryId: categoryId || undefined,
              categoryName: currentCategoryName,
              familyCategoryId: currentFamilyCategoryId || undefined,
            },
            MAX_RELATED_PRODUCTS,
          );

          if (nextRelatedProducts.length === 0) {
            const refillSnap = await getDocs(query(collection(db, "products"), limit(200)));
            if (!isActive) return;
            pool = refillSnap.docs.map(mapRelatedDoc);
            nextRelatedProducts = sortRelatedProductsForDetail(
              pool,
              {
                id: nextProduct.id,
                categoryId: categoryId || undefined,
                categoryName: currentCategoryName,
                familyCategoryId: currentFamilyCategoryId || undefined,
              },
              MAX_RELATED_PRODUCTS,
            );
          }

          if (process.env.NODE_ENV === "development") {
            console.log(
              "[product-detail-client] relatedProducts count=%s",
              nextRelatedProducts.length,
            );
          }
        } catch (error) {
          console.error("[product-detail-client] related data failed:", error);
        }

        if (!isActive) return;

        setCategories(nextCategories);
        setRelatedProducts(nextRelatedProducts);
        setStatus("ready");
      } catch (error: unknown) {
        console.error("[product-detail-client] fetch failed:", error);
        if (!isActive) return;
        setStatus("error");
      }
    }

    fetchProductDetail();
    return () => {
      isActive = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!product) return;

    const title = `${product.name ?? "Sản phẩm"} | In1991`;
    document.title = title;

    const description =
      product.desc?.trim() ||
      product.description?.trim() ||
      `Chi tiết sản phẩm ${product.name ?? "đang cập nhật"}.`;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [product]);

  const categoriesById = useMemo(
    () => new Map<string, CategoryLookupRow>(categories.map((item) => [item.id, item])),
    [categories],
  );

  const currentCategory = useMemo(() => {
    if (!product?.categoryId) return null;
    return categoriesById.get(product.categoryId) ?? null;
  }, [categoriesById, product]);

  const currentCategoryHref = currentCategory ? buildCategoryHref(currentCategory) : "/danh-muc/tat-ca";
  const currentCategoryLabel =
    currentCategory?.name || product?.categoryName?.trim() || "Danh mục";

  const relatedProductsForInteractive: ProductData[] = useMemo(
    () =>
      relatedProducts.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price: item.price,
      })),
    [relatedProducts],
  );

  if (status === "loading") {
    return <LoadingView />;
  }

  if (status === "not-found") {
    return <MessageView message="Sản phẩm không tồn tại" />;
  }

  if (status === "error" || !product) {
    return <MessageView message="Không thể tải sản phẩm vào lúc này" />;
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="grow">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="flex min-w-0 flex-col gap-10 md:col-span-3">
            <Breadcrumbs
              items={[
                { label: "Trang chủ", href: "/" },
                {
                  label: currentCategoryLabel,
                  href: currentCategoryHref,
                },
                { label: product.name || "Chi tiết sản phẩm" },
              ]}
            />
            <ProductInteractive product={product} relatedProducts={relatedProductsForInteractive} />
            <RelatedProductsMobile products={relatedProducts} />

            <div className="w-full overflow-hidden rounded-2xl border border-slate-100/90 bg-slate-50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
              <h2 className="mb-8 text-2xl font-bold text-slate-800">Thông Tin Sản Phẩm & Dịch Vụ</h2>
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .quill-content-fix * {
                    white-space: normal !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                    display: inline-block !important;
                    width: auto !important;
                  }
                  .quill-content-fix p, .quill-content-fix div {
                    display: block !important;
                    width: 100% !important;
                  }
                `,
                }}
              />
              <div className="ql-snow">
                <div
                  className="ql-editor quill-content-fix px-0 text-base leading-relaxed text-slate-600 md:text-lg"
                  dangerouslySetInnerHTML={{
                    __html: product.longDescription || "",
                  }}
                />
              </div>
            </div>
          </div>

          <RelatedProductsSidebar products={relatedProducts} />
        </div>
      </div>

      <Footer />
    </main>
  );
}