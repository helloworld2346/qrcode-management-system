import { inventoryDue } from "@/features/dashboard/data/mock";

export function InventoryDueCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-text">
        Cần kiểm kê / quá hạn
      </h2>

      {inventoryDue.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-text text-opacity-50">
            Không có tài sản nào quá hạn kiểm kê.
          </p>
        </div>
      ) : (
        <div>
          {inventoryDue.map((item) => (
            <div
              key={item.code}
              className="mb-3 flex items-center rounded-xl border border-border p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{item.name}</p>
                <p className="text-xs text-text text-opacity-50">
                  {item.code} · {item.unit}
                </p>
              </div>
              <span className="rounded-full bg-accent bg-opacity-10 px-3 py-1 text-xs font-semibold text-accent">
                Quá hạn {item.overdueDays} ngày
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
