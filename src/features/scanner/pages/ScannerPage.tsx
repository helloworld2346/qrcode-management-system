import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiExternalLink, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  useResolveItem,
  useUpdateItemStatus,
} from "@/features/items/items.hooks";
import {
  itemStatusColor,
  itemStatusLabel,
  itemStatusMeta,
  type Item,
} from "@/features/items/items.types";

export function ScannerPage() {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const [history, setHistory] = useState<Item[]>([]);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { data: item, isFetching, isError, error } = useResolveItem(code);
  const updateStatus = useUpdateItemStatus();

  // Auto-focus ô nhập để máy quét dán mã ngay
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Khi resolve thành công: đồng bộ form trạng thái + thêm vào lịch sử (mới nhất lên đầu, bỏ trùng)
  useEffect(() => {
    if (!item) return;
    setStatus(item.status);
    setNote("");
    setHistory((prev) => [
      item,
      ...prev.filter((h) => h.idItem !== item.idItem),
    ]);
  }, [item]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    // Nếu quét lại đúng mã cũ, reset để trigger query lại
    if (value === code) {
      setCode("");
      window.setTimeout(() => setCode(value), 0);
    } else {
      setCode(value);
    }
    setInput("");
  };

  const handleUpdateStatus = () => {
    if (!item) return;
    updateStatus.mutate(
      { id: item.idItem, payload: { status, note } },
      {
        onSuccess: () => {
          setNote("");
          inputRef.current?.focus();
        },
      },
    );
  };

  const clearHistory = () => setHistory([]);

  const statusOptions = itemStatusMeta.map((s) => ({
    value: s.value,
    label: s.label,
  }));

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-text">Quét mã</h1>
        <p className="mt-1 text-sm text-text text-opacity-60">
          Đặt con trỏ vào ô dưới rồi quét QR bằng máy quét, hoặc gõ mã thủ công
          và nhấn Enter.
        </p>
      </div>

      {/* Ô quét */}
      <form
        onSubmit={handleSubmit}
        className="mb-4 rounded-2xl border border-border bg-surface px-5 py-4"
      >
        <label className="mb-1 block text-sm font-medium text-text">
          Mã QR / Mã đồ vật
        </label>
        <div className="flex items-center">
          <div className="relative flex-1">
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text text-opacity-40"
            />
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Quét hoặc nhập mã rồi nhấn Enter..."
              className="pl-9"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isFetching}
            className="ml-3 flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <FiSearch className="mr-2" size={16} />
            Tra cứu
          </button>
        </div>
      </form>

      {/* Kết quả lần quét gần nhất */}
      {isFetching ? (
        <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-10 text-center text-sm text-text text-opacity-60">
          Đang tra cứu...
        </div>
      ) : isError ? (
        <div className="mb-4 rounded-2xl border border-accent bg-surface px-5 py-5 text-sm text-accent">
          {error instanceof Error ? error.message : "Không tìm thấy mã"}
        </div>
      ) : item ? (
        <div className="mb-4 rounded-2xl border border-border bg-surface px-5 py-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text">
                {item.itemName}
              </h2>
              <p className="mt-1 font-mono text-sm text-text text-opacity-60">
                {item.code}
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: itemStatusColor(item.status) }}
            >
              {itemStatusLabel(item.status)}
            </span>
          </div>

          {item.description ? (
            <p className="mb-4 text-sm text-text text-opacity-70">
              {item.description}
            </p>
          ) : null}

          {item.attributeValues &&
          Object.keys(item.attributeValues).length > 0 ? (
            <div className="mb-4 border-t border-border pt-3">
              {Object.entries(item.attributeValues).map(([k, v]) => (
                <div key={k} className="mb-1 flex text-sm">
                  <span className="mr-2 w-40 text-text text-opacity-50">
                    {k}
                  </span>
                  <span className="text-text">{v}</span>
                </div>
              ))}
            </div>
          ) : null}

          {/* Đổi trạng thái */}
          <div className="border-t border-border pt-4">
            <p className="mb-2 text-sm font-medium text-text">Đổi trạng thái</p>
            <div className="mb-3 md:w-1/2">
              <FormSelect
                value={status}
                options={statusOptions}
                onChange={setStatus}
              />
            </div>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú (tùy chọn)..."
              rows={2}
              className="mb-3"
            />
            {updateStatus.isError ? (
              <p className="mb-2 text-sm text-accent">
                {updateStatus.error instanceof Error
                  ? updateStatus.error.message
                  : "Đổi trạng thái thất bại"}
              </p>
            ) : null}
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updateStatus.isPending || status === item.status}
                className="flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
              >
                Lưu trạng thái
              </button>
              <Link
                to={`/dashboard/items`}
                className="ml-3 flex items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition-colors hover:border-primary"
              >
                <FiExternalLink className="mr-2" size={15} />
                Xem danh sách
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Lịch sử quét trong phiên */}
      <div className="rounded-2xl border border-border bg-surface px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">
            Lịch sử quét ({history.length})
          </h2>
          {history.length > 0 ? (
            <button
              type="button"
              onClick={clearHistory}
              className="flex items-center rounded-lg px-2 py-1 text-xs font-medium text-text text-opacity-60 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent"
            >
              <FiTrash2 className="mr-1" size={13} />
              Xóa lịch sử
            </button>
          ) : null}
        </div>

        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-text text-opacity-50">
            Chưa có mã nào được quét trong phiên này.
          </p>
        ) : (
          <div className="-mx-2">
            {history.map((h) => (
              <div
                key={h.idItem}
                className="mx-2 mb-2 flex items-center justify-between rounded-lg border border-border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">
                    {h.itemName}
                  </p>
                  <p className="truncate font-mono text-xs text-text text-opacity-50">
                    {h.code}
                  </p>
                </div>
                <div className="flex items-center">
                  <span
                    className="mr-3 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: itemStatusColor(h.status) }}
                  >
                    {itemStatusLabel(h.status)}
                  </span>
                  <button
                    type="button"
                    aria-label="Bỏ khỏi lịch sử"
                    onClick={() =>
                      setHistory((prev) =>
                        prev.filter((x) => x.idItem !== h.idItem),
                      )
                    }
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-text text-opacity-50 transition-colors hover:bg-accent hover:bg-opacity-10 hover:text-accent"
                  >
                    <FiX size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
