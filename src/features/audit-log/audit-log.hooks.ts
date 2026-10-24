import { useQuery } from "@tanstack/react-query";

import { pickData } from "@/types/api.types";

import { auditLogApi } from "./audit-log.api";
import type { AuditLogFilter } from "./audit-log.types";

const keys = {
  all: ["audit-log"] as const,
  list: (filter: AuditLogFilter) => ["audit-log", "list", filter] as const,
};

export function useAuditLogs(filter: AuditLogFilter = {}) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: async () => pickData(await auditLogApi.list(filter)),
  });
}
