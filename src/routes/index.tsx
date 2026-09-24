import { createBrowserRouter, Navigate } from "react-router-dom";

import { AssetsPage } from "@/features/assets/pages/AssetsPage";
import { AuditLogPage } from "@/features/audit-log/pages/AuditLogPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { RolesPage } from "@/features/roles/pages/RolesPage";
import { ScannerPage } from "@/features/scanner/pages/ScannerPage";
import { UnitsPage } from "@/features/units/pages/UnitsPage";
import { UsersPage } from "@/features/users/pages/UsersPage";
import { WeaponsPage } from "@/features/weapons/pages/WeaponsPage";
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
      { path: "weapons", element: <WeaponsPage /> },
      { path: "scanner", element: <ScannerPage /> },
      {
        path: "units",
        element: (
          <ProtectedRoute allow="admin">
            <UnitsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute allow="admin">
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "roles",
        element: (
          <ProtectedRoute allow="admin">
            <RolesPage />
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
