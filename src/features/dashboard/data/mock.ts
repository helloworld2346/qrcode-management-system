import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAlertTriangle,
  FiBox,
  FiCrosshair,
} from "react-icons/fi";

export interface StatItem {
  label: string;
  value: string;
  icon: IconType;
  hint: string;
}

export const stats: StatItem[] = [
  { label: "Tổng tài sản", value: "1.284", icon: FiBox, hint: "Toàn đơn vị" },
  {
    label: "Tổng vũ khí",
    value: "512",
    icon: FiCrosshair,
    hint: "Toàn đơn vị",
  },
  { label: "Đã quét hôm nay", value: "147", icon: FiActivity, hint: "24 giờ" },
  { label: "Cần kiểm kê", value: "23", icon: FiAlertTriangle, hint: "Quá hạn" },
];

export interface ScanPoint {
  day: string;
  scans: number;
}

export const scanTrend: ScanPoint[] = [
  { day: "T2", scans: 82 },
  { day: "T3", scans: 134 },
  { day: "T4", scans: 96 },
  { day: "T5", scans: 158 },
  { day: "T6", scans: 121 },
  { day: "T7", scans: 64 },
  { day: "CN", scans: 38 },
];

export interface StatusSlice {
  name: string;
  value: number;
}

export const statusData: StatusSlice[] = [
  { name: "Đang sử dụng", value: 912 },
  { name: "Bảo trì", value: 168 },
  { name: "Niêm cất", value: 154 },
  { name: "Hỏng", value: 50 },
];

export interface InventoryDueItem {
  code: string;
  name: string;
  unit: string;
  overdueDays: number;
}

export const inventoryDue: InventoryDueItem[] = [
  {
    code: "TS-2024-0417",
    name: "Máy phát điện 5kVA",
    unit: "Trung đoàn 1",
    overdueDays: 12,
  },
  {
    code: "VK-2023-0089",
    name: "Súng tiểu liên AK-47",
    unit: "Tiểu đoàn 3",
    overdueDays: 9,
  },
  {
    code: "TS-2024-0621",
    name: "Bộ đàm cầm tay",
    unit: "Trung đoàn 2",
    overdueDays: 7,
  },
  {
    code: "VK-2022-0154",
    name: "Súng ngắn K54",
    unit: "Ban Chỉ huy",
    overdueDays: 5,
  },
  {
    code: "TS-2024-0733",
    name: "Xe tải quân sự Ural",
    unit: "Tiểu đoàn Vận tải",
    overdueDays: 3,
  },
  {
    code: "TS-2023-0512",
    name: "Máy tính trạm chỉ huy",
    unit: "Phòng Tham mưu",
    overdueDays: 2,
  },
];
