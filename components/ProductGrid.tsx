"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ProductBadge from "@/components/ProductBadge";

function parsePriceVnd(price?: string) {
  if (!price) return null;
  const digits = String(price).replace(/\D/g, "");
  if (!digits) return null;
  const n = Number.parseInt(digits, 10);
  return Number.isFinite(n) ? n : null;
}

function formatVnd(amount: number) {
  return `${amount.toLocaleString("vi-VN")}đ`;
}

export type ProductFromFirestore = {
  id: string;
  categoryId?: string;
  categoryName?: string;
  name?: string;
  slug?: string;
  badgeType?: "HOT" | "NEW" | "SALE" | null;
  discountPercent?: number | null;
  price?: string;
  image?: string;
  desc?: string;
  longDescription?: string;
};

export type ProjectFromFirestore = {
  id: string;
  title?: string;
  type?: string;
  description?: string;
  image?: string;
};

type CategoryFromFirestore = {
  id: string;
  name: string;
  parentId?: string | null;
  slug?: string;
};

type ProductGridProps = {
  initialProducts: ProductFromFirestore[];
  products?: ProductFromFirestore[];
  projects: ProjectFromFirestore[];
  hideHeader?: boolean;
  hideProjects?: boolean;
  disableOuterContainer?: boolean;
};

