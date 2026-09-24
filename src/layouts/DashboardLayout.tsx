import { Outlet } from "react-router-dom";

import { Topbar } from "@/components/layout/Topbar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Topbar />
      <main className="mx-auto w-full max-w-7xl p-6 print-area">
        <Outlet />
      </main>
    </div>
  );
}
