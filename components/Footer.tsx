import type { SVGProps } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";

function IconFacebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IconZalo(props: SVGProps<SVGSVGElement>) {
  /* Biểu tượng bong bóng chat + Z (tham chiếu thương hiệu Zalo) */
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.85} aria-hidden {...props}>
      <path
        strokeLinejoin="round"
        d="M4 6.5h16a2 2 0 012 2v8a2 2 0 01-2 2h-9l-3.5 2.9V18.5H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
      />
      <path strokeLinecap="round" d="M8.75 13.75h6.75M13.25 11l3.75 6" />
    </svg>
  );
}

function IconYoutube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconMapPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconMail(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-gray-300">
      {/* —— Dải CTA đỏ —— */}
      <div className="bg-red-700">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-10">
          <div className="text-center lg:text-left">
            <p className="text-lg font-bold text-white md:text-xl">
              Bạn cần tư vấn về bảng hiệu quảng cáo?
            </p>
            <p className="mt-1 text-sm text-white/95 md:text-base">
              Liên hệ ngay để được báo giá miễn phí trong 24h
            </p>
          </div>
          <div className="flex shrink-0 justify-center lg:justify-end">
            <a
              href="tel:0905741733"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-red-700 shadow-md transition-colors hover:bg-gray-50"
            >
              <Phone className="size-5 shrink-0 stroke-[2.25]" aria-hidden />
              <span>0905.741.733</span>
            </a>
          </div>
        </div>
      </div>

      {/* —— Khối chính 4 cột —— */}
      <div className="mx-auto max-w-7xl px-4 py-14 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Cột 1 — Thương hiệu */}
          <div className="flex flex-col lg:col-span-1">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-black text-white">
                1991
              </div>
              <div>
                <p className="text-base font-bold leading-tight text-white">XƯỞNG IN 1991</p>
                <p className="mt-0.5 text-sm text-gray-300">Đà Nẵng</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-gray-300">
              Chuyên thiết kế, sản xuất và thi công các loại bảng hiệu quảng cáo chất lượng cao với chi phí
              tối ưu nhất tại Đà Nẵng.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-gray-300 ring-1 ring-slate-700 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <IconFacebook className="size-[18px]" />
              </a>
              <a
                href="#"
                aria-label="Zalo"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-gray-300 ring-1 ring-slate-700 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <IconZalo className="size-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-gray-300 ring-1 ring-slate-700 transition-colors hover:bg-slate-700 hover:text-white"
              >
                <IconYoutube className="size-[18px]" />
              </a>
            </div>
          </div>

          {/* Cột 2 — Dịch vụ */}
          <div>
            <h3 className="mb-5 text-base font-bold tracking-wide text-white">DỊCH VỤ</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/san-pham/1" className="text-sm text-gray-300 transition-colors hover:text-white">
                Bảng hiệu Alu
              </Link>
              <Link href="/san-pham/2" className="text-sm text-gray-300 transition-colors hover:text-white">
                Chữ nổi Mica
              </Link>
              <Link href="/san-pham/3" className="text-sm text-gray-300 transition-colors hover:text-white">
                Hộp đèn LED
              </Link>
              <Link href="/san-pham/4" className="text-sm text-gray-300 transition-colors hover:text-white">
                In bạt Hiflex
              </Link>
              <Link href="/danh-muc/tat-ca" className="text-sm text-gray-300 transition-colors hover:text-white">
                Biển quảng cáo
              </Link>
              <Link href="/danh-muc/tat-ca" className="text-sm text-gray-300 transition-colors hover:text-white">
                Hộp đèn siêu mỏng
              </Link>
            </nav>
          </div>

          {/* Cột 3 — Liên kết nhanh */}
          <div>
            <h3 className="mb-5 text-base font-bold tracking-wide text-white">LIÊN KẾT NHANH</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/" className="text-sm text-gray-300 transition-colors hover:text-white">
                Trang chủ
              </Link>
              <Link href="/du-an" className="text-sm text-gray-300 transition-colors hover:text-white">
                Dự án tiêu biểu
              </Link>
              <Link href="/lien-he" className="text-sm text-gray-300 transition-colors hover:text-white">
                Bảng giá dịch vụ
              </Link>
              <Link href="/lien-he" className="text-sm text-gray-300 transition-colors hover:text-white">
                Liên hệ
              </Link>
            </nav>
          </div>

          {/* Cột 4 — Thông tin liên hệ */}
          <div>
            <h3 className="mb-5 text-base font-bold tracking-wide text-white">THÔNG TIN LIÊN HỆ</h3>
            <ul className="flex flex-col gap-4 text-sm">
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-red-600">
                  <IconMapPin className="size-5" />
                </span>
                <span className="leading-relaxed text-gray-300">434 Hùng Vương, Thanh Khê, Đà Nẵng, Việt Nam</span>
              </li>
              <li className="flex gap-3">
                <a href="tel:0905741733" className="mt-0.5 shrink-0 text-red-600 hover:text-red-500">
                  <Phone className="size-5" strokeWidth={2} aria-hidden />
                </a>
                <a href="tel:0905741733" className="leading-relaxed text-gray-300 transition-colors hover:text-white">
                  0905.741.733
                </a>
              </li>
              <li className="flex gap-3">
                <a
                  href="mailto:huynhhieutran@gmail.com"
                  className="mt-0.5 shrink-0 text-red-600 hover:text-red-500"
                >
                  <IconMail className="size-5" aria-hidden />
                </a>
                <a
                  href="mailto:huynhhieutran@gmail.com"
                  className="break-all leading-relaxed text-gray-300 transition-colors hover:text-white"
                >
                  huynhhieutran@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 shrink-0 text-red-600">
                  <IconClock className="size-5" aria-hidden />
                </span>
                <span className="leading-relaxed text-gray-300">
                  Thứ 2 - Thứ 7: 08:00 - 17:30
                  <br />
                  Chủ nhật: Nghỉ
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* —— Thanh đáy —— */}
        <div className="mt-14 flex flex-col gap-5 border-t border-slate-800 pt-10 text-sm lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-center text-gray-400 lg:text-left">© 2026 Xưởng In 1991. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-end">
            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
              Điều khoản dịch vụ
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
