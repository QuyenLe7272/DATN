"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { ProductFromFirestore } from "@/components/ProductGrid";

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newProduct: ProductFromFirestore) => void;
};

type ProductFormState = {
  name: string;
  categoryId: string;
  price: string;
  desc: string;
};

type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
};

const initialForm: ProductFormState = {
  name: "",
  categoryId: "",
  price: "Liên hệ",
  desc: "",
};

export function AddProductModal({
  isOpen,
  onClose,
  onSaved,
}: AddProductModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [longDescription, setLongDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setForm(initialForm);
    setFile(null);
    setLongDescription("");
    setError(null);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const nextCategories = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as { name?: string; parentId?: unknown };
        return {
          id: docSnap.id,
          name: String(data.name ?? "").trim(),
          parentId: typeof data.parentId === "string" ? data.parentId : null,
        };
      });
      setCategories(nextCategories.filter((item) => item.name));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const childCategories = categories.filter((category) => category.parentId);
    if (form.categoryId || childCategories.length === 0) return;
    setForm((prev) => ({ ...prev, categoryId: childCategories[0].id }));
  }, [categories, form.categoryId]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Vui lòng chọn ảnh sản phẩm.");
      return;
    }

    const childCategories = categories.filter((category) => category.parentId);
    if (childCategories.length === 0) {
      setError("Chưa có danh mục nhỏ nào. Vui lòng tạo danh mục cha - con trước.");
      return;
    }

    const category = childCategories.find((c) => c.id === form.categoryId);
    if (!category) {
      setError("Danh mục không hợp lệ.");
      return;
    }

    setIsLoading(true);
    try {
      const secureUrl = await uploadImageToCloudinary(file);

      const name = form.name.trim();
      const price = form.price.trim() || "Liên hệ";
      const desc = form.desc.trim();
      const docRef = await addDoc(collection(db, "products"), {
        name,
        categoryId: category.id,
        categoryName: category.name,
        price,
        desc,
        image: secureUrl,
        longDescription,
      });

      reset();
      onClose();
      onSaved({
        id: docRef.id,
        name,
        categoryId: category.id,
        categoryName: category.name,
        price,
        desc,
        image: secureUrl,
        longDescription,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Không thể lưu sản phẩm.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        aria-label="Đóng"
        onClick={() => !isLoading && onClose()}
      />

      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 id={titleId} className="text-lg font-bold text-slate-900">
            Thêm sản phẩm mới
          </h2>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onClose()}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
            aria-label="Đóng hộp thoại"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label
              htmlFor="add-product-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Tên sản phẩm
            </label>
            <input
              id="add-product-name"
              required
              disabled={isLoading}
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-50"
              placeholder="Ví dụ: Bảng hiệu Alu"
            />
          </div>

          <div>
            <label
              htmlFor="add-product-category"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Danh mục
            </label>
            <select
              id="add-product-category"
              required
              disabled={isLoading}
              value={form.categoryId}
              onChange={(e) =>
                setForm((f) => ({ ...f, categoryId: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-50"
            >
              {categories.filter((category) => !category.parentId).map((parent) => {
                const children = categories.filter(
                  (category) => category.parentId === parent.id,
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
              {categories.filter((category) => category.parentId).length === 0 ? (
                <option value="">Chưa có danh mục nhỏ</option>
              ) : null}
            </select>
          </div>

          <div>
            <label
              htmlFor="add-product-price"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Giá
            </label>
            <input
              id="add-product-price"
              disabled={isLoading}
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-50"
              placeholder="Liên hệ hoặc số tiền"
            />
          </div>

          <div>
            <label
              htmlFor="add-product-desc"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Mô tả
            </label>
            <textarea
              id="add-product-desc"
              required
              rows={4}
              disabled={isLoading}
              value={form.desc}
              onChange={(e) =>
                setForm((f) => ({ ...f, desc: e.target.value }))
              }
              className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:bg-slate-50"
              placeholder="Mô tả chi tiết sản phẩm..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Chi tiết dịch vụ (Bài viết)
            </label>
            <RichTextEditor value={longDescription} onChange={setLongDescription} />
          </div>

          <div>
            <label
              htmlFor="add-product-image"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Ảnh
            </label>
            <input
              id="add-product-image"
              type="file"
              accept="image/*"
              disabled={isLoading}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
              }}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-red-700 hover:file:bg-red-100"
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onClose()}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-60"
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
