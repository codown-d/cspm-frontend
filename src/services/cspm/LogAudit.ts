import { request } from '@umijs/max';

export async function getAuditLogs(params: API.SystemLogsRequest) {
  return request<API.ResponseWithItems<API.SystemLogsDatum>>(
    '/api/v1/system/audit/list',
    {
      method: 'GET',
      params,
    },
  );
}

export async function exportAuditLogs(
  data: API.SystemLogsRequest & { export_name: string },
) {
  return request<API.ComplianceInfoResponse>(`/api/v1/system/audit/export`, {
    method: 'POST',
    data,
  });
}
