"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const banners = [
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739415/banner1_tmc1d5.jpg",
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776783995/banner2_lo2tdm.jpg",
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776783995/banner3_qjhpkj.jpg",
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1777388824/zkh0dqriz4y1hnqbrsst.webp",
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden group bg-slate-900 min-h-[400px] md:min-h-[600px]">
      {banners.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={image}
            alt={`Banner ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Lớp phủ đen mờ ưu tiên mobile */}
      <div className="absolute inset-0 bg-black/60 md:bg-black/40 z-20" />

      {/* Nội dung chữ: căn giữa dọc, ưu tiên đọc tốt trên mobile */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center items-center py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug md:leading-tight drop-shadow-lg">
            THIẾT KẾ & THI CÔNG <br className="hidden md:block" />
            <span className="text-red-500 mt-2 block">BẢNG HIỆU QUẢNG CÁO</span>
          </h1>
          
          <p className="text-slate-300 text-sm md:text-lg max-w-2xl mx-auto line-clamp-2">
            Giải pháp quảng cáo toàn diện, nâng tầm thương hiệu của bạn với chi phí tối ưu nhất tại Đà Nẵng.
          </p>
          
          <div className="flex flex-row items-center justify-center gap-2 w-full px-2 mb-8">
            <Link
              href="/lien-he"
              className="flex-1 md:flex-none bg-red-600 text-white py-2.5 px-2 md:px-8 md:py-3 rounded-full font-bold text-[13px] md:text-base text-center whitespace-nowrap shadow-lg shadow-red-600/30"
            >
              <span className="md:hidden">Báo Giá</span>
              <span className="hidden md:inline">Nhận Báo Giá Ngay</span>
            </Link>
            <Link
              href="/du-an"
              className="flex-1 md:flex-none border border-white text-white py-2.5 px-2 md:px-8 md:py-3 rounded-full font-bold text-[13px] md:text-base text-center whitespace-nowrap"
            >
              <span className="md:hidden">Dự Án</span>
              <span className="hidden md:inline">Xem Các Dự Án</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            className={`transition-all ${
              index === currentIndex
                ? "bg-red-600 w-8 h-2 rounded-full"
                : "bg-white/70 w-2 h-2 rounded-full"
            }`}
            aria-label={`Chọn banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
