import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  '434 Hùng Vương, Thanh Khê, Đà Nẵng',
)}&hl=vi&z=16&output=embed`;

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <div className="grow mx-auto w-full max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-slate-900">THÔNG TIN LIÊN HỆ</h1>
          <p className="text-lg text-slate-600">
            Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp quảng cáo tốt nhất cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          <div className="h-full lg:col-span-2">
            <div className="h-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-lg">
              <div className="grid h-full grid-cols-1 md:grid-cols-2">
                {/* Cột trái: Thông tin Profile */}
                <div className="flex flex-col justify-center bg-slate-900 p-10 text-white">
                  <h2 className="mb-8 text-2xl font-bold text-red-500">XƯỞNG IN 1991</h2>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-slate-400">Địa chỉ văn phòng & xưởng</p>
                        <p className="text-lg">434 Hùng Vương, Thanh Khê, Đà Nẵng, Việt Nam</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-slate-400">Hotline tư vấn (24/7)</p>
                        <p className="text-lg font-bold text-red-400">0905.741.733</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <span className="text-2xl">✉️</span>
                      <div>
                        <p className="mb-1 text-sm font-semibold text-slate-400">Email hỗ trợ</p>
                        <p className="text-lg">huynhhieutran@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột phải trong card: Mạng xã hội & Zalo */}
                <div className="flex flex-col justify-center p-10">
                  <h3 className="mb-6 text-xl font-bold text-slate-800">Kết nối với chúng tôi</h3>

                  <div className="space-y-4">
                    <a
                      href="#"
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-500 hover:bg-blue-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                        f
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Fanpage Facebook</p>
                        <p className="text-sm text-slate-500">Nhắn tin qua Messenger</p>
                      </div>
                    </a>

                    <a
                      href="#"
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-400 hover:bg-blue-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-500 transition-colors group-hover:bg-blue-400 group-hover:text-white">
                        Z
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Zalo Official</p>
                        <p className="text-sm text-slate-500">Gửi mẫu và nhận báo giá nhanh</p>
                      </div>
                    </a>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <p className="text-sm italic text-slate-500">
                      * Vui lòng liên hệ trước qua Zalo hoặc Hotline để chúng tôi chuẩn bị mẫu vật liệu tốt
                      nhất khi bạn đến xưởng tham quan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[300px] h-full overflow-hidden rounded-2xl border border-gray-100 shadow-lg lg:col-span-1">
            <iframe
              src={MAP_EMBED_SRC}
              className="h-full min-h-[350px] w-full border-0 lg:min-h-full"
              title="Bản đồ — 434 Hùng Vương, Thanh Khê, Đà Nẵng"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
