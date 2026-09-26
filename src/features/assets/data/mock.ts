export type AssetStatus =
  | "in_use"
  | "available"
  | "stored"
  | "maintenance"
  | "damaged"
  | "lost";

export interface AssetRow {
  code: string;
  name: string;
  unit: string;
  status: AssetStatus;
  issuedDate: string;
}

export interface StatusMeta {
  value: AssetStatus;
  label: string;
}

export const statusMeta: StatusMeta[] = [
  { value: "in_use", label: "Đang sử dụng" },
  { value: "available", label: "Sẵn sàng" },
  { value: "stored", label: "Niêm cất" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "damaged", label: "Hư hỏng" },
  { value: "lost", label: "Thất lạc" },
];

export const assetRows: AssetRow[] = [
  {
    code: "TS-2024-0417",
    name: "Máy phát điện 5kVA",
    unit: "Trung đoàn 1",
    status: "in_use",
    issuedDate: "12/03/2024",
  },
  {
    code: "TS-2024-0621",
    name: "Bộ đàm cầm tay",
    unit: "Trung đoàn 2",
    status: "available",
    issuedDate: "05/06/2024",
  },
  {
    code: "TS-2023-0158",
    name: "Xe tải vận chuyển",
    unit: "Tiểu đoàn Vận tải",
    status: "maintenance",
    issuedDate: "22/11/2023",
  },
  {
    code: "TS-2024-0902",
    name: "Máy tính bàn Dell",
    unit: "Ban Chỉ huy",
    status: "in_use",
    issuedDate: "18/08/2024",
  },
  {
    code: "TS-2023-0044",
    name: "Lều bạt dã chiến",
    unit: "Tiểu đoàn 3",
    status: "stored",
    issuedDate: "09/02/2023",
  },
  {
    code: "TS-2022-0311",
    name: "Máy nổ Honda",
    unit: "Trung đoàn 1",
    status: "damaged",
    issuedDate: "30/07/2022",
  },
  {
    code: "TS-2024-0288",
    name: "Ống nhòm quân sự",
    unit: "Trung đoàn 2",
    status: "available",
    issuedDate: "14/05/2024",
  },
  {
    code: "TS-2021-0176",
    name: "Bình chữa cháy CO2",
    unit: "Ban Chỉ huy",
    status: "lost",
    issuedDate: "03/09/2021",
  },
];
