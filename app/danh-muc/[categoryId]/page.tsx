"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import Breadcrumbs from "@/components/Breadcrumbs";

type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
};

type ProductItem = {
  id: string;
  categoryId?: string;
  categoryName?: string;
  name?: string;
  price?: string;
  image?: string;
  desc?: string;
};

export default function CategoryProductsPage() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [parentCategory, setParentCategory] = useState<CategoryItem | null>(null);

  useEffect(() => {
    const unsubscribeCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      const next = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as { name?: string; parentId?: unknown };
        return {
          id: docSnap.id,
          name: String(data.name ?? "").trim(),
          parentId: typeof data.parentId === "string" ? data.parentId : null,
        };
      });
      setCategories(next.filter((item) => item.name));
    });

    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const next = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ProductItem[];
      setProducts(next);
    });

    return () => {
      unsubscribeCategories();
      unsubscribeProducts();
    };
  }, []);

  const currentCategory = useMemo(
    () => categories.find((item) => item.id === categoryId) ?? null,
    [categories, categoryId],
  );

  useEffect(() => {
    let isActive = true;

    async function fetchParentCategory() {
      if (!currentCategory?.parentId) {
        setParentCategory(null);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "categories", currentCategory.parentId));
        if (!isActive) return;
        if (!snap.exists()) {
          setParentCategory(null);
          return;
        }
        const data = snap.data() as { name?: unknown; parentId?: unknown };
        setParentCategory({
          id: snap.id,
          name: String(data.name ?? "").trim(),
          parentId: typeof data.parentId === "string" ? data.parentId : null,
        });
      } catch {
        if (!isActive) return;
        setParentCategory(null);
      }
    }

    fetchParentCategory();
    return () => {
      isActive = false;
    };
  }, [currentCategory?.parentId]);

  const activeParent = useMemo(() => {
    if (!currentCategory) return null;
    if (!currentCategory.parentId) return currentCategory;
    return categories.find((item) => item.id === currentCategory.parentId) ?? null;
  }, [categories, currentCategory]);

  const sidebarChildren = useMemo(() => {
    if (!activeParent) return [];
    return categories.filter((item) => item.parentId === activeParent.id);
  }, [categories, activeParent]);

  const filteredProducts = useMemo(() => {
    if (!currentCategory) return [];
    if (currentCategory.parentId) {
      return products.filter((product) => product.categoryId === currentCategory.id);
    }
    const validCategoryIds = [currentCategory.id, ...sidebarChildren.map((item) => item.id)];
    return products.filter(
      (product) => product.categoryId && validCategoryIds.includes(product.categoryId),
    );
  }, [currentCategory, sidebarChildren, products]);

  const currentTitle = currentCategory?.name ?? "Danh mục";
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: "Trang chủ", href: "/" },
      { label: "Danh mục sản phẩm", href: "/danh-muc/tat-ca" },
    ];

    if (parentCategory?.id && parentCategory.name) {
      items.push({ label: parentCategory.name, href: `/danh-muc/${parentCategory.id}` });
    }

    items.push({ label: currentCategory?.name || "Đang cập nhật" });
    return items;
  }, [currentCategory?.name, parentCategory?.id, parentCategory?.name]);

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <div className="max-w-7xl mx-auto w-full px-4 py-8 flex-grow">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row gap-8 py-8">
          <aside className="w-full md:w-1/4">
            <div className="rounded-t-md bg-red-600 px-4 py-3 font-bold uppercase text-white">
              {activeParent?.name ?? "Danh mục"}
            </div>
            <ul className="overflow-hidden rounded-b-md border border-slate-200 bg-white">
              {sidebarChildren.map((child) => (
                <li key={child.id} className="border-t border-slate-100 first:border-t-0">
                  <Link
                    href={`/danh-muc/${child.id}`}
                    className={`block px-4 py-3 text-sm transition-colors ${
                      child.id === categoryId
                        ? "border-l-4 border-red-600 bg-red-50 font-bold text-red-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <section className="w-full md:w-3/4">
            <h1 className="mb-6 text-3xl font-extrabold text-slate-900">{currentTitle}</h1>

            {filteredProducts.length === 0 ? (
              <p className="text-slate-500">Đang cập nhật sản phẩm...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => {
                  const desc = product.desc ?? "";
                  const preview = desc.length > 100 ? `${desc.slice(0, 100)}...` : desc;
                  return (
                    <Link href={`/san-pham/${product.id}`} key={product.id} className="block group">
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
                        <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {product.categoryName ?? ""}
                          </div>

                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name ?? "Sản phẩm"}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              priority={index === 0}
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                          ) : null}
                        </div>

                        <div className="p-6 relative bg-white z-10 border-t border-slate-100">
                          <h3 className="font-bold text-xl text-slate-800 group-hover:text-red-600 transition-colors mb-2">
                            {product.name ?? ""}
                          </h3>
                          <p className="text-slate-600 text-sm line-clamp-2">{preview}</p>

                          <div className="mt-5 flex justify-between items-center">
                            <span className="text-red-600 font-bold">
                              {product.price ?? "Liên hệ"}{" "}
                              <span className="text-xs text-slate-400 font-normal">/ m²</span>
                            </span>
                            <div className="text-red-600 font-semibold text-sm uppercase tracking-wider flex items-center">
                              Xem chi tiết <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
