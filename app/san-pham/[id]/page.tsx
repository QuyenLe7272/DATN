import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';
import ProductInteractive from '@/components/product/ProductInteractive';
import Breadcrumbs from '@/components/Breadcrumbs';
import 'react-quill-new/dist/quill.snow.css';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
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
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: 'Trang chủ', href: '/' },
              {
                label: 'Danh mục',
                href: product?.categoryId ? `/danh-muc/${product.categoryId}` : '/danh-muc/tat-ca',
              },
              { label: product?.name || 'Chi tiết sản phẩm' },
            ]}
          />
          <ProductInteractive product={product} />

          <div className="mx-auto mt-16 max-w-6xl overflow-hidden rounded-2xl border border-slate-100/90 bg-slate-50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:p-10">
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
      </div>

      <Footer />
    </main>
  );
}