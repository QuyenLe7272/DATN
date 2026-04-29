import Link from 'next/link'; // Bổ sung import Link của Next.js

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Cột 1: Thông tin liên hệ */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">XƯỞNG IN 1991</h3>
            <ul className="space-y-2">
              <li>Địa chỉ: Đà Nẵng</li>
              <li>Hotline: 0909.123.456</li>
              <li>Email: lienhe@in1991.com</li>
            </ul>
          </div>

          {/* Cột 2: Liên kết Dịch vụ */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">DỊCH VỤ</h3>
            <div className="flex flex-col gap-2">
              {/* Trỏ link về đúng ID sản phẩm */}
              <Link className="transition-colors hover:text-white" href="/san-pham/1">
                Bảng hiệu Alu
              </Link>
              <Link className="transition-colors hover:text-white" href="/san-pham/2">
                Chữ nổi Mica
              </Link>
              {/* Lưu ý: In bạt Hiflex là ID số 4 */}
              <Link className="transition-colors hover:text-white" href="/san-pham/4">
                In bạt Hiflex
              </Link>
              {/* Lưu ý: Hộp đèn LED là ID số 3 */}
              <Link className="transition-colors hover:text-white" href="/san-pham/3">
                Hộp đèn LED
              </Link>
            </div>
          </div>

          {/* Cột 3: Thời gian làm việc */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">GIỜ MỞ CỬA</h3>
            <p>Thứ 2 - Thứ 7: 08:00 - 17:30</p>
            <p>Chủ nhật: Nghỉ</p>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-center text-sm">
            © 2026 Xưởng In 1991. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}