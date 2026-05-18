import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../api/audit";

export const useAuditLogs = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["admin", "audit-logs", page, limit],
    queryFn: () => getAuditLogs(page, limit),
    refetchInterval: 30000, // Sync every 30 seconds for live feel
  });
};
