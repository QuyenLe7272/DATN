"use client";
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import Link from 'next/link';
import ProductBadge from "@/components/ProductBadge";

export default function CheckoutPage() {
  const { items, getTotalItems, removeItem } = useCart();

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
      window.open('https://zalo.me/0905741733', '_blank');
    }).catch(() => {
      alert("Có lỗi xảy ra khi copy đơn hàng. Vui lòng thử lại!");
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <div className="grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            <span aria-hidden>←</span>
            Tiếp tục mua hàng
          </Link>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-800">Xác nhận đơn hàng</h1>
          <p className="mt-1 text-sm text-slate-500">Vui lòng điền thông tin để chúng tôi liên hệ báo giá</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-xl shadow-md border border-slate-200">
            <p className="text-xl text-slate-500 mb-6">Giỏ hàng của bạn đang trống.</p>
            <Link
              href="/"
              className="mx-auto inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full bg-red-600 px-6 py-3 text-center font-bold text-white transition-colors hover:bg-red-700 sm:px-8"
            >
              <span className="sm:hidden">Quay lại</span>
              <span className="hidden sm:inline">Quay lại chọn mẫu bảng hiệu</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-10 rounded-2xl border border-slate-200 bg-white px-4 py-6 shadow-sm sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-50 text-green-600 ring-1 ring-green-100">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                      <path
                        d="M7 7h14l-2 8H9L7 7Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 7 6 3H3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-green-600">Giỏ hàng</p>
                  </div>
                </div>

                <div className="hidden flex-1 items-center px-2 sm:flex">
                  <hr className="w-full border-slate-200" />
                </div>

                <div className="flex flex-1 items-center justify-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-red-600 text-white shadow-sm">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                      <path
                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 text-center">
                    <p className="text-xs font-semibold text-red-600">Thông tin</p>
                  </div>
                </div>

                <div className="hidden flex-1 items-center px-2 sm:flex">
                  <hr className="w-full border-slate-200" />
                </div>

                <div className="flex flex-1 items-center justify-end gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                      <path
                        d="M9 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-xs font-semibold text-slate-400">Xác nhận</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr] lg:gap-12">
            
              {/* CỘT TRÁI: FORM LIÊN HỆ */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-red-600 px-6 py-5 text-white">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
                      <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                        <path
                          d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold uppercase leading-tight">Thông tin khách hàng</h2>
                      <p className="mt-0.5 text-sm text-white/90">Điền thông tin để nhận báo giá</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <form onSubmit={handleZaloSubmit} className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Họ và tên <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Số điện thoại liên hệ <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        placeholder="090x.xxx.xxx"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Địa chỉ lắp đặt tại Đà Nẵng <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        placeholder="Số nhà, tên đường, quận..."
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Ghi chú yêu cầu (Kích thước, màu sắc...)
                      </label>
                      <textarea
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        placeholder="Ví dụ: Bảng Alu vàng chanh, chữ nổi sáng chân..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="mt-2 w-full rounded-xl bg-red-600 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-red-600/25 transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl active:translate-y-0 active:scale-[0.99]"
                    >
                      GỬI ĐƠN QUA ZALO
                    </button>

                    <p className="pt-2 text-center text-xs text-slate-500">
                      Hoặc gọi trực tiếp{" "}
                      <a className="font-bold text-red-600 hover:underline" href="tel:0905741733">
                        0905.741.733
                      </a>{" "}
                      để được tư vấn ngay
                    </p>
                  </form>
                </div>
              </div>

              {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
              <div className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:sticky lg:top-28">
                <div className="bg-slate-800 px-6 py-5 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-full bg-white/10">
                        <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                          <path
                            d="M21 8.5 12 3 3 8.5v10L12 22l9-3.5v-10Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinejoin="round"
                          />
                          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" />
                          <path d="M21 8.5 12 12 3 8.5" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <h2 className="text-base font-extrabold">Đơn hàng của bạn</h2>
                    </div>
                    <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold">
                      {getTotalItems()}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200">
                          <ProductBadge
                            badgeType={item.badgeType}
                            discountPercent={item.discountPercent}
                            className="scale-75"
                          />
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 grow">
                          <p className="truncate text-sm font-bold text-slate-800">{item.name}</p>
                          <p className="mt-1 text-xs text-slate-500">Số lượng: x{item.quantity}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm font-extrabold text-red-600">{item.price}</p>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-red-600"
                            title="Xóa sản phẩm"
                            aria-label="Xóa sản phẩm"
                          >
                            <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden>
                              <path
                                d="M4 7h16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M10 11v6M14 11v6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M6 7l1 14h10l1-14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 7V4h6v3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">Tổng tiền tạm tính:</span>
                      <span className="text-lg font-extrabold text-red-600">{calculateTotal()}</span>
                    </div>
                    <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                      <p className="font-semibold">Lưu ý:</p>
                      <p className="mt-1 text-xs leading-relaxed">
                        Đơn giá trên chưa bao gồm thuế VAT và phí vận chuyển lắp đặt thực tế.
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        <span className="inline-flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden>
                            <path
                              d="M20 6 9 17l-5-5"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        Báo giá miễn phí
                      </div>
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                        <span className="inline-flex size-4 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                          <svg viewBox="0 0 24 24" fill="none" className="size-3" aria-hidden>
                            <path
                              d="M12 6v6l4 2"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                          </svg>
                        </span>
                        Tư vấn 24/7
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}