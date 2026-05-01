import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section 
      /* bg-cover giúp ảnh luôn phủ kín màn hình, bg-center căn ảnh ở giữa */
      className="relative w-full py-24 md:py-32 bg-slate-900 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/dkkxbcn56/image/upload/v1776739415/banner1_tmc1d5.jpg')" }} 
    >
      {/* Lớp phủ đen mờ (Overlay) với độ đục 70% (bg-black/70) để làm nổi chữ */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Nội dung chữ: Cần thêm relative và z-10 để chữ nổi lên trên lớp phủ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-snug md:leading-tight">
          THIẾT KẾ & THI CÔNG <br className="hidden md:block" />
          <span className="text-red-500 mt-2 block">BẢNG HIỆU QUẢNG CÁO</span>
        </h1>
        
        <p className="text-slate-300 mt-6 text-lg max-w-2xl mx-auto">
          Giải pháp quảng cáo toàn diện, nâng tầm thương hiệu của bạn với chi phí tối ưu nhất tại Đà Nẵng.
        </p>
        
        <div className="flex flex-row items-center justify-center gap-2 w-full px-2 mt-8">
          <Link
            href="/lien-he"
            className="flex-1 md:flex-none bg-red-600 text-white py-2.5 px-2 md:px-8 md:py-3 rounded-full font-bold text-[13px] md:text-base text-center whitespace-nowrap shadow-lg"
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
    </section>
  );
}