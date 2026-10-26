# QR Code Management System — Tài liệu kỹ thuật  
  
Hệ thống quản lý tài sản bằng mã QR, chạy trong mạng LAN. Frontend: React + TypeScript + Vite, giao tiếp REST với backend Go.  
  
## 1. Stack & phiên bản  
  
| Thành phần | Phiên bản |  
|---|---|  
| React | 18.2.0 |  
| TypeScript | 5.4.5 |  
| Vite | 5.4.19 |  
| Tailwind CSS | 3.4.17 |  
| React Router | 6.22.3 |  
| Axios | 1.6.8 |  
| TanStack Query | 5.59.20 |  
| Zustand | 4.5.5 |  
| React Hook Form | 7.51.5 |  
| Zod | 3.22.4 |  
| React Icons | 5.5.0 |  
| qrcode.react / html5-qrcode | 3.1.0 / 2.3.8 |  
| recharts | 2.12.7 |  
  
Version pin cụ thể (không `^`/`~`/`latest`). Node: `>=20.12.0` (field `engines` trong `package.json`).  
  
**Browser target:** Chrome 78+. Vite `build.target = "chrome78"`; esbuild drop `console`/`debugger` khi build production (`vite.config.ts`). KHÔNG dùng CSS `gap`/`inset`/`:has` (tương thích Chrome 78).  
  
## 2. Cài đặt & chạy  
  
```bash  
npm install  
cp .env.example .env   # điền biến môi trường  
npm run dev            # dev server  
npm run build          # tsc -b && vite build (target chrome78)  
npm run preview        # xem bản build  
npm run lint           # eslint --max-warnings=0  
```  
  
### Biến môi trường (`.env`)  
  
| Biến | Ý nghĩa |  
|---|---|  
| `VITE_API_BASE_URL` | Base URL của backend API |  
| `VITE_USE_MOCK` | Bật/tắt mock đăng nhập |  
| `VITE_ENABLE_LOG` | Bật/tắt log qua `src/utils/logger.ts` |  
| `VITE_APP_ENV` | Môi trường ứng dụng |  
  
## 3. Cấu trúc thư mục `src/`  
  
```  
api/         endpoints, axios instance, interceptor  
assets/      tài nguyên tĩnh  
components/  UI dùng chung (Button, Input, Pagination, SearchInput, ConfirmDialog, FormField, FormSelect, DatePicker...)  
features/    module theo tính năng (xem mục 4)  
hooks/       hook dùng chung  
layouts/     AuthLayout, DashboardLayout  
routes/      router, ProtectedRoute, RouteError  
store/       Zustand store (auth)  
types/       type dùng chung (api.types.ts)  
utils/       logger, errorMessages  
```  
  
Mỗi feature trong `features/` tự chứa `*.api.ts`, `*.hooks.ts`, `*.types.ts`, `*.schema.ts` (nếu có) và thư mục `pages/` / `components/`.  
  
Danh sách feature: `accounts`, `assets`, `attributes`, `audit-log`, `auth`, `categories`, `dashboard`, `departments`, `inventory`, `print`, `scanner`.  
  
## 4. Routing & phân quyền  
  
Định nghĩa trong `src/routes/index.tsx`. Mọi route `/dashboard/*` bọc trong `ProtectedRoute` (chưa đăng nhập → `/login`).  
  
| Route | Trang | Quyền |  
|---|---|---|  
| `/dashboard` | DashboardPage | mọi role |  
| `/dashboard/assets` | AssetsPage | mọi role |  
| `/dashboard/assets/create` | AssetCreatePage | admin/editor |  
| `/dashboard/assets/:code` | AssetDetailPage | mọi role |  
| `/dashboard/assets/:code/edit` | AssetEditPage | admin/editor |  
| `/dashboard/assets/:code/print` | AssetPrintPage | mọi role |  
| `/dashboard/scanner` | ScannerPage | mọi role |  
| `/dashboard/inventory` | InventoryPage | mọi role (ghi kiểm kê: admin/editor) |  
| `/dashboard/accounts` | AccountsPage | `allow="admin"` |  
| `/dashboard/categories` | CategoriesPage | `allow="admin"` |  
| `/dashboard/categories/:id` | CategoryDetailPage | `allow="admin"` |  
| `/dashboard/attributes` | AttributesPage | `allow="admin"` |  
| `/dashboard/departments` | DepartmentsPage | `allow="admin"` |  
| `/dashboard/audit-log` | AuditLogPage | `allow="admin"` |  
  
### Vai trò (`src/store/auth.store.ts`)  
  
`Role = "admin" | "editor" | "viewer"`.  
  
- **admin**: toàn quyền (accounts, departments, categories, attributes, audit, mọi thao tác asset/kiểm kê trên mọi đơn vị).  
- **editor**: CRUD tài sản + đổi status + kiểm kê + in tem, giới hạn trong đơn vị của mình. Không vào menu quản trị.  
- **viewer**: chỉ đọc + quét QR + in tem. Mọi POST/PUT/DELETE asset → 403.  
  
FE chỉ ẩn/disable UI; backend mới là nơi enforce quyền thật (trả 403).  
  
## 5. State & dữ liệu server  
  
- **Server state**: chỉ qua TanStack Query. Component gọi hook (`use*`), không gọi `*Api.*` trực tiếp.  
- **Auth state**: Zustand (`useAuthStore`) với `persist` (key `qr-auth`), lưu `user`, `token`, `refreshToken`.  
  
## 6. API layer  
  
- `src/api/endpoints.ts`: tập trung toàn bộ đường dẫn endpoint.  
- Axios instance + interceptor trong `src/api/`.  
- Mọi response theo chuẩn `ApiResponse<T>` (`src/types/api.types.ts`): `{ ok, data?, error? }`. List dùng `ListResult<T>` (`items`, `page`, `size`, `total`).  
  
