import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="grow max-w-4xl mx-auto px-4 py-16 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">THÔNG TIN LIÊN HỆ</h1>
          <p className="text-lg text-slate-600">Chúng tôi luôn sẵn sàng lắng nghe và tư vấn giải pháp quảng cáo tốt nhất cho bạn.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Cột trái: Thông tin Profile */}
            <div className="p-10 bg-slate-900 text-white flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-8 text-red-500">XƯỞNG IN 1991</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold mb-1">Địa chỉ văn phòng & xưởng</p>
                    <p className="text-lg">434 Hùng Vương, Thanh Khê, Đà Nẵng, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">📞</span>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold mb-1">Hotline tư vấn (24/7)</p>
                    <p className="text-lg font-bold text-red-400">0905.741.733</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <p className="text-sm text-slate-400 font-semibold mb-1">Email hỗ trợ</p>
                    <p className="text-lg">huynhhieutran@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Mạng xã hội & Zalo */}
            <div className="p-10 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Kết nối với chúng tôi</h3>
              
              <div className="space-y-4">
                <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">f</div>
                  <div>
                    <p className="font-bold text-slate-800">Fanpage Facebook</p>
                    <p className="text-sm text-slate-500">Nhắn tin qua Messenger</p>
                  </div>
                </a>

                <a href="#" className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center font-bold text-xl group-hover:bg-blue-400 group-hover:text-white transition-colors">Z</div>
                  <div>
                    <p className="font-bold text-slate-800">Zalo Official</p>
                    <p className="text-sm text-slate-500">Gửi mẫu và nhận báo giá nhanh</p>
                  </div>
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <p className="text-sm text-slate-500 italic">
                  * Vui lòng liên hệ trước qua Zalo hoặc Hotline để chúng tôi chuẩn bị mẫu vật liệu tốt nhất khi bạn đến xưởng tham quan.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}