export default function ProductGrid({
  initialProducts,
  products: productsOverride,
  projects,
  hideHeader = false,
  hideProjects = false,
  disableOuterContainer = false,
}: ProductGridProps) {
  const [products, setProducts] = useState<ProductFromFirestore[]>(initialProducts);
  const [categories, setCategories] = useState<CategoryFromFirestore[]>([]);

  useEffect(() => {
    if (productsOverride) return;
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as ProductFromFirestore[];
      setProducts(updatedProducts);
    });

    return () => unsubscribe();
  }, [productsOverride]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const updatedCategories = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        name: String(docSnap.data().name ?? '').trim(),
        slug:
          typeof docSnap.data().slug === "string"
            ? String(docSnap.data().slug).trim()
            : undefined,
        parentId:
          typeof docSnap.data().parentId === 'string'
            ? docSnap.data().parentId
            : null,
      }));
      setCategories(updatedCategories.filter((category) => category.name));
    });

    return () => unsubscribe();
  }, []);

  const effectiveProducts = productsOverride ?? products;
  const parentCategories = categories.filter((category) => !category.parentId);
  const childCategories = categories.filter((category) => Boolean(category.parentId));
  const categorySections = useMemo(() => {
    return parentCategories
      .map((parent) => {
        const children = childCategories.filter((child) => child.parentId === parent.id);
        const validCategoryIds = [parent.id, ...children.map((child) => child.id)];
        const sectionProducts = effectiveProducts.filter(
          (product) => product.categoryId && validCategoryIds.includes(product.categoryId),
        );
        return {
          parent,
          children,
          sectionProducts,
        };
      })
      .filter((section) => section.sectionProducts.length > 0);
  }, [parentCategories, childCategories, effectiveProducts]);

  const sectionClassName = disableOuterContainer
    ? "bg-slate-50"
    : "py-16 max-w-7xl mx-auto px-4 bg-slate-50";

  return (
    <section className={sectionClassName}>
      {!hideHeader ? (
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-600">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l1.6 4.6L18 8l-4.4 1.4L12 14l-1.6-4.6L6 8l4.4-1.4L12 2z" />
              <path d="M19 11l.9 2.6L22 14l-2.1.7L19 17l-.9-2.3L16 14l2.1-.4L19 11z" />
            </svg>
            Dịch vụ chuyên nghiệp
          </div>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-slate-900">DỊCH VỤ CỦA </span>
            <span className="text-red-600">CHÚNG TÔI</span>
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-500 md:text-lg">
            Khám phá các giải pháp thi công bảng hiệu chuyên nghiệp, đa dạng chất liệu, phù hợp với
            mọi nhu cầu và ngân sách của bạn.
          </p>
        </div>
      ) : null}

      {categorySections.map((section) => (
        <div key={section.parent.id} className="mb-12">
          <div className="mb-6 flex items-stretch justify-between overflow-hidden rounded-t-md bg-gray-100">
            <div className="bg-red-600 px-6 py-3 text-lg font-bold uppercase text-white">
              {section.parent.name}
            </div>
            <div className="flex items-center justify-end pr-4 md:hidden">
              <Link
                href={`/danh-muc/${section.parent.slug || section.parent.id}`}
                className="font-semibold text-red-600 hover:underline"
              >
                <span className="md:hidden">Tất cả</span>
                <span className="hidden md:inline">Xem tất cả</span>
                <span className="ml-1">»</span>
              </Link>
            </div>
            <div className="hidden items-center gap-3 px-4 text-sm text-slate-700 md:flex">
              {section.children.map((child, index) => (
                <React.Fragment key={child.id}>
                    <Link href={`/danh-muc/${child.slug || child.id}`} className="hover:text-red-600">
                      {child.name}
                    </Link>
                    {index < section.children.length - 1 ? <span>|</span> : null}
                </React.Fragment>
              ))}
              <Link
                href={`/danh-muc/${section.parent.slug || section.parent.id}`}
                className="font-semibold text-red-600 hover:underline"
              >
                <span className="md:hidden">Tất cả</span>
                <span className="hidden md:inline">Xem tất cả</span>
                <span className="ml-1">»</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {section.sectionProducts.slice(0, 8).map((product, index) => {
              const desc = product.desc ?? '';
              const preview = desc.length > 100 ? `${desc.slice(0, 100)}...` : desc;
              const badgeType = product.badgeType ?? null;
              const discountPercent =
                typeof product.discountPercent === "number"
                  ? product.discountPercent
                  : null;
              const isSale = badgeType === "SALE" && discountPercent && discountPercent > 0;
              const numericPrice = parsePriceVnd(product.price);
              const originalPrice =
                isSale && numericPrice && discountPercent < 100
                  ? Math.round(numericPrice / (1 - discountPercent / 100))
                  : null;
              return (
                <Link
                  href={`/san-pham/${product.slug || product.id}`}
                  key={product.id}
                  className="block group"
                >
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
                      <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.categoryName ?? ''}
                      </div>

                      <ProductBadge
                        badgeType={badgeType}
                        discountPercent={discountPercent}
                      />

                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name ?? 'Sản phẩm'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index === 0}
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : null}
                    </div>

                    <div className="p-6 relative bg-white z-10 border-t border-slate-100">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-red-600 transition-colors mb-2">
                        {product.name ?? ''}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-2">{preview}</p>

                      <div className="mt-5 flex justify-between items-center">
                        <span className="text-red-600 font-bold">
                          {product.price ?? "Liên hệ"}{" "}
                          {isSale ? (
                            <>
                              {originalPrice ? (
                                <span className="ml-2 text-xs font-semibold text-slate-400 line-through">
                                  {formatVnd(originalPrice)}
                                </span>
                              ) : null}
                              <span className="ml-2 text-xs font-bold text-red-600">
                                -{Math.round(discountPercent ?? 0)}%
                              </span>
                            </>
                          ) : null}
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
        </div>
      ))}

      {!hideProjects && projects.length > 0 ? (
        <div className="mt-20 pt-16 border-t border-slate-200">
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold tracking-wide text-red-600">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l2 5 5 .5-4 3.4 1.4 5.1L12 14.9 7.6 17l1.4-5.1-4-3.4 5-.5 2-5z" />
              </svg>
              PORTFOLIO
            </div>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              <span className="text-slate-900">DỰ ÁN </span>
              <span className="relative inline-block text-red-600">
                TIÊU BIỂU
                <svg
                  aria-hidden
                  viewBox="0 0 180 18"
                  className="absolute -bottom-3 left-1/2 h-[18px] w-[180px] -translate-x-1/2 text-red-600/70"
                  fill="none"
                >
                  <path
                    d="M3 12c22 7 38-7 58-7s35 14 56 11 31-16 60-10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
              Một số công trình bảng hiệu đã thực hiện. Mỗi dự án đều được thiết kế và thi công{" "}
              <span className="font-bold text-slate-800">tỉ mỉ</span> với{" "}
              <span className="font-bold text-slate-800">chất lượng cao nhất</span>.
            </p>

            <Link
              href="/du-an"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-sm font-medium text-white shadow-md transition-colors hover:bg-red-700"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2l1.6 4.6L18 8l-4.4 1.4L12 14l-1.6-4.6L6 8l4.4-1.4L12 2z" />
                <path d="M19 11l.9 2.6L22 14l-2.1.7L19 17l-.9-2.3L16 14l2.1-.4L19 11z" />
              </svg>
              Xem tất cả dự án
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>

            <div className="mt-16 w-full max-w-4xl border-b border-gray-200 pb-12">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 md:text-5xl">100+</div>
                  <div className="mt-2 text-sm text-gray-500">Dự án hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 md:text-5xl">50+</div>
                  <div className="mt-2 text-sm text-gray-500">Khách hàng tin tưởng</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 md:text-5xl">5+</div>
                  <div className="mt-2 text-sm text-gray-500">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 md:text-5xl">100%</div>
                  <div className="mt-2 text-sm text-gray-500">Khách hài lòng</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <Link
                href="/du-an"
                key={project.id}
                className="group block"
              >
                <article className="rounded-2xl bg-white/80 shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-4/3">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title ?? 'Dự án'}
                        fill
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : null}

                    {project.type ? (
                      <div className="absolute left-4 top-4 z-20 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-800 shadow-sm ring-1 ring-slate-200/60">
                        {project.type}
                      </div>
                    ) : null}

                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white opacity-0 backdrop-blur-sm ring-1 ring-white/25 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        Xem chi tiết
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-4">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-2 transition-colors group-hover:text-red-600">
                      {project.title ?? ''}
                    </h3>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}