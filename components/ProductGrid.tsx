"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type ProductFromFirestore = {
  id: string;
  categoryId?: string;
  categoryName?: string;
  name?: string;
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
  const [products, setProducts] = useState<ProductFromFirestore[]>(
    productsOverride ?? initialProducts,
  );
  const [categories, setCategories] = useState<CategoryFromFirestore[]>([]);

  useEffect(() => {
    if (!productsOverride) return;
    setProducts(productsOverride);
  }, [productsOverride]);

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
        parentId:
          typeof docSnap.data().parentId === 'string'
            ? docSnap.data().parentId
            : null,
      }));
      setCategories(updatedCategories.filter((category) => category.name));
    });

    return () => unsubscribe();
  }, []);

  const parentCategories = categories.filter((category) => !category.parentId);
  const childCategories = categories.filter((category) => Boolean(category.parentId));
  const categorySections = useMemo(() => {
    return parentCategories
      .map((parent) => {
        const children = childCategories.filter((child) => child.parentId === parent.id);
        const validCategoryIds = [parent.id, ...children.map((child) => child.id)];
        const sectionProducts = products.filter(
          (product) => product.categoryId && validCategoryIds.includes(product.categoryId),
        );
        return {
          parent,
          children,
          sectionProducts,
        };
      })
      .filter((section) => section.sectionProducts.length > 0);
  }, [parentCategories, childCategories, products]);

  const sectionClassName = disableOuterContainer
    ? "bg-slate-50"
    : "py-16 max-w-7xl mx-auto px-4 bg-slate-50";

  return (
    <section className={sectionClassName}>
      {!hideHeader ? (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 uppercase">DỊCH VỤ CỦA CHÚNG TÔI</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Khám phá các giải pháp thi công bảng hiệu chuyên nghiệp, đa dạng chất liệu, phù hợp với mọi nhu cầu và ngân sách của bạn.</p>
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
                href={`/danh-muc/${section.parent.id}`}
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
                    <Link href={`/danh-muc/${child.id}`} className="hover:text-red-600">
                      {child.name}
                    </Link>
                    {index < section.children.length - 1 ? <span>|</span> : null}
                </React.Fragment>
              ))}
              <Link
                href={`/danh-muc/${section.parent.id}`}
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
              return (
                <Link href={`/san-pham/${product.id}`} key={product.id} className="block group">
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer">
                    <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
                      <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.categoryName ?? ''}
                      </div>

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
                        <span className="text-red-600 font-bold">{product.price ?? 'Liên hệ'} <span className="text-xs text-slate-400 font-normal">/ m²</span></span>
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
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 uppercase">Dự án tiêu biểu</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
              Một số công trình bảng hiệu đã thực hiện. Xem đầy đủ tại trang dự án.
            </p>
            <Link
              href="/du-an"
              className="inline-block mt-4 text-red-600 font-semibold text-sm hover:underline"
            >
              Xem tất cả dự án →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <Link
                href="/du-an"
                key={project.id}
                className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 w-full bg-slate-100">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title ?? 'Dự án'}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  ) : null}
                  {project.type ? (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {project.type}
                    </div>
                  ) : null}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {project.title ?? ''}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}