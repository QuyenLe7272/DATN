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
          <Link href="/du-an" className="w-full sm:w-auto border border-white text-white px-8 py-3.5 rounded-full font-bold hover:bg-white/10 transition-colors inline-block text-center">
            Xem Các Dự Án
          </Link>
        </div>
      </div>
    </section>
  );
}