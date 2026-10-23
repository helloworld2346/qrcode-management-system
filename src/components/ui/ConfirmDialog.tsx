interface Props {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  loading?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  danger = true,
  loading = false,
  error,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl"
      >
        <h2 className="mb-1 text-base font-semibold text-text">{title}</h2>
        {message && (
          <p className="mb-4 text-sm text-text text-opacity-60">{message}</p>
        )}
        {error && <p className="mb-3 text-xs text-accent">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-2 rounded-lg px-4 py-2 text-sm font-medium text-text text-opacity-70 transition-colors hover:bg-primary hover:bg-opacity-10"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50 ${
              danger ? "bg-accent" : "bg-primary"
            }`}
          >
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
