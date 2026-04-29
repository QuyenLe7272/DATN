"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/useCart";

type ProductData = {
  id: string;
  name?: string;
  categoryName?: string;
  image?: string;
  images?: string[];
  price?: string;
  desc?: string;
  description?: string;
};

type ProductInteractiveProps = {
  product: ProductData;
};

export default function ProductInteractive({ product }: ProductInteractiveProps) {
  const addToCart = useCart((state) => state.addToCart);
  const openCart = useCart((state) => state.openCart);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");
  const [isHovered, setIsHovered] = useState(false);

  const productImages = useMemo(() => {
    const fromArray = (product.images ?? []).filter(Boolean);
    if (fromArray.length > 0) return fromArray;
    return product.image ? [product.image] : [];
  }, [product.images, product.image]);
  const [activeImage, setActiveImage] = useState(product.image ?? product.images?.[0] ?? "");

  useEffect(() => {
    setActiveImage(productImages[0] ?? "");
  }, [productImages]);

  useEffect(() => {
    if (!isZoomed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsZoomed(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isZoomed]);

  const name = product.name ?? "Sản phẩm";
  const categoryName = product.categoryName ?? "Danh mục";
  const description = product.desc ?? product.description ?? "Đang cập nhật mô tả sản phẩm.";
  const price = product.price ?? "Liên hệ";
  const summaryParagraphs = description
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="w-full max-w-lg mx-auto sticky top-24">
          {productImages.length > 0 ? (
            <div className="space-y-4">
              <div
                className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-zoom-in"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setTransformOrigin("50% 50%");
                }}
                onMouseMove={handleMouseMove}
              >
                <Image
                  src={activeImage || productImages[0]}
                  alt={name}
                  fill
                  onClick={() => setIsZoomed(true)}
                  className="object-cover"
                  style={{
                    transform: isHovered ? "scale(2)" : "scale(1)",
                    transformOrigin,
                    transition: "transform 0.3s ease",
                  }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {productImages.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {productImages.slice(0, 8).map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(image)}
                      className={`relative aspect-square overflow-hidden rounded-lg border bg-slate-100 transition ${
                        activeImage === image
                          ? "border-red-500 ring-2 ring-red-200"
                          : "border-slate-200 hover:border-red-300"
                      }`}
                      aria-label={`Chọn ảnh ${name}`}
                    >
                      <Image src={image} alt={name} fill className="object-cover" sizes="160px" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm flex items-center justify-center text-slate-400">
              Chưa có hình ảnh
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-red-600">{categoryName}</p>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl leading-tight">{name}</h1>
          <p className="mt-3 text-3xl font-bold text-red-600">{price}</p>

          <div className="mt-6 mb-8 h-auto rounded-xl border border-slate-100 bg-slate-50 p-5">
            <h3 className="mb-2 font-semibold text-slate-900">Tóm tắt</h3>
            <div className="text-gray-600 text-sm md:text-base space-y-2">
              {summaryParagraphs.length > 0 ? (
                summaryParagraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed">Đang cập nhật mô tả sản phẩm.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                addToCart({
                  id: product.id,
                  name,
                  price,
                  image: productImages[0] ?? "",
                  quantity: 1,
                });
                openCart();
              }}
              className="rounded-full bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700"
            >
              Thêm vào giỏ hàng
            </button>
            <Link
              href="/lien-he"
              className="rounded-full border border-slate-300 px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </div>
      {isZoomed && activeImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            aria-label="Đóng xem ảnh"
            onClick={(event) => {
              event.stopPropagation();
              setIsZoomed(false);
            }}
            className="absolute right-6 top-6 z-50 text-white transition-colors hover:text-red-500"
          >
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={activeImage}
            alt={name}
            className="max-h-[90vh] max-w-full cursor-zoom-out select-none object-contain"
            onClick={(event) => {
              event.stopPropagation();
              setIsZoomed(false);
            }}
          />
        </div>
      ) : null}
    </>
  );
}
