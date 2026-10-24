import { http } from "@/api/axios";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse, ListResult } from "@/types/api.types";

import type { AuditLog, AuditLogFilter } from "./audit-log.types";

export const auditLogApi = {
  list: async (filter: AuditLogFilter = {}) => {
    const { data } = await http.get<ApiResponse<ListResult<AuditLog>>>(
      endpoints.audit.list,
      {
        params: {
          page: filter.page,
          size: filter.size,
          actor_id: filter.actor_id || undefined,
          entity: filter.entity || undefined,
          action: filter.action || undefined,
        },
      },
    );
    return data;
  },
};
