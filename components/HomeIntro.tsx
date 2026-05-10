"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

export default function HomeIntro() {
  return (
    <div className="w-full bg-slate-50">
      {/* PHẦN 1: GIỚI THIỆU */}
      <div className="flex flex-col items-center text-center w-full mb-12 px-4 pt-8 md:pt-12">
        <p className="text-sm font-bold text-slate-500 tracking-widest uppercase">
          THIẾT KẾ IN ẤN VÀ QUẢNG CÁO IN1991
        </p>
        <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900 uppercase">
          THI CÔNG QUẢNG CÁO TẠI ĐÀ NẴNG
        </h2>
        <p className="mt-4 max-w-5xl text-gray-600 leading-relaxed text-base md:text-lg">
          Thiết kế In ấn và Quảng cáo In1991 tự hào có nhiều năm kinh nghiệm trong lĩnh vực tư vấn
          thương hiệu, thiết kế đồ họa, in ấn, thi công biển hiệu, bảng hiệu quảng cáo tại Đà Nẵng với
          tiêu chí{" "}
          <strong className="inline-block whitespace-nowrap font-black text-red-600">
            UY TÍN - CHẤT LƯỢNG - GIÁ RẺ
          </strong>{" "}
          cam kết mang lại sự hài lòng tuyệt đối cho khách hàng.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <a
            href="tel:0905741733"
            className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2.5 font-medium flex items-center gap-2 transition-colors"
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            0905.741.733
          </a>
          <Link
            href="/lien-he"
            className="border-2 border-slate-300 hover:border-slate-800 text-slate-700 rounded-full px-8 py-2.5 font-medium transition-colors"
          >
            Liên hệ
          </Link>
        </div>
      </div>

      {/* PHẦN 2: DẢI BANNER DỊCH VỤ */}
      <div className="w-full bg-slate-900 relative mt-12 py-10">
        <div className="flex flex-col items-center text-center px-4">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">DỊCH VỤ</h2>
          <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
            Thiết kế In ấn và Quảng cáo In1991 có nhiều năm kinh nghiệm trong lĩnh vực tiếp thị
            quảng cáo tại Đà Nẵng.
          </p>
        </div>
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-transparent border-t-slate-900"
          aria-hidden
        />
      </div>

      {/* PHẦN 3: CHI TIẾT THI CÔNG */}
      <div className="mt-16 w-full max-w-5xl px-4 mx-auto mb-8 flex flex-col items-center text-center">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase">
          THI CÔNG QUẢNG CÁO
        </h3>
        <p className="mt-6 text-gray-600 leading-relaxed text-justify md:text-center text-base">
          Công ty Thiết kế In ấn và Quảng Cáo In1991 tự hào khi là đơn vị chuyên thiết kế, thi công
          bảng hiệu quảng cáo công ty, bảng hiệu shop, Bảng hiệu cửa hàng, sự kiện, bảng hiệu spa,...
          uy tín, chuyên nghiệp hàng đầu tại Đà Nẵng: bảng hiệu alu, mica, hiflex, chữ nổi inox, hộp
          đèn, đèn led,.... Thiết kế và thi công đèn led nhà hàng, khách sạn, quán karaoke,....
          Cam kết từ chúng tôi: Bảng hiệu quảng cáo Thiết kế đúng mẫu, đẹp – Thi công nhanh chóng,
          gọn lẹ – Giá thành rẻ nhất – Bảo hành lâu dài, đúng với thỏa thuận trong hợp đồng!
        </p>
      </div>
    </div>
  );
}
