"use client";
import React from 'react';
import { useCart } from '@/store/useCart';
import Image from 'next/image';
import Link from 'next/link';

export default function CartModal() {
  const { items, isCartOpen, closeCart, updateQuantity, removeItem, getTotalItems } = useCart();

  // Hàm phụ để tính tổng tiền (Chuyển chuỗi "1.200.000đ" thành số để cộng)
  const calculateTotal = () => {
    let total = 0;
    items.forEach(item => {
      const priceNumber = parseInt(item.price.replace(/\D/g, '')); // Xóa các ký tự không phải số
      total += priceNumber * item.quantity;
    });
    return total.toLocaleString('vi-VN') + 'đ';
  };

  // Nếu trạng thái là false thì ẩn popup đi
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header của Popup */}
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold uppercase flex items-center gap-2">
            🛒 Giỏ hàng của bạn ({getTotalItems()})
          </h2>
          <button onClick={closeCart} className="text-white hover:text-red-200 text-2xl leading-none font-bold">
            &times;
          </button>
        </div>

        {/* Thân của Popup (Danh sách sản phẩm) */}
        <div className="p-6 overflow-y-auto flex-grow">
          {items.length === 0 ? (
            <div className="text-center py-10 text-slate-500">Giỏ hàng đang trống.</div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 items-center border-b border-slate-100 pb-4">
                  <div className="relative h-20 w-24 flex-shrink-0 rounded-md overflow-hidden border border-slate-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-red-600 font-medium text-sm mt-1">{item.price} <span className="text-slate-400 font-normal">/ m²</span></p>
                  </div>
                  
                  {/* Bộ điều chỉnh số lượng */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md hover:bg-slate-200 font-bold">-</button>
                    <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md hover:bg-slate-200 font-bold">+</button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-600 ml-4 p-2" title="Xóa sản phẩm">
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer của Popup (Tổng tiền và Nút bấm) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-700">
            Tổng tiền tạm tính: <span className="text-xl font-bold text-red-600 ml-2">{calculateTotal()}</span>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={closeCart} className="flex-1 md:flex-none px-6 py-2.5 rounded-md border border-red-600 text-red-600 font-bold hover:bg-red-50 transition-colors">
              Mua tiếp
            </button>
            <Link href="/thanh-toan" onClick={closeCart} className="flex-1 md:flex-none px-6 py-2.5 rounded-md bg-red-600 text-white font-bold hover:bg-red-700 transition-colors text-center">
              Thanh toán &raquo;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}