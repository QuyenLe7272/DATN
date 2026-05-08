import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  badgeType?: "HOT" | "NEW" | "SALE" | null;
  discountPercent?: number | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean; // Trạng thái đóng/mở Popup
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void; // Tăng giảm số lượng
  removeItem: (id: string) => void; // Xóa khỏi giỏ
  getTotalItems: () => number;
  openCart: () => void; // Hàm mở Popup
  closeCart: () => void; // Hàm đóng Popup
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  
  addToCart: (newItem) => set((state) => {
    const existingItem = state.items.find(item => item.id === newItem.id);
    if (existingItem) {
      return {
        items: state.items.map(item => 
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),

  // Cập nhật số lượng (không cho phép nhỏ hơn 1)
  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),

  // Lọc bỏ sản phẩm có id cần xóa
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),

  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));