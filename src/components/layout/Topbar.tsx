import { ThemeToggle } from "@/components/layout/ThemeToggle";

import { UserMenu } from "./UserMenu";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-bg px-6 no-print">
      <div>
        <h2 className="text-lg font-bold text-text">Bảng điều khiển</h2>
        <p className="text-xs text-text text-opacity-50">
          Hệ thống quản lý mã QR
        </p>
      </div>

      <div className="flex items-center">
        <ThemeToggle className="mr-3 border-border bg-surface" />
        <UserMenu />
      </div>
    </header>
  );
}
