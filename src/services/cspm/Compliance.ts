import { request } from '@umijs/max';
import { Key } from 'react';

// 合规框架列表
export async function getCompliance(params?: API_COMPLIANCE.ComplianceRequest) {
  return request<API_COMPLIANCE.ComplianceDatum[]>(`/api/v1/compliance`, {
    params,
  });
}
// 新增 自定义合规框架
export async function addCompliance(data: API_COMPLIANCE.AddComplianceRequest) {
  return request<API.ResponseIdWithAdd<number>>(`/api/v1/compliance`, {
    method: 'POST',
    data,
  });
}
// 编辑 自定义合规框架
export async function editCompliance({
  id,
  ...data
}: API_COMPLIANCE.AddComplianceRequest & { id: number }) {
  return request(`/api/v1/compliance/${id}`, {
    method: 'PATCH',
    data,
  });
}

export async function getRelatedCompliance(
  params: API_COMPLIANCE.RelatedComplianceRequest,
) {
  return request<API.ResponseWithItems<API_COMPLIANCE.RelatedComplianceDatum>>(
    `/api/v1/compliance/related`,
    { params },
  );
}
// 合规框架详情
export async function getComplianceById(id: string) {
  return request<API_COMPLIANCE.ComplianceInfoResponse>(
    `/api/v1/compliance/${id}`,
  );
}
// 删除 自定义合规框架
export async function deleteComplianceById(id: number) {
  return request(`/api/v1/compliance/${id}`, {
    method: 'DELETE',
  });
}
// 带风险计数的合规框架
export async function getComplianceWithRisks({
  id,
  ...params
}: API_COMPLIANCE.ComplianceWithRisksRequest & { id: Key }) {
  return request<API_COMPLIANCE.ComplianceWithRisksResponse>(
    `/api/v1/compliance/${id}/detail_with_risks`,
    {
      params,
    },
  );
}
// 合规概览
export async function getComplianceOverview(credential_ids?: number[]) {
  return request<API_COMPLIANCE.ComplianceOverviewItem[]>(
    `/api/v1/compliance/overview`,
    {
      params: { credential_ids },
    },
  );
}
// 合规框架调整顺序
export async function sequenceCompliance({
  id,
  ...data
}: API_COMPLIANCE.ComplianceSequence) {
  return request(`/api/v1/compliance/${id}/sequence`, {
    method: 'POST',
    data,
  });
}
// 合规框架启停用
export async function toggleCompliance({
  id,
  ...data
}: API_COMPLIANCE.ComplianceToggle) {
  return request(`/api/v1/compliance/${id}/toggle`, {
    method: 'POST',
    data,
  });
}
export async function exportComplianceById({
  key,
  ...rest
}: API_COMPLIANCE.ComplianceInfoRequest & { export_name: string }) {
  return request<API_COMPLIANCE.ComplianceWithRisksResponse>(
    `/api/v1/compliance/export/${key}/risks`,
    {
      params: rest,
    },
  );
}

// 获取更正留存期限
export async function getComplianceSettings() {
  return request<API_COMPLIANCE.ComplianceSettingsResponse>(
    '/api/v1/compliance/settings',
  );
}

// 设置更正留存期限
export async function postComplianceSettings(
  data: API_COMPLIANCE.ComplianceSettingsReq,
) {
  return request('/api/v1/compliance/settings', {
    method: 'POST',
    data,
  });
}

// 执行扫描
export async function complianceScan(
  data: API_COMPLIANCE.ComplianceScanRequest,
) {
  return request(`/api/v1/compliance/scan`, {
    method: 'POST',
    data,
  });
}

// 更正手动检测项结果
export async function rectifyPolicyResult(
  data: API_COMPLIANCE.RectifyPolicyResultRequest,
) {
  return request(`/api/v1/compliance/policy/result`, {
    method: 'POST',
    data,
  });
}
