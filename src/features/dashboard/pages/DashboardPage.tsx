import { InventoryDueCard } from "@/features/dashboard/components/InventoryDueCard";
import { ScanTrendCard } from "@/features/dashboard/components/ScanTrendCard";
import { StatCards } from "@/features/dashboard/components/StatCards";
import { StatusDonutCard } from "@/features/dashboard/components/StatusDonutCard";

export function DashboardPage() {
  return (
    <div>
      <StatCards />

      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 w-full px-3 lg:w-2/3">
          <ScanTrendCard />
        </div>
        <div className="w-full px-3 lg:w-1/3">
          <StatusDonutCard />
          <InventoryDueCard />
        </div>
      </div>
    </div>
  );
}
