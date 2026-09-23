import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import { logger } from "@/utils/logger";

export function RouteError() {
  const error = useRouteError();

  logger.error("Route error:", error);

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Đã xảy ra lỗi không xác định";

  return (
    <div className="min-h-screen bg-bg p-8 text-center text-text">
      <h1 className="mb-2 text-xl font-semibold">Có lỗi xảy ra</h1>
      <p className="mb-4 text-red-600">{message}</p>
      <button
        className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover"
        onClick={() => window.location.assign("/dashboard")}
      >
        Về trang chủ
      </button>
    </div>
  );
}
