"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Phone, Search, ShoppingCart, X } from "lucide-react";
import { useCart } from "@/store/useCart";
import { db } from "@/lib/firebase";
import { buildCategoryHref } from "@/lib/slug";
import CartModal from "./CartModal";

type SearchSuggestion = {
  id: string;
  name: string;
  image?: string;
  slug?: string;
};

const FEATURED_PARENT_NAMES = [
  "Bảng Hiệu Quảng Cáo",
  "Biển Quảng Cáo",
  "Hộp Đèn",
] as const;

export default function Header() {
  const router = useRouter();
  const totalItems = useCart((state) => state.getTotalItems());
  const openCart = useCart((state) => state.openCart);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [categories, setCategories] = useState<
    { id: string; name: string; parentId: string | null; slug?: string }[]
  >([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const nextCategories = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as {
          name?: string;
          parentId?: unknown;
          slug?: unknown;
        };
        return {
          id: docSnap.id,
          name: String(data.name ?? "").trim(),
          parentId: typeof data.parentId === "string" ? data.parentId : null,
          slug: typeof data.slug === "string" ? data.slug.trim() : undefined,
        };
      });
      setCategories(nextCategories.filter((item) => item.name));
    });

    return () => unsubscribe();
  }, []);

  const groupedCategories = useMemo(() => {
    const parents = categories.filter(
      (category) => !category.parentId && category.id !== "uncategorized",
    );
    return parents.map((parent) => ({
      ...parent,
      children: categories.filter((category) => category.parentId === parent.id),
    }));
  }, [categories]);

  const featuredParents = useMemo(
    () =>
      FEATURED_PARENT_NAMES
        .map((name) =>
          groupedCategories.find(
            (category) => category.name.toLowerCase() === name.toLowerCase(),
          ),
        )
        .filter(
          (category): category is (typeof groupedCategories)[number] =>
            Boolean(category),
        ),
    [groupedCategories],
  );

  useEffect(() => {
    if (!isSearchOpen) return;
    const timer = window.setTimeout(() => {
      const input = document.getElementById(
        "header-search-input",
      ) as HTMLInputElement | null;
      input?.focus();
    }, 100);
    return () => window.clearTimeout(timer);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setSuggestions([]);
      return;
    }

    const keyword = searchQuery.trim().toLowerCase();
    if (keyword.length <= 1) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const snapshot = await getDocs(collection(db, "products"));
        if (cancelled) return;
        const matched = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data() as { name?: unknown; image?: unknown; slug?: unknown };
            return {
              id: docSnap.id,
              name: String(data.name ?? "").trim(),
              image: typeof data.image === "string" ? data.image : undefined,
              slug: typeof data.slug === "string" ? data.slug : undefined,
            };
          })
          .filter((item) => item.name.toLowerCase().includes(keyword))
          .slice(0, 8);
        setSuggestions(matched);
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchQuery, isSearchOpen]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const keyword = searchQuery.trim();
    if (!keyword) return;
    router.push(`/tim-kiem?q=${encodeURIComponent(keyword)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  }

  function handleSelectSuggestion(idOrSlug: string) {
    router.push(`/san-pham/${idOrSlug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  }

  function closeSearchOverlay() {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div
        className={`fixed inset-0 z-70 bg-white transition-transform duration-300 md:inset-x-0 md:top-0 md:bottom-auto md:h-auto md:shadow-lg ${isSearchOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-4 md:flex-row md:items-center md:gap-3">
          <form onSubmit={handleSearch} className="relative flex w-full items-center gap-3">
            <Search size={20} className="text-slate-500" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập từ khóa để tìm sản phẩm..."
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 md:text-base"
            />
            <button
              type="button"
              onClick={closeSearchOverlay}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 px-3 text-slate-600 transition hover:bg-slate-100"
              aria-label="Đóng tìm kiếm"
            >
              <X size={20} />
            </button>
            {searchQuery.trim().length > 1 ? (
              <div className="absolute left-0 top-full z-75 mt-1 max-h-96 w-full overflow-y-auto rounded-b-lg bg-white shadow-lg">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-slate-500">Đang tìm kiếm...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/san-pham/${item.slug || item.id}`}
                      onClick={() => handleSelectSuggestion(item.slug || item.id)}
                      className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="line-clamp-2 text-sm font-medium text-slate-700">
                        {item.name}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Không tìm thấy kết quả phù hợp
                  </div>
                )}
              </div>
            ) : null}
          </form>
        </div>
      </div>
      {/* Tăng chiều cao header lên h-24 để logo có chỗ đứng */}
      <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 py-2">
        
        {/* --- KHỐI LOGO --- */}
        {/* Thêm h-full để báo cho thẻ Link biết nó cao bằng Header */}
        <Link href="/" className="flex h-full shrink-0 items-center">
          <Image
            src="/icon.jpg"
            alt="Logo in1991"
            width={200}
            height={200}
            className="h-full w-auto object-contain"
            priority
          />
        </Link>

        {/* --- KHỐI MENU ĐIỀU HƯỚNG --- */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-base font-medium text-slate-700 transition hover:text-orange-600"
              >
                <span className="text-lg leading-none">≡</span>
                Danh mục sản phẩm
              </button>
              <div className="pointer-events-none absolute left-0 top-full z-100 min-w-[260px] pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <ul className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                  {groupedCategories.map((parent) => (
                    <li key={parent.id} className="group/item relative">
                      <div className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-red-600">
                        <Link href={buildCategoryHref(parent)} className="flex-1">
                          {parent.name}
                        </Link>
                        {parent.children.length > 0 ? (
                          <span className="ml-2 text-xs text-slate-400">▸</span>
                        ) : null}
                      </div>
                      {parent.children.length > 0 ? (
                        <div className="pointer-events-none absolute left-full top-0 z-110 pl-2 opacity-0 transition-opacity duration-150 group-hover/item:pointer-events-auto group-hover/item:opacity-100">
                          <ul className="min-w-[240px] rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                            {parent.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={buildCategoryHref(child)}
                                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            {featuredParents.map((parent) => (
              <li key={parent.id} className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-base font-medium text-slate-700 transition hover:text-orange-600"
                >
                  {parent.name}
                  {parent.children.length > 0 ? (
                    <span className="text-xs text-slate-400 transition group-hover:rotate-180">
                      ▼
                    </span>
                  ) : null}
                </button>
                {parent.children.length > 0 ? (
                  <div className="pointer-events-none absolute left-0 top-full z-90 min-w-[230px] pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                      {parent.children.map((child) => (
                        <Link
                          key={child.id}
                          href={buildCategoryHref(child)}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-red-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
            <li>
              <Link
                href="/lien-he"
                className="text-base font-medium text-slate-700 transition hover:text-orange-600"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>

        {/* --- KHỐI GIỎ HÀNG + HOTLINE --- */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={openCart}
            className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-slate-300 hover:text-red-600"
            aria-label="Mở giỏ hàng"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 px-2.5 sm:px-3 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-red-600 sm:h-10"
          >
            <Search size={18} />
            <span className="hidden text-sm font-semibold md:inline">Tìm kiếm</span>
          </button>
          <a
            href="tel:0905741733"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-red-600 px-3 text-xs font-bold text-white shadow-md transition hover:bg-red-700 sm:h-10 sm:px-4 sm:text-sm md:px-6"
          >
            <Phone size={14} />
            <span className="hidden sm:inline">Hotline:</span>
            <span>0905.741.733</span>
          </a>
        </div>
      </div>
      <CartModal />
    </header>
  );
}