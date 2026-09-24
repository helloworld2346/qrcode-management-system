import { stats } from "@/features/dashboard/data/mock";

export function StatCards() {
  return (
    <div className="-mx-2 mb-8 flex flex-wrap">
      {stats.map(({ label, value, icon: Icon, hint }) => (
        <div key={label} className="mb-4 w-full px-2 sm:w-1/2 lg:w-1/4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover text-white">
              <Icon size={20} />
            </span>
            <p className="text-sm text-text text-opacity-60">{label}</p>
            <p className="mt-1 text-3xl font-bold text-text">{value}</p>
            <p className="mt-1 text-xs text-text text-opacity-40">{hint}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
