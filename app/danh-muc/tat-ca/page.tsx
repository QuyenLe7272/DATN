import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid, { type ProductFromFirestore } from "@/components/ProductGrid";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description: "Danh sách tất cả sản phẩm bảng hiệu và dịch vụ đang có.",
};

export default async function AllProductsPage() {
  const snapshot = await getDocs(collection(db, "products"));
  const products = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  })) as ProductFromFirestore[];

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Tất cả sản phẩm" }]} />

          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-8">Tất cả sản phẩm</h1>

          {products.length === 0 ? (
            <p className="text-gray-600">Hiện chưa có sản phẩm nào trong danh mục này</p>
          ) : (
            <ProductGrid
              initialProducts={products}
              projects={[]}
              hideHeader
              hideProjects
              disableOuterContainer
            />
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

