import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { notFound } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
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
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id }));
  } catch (err) {
    console.error('[generateStaticParams] /san-pham/[id]: không fetch được products:', err);
    return [];
  }
}

export default async function ProductDetail({ params }: ProductPageProps) {
  const { id } = await params;
  const docSnap = await getDoc(doc(db, 'products', id));
  if (!docSnap.exists()) {
    notFound();
  }

  const product = {
    id: docSnap.id,
    ...docSnap.data(),
  } as {
    id: string;
    categoryId?: string;
    name?: string;
    image?: string;
    price?: string;
    desc?: string;
    description?: string;
    longDescription?: string;
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
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

          <div className="max-w-6xl mx-auto mt-16 p-6 md:p-10 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông Tin Sản Phẩm & Dịch Vụ</h2>
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
                className="ql-editor quill-content-fix px-0 text-gray-700 text-base md:text-lg leading-relaxed"
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