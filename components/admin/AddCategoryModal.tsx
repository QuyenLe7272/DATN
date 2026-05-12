"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createSlug, ensureUniqueSlug } from "@/lib/slug";

type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
};

type AddCategoryModalProps = {
  onClose: () => void;
  isOpen?: boolean;
  onSaved?: () => void;
  excludedRootIds?: string[];
};

export function AddCategoryModal({
  onClose,
  isOpen = true,
  onSaved,
  excludedRootIds = [],
}: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [parentCategories, setParentCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

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

      setParentCategories(
        next.filter(
          (category) =>
            category.name &&
            (!category.parentId || category.parentId === "uncategorized") &&
            !excludedRootIds.includes(category.id),
        ),
      );
    });

    return () => unsubscribe();
  }, [excludedRootIds]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function handleSave() {
    if (!name.trim()) {
      setError("Vui lòng nhập tên danh mục.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const trimmedName = name.trim();
      const baseSlug = createSlug(trimmedName);
      const slug = await ensureUniqueSlug({
        db,
        collectionName: "categories",
        baseSlug,
      });
      await addDoc(collection(db, "categories"), {
        name: trimmedName,
        slug,
        parentId: parentId || null,
      });
      setToast("Đã thêm danh mục thành công.");
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể lưu danh mục.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-900">Thêm danh mục mới</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Tên danh mục
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                placeholder="Nhập tên danh mục..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Danh mục cha
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">Không có (Đây là danh mục lớn)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
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
