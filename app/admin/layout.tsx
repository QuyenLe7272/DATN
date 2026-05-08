import { AdminAuthGuard } from "@/components/AdminAuthGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="min-w-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
