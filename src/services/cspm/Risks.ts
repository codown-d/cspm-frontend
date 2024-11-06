import { request } from '@umijs/max';

export async function getRisksStatic(credential_id?: number) {
  return request<API_RISK.RisksStaticResponse>(`/api/v1/risk/risks_static`, {
    params: { credential_id },
  });
}
export async function getComplianceRisks(data: API_RISK.RiskRequest) {
  return request<API_RISK.RisksStaticResponse>(`/api/v1/compliance/risk`, {
    data,
    method: 'POST',
  });
}
export async function getComplianceHistoryRisks(
  params: API_RISK.RiskRequest & { task_id: string },
) {
  return request<API_RISK.RisksStaticResponse>(
    `/api/v1/risk/scan/history/compliance`,
    {
      params,
    },
  );
}
export async function getRisk(data: API_RISK.RiskRequest) {
  return request<API.ResponseWithItems<API_RISK.RiskItem>>(`/api/v1/risk`, {
    data,
    method: 'POST',
  });
}
export async function verifyPolicy(data: API_RISK.VerifyPolicyRequest) {
  return request(`/api/v1/risk/config/verify`, {
    data,
    method: 'POST',
  });
}

export async function getPolicyHistory(params: API_RISK.PolicyHistoryRequest) {
  return request<API.PolicyInfoResponse>(
    `/api/v1/common/policy/history/detail`,
    {
      params,
    },
  );
}