### Nhóm endpoint chính  
  
| Nhóm | Endpoint tiêu biểu |  
|---|---|  
| auth | `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/change-password` |  
| accounts | `GET/POST /accounts`, `PUT /accounts/:id`, `/accounts/:id/lock`, `/unlock`, `/reset-password`, `DELETE /accounts/:id`, `/accounts/me` |  
| departments | `GET/POST /departments`, `PUT/DELETE /departments/:id` |  
| categories | `GET/POST /categories`, `PUT/DELETE /categories/:id`, `/categories/:id/attributes` |  
| attributes | `GET/POST /attributes`, `DELETE /attributes/:id` |  
| assets | `GET/POST /assets`, `PUT /assets/:id`, `/assets/:id/status`, `/history`, `/assets/:id/qr.png`, `/assets/lookup/:code`, `/assets/mark-printed` |  
| inventory | `/inventory/sessions`, `/sessions/:id/scan`, `/scans`, `/report`, `/close` |  
| stats | `/stats/dashboard` |  
| audit | `/audit` |  
| print | `/print/labels` |  
  
### Lọc tài sản (`GET /assets`)  
  
Query param: `q` (tìm theo tên), `status`, `department_id`, `category_id`, `page`, `size` (max 100, mặc định 20). Với editor/viewer backend ép `department_id` về đúng đơn vị của user, nên FE ẩn dropdown lọc đơn vị với 2 role này.  
  
## 7. Thuộc tính động (attributes)  
  
Tài sản mang `attributes` (map `code → value`) và `attributes_detail` (đã enrich `name`, `data_type`, `sort_order`) cho hiển thị. Form Thêm/Sửa dùng `attributes`; trang hiển thị (ScannerPage, AssetDetailPage) ưu tiên `attributes_detail`, fallback về code thô nếu thuộc tính đã gỡ khỏi danh mục.  
  
Các `data_type`: `TEXT`, `TEXTAREA`, `NUMBER`, `DECIMAL`, `BOOLEAN`, `DATE`, `DATETIME`, `SELECT`, `MULTI_SELECT`, `CASCADE_SELECT` (select 2 cấp parent→child).  
  
| data_type | options khi tạo | value của asset |  
|---|---|---|  
| SELECT | `["A","B"]` | `"A"` |  
| MULTI_SELECT | `["A","B"]` | `["A","B"]` |  
| CASCADE_SELECT | `{"A":["a1","a2"]}` | `{"parent":"A","child":"a1"}` |  
  
## 8. Kiểm kê (inventory)  
  
Tạo phiên qua `POST /inventory/sessions` với `scope_type` (`DEPARTMENT`/`CATEGORY`), `scope_id`, và `filter_category_id` optional (chỉ dùng khi `scope_type=DEPARTMENT`; dùng sai → `INVALID_FILTER`). Quét asset ngoài danh mục lọc → đánh dấu `is_unexpected`. Danh sách phiên hỗ trợ `q`/`page`/`size` server-side.  
  
## 9. Xử lý lỗi (`src/utils/errorMessages.ts`)  
  
`errorMessage(err)` đọc `error.code` từ response và map sang tiếng Việt qua `ERROR_MESSAGES`. Các nhánh đặc biệt:  
  
- `INVALID_STATUS_TRANSITION` / chuỗi `status transition`: dịch `from`/`to` sang tên trạng thái tiếng Việt qua `statusLabel`.  
- `VALIDATION_FAILED`: ghép thêm `error.fields` (map field→lý do).  
- Code lạ: fallback về `message` gốc + `logger.warn` cảnh báo trong dev.  
  
Bảng mã lỗi đã map: `UNAUTHORIZED`, `INVALID_CREDENTIALS`, `TOKEN_INVALID`, `FORBIDDEN`, `ACCOUNT_LOCKED`, `NOT_FOUND`, `USER_NOT_FOUND`, `USER_EXISTS`, `CONFLICT`, `ASSET_NOT_FOUND`, `DEPARTMENT_REQUIRED`, `PASSWORD_TOO_SHORT`, `BAD_REQUEST`, `BAD_JSON`, `VALIDATION_FAILED`, `INVALID_ATTRIBUTES`, `NO_IDS`, `NO_PRINTABLE_ASSETS`, `INVALID_FILTER`, `SCOPE_NOT_FOUND`, `INTERNAL`.  
  
## 10. In tem / QR  
  
Dùng `@media print` + class `.print-area` / `.no-print` trong `src/index.css`: khi in chỉ hiện vùng tem, ẩn sidebar/header/nút. Không dùng `gap` cho lưới tem → dùng margin.  
  
## 11. Quy ước code (PROJECT RULES)  
  
- TypeScript strict; functional component; **named export**.  
- Import order: thư viện ngoài → `@/` → relative.  
- KHÔNG dùng CSS `gap`/`inset`/`:has`.  
- Dark/Light qua theme class (`text-text`, `bg-surface`, `border-border`, `bg-bg`, `bg-primary`, `text-accent`), không hardcode màu (ngoại lệ trang in tem).  
- Server state chỉ qua TanStack Query; không gọi `*Api.*` trực tiếp trong page.  
- Không để `console.*` trong bundle production — dùng `src/utils/logger.ts`.  
  
## 12. Definition of Done  
  
```  
✓ TypeScript pass (strict)  
✓ ESLint pass (--max-warnings=0)  
✓ Build pass (Vite target chrome78; không gap/inset/:has)  
✓ 4 trạng thái: Loading / Empty / Error / Success  
✓ Responsive + Dark/Light  
✓ In QR chuẩn kích thước tem  
✓ Không còn console trong bundle production  
```