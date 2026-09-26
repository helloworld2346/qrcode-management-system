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
  {
    code: "TS-2024-0510",
    name: "Máy chiếu Epson",
    unit: "Ban Tham mưu",
    status: "in_use",
    issuedDate: "21/04/2024",
  },
  {
    code: "TS-2023-0733",
    name: "Máy in laser HP",
    unit: "Ban Chỉ huy",
    status: "available",
    issuedDate: "17/10/2023",
  },
  {
    code: "TS-2022-0489",
    name: "Máy lọc nước dã chiến",
    unit: "Tiểu đoàn 3",
    status: "maintenance",
    issuedDate: "08/06/2022",
  },
  {
    code: "TS-2024-0125",
    name: "Bộ dụng cụ cơ khí",
    unit: "Tiểu đoàn Vận tải",
    status: "in_use",
    issuedDate: "02/02/2024",
  },
  {
    code: "TS-2023-0367",
    name: "Máy đo địa hình",
    unit: "Ban Tham mưu",
    status: "stored",
    issuedDate: "25/07/2023",
  },
  {
    code: "TS-2021-0298",
    name: "Máy hàn điện tử",
    unit: "Trung đoàn 1",
    status: "damaged",
    issuedDate: "11/12/2021",
  },
  {
    code: "TS-2024-0844",
    name: "Camera giám sát",
    unit: "Trung đoàn 2",
    status: "in_use",
    issuedDate: "29/07/2024",
  },
  {
    code: "TS-2023-0592",
    name: "Bộ pin năng lượng mặt trời",
    unit: "Tiểu đoàn 3",
    status: "available",
    issuedDate: "14/09/2023",
  },
  {
    code: "TS-2022-0157",
    name: "Máy phát điện 10kVA",
    unit: "Ban Chỉ huy",
    status: "maintenance",
    issuedDate: "06/03/2022",
  },
  {
    code: "TS-2024-0673",
    name: "Bàn làm việc gấp",
    unit: "Ban Tham mưu",
    status: "stored",
    issuedDate: "19/06/2024",
  },
  {
    code: "TS-2021-0421",
    name: "Tủ đựng tài liệu",
    unit: "Ban Chỉ huy",
    status: "in_use",
    issuedDate: "23/08/2021",
  },
  {
    code: "TS-2023-0810",
    name: "Máy quét mã vạch",
    unit: "Tiểu đoàn Vận tải",
    status: "available",
    issuedDate: "30/11/2023",
  },
  {
    code: "TS-2022-0654",
    name: "Đèn pha di động",
    unit: "Trung đoàn 1",
    status: "lost",
    issuedDate: "15/05/2022",
  },
  {
    code: "TS-2024-0399",
    name: "Bộ đàm cố định",
    unit: "Trung đoàn 2",
    status: "in_use",
    issuedDate: "07/04/2024",
  },
  {
    code: "TS-2023-0233",
    name: "Máy đo huyết áp",
    unit: "Quân y",
    status: "available",
    issuedDate: "12/06/2023",
  },
  {
    code: "TS-2022-0778",
    name: "Cáng cứu thương",
    unit: "Quân y",
    status: "stored",
    issuedDate: "20/09/2022",
  },
  {
    code: "TS-2024-0056",
    name: "Máy sốc tim di động",
    unit: "Quân y",
    status: "maintenance",
    issuedDate: "03/01/2024",
  },
  {
    code: "TS-2021-0512",
    name: "Bình oxy y tế",
    unit: "Quân y",
    status: "in_use",
    issuedDate: "28/10/2021",
  },
  {
    code: "TS-2023-0445",
    name: "Xe máy tuần tra",
    unit: "Tiểu đoàn Vận tải",
    status: "damaged",
    issuedDate: "16/07/2023",
  },
  {
    code: "TS-2024-0721",
    name: "Máy tính xách tay",
    unit: "Ban Tham mưu",
    status: "in_use",
    issuedDate: "22/08/2024",
  },
  {
    code: "TS-2022-0203",
    name: "Loa phóng thanh",
    unit: "Trung đoàn 1",
    status: "available",
    issuedDate: "09/04/2022",
  },
  {
    code: "TS-2023-0688",
    name: "Máy bơm nước",
    unit: "Tiểu đoàn 3",
    status: "stored",
    issuedDate: "13/10/2023",
  },
  {
    code: "TS-2021-0334",
    name: "Máy cắt cỏ",
    unit: "Ban Chỉ huy",
    status: "lost",
    issuedDate: "05/06/2021",
  },
  {
    code: "TS-2024-0467",
    name: "Két sắt an ninh",
    unit: "Ban Chỉ huy",
    status: "in_use",
    issuedDate: "26/05/2024",
  },
  {
    code: "TS-2023-0119",
    name: "Máy đo nồng độ khí",
    unit: "Ban Tham mưu",
    status: "available",
    issuedDate: "18/03/2023",
  },
  {
    code: "TS-2022-0591",
    name: "Bộ định vị GPS",
    unit: "Trung đoàn 2",
    status: "maintenance",
    issuedDate: "24/08/2022",
  },
  {
    code: "TS-2024-0803",
    name: "Máy ghi âm kỹ thuật số",
    unit: "Ban Tham mưu",
    status: "in_use",
    issuedDate: "11/09/2024",
  },
  {
    code: "TS-2021-0247",
    name: "Thang nhôm gấp",
    unit: "Tiểu đoàn Vận tải",
    status: "stored",
    issuedDate: "07/07/2021",
  },
  {
    code: "TS-2023-0956",
    name: "Máy phun khử khuẩn",
    unit: "Quân y",
    status: "available",
    issuedDate: "29/12/2023",
  },
  {
    code: "TS-2022-0428",
    name: "Bộ đèn tín hiệu",
    unit: "Trung đoàn 1",
    status: "damaged",
    issuedDate: "02/05/2022",
  },
  {
    code: "TS-2024-0192",
    name: "Máy nạp ắc quy",
    unit: "Tiểu đoàn Vận tải",
    status: "in_use",
    issuedDate: "15/02/2024",
  },
  {
    code: "TS-2023-0574",
    name: "Tủ lạnh bảo quản",
    unit: "Quân y",
    status: "available",
    issuedDate: "21/09/2023",
  },
];
