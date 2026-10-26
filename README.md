# QR Code Management System (LAN)  
  
Hệ thống quản lý tài sản bằng mã QR, chạy trong mạng LAN nội bộ. Frontend React + TypeScript + Vite, hỗ trợ quản lý tài sản theo đơn vị/danh mục/thuộc tính động, quét QR tra cứu, kiểm kê, in tem và phân quyền theo vai trò.  
  
## Tính năng chính  
  
- **Xác thực & phân quyền** 3 vai trò: `admin`, `editor`, `viewer` (`src/store/auth.store.ts`).  
  - `admin`: toàn quyền (tài khoản, đơn vị, danh mục, thuộc tính, nhật ký, mọi phòng).  
  - `editor`: CRUD tài sản + đổi trạng thái + kiểm kê + in tem, giới hạn trong phòng mình.  
  - `viewer`: chỉ đọc + quét QR + in tem.  
- **Quản lý tài sản**: tạo/sửa/xóa, đổi trạng thái, lịch sử, lọc theo đơn vị/danh mục/trạng thái, tìm kiếm, phân trang.  
- **Danh mục & thuộc tính động**: thuộc tính theo từng danh mục với nhiều kiểu dữ liệu (TEXT, NUMBER, BOOLEAN, DATE, SELECT, MULTI_SELECT, CASCADE_SELECT...).  
- **Quét QR** tra cứu nhanh thông tin tài sản (`src/features/scanner`).  
- **Kiểm kê** theo đơn vị hoặc danh mục, báo cáo thiếu/thừa.  
- **In tem QR** chuẩn kích thước tem (A4-3x8, A4-2x5).  
- **Nhật ký (audit log)** và **Dashboard** thống kê.  
  
## Stack  
  
- React `18.2.0`, TypeScript `5.4.5`, Vite `5.4.19`  
- Tailwind CSS `3.4.17`  
- React Router `6.22.3`, TanStack Query `5.59.20`, Zustand `4.5.5`  
- React Hook Form `7.51.5` + Zod `3.22.4`  
- Axios `1.6.8`, React Icons `5.5.0`, Recharts `2.12.7`  
- `qrcode.react` `3.1.0`, `html5-qrcode` `2.3.8`  
  
> Tất cả version được pin cụ thể (không dùng `^`, `~`, `latest`).  
  
## Yêu cầu môi trường  
  
- Node `>=20.12.0` (xem `.nvmrc` và field `engines` trong `package.json`).  
- Trình duyệt mục tiêu: **Chrome 78+** (Vite build target `chrome78`).  
  
## Cài đặt & chạy  
  
```bash  
# cài dependencies  
npm install  
  
# tạo file môi trường  
cp .env.example .env  
# điền các biến bên dưới  
  
# chạy dev  
npm run dev  
  
# build production  
npm run build  
  
# preview bản build  
npm run preview  
  
# kiểm tra lint (0 warning)  
npm run lint  
```  
  
## Biến môi trường  
  
Khai báo trong `.env` (xem `.env.example`):  
  
| Biến | Ý nghĩa |  
| --- | --- |  
| `VITE_API_BASE_URL` | URL gốc của backend API (vd `http://192.168.1.10:8080/api/v1`) |  
| `VITE_USE_MOCK` | Bật/tắt dữ liệu mock |  
| `VITE_ENABLE_LOG` | Bật/tắt log ở client (qua `src/utils/logger.ts`) |  
| `VITE_APP_ENV` | Môi trường ứng dụng |  
  
## Cấu trúc thư mục  
  
```  
src/  
  api/          # axios instance, endpoints, interceptor  
  assets/       # tài nguyên tĩnh  
  components/   # UI dùng chung (Button, Input, Pagination, SearchInput...)  
  features/     # tính năng tách theo domain  
    accounts/ assets/ attributes/ audit-log/ auth/  
    categories/ dashboard/ departments/ inventory/ print/ scanner/  
  hooks/        # hook dùng chung  
  layouts/      # AuthLayout, DashboardLayout  
  routes/       # router + ProtectedRoute  
  store/        # zustand store (auth)  
  types/        # kiểu dùng chung (api.types.ts)  
  utils/        # logger, errorMessages...  
```  
  
Mỗi feature tự chứa `*.api.ts`, `*.hooks.ts`, `*.types.ts`, `pages/`, `components/`.  
  
## Quy ước (PROJECT RULES)  
  
- TypeScript strict; functional component; named export.  
- Thứ tự import: thư viện ngoài → `@/` → relative.  
- **Không dùng CSS `gap` / `inset` / `:has`** (tương thích Chrome 78) — dùng margin thay cho gap.  
- Dark/Light qua class theme (`text-text`, `bg-surface`, `border-border`...).  
- Server state chỉ qua TanStack Query; page gọi hook, không gọi `*Api.*` trực tiếp.  
- Không để lại `console.*` trong bundle production (dùng `logger`; Vite drop `console`/`debugger` khi build production).  
- Mỗi màn hình đủ 4 trạng thái: Loading / Empty / Error / Success.  
  
## Routing  
  
Router định nghĩa ở `src/routes/index.tsx`. Các route quản trị (`accounts`, `categories`, `attributes`, `departments`, `audit-log`) được bọc `ProtectedRoute allow="admin"`.