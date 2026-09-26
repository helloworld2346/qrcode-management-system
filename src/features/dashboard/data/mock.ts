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
  { day: "T2", scans: 100 },
  { day: "T3", scans: 241 },
  { day: "T4", scans: 96 },
  { day: "T5", scans: 122 },
  { day: "T6", scans: 67 },
  { day: "T7", scans: 170 },
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

export interface UnitAsset {
  unit: string;
  value: number;
}

export const assetsByUnit: UnitAsset[] = [
  { unit: "Trung đoàn 1", value: 342 },
  { unit: "Trung đoàn 2", value: 298 },
  { unit: "Tiểu đoàn 3", value: 187 },
  { unit: "Tiểu đoàn Vận tải", value: 156 },
  { unit: "Ban Chỉ huy", value: 101 },
];

export interface QrAssignment {
  assigned: number;
  total: number;
}

export const qrAssignment: QrAssignment = { assigned: 1120, total: 1284 };