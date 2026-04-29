"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { Search } from "lucide-react";
import type { ProductFromFirestore } from "@/components/ProductGrid";
import { db } from "@/lib/firebase";
import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";
import { AddCategoryModal } from "./AddCategoryModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

type AdminProductsPanelProps = {
  initialProducts: ProductFromFirestore[];
};

export function AdminProductsPanel({
  initialProducts,
}: AdminProductsPanelProps) {
  const [products, setProducts] =
    useState<ProductFromFirestore[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductFromFirestore | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const next = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: String(docSnap.data().name ?? "").trim(),
      }));
      setCategories(next.filter((item) => item.name));
    });
    return () => unsubscribe();
  }, []);

  const isUncategorizedProduct = (product: ProductFromFirestore) => {
    const hasMissingCategoryField = !product.categoryId || product.categoryId === "uncategorized";
    const hasMissingCategoryName = !String(product.categoryName ?? "").trim();
    const categoryNotFound =
      !!product.categoryId &&
      product.categoryId !== "uncategorized" &&
      !categories.some((category) => category.id === product.categoryId);
    return hasMissingCategoryField || hasMissingCategoryName || categoryNotFound;
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aUncategorized = isUncategorizedProduct(a);
      const bUncategorized = isUncategorizedProduct(b);
      if (aUncategorized !== bUncategorized) {
        return aUncategorized ? -1 : 1;
      }
      const aName = String(a.name ?? "");
      const bName = String(b.name ?? "");
      return aName.localeCompare(bName, "vi");
    });
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return sortedProducts;
    return sortedProducts.filter((product) =>
      String(product.name ?? "").toLowerCase().includes(keyword),
    );
  }, [sortedProducts, searchTerm]);

  function handleSaved(newProduct: ProductFromFirestore) {
    setProducts((prev) => [newProduct, ...prev]);
    setToast("Đã thêm sản phẩm thành công.");
  }

  function handleUpdated(updatedProduct: ProductFromFirestore) {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      ),
    );
    setToast("Đã cập nhật sản phẩm thành công.");
    setEditingProduct(null);
  }

  function handleCategorySaved() {
    setToast("Đã thêm danh mục thành công.");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget || deletingId) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteDoc(doc(db, "products", deleteTarget.id));
      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteTarget.id),
      );
      setToast("Đã xóa sản phẩm.");
      setDeleteTarget(null);
    } catch {
      setToast("Không thể xóa sản phẩm. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Sản phẩm
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Quản lý danh mục dịch vụ trên cửa hàng.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
              <div className="relative w-full flex-1 max-w-sm">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm sản phẩm theo tên..."
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                />
              </div>
              <button
                type="button"
                onClick={() => setCategoryModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              >
                <span className="text-lg leading-none">+</span>
                Thêm danh mục
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/25 transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                <span className="text-lg leading-none">+</span>
                Thêm sản phẩm mới
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                      Hình ảnh
                    </th>
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                      Tên sản phẩm
                    </th>
                    <th className="px-4 py-3 font-semibold text-slate-700 sm:px-5">
                      Danh mục
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 sm:px-5">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        Chưa có sản phẩm nào trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-5 py-12 text-center text-slate-500"
                      >
                        Không tìm thấy sản phẩm nào khớp với từ khóa tìm kiếm
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-slate-50/80"
                      >
                        <td className="px-4 py-3 sm:px-5">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name ?? ""}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                —
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="max-w-[200px] px-4 py-3 font-medium text-slate-900 sm:max-w-none sm:px-5">
                          <span className="line-clamp-2">
                            {product.name ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 sm:px-5">
                          {isUncategorizedProduct(product) ? (
                            <div className="flex items-center font-medium text-red-500">
                              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-red-500" />
                              Chưa có danh mục
                            </div>
                          ) : (
                            <span className="line-clamp-2">
                              {product.categoryName ?? "—"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right sm:px-5">
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(product)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:text-sm"
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === product.id}
                              onClick={() =>
                                setDeleteTarget({
                                  id: product.id,
                                  name: product.name ?? "sản phẩm này",
                                })
                              }
                              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-50 sm:text-sm"
                            >
                              {deletingId === product.id ? "Đang xóa..." : "Xóa"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
      <AddCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSaved={handleCategorySaved}
      />
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSaved={handleUpdated}
      />
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.name ?? ""}
        isLoading={Boolean(deletingId)}
        onCancel={() => !deletingId && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-900 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </>
  );
}
