import { createBrowserRouter, Navigate } from "react-router-dom";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteError } from "@/routes/RouteError";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <div className="min-h-screen bg-bg p-8 text-text">Dashboard</div>
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
