import { Outlet } from "react-router-dom";

import { Topbar } from "@/components/layout/Topbar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Topbar />
      <main className="w-full px-8 py-6 print-area">
        <Outlet />
      </main>
    </div>
  );
}
