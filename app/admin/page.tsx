import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/** Luôn tải lại danh sách từ Firestore (phù hợp trang quản trị). */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [productsSnap, categoriesSnap] = await Promise.all([
    getDocs(collection(db, "products")),
    getDocs(collection(db, "categories")),
  ]);

  const productCount = productsSnap.size;
  const categoryCount = categoriesSnap.size;

  return (
    <div className="text-slate-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Tổng quan</h1>
        <p className="mt-1 text-sm text-slate-500">Thống kê nhanh hệ thống quản trị.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tổng sản phẩm</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{productCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Tổng danh mục</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{categoryCount}</p>
        </div>
      </div>
    </div>
  );
}
