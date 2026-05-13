"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import type { ProductFromFirestore } from "@/components/ProductGrid";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { createSlug, ensureUniqueSlug } from "@/lib/slug";

type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
};

type ProductFormState = {
  name: string;
  categoryId: string;
  price: string;
  desc: string;
  badgeType: "" | "HOT" | "NEW" | "SALE";
  discountPercent: string;
};

type EditProductModalProps = {
  product: ProductFromFirestore | null;
  onClose: () => void;
  onSuccess?: () => void;
  onSaved?: (updatedProduct: ProductFromFirestore) => void;
  isOpen?: boolean;
};

export function EditProductModal({
  product,
  onClose,
  onSuccess,
  onSaved,
  isOpen = true,
}: EditProductModalProps) {
  const [form, setForm] = useState<ProductFormState>({
    name: "",
    categoryId: "",
    price: "Liên hệ",
    desc: "",
    badgeType: "",
    discountPercent: "",
  });
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [longDescription, setLongDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const parentCategories = useMemo(
    () => categories.filter((category) => !category.parentId),
    [categories],
  );
  const childCategories = useMemo(
    () => categories.filter((category) => Boolean(category.parentId)),
    [categories],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
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

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen || !product) return;
    setForm({
      name: product.name ?? "",
      categoryId: product.categoryId ?? "",
      price: product.price ?? "Liên hệ",
      desc: product.desc ?? "",
      badgeType: product.badgeType === "HOT" || product.badgeType === "NEW" || product.badgeType === "SALE"
        ? product.badgeType
        : "",
      discountPercent:
        typeof product.discountPercent === "number" && Number.isFinite(product.discountPercent)
          ? String(product.discountPercent)
          : "",
    });
    setLongDescription(product.longDescription ?? "");
    setFile(null);
    setError(null);
  }, [isOpen, product]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!product?.id) return;
    if (!form.name.trim()) {
      setError("Vui lòng nhập tên sản phẩm.");
      return;
    }
    if (!form.categoryId) {
      setError("Vui lòng chọn danh mục.");
      return;
    }

    const matchedCategory = categories.find((category) => category.id === form.categoryId);
    if (!matchedCategory) {
      setError("Danh mục đã chọn không hợp lệ.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = file
        ? await uploadImageToCloudinary(file)
        : (product.image ?? "");
      const name = form.name.trim();

      // Chỉ sinh slug mới khi tên thực sự đổi (hoặc sản phẩm chưa có slug).
      // Trường hợp này tránh đổi slug "vô cớ" mỗi lần lưu các trường khác và
      // cũng giúp `ensureUniqueSlug` không tốn query khi không cần thiết.
      const previousName = String(product.name ?? "").trim();
      const previousSlug = String(product.slug ?? "").trim();
      const nameChanged = name !== previousName;
      const needsSlug = nameChanged || !previousSlug;
      const slug = needsSlug
        ? (
            await ensureUniqueSlug({
              db,
              collectionName: "products",
              baseSlug: createSlug(name),
              excludeDocId: product.id,
            })
          )
            .trim()
            .toLowerCase()
        : previousSlug;
      const price = form.price.trim() || "Liên hệ";
      const desc = form.desc.trim();
      const badgeType = form.badgeType || null;
      const discountPercent =
        badgeType === "SALE"
          ? Number.parseInt(form.discountPercent, 10) || null
          : null;

      await updateDoc(doc(db, "products", product.id), {
        name,
        slug,
        categoryId: form.categoryId,
        categoryName: matchedCategory.name,
        price,
        desc,
        badgeType,
        discountPercent,
        image: imageUrl,
        longDescription,
      });

      setToast("Cập nhật sản phẩm thành công.");
      onSuccess?.();
      onSaved?.({
        ...product,
        name,
        slug,
        categoryId: form.categoryId,
        categoryName: matchedCategory.name,
        price,
        desc,
        badgeType,
        discountPercent,
        image: imageUrl,
        longDescription,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật sản phẩm.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen || !product) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">Sửa thông tin sản phẩm</h2>

          <form onSubmit={handleUpdate} className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Tên sản phẩm
              </label>
              <input
                required
                disabled={isLoading}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Danh mục
              </label>
              <select
                required
                disabled={isLoading}
                value={form.categoryId}
                onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              >
                {parentCategories.map((parent) => {
                  const children = childCategories.filter(
                    (child) => child.parentId === parent.id,
                  );
                  if (children.length === 0) return null;
                  return (
                    <optgroup key={parent.id} label={parent.name}>
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
                {childCategories.length === 0 ? (
                  <option value="">Chưa có danh mục con</option>
                ) : null}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Giá</label>
              <input
                disabled={isLoading}
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Trạng thái (Badge)
                </label>
                <select
                  disabled={isLoading}
                  value={form.badgeType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      badgeType: e.target.value as ProductFormState["badgeType"],
                      discountPercent: e.target.value === "SALE" ? prev.discountPercent : "",
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Không có</option>
                  <option value="HOT">HOT</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                </select>
              </div>

              {form.badgeType === "SALE" ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">% Giảm giá</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    disabled={isLoading}
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, discountPercent: e.target.value }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    placeholder="Ví dụ: 20"
                  />
                </div>
              ) : (
                <div />
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                rows={4}
                disabled={isLoading}
                value={form.desc}
                onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
                className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Chi tiết dịch vụ (Bài viết)
              </label>
              <RichTextEditor value={longDescription} onChange={setLongDescription} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ảnh mới (không chọn để giữ ảnh cũ)
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={isLoading}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700 hover:file:bg-red-100"
              />
            </div>

            {error ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-60 -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-900 shadow-lg">
          {toast}
        </div>
      ) : null}
    </>
  );
}

export default EditProductModal;
