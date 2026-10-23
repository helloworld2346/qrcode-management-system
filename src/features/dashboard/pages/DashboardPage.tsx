import { AssetsByUnitCard } from "@/features/dashboard/components/AssetsByUnitCard";
import { QrGaugeCard } from "@/features/dashboard/components/QrGaugeCard";
import { ScanTrendCard } from "@/features/dashboard/components/ScanTrendCard";
import { StatCards } from "@/features/dashboard/components/StatCards";
import { StatusDonutCard } from "@/features/dashboard/components/StatusDonutCard";

export function DashboardPage() {
  return (
    <div>
      <StatCards />

      <div className="-mx-3 flex flex-wrap">
        <div className="w-full px-3 lg:w-2/3">
          <div className="mb-6">
            <ScanTrendCard />
          </div>
          <AssetsByUnitCard />
        </div>
        <div className="w-full px-3 lg:w-1/3">
          <StatusDonutCard />
          <QrGaugeCard />
        </div>
      </div>
    </div>
  );
}
