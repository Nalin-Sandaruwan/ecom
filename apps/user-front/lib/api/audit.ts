import { apiClient } from "./apiClient";

export interface AuditUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuditLog {
  _id: string;
  userId?: AuditUser;
  action: string;
  status: "success" | "failure";
  details?: string;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export interface AuditLogsResponse {
  status: string;
  results: number;
  total: number;
  data: {
    logs: AuditLog[];
  };
}

export const getAuditLogs = async (page = 1, limit = 10): Promise<AuditLogsResponse> => {
  const response = await apiClient.get(`/admin/audit-logs?page=${page}&limit=${limit}`);
  return response.data;
};
