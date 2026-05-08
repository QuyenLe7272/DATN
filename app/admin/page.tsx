"use client";

import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useCallback, useEffect, useId, useRef, useState } from "react";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dkkxbcn56/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "bannerxuongin1991";

type BannerDoc = {
  id: string;
  title: string;
  link: string;
  imageUrl: string;
};

type BannerRow = BannerDoc & { sortMs: number };

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: { message?: string };
};

async function uploadBannerImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "banner");

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = (await res.json()) as CloudinaryUploadResponse;
  if (!res.ok) {
    throw new Error(data.error?.message ?? `Upload ảnh thất bại (${res.status}).`);
  }
  const url = data.secure_url;
  if (!url || typeof url !== "string") {
    throw new Error("Cloudinary không trả về secure_url.");
  }
  return url;
}

export default function AdminPage() {
  const titleFieldId = useId();
  const linkFieldId = useId();
  const fileFieldId = useId();

  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  const [banners, setBanners] = useState<BannerDoc[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formFeedback, setFormFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [listFeedback, setListFeedback] = useState<{ kind: "err"; text: string } | null>(null);

  /** Thống kê: giữ nguyên logic đếm như trước (products + categories). */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [productsSnap, categoriesSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "categories")),
        ]);
        if (!cancelled) {
          setProductCount(productsSnap.size);
          setCategoryCount(categoriesSnap.size);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setProductCount(0);
          setCategoryCount(0);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "banners"),
      (snap) => {
        const rows: BannerRow[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          const createdAt = data.createdAt as { toMillis?: () => number } | undefined;
          return {
            id: d.id,
            title: String(data.title ?? ""),
            link: String(data.link ?? ""),
            imageUrl: String(data.imageUrl ?? ""),
            sortMs: typeof createdAt?.toMillis === "function" ? createdAt.toMillis() : 0,
          };
        });
        rows.sort((a, b) => b.sortMs - a.sortMs);
        setBanners(
          rows.map((row) => {
            const { sortMs, ...rest } = row;
            void sortMs;
            return rest;
          }),
        );
        setBannersLoading(false);
      },
      (err) => {
        console.error(err);
        setBannersLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const clearPreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    clearPreview();
    setBannerFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setPreviewUrl(url);
    }
    e.target.value = "";
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);
    if (!(title || "").trim()) {
      setFormFeedback({ kind: "err", text: "Vui lòng nhập tiêu đề banner." });
      return;
    }
    if (!bannerFile) {
      setFormFeedback({ kind: "err", text: "Vui lòng chọn ảnh banner." });
      return;
    }

    setIsSaving(true);
    try {
      const imageUrl = await uploadBannerImageToCloudinary(bannerFile);

      await addDoc(collection(db, "banners"), {
        title: title.trim(),
        link: link.trim(),
        imageUrl,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setLink("");
      setBannerFile(null);
      clearPreview();
      setFormFeedback({ kind: "ok", text: "Đã lưu banner." });
    } catch (err) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Không lưu được banner. Thử lại sau.";
      setFormFeedback({
        kind: "err",
        text: msg,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const executeDeleteBanner = async (banner: BannerDoc) => {
    setListFeedback(null);
    setDeletingId(banner.id);
    try {
      await deleteDoc(doc(db, "banners", banner.id));
      setPendingDeleteId(null);
    } catch (err) {
      console.error(err);
      setListFeedback({ kind: "err", text: "Không xóa được banner." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-full text-slate-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tổng quan</h1>
        <p className="mt-1 text-sm text-slate-500">Thống kê nhanh hệ thống quản trị.</p>
      </div>

      {/* Hai thẻ thống kê */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tổng sản phẩm</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {productCount === null ? "…" : productCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tổng danh mục</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {categoryCount === null ? "…" : categoryCount}
          </p>
        </div>
      </div>

      {/* Quản lý banner — ngay dưới thống kê; 2 cột desktop */}
      <section className="mt-10 w-full min-w-0" aria-labelledby="banner-management-heading">
        <h2 id="banner-management-heading" className="sr-only">
          Quản lý banner
        </h2>
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 rounded-2xl bg-white p-6 shadow-sm lg:col-span-8">
          <p className="text-lg font-semibold text-slate-800">Banner hiện có</p>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách lấy trực tiếp từ collection <code className="text-slate-700">banners</code>.
          </p>

          {listFeedback ? (
            <p className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {listFeedback.text}
            </p>
          ) : null}

          <div className="mt-6 space-y-4">
            {bannersLoading ? (
              <p className="text-sm text-slate-500">Đang tải…</p>
            ) : banners.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                Chưa có banner nào. Thêm mới ở cột bên phải (hoặc bên dưới trên điện thoại).
              </p>
            ) : (
              banners.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-200 sm:h-20 sm:w-32">
                    {b.imageUrl ? (
                      <img
                        src={b.imageUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="px-2 text-center text-xs text-slate-500">Chưa có ảnh</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-800">{b.title || "—"}</p>
                    {b.link ? (
                      <p className="mt-1 truncate text-xs text-slate-500">{b.link}</p>
                    ) : null}
                  </div>
                  <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:items-end">
                    {pendingDeleteId === b.id ? (
                      <div className="flex flex-col gap-2 sm:items-end">
                        <p className="text-xs text-slate-600">Xác nhận xóa banner này?</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(null)}
                            disabled={deletingId === b.id}
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            onClick={() => void executeDeleteBanner(b)}
                            disabled={deletingId === b.id}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="size-4"
                              aria-hidden
                            >
                              <path d="M3 6h18M8 6V4h8v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12zM10 11v6M14 11v6" />
                            </svg>
                            {deletingId === b.id ? "Đang xóa…" : "Xóa hẳn"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setListFeedback(null);
                          setPendingDeleteId(b.id);
                        }}
                        disabled={deletingId !== null}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="size-4"
                          aria-hidden
                        >
                          <path d="M3 6h18M8 6V4h8v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6h12zM10 11v6M14 11v6" />
                        </svg>
                        Xóa
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          </div>

          <div className="min-w-0 rounded-2xl bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:col-span-4 lg:self-start">
          <h2 className="text-lg font-semibold text-slate-800">Thêm banner mới</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload ảnh qua Cloudinary, lưu metadata vào Firestore.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSaveBanner}>
            {formFeedback ? (
              <p
                className={
                  formFeedback.kind === "ok"
                    ? "rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    : "rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                }
                role={formFeedback.kind === "err" ? "alert" : undefined}
              >
                {formFeedback.text}
              </p>
            ) : null}

            <div>
              <label htmlFor={titleFieldId} className="block text-sm font-medium text-slate-700">
                Tiêu đề banner
              </label>
              <input
                id={titleFieldId}
                name="banner-title"
                type="text"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="Ví dụ: Khuyến mãi tháng 5"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor={linkFieldId} className="block text-sm font-medium text-slate-700">
                Đường dẫn (khi click banner)
              </label>
              <input
                id={linkFieldId}
                name="banner-link"
                type="text"
                inputMode="url"
                value={link || ""}
                onChange={(e) => setLink(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 shadow-sm outline-none ring-slate-300 placeholder:text-slate-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                placeholder="https://…"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor={fileFieldId} className="block text-sm font-medium text-slate-700">
                Ảnh banner
              </label>
              <input
                id={fileFieldId}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-700"
              />
            </div>

            {previewUrl ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Xem trước
                </p>
                <div className="relative mx-auto max-h-40 max-w-full overflow-hidden rounded-xl bg-white">
                  <img
                    src={previewUrl}
                    alt=""
                    className="mx-auto max-h-40 w-auto object-contain"
                  />
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
            >
              {isSaving ? "Đang lưu…" : "Lưu banner"}
            </button>
          </form>
          </div>
        </div>
      </section>
    </div>
  );
}
