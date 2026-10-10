import { createBrowserRouter, Navigate } from "react-router-dom";

import { AccountsPage } from "@/features/accounts/pages/AccountsPage";
import { AssetCreatePage } from "@/features/assets/pages/AssetCreatePage";
import { AssetDetailPage } from "@/features/assets/pages/AssetDetailPage";
import { AssetEditPage } from "@/features/assets/pages/AssetEditPage";
import { AssetPrintPage } from "@/features/assets/pages/AssetPrintPage";
import { AssetsPage } from "@/features/assets/pages/AssetsPage";
import { AttributesPage } from "@/features/attributes/pages/AttributesPage";
import { AuditLogPage } from "@/features/audit-log/pages/AuditLogPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { CategoriesPage } from "@/features/categories/pages/CategoriesPage";
import { CategoryDetailPage } from "@/features/categories/pages/CategoryDetailPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ItemsPage } from "@/features/items/pages/ItemsPage";
import { ScannerPage } from "@/features/scanner/pages/ScannerPage";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteError } from "@/routes/RouteError";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "assets", element: <AssetsPage /> },
      { path: "assets/create", element: <AssetCreatePage /> },
      { path: "assets/:code", element: <AssetDetailPage /> },
      { path: "assets/:code/edit", element: <AssetEditPage /> },
      { path: "assets/:code/print", element: <AssetPrintPage /> },
      { path: "scanner", element: <ScannerPage /> },
      { path: "items", element: <ItemsPage /> },
      {
        path: "accounts",
        element: (
          <ProtectedRoute allow="admin">
            <AccountsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories",
        element: (
          <ProtectedRoute allow="admin">
            <CategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "categories/:id",
        element: (
          <ProtectedRoute allow="admin">
            <CategoryDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "attributes",
        element: (
          <ProtectedRoute allow="admin">
            <AttributesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "audit-log",
        element: (
          <ProtectedRoute allow="admin">
            <AuditLogPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
]);
