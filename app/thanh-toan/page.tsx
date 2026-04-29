"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, getTotalItems } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    note: ''
  });

  // Hàm tính tổng tiền dựa trên giá và số lượng
  const calculateTotal = () => {
    let total = 0;
    items.forEach(item => {
      const priceNumber = parseInt(item.price.replace(/\D/g, ''));
      total += priceNumber * item.quantity;
    });
    return total.toLocaleString('vi-VN') + 'đ';
  };

  const handleZaloSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderItemsText = items.map(
      (item, index) => `${index + 1}. ${item.name} - SL: ${item.quantity} (${item.price}/m2)`
    ).join('\n');

    const message = `Chào Xưởng in 1991, tôi muốn đặt làm bảng hiệu:\n\n` +
      `👤 Tên: ${formData.name}\n` +
      `📞 SĐT: ${formData.phone}\n` +
      `📍 Địa chỉ: ${formData.address}\n` +
      `📝 Ghi chú: ${formData.note || 'Không có'}\n\n` +
      `🛒 ĐƠN HÀNG CỦA TÔI:\n${orderItemsText}\n\n` +
      `💰 Tổng tạm tính: ${calculateTotal()}\n\n` +
      `Nhờ xưởng tư vấn và báo giá chi tiết giúp tôi nhé!`;

    navigator.clipboard.writeText(message).then(() => {
      alert("Hệ thống đã copy thông tin đơn hàng!\n\nVui lòng nhấn 'Dán' (hoặc Ctrl+V) vào khung chat Zalo để gửi cho xưởng nhé.");
      window.open('https://zalo.me/0788545090', '_blank');
    }).catch(() => {
      alert("Có lỗi xảy ra khi copy đơn hàng. Vui lòng thử lại!");
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Xác nhận đơn hàng</h1>

        {items.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border border-slate-200">
            <p className="text-xl text-slate-500 mb-6">Giỏ hàng của bạn đang trống.</p>
            <Link href="/" className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors">
              Quay lại chọn mẫu bảng hiệu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* CỘT TRÁI: FORM LIÊN HỆ */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-6 border-b border-slate-100 pb-4 text-slate-800">Thông tin khách hàng</h2>
              <form onSubmit={handleZaloSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại liên hệ *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="090x.xxx.xxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Địa chỉ lắp đặt tại Đà Nẵng *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                    placeholder="Số nhà, tên đường, quận..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ghi chú yêu cầu (Kích thước, màu sắc...)</label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-28"
                    placeholder="Ví dụ: Bảng Alu vàng chanh, chữ nổi sáng chân..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg mt-4 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  GỬI ĐƠN QUA ZALO
                </button>
              </form>
            </div>

            {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-fit sticky top-28">
              <h2 className="text-xl font-bold mb-6 border-b border-slate-100 pb-4 text-slate-800">Đơn hàng của bạn ({getTotalItems()})</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-slate-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-slate-500 text-xs">Số lượng: x{item.quantity}</p>
                        <p className="text-red-600 font-bold text-sm">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Tổng tiền tạm tính:</span>
                  <span className="text-2xl font-black text-red-600">{calculateTotal()}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 italic">* Đơn giá trên chưa bao gồm thuế VAT và phí vận chuyển lắp đặt thực tế.</p>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}