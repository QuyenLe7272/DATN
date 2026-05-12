import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import ProductInteractive, { type ProductData } from '@/components/product/ProductInteractive';
import {
  RelatedProductsMobile,
  RelatedProductsSidebar,
  type RelatedProductItem,
} from '@/components/product/RelatedProducts';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  chunkArray,
  FIRESTORE_IN_MAX,
  getFamilyMemberCategoryIds,
  parseCategoryParentId,
  resolveFamilyCategoryId,
  type CategoryTreeRow,
} from '@/lib/categoryFamily';
import {
  sortRelatedProductsForDetail,
  type RelatedProductSortable,
} from '@/lib/sortRelatedProducts';
import { buildCategoryHref } from '@/lib/slug';
import 'react-quill-new/dist/quill.snow.css';

const MAX_RELATED_PRODUCTS = 6;

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type CategoryLookupRow = CategoryTreeRow & {
  name?: string;
  slug?: string;
};

export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as { slug?: unknown };
      const slug = typeof data.slug === 'string' ? data.slug.trim() : '';
      return { id: slug || docSnap.id };
    });
  } catch (err) {
    console.error('[generateStaticParams] /san-pham/[id]: không fetch được products:', err);
    return [];
  }
}

export default async function ProductDetail({ params }: ProductPageProps) {
  const { id } = await params;
  let docSnap: import("firebase/firestore").QueryDocumentSnapshot | import("firebase/firestore").DocumentSnapshot | null =
    null;

  try {
    const slugQuery = query(
      collection(db, 'products'),
      where('slug', '==', id),
      limit(1),
    );
    const slugSnap = await getDocs(slugQuery);
    docSnap = slugSnap.docs[0] ?? (await getDoc(doc(db, 'products', id)));
  } catch (err: unknown) {
    const code = typeof err === 'object' && err ? (err as { code?: unknown }).code : undefined;
    if (code === 'failed-precondition') {
      console.error((err as { message?: unknown }).message);
      return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
          <Header />
          <div className="grow flex items-center justify-center px-4 py-24">
            <p className="text-slate-500">Đang cấu hình dữ liệu, vui lòng thử lại sau</p>
          </div>
          <Footer />
        </main>
      );
    }
    throw err;
  }

  if (!docSnap || !docSnap.exists()) {
    notFound();
  }

  const product = {
    id: docSnap.id,
    ...(docSnap.data() ?? {}),
  } as {
    id: string;
    categoryId?: string;
    name?: string;
    slug?: string;
    badgeType?: "HOT" | "NEW" | "SALE" | null;
    discountPercent?: number | null;
    image?: string;
    price?: string;
    desc?: string;
    description?: string;
    longDescription?: string;
    categoryName?: string;
  };

  const categoryIdRaw = product.categoryId;
  const categoryId =
    typeof categoryIdRaw === 'string'
      ? categoryIdRaw.trim()
      : categoryIdRaw != null && String(categoryIdRaw).length > 0
        ? String(categoryIdRaw)
        : '';

  const currentCategoryName =
    typeof product.categoryName === 'string' ? product.categoryName.trim() : undefined;

  const categoriesById = new Map<string, CategoryLookupRow>();
  try {
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    categoriesSnap.docs.forEach((catDoc) => {
      const data = catDoc.data() as Record<string, unknown>;
      categoriesById.set(catDoc.id, {
        id: catDoc.id,
        name: typeof data.name === 'string' ? data.name.trim() : undefined,
        parentId: parseCategoryParentId(data.parentId),
        slug: typeof data.slug === 'string' ? data.slug.trim() : undefined,
      });
    });
  } catch {
    /* ignore */
  }

  const currentFamilyCategoryId = categoryId
    ? resolveFamilyCategoryId(categoriesById, categoryId)
    : '';
  const familyMemberCategoryIds = currentFamilyCategoryId
    ? getFamilyMemberCategoryIds(categoriesById.values(), currentFamilyCategoryId)
    : [];
  const currentCategory = categoryId ? categoriesById.get(categoryId) ?? null : null;
  const currentCategoryHref = currentCategory ? buildCategoryHref(currentCategory) : '/danh-muc/tat-ca';
  const currentCategoryLabel =
    currentCategory?.name || currentCategoryName || 'Danh mục';

  const mapRelatedDoc = (d: QueryDocumentSnapshot): RelatedProductSortable => {
    const data = d.data() as Record<string, unknown>;
    const rawCatId = data.categoryId;
    const categoryIdDoc =
      typeof rawCatId === 'string'
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
      name: typeof data.name === 'string' ? data.name : undefined,
      slug: typeof data.slug === 'string' ? data.slug.trim() : undefined,
      image: typeof data.image === 'string' ? data.image : undefined,
      price: typeof data.price === 'string' ? data.price : undefined,
      categoryId: categoryIdDoc,
      categoryName:
        typeof data.categoryName === 'string' ? data.categoryName.trim() : undefined,
      familyCategoryId,
    };
  };

  let relatedProducts: RelatedProductItem[] = [];

  let pool: RelatedProductSortable[] = [];
  try {
    const byDocId = new Map<string, QueryDocumentSnapshot>();

    if (familyMemberCategoryIds.length > 0) {
      const idChunks = chunkArray(familyMemberCategoryIds, FIRESTORE_IN_MAX);
      for (const catChunk of idChunks) {
        const familyProductsQuery = query(
          collection(db, 'products'),
          where('categoryId', 'in', catChunk),
          limit(80),
        );
        const familySnap = await getDocs(familyProductsQuery);
        familySnap.docs.forEach((docItem) => {
          byDocId.set(docItem.id, docItem);
        });
      }
    } else if (categoryId) {
      const leafQuery = query(
        collection(db, 'products'),
        where('categoryId', '==', categoryId),
        limit(80),
      );
      const leafSnap = await getDocs(leafQuery);
      leafSnap.docs.forEach((docItem) => {
        byDocId.set(docItem.id, docItem);
      });
    }

    const broadSnap = await getDocs(query(collection(db, 'products'), limit(150)));
    broadSnap.docs.forEach((docItem) => {
      if (!byDocId.has(docItem.id)) {
        byDocId.set(docItem.id, docItem);
      }
    });

    pool = Array.from(byDocId.values()).map(mapRelatedDoc);
  } catch {
    pool = [];
  }

  relatedProducts = sortRelatedProductsForDetail(
    pool,
    {
      id: product.id,
      categoryId: categoryId || undefined,
      categoryName: currentCategoryName,
      familyCategoryId: currentFamilyCategoryId || undefined,
    },
    MAX_RELATED_PRODUCTS,
  );

  if (relatedProducts.length === 0) {
    try {
      const refillSnap = await getDocs(query(collection(db, 'products'), limit(200)));
      pool = refillSnap.docs.map(mapRelatedDoc);
      relatedProducts = sortRelatedProductsForDetail(
        pool,
        {
          id: product.id,
          categoryId: categoryId || undefined,
          categoryName: currentCategoryName,
          familyCategoryId: currentFamilyCategoryId || undefined,
        },
        MAX_RELATED_PRODUCTS,
      );
    } catch {
      /* ignore */
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[product-detail] relatedProducts count=%s (for sidebar/mobile + ProductInteractive)", relatedProducts.length);
    if (relatedProducts.length === 0) {
      console.warn("[product-detail] relatedProducts still empty after refill; check Firestore products collection.");
    }
  }

  const relatedProductsForInteractive: ProductData[] = relatedProducts.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    image: r.image,
    price: r.price,
  }));

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="grow">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-8 md:grid-cols-4">
          <div className="flex min-w-0 flex-col gap-10 md:col-span-3">
            <Breadcrumbs
              items={[
                { label: 'Trang chủ', href: '/' },
                {
                  label: currentCategoryLabel,
                  href: currentCategoryHref,
                },
                { label: product?.name || 'Chi tiết sản phẩm' },
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
                    __html: product.longDescription || '',
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