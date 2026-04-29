"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid, { type ProductFromFirestore } from "@/components/ProductGrid";
import { db } from "@/lib/firebase";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const normalizedQuery = q.trim().toLowerCase();
  const [allProducts, setAllProducts] = useState<ProductFromFirestore[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "products"));
        if (cancelled) return;
        const nextProducts = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ProductFromFirestore[];
        setAllProducts(nextProducts);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) return [];
    return allProducts.filter((item) =>
      String(item.name ?? "").toLowerCase().includes(normalizedQuery),
    );
  }, [allProducts, normalizedQuery]);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Breadcrumbs
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Tìm kiếm" },
            ]}
          />

          <h1 className="mb-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
            Kết quả tìm kiếm cho: {q || "Từ khóa trống"}
          </h1>
          <p className="mb-8 text-sm text-slate-500">
            {loading
              ? "Đang tải dữ liệu sản phẩm..."
              : `Tìm thấy ${filteredProducts.length} kết quả phù hợp.`}
          </p>
        </div>

        {!loading && filteredProducts.length === 0 ? (
          <div className="mx-auto mb-16 max-w-7xl px-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-8 text-center text-slate-600">
              Rất tiếc, không có sản phẩm nào phù hợp với tìm kiếm của bạn
            </div>
          </div>
        ) : (
          <ProductGrid
            initialProducts={filteredProducts}
            products={filteredProducts}
            projects={[]}
            hideHeader
            hideProjects
          />
        )}
      </div>
      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white flex flex-col">
          <Header />
          <div className="grow flex items-center justify-center py-24 text-slate-500">
            Đang tải…
          </div>
          <Footer />
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
