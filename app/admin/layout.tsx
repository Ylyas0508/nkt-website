import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await getSession();

  if (!authenticated) {
    // Show just the children (login page) without sidebar
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#0a1628" }}>
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
