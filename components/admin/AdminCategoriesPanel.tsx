"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { AddCategoryModal } from "./AddCategoryModal";

type CategoryItem = {
  id: string;
  name: string;
  parentId: string | null;
};

type EditCategoryModalProps = {
  isOpen: boolean;
  category: CategoryItem | null;
  categories: CategoryItem[];
  onClose: () => void;
  onSaved: () => void;
};

function EditCategoryModal({
  isOpen,
  category,
  categories,
  onClose,
  onSaved,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parentCandidates = useMemo(
    () =>
      categories.filter(
        (item) =>
          !item.parentId &&
          item.id !== "uncategorized" &&
          item.id !== category?.id, // chặn tự làm cha chính nó
      ),
    [categories, category?.id],
  );

  const filteredParents = useMemo(
    () =>
      parentCandidates.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [parentCandidates, searchTerm],
  );

  useEffect(() => {
    if (!isOpen || !category) return;
    setName(category.name);
    setParentId(category.parentId ?? "");
    setIsDropdownOpen(false);
    setSearchTerm("");
    setError(null);
  }, [isOpen, category]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Tên danh mục không được để trống.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const newParentId = parentId || null;
      const currentParentId = category.parentId;
      const isDemoting = currentParentId === null && newParentId !== null;
      const currentChildren = categories.filter((item) => item.parentId === category.id);

      if (isDemoting && currentChildren.length > 0) {
        const batch = writeBatch(db);
        batch.update(doc(db, "categories", category.id), {
          name: trimmedName,
          parentId: newParentId,
        });
        currentChildren.forEach((child) => {
          batch.update(doc(db, "categories", child.id), {
            parentId: "uncategorized",
          });
        });
        await batch.commit();
      } else {
        await updateDoc(doc(db, "categories", category.id), {
          name: trimmedName,
          parentId: newParentId,
        });
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật danh mục.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen || !category) return null;

  const selectedParentName =
    parentCandidates.find((item) => item.id === parentId)?.name ?? "Không có";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h3 className="text-lg font-bold text-slate-900">Sửa danh mục</h3>
        <form className="mt-4 space-y-4" onSubmit={handleSave}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Tên danh mục</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Danh mục cha mới</label>
            <div className="relative">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <span className="truncate">{selectedParentName}</span>
                <span className="text-xs">▼</span>
              </button>

              {isDropdownOpen ? (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                  <div className="sticky top-0 bg-white p-2">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm kiếm danh mục..."
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>
                  <ul className="max-h-60 overflow-y-auto pb-1">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setParentId("");
                          setIsDropdownOpen(false);
                          setSearchTerm("");
                        }}
                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-100"
                      >
                        Không có
                      </button>
                    </li>
                    {filteredParents.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setParentId(item.id);
                            setIsDropdownOpen(false);
                            setSearchTerm("");
                          }}
                          className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isLoading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminCategoriesPanel() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
    type: "parent" | "child";
  } | null>(null);

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
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const parentCategories = useMemo(
    () =>
      categories
        .filter((category) => !category.parentId && category.id !== "uncategorized")
        .filter((category) =>
          category.name.toLowerCase().includes(search.trim().toLowerCase()),
        ),
    [categories, search],
  );

  const childCategories = useMemo(
    () => categories.filter((category) => Boolean(category.parentId)),
    [categories],
  );

  async function handleDeleteParent(parent: CategoryItem) {
    const hasChildren = childCategories.some((child) => child.parentId === parent.id);
    if (hasChildren) {
      alert("Không thể xóa! Vui lòng chuyển hoặc xóa các danh mục con bên trong trước.");
      return;
    }
    setDeleteTarget({ id: parent.id, name: parent.name, type: "parent" });
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget || deletingId) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteDoc(doc(db, "categories", deleteTarget.id));
      setToast("Đã xóa danh mục.");
      setDeleteTarget(null);
    } catch {
      setToast("Không thể xóa danh mục.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Danh mục</h1>
            <p className="mt-1 text-sm text-slate-500">
              Quản lý danh mục cha - con bằng thẻ trực quan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm danh mục cha..."
              className="flex-1 w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium whitespace-nowrap flex items-center gap-2"
              type="button"
            >
              + Thêm danh mục mới
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900">Chưa xếp loại</h2>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {childCategories.filter((child) => child.parentId === "uncategorized").length ===
                0 ? (
                  <span className="text-sm text-slate-400">Không có danh mục con mồ côi</span>
                ) : (
                  childCategories
                    .filter((child) => child.parentId === "uncategorized")
                    .map((child) => (
                      <div
                        key={child.id}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                      >
                        <span>{child.name}</span>
                        <button
                          type="button"
                          onClick={() => setEditingCategory(child)}
                          className="text-slate-400 transition hover:text-slate-700"
                          title="Sửa"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              id: child.id,
                              name: child.name,
                              type: "child",
                            })
                          }
                          className="text-slate-400 transition hover:text-red-600"
                          title="Xóa"
                        >
                          Xóa
                        </button>
                      </div>
                    ))
                )}
              </div>
            </section>
            {parentCategories.map((parent) => {
              const children = childCategories.filter((child) => child.parentId === parent.id);
              return (
                <section
                  key={parent.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-slate-900">{parent.name}</h2>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(parent)}
                        className="text-xs font-semibold text-slate-400 transition hover:text-slate-700"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteParent(parent)}
                        className="text-xs font-semibold text-slate-400 transition hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {children.length === 0 ? (
                      <span className="text-sm text-slate-400">Chưa có danh mục con</span>
                    ) : (
                      children.map((child) => (
                        <div
                          key={child.id}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                        >
                          <span>{child.name}</span>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(child)}
                            className="text-slate-400 transition hover:text-slate-700"
                            title="Sửa"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                id: child.id,
                                name: child.name,
                                type: "child",
                              })
                            }
                            className="text-slate-400 transition hover:text-red-600"
                            title="Xóa"
                          >
                            Xóa
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <EditCategoryModal
        isOpen={Boolean(editingCategory)}
        category={editingCategory}
        categories={categories}
        onClose={() => setEditingCategory(null)}
        onSaved={() => setToast("Đã cập nhật danh mục thành công.")}
      />
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.name ?? ""}
        isLoading={Boolean(deletingId)}
        onCancel={() => !deletingId && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
      {isAddModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddModalOpen(false)}
          onSaved={() => setIsAddModalOpen(false)}
        />
      )}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[95] -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-900 shadow-lg">
          {toast}
        </div>
      ) : null}
    </>
  );
}
