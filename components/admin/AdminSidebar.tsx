"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type AdminSidebarProps = {
  active?: "overview" | "products" | "projects" | "categories";
};

const menuItems = [
  { name: "Tổng quan", href: "/admin", key: "overview" },
  { name: "Sản phẩm", href: "/admin/products", key: "products" },
  { name: "Dự án", href: "/admin/projects", key: "projects" },
  { name: "Danh mục", href: "/admin/categories", key: "categories" },
] as const;

function isItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminSidebar({ active }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch {
      // Keep UI responsive even if signOut fails transiently.
      router.replace("/login");
    }
  }

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-2">
        <p className="text-lg font-bold text-slate-900">Quản trị Xưởng</p>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Đăng xuất
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const activeByPath = isItemActive(pathname, item.href);
          const activeByProp = active ? item.key === active : false;
          const isActive = activeByPath || activeByProp;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-red-50 text-red-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
export { AdminSidebar };
