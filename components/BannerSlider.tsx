"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const banners = [
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739415/banner1_tmc1d5.jpg",
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776783995/banner2_lo2tdm.jpg",
  "https://res.cloudinary.com/dkkxbcn56/image/upload/v1776783995/banner3_qjhpkj.jpg",
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
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden group">
      {banners.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img src={image} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}

      {/* Lớp phủ đen mờ 70% */}
      <div className="absolute inset-0 bg-black/70 z-20"></div>

      {/* Nội dung chữ chính xác từ Hero.tsx */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center items-center px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            THIẾT KẾ & THI CÔNG <br className="hidden md:block" />
            <span className="text-red-500 mt-2 block">BẢNG HIỆU QUẢNG CÁO</span>
          </h1>
          
          <p className="text-slate-300 mt-6 text-lg max-w-2xl mx-auto">
            Giải pháp quảng cáo toàn diện, nâng tầm thương hiệu của bạn với chi phí tối ưu nhất tại Đà Nẵng.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/lien-he"
              className="w-full sm:w-auto bg-red-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
            >
              Nhận Báo Giá Ngay
            </Link>
            <Link 
              href="/du-an" 
              className="w-full sm:w-auto border border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors inline-block text-center"
            >
              Xem Các Dự Án
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
