import { request } from '@umijs/max';
import { Key } from 'react';

export async function getCommonPlugins(params: API.CommonPluginsRequest) {
  return request<API.CommonPluginsResponse[]>('/api/v1/common/plugins', {
    params,
  });
}
export async function getCommonPolicyTree() {
  return request<API.CommonPolicyTreeResponse[]>('/api/v1/common/policy/tree');
}
export async function getAssetsServicetree(params: API.RiskServicetreeRequest) {
  return request<API.ServicetreeResponse[]>('/api/v1/assets/servicetree', {
    params,
  });
}
export async function getHistoryRiskServicetree(
  params: API.HistoryRiskServicetreeRequest,
) {
  return request<API.ServicetreeResponse[]>(
    '/api/v1/risk/scan/history/servicetree',
    {
      params,
    },
  );
}
export async function getHistoryAssetsServicetree(
  params: API.RiskServicetreeRequest,
) {
  return request<API.ServicetreeResponse[]>(
    '/api/v1/assets/scan/history/servicetree',
    {
      params,
    },
  );
}
export async function getServiceTree(only_top?: number) {
  return request<API.CommonServicetreeResponse[]>(
    '/api/v1/common/services/tree',
    {
      params: { only_top },
      // isSignal: true,
    },
  );
}
export async function getRiskServicetree(params: API.RiskServicetreeRequest) {
  return request<API.ServicetreeResponse[]>('/api/v1/risk/servicetree', {
    params,
  });
}
export async function getCommonPolicyList() {
  return request<API.CommonPolicyDatum[]>('/api/v1/common/policy/list');
}
export async function getCommonPlatforms(params?: API.RegionsRequest) {
  return request<API.CommonPlatformsResponse[]>('/api/v1/common/platforms', {
    params,
  });
}
// 合规类型
// export async function getCompliance() {
//   return request<API.ResponseWithItems<API.ComplianceDatum>>(
//     '/api/v1/compliance',
//     {},
//   );
// }
// 服务类型/资产类型
export async function getSystemConfigs() {
  return request<API.SystemConfigs>('/api/v1/system/configs');
}
// 获取静态枚举
export async function getCommonConst() {
  return request<API.ICommonConst>('/api/v1/common/const');
}

// 执行扫描
export async function credentialsScan(data: API.CredentialsScanResRequest) {
  return request<API.CredentialsScanResponse>(`/api/v1/risk/scan`, {
    method: 'POST',
    data,
  });
}
export async function getDashboardCredentials() {
  return request<API.DashboardCredentialsResponse[]>(
    '/api/v1/dashboard/credentials',
    {},
  );
}
export async function getCredentials(params: API.CredentialsRequest) {
  return request<API.ResponseWithItems<API.CredentialsDatum>>(
    '/api/v1/credential',
    {
      params,
    },
  );
}
export async function getCredentialsHistory(
  data: API.CredentialsRequest & { task_id: string },
) {
  return request<API.ResponseWithItems<API.CredentialsDatum>>(
    '/api/v1/compliance/risk/scan/credentials',
    { method: 'POST', data },
  );
}
export async function getRiskCredentials(
  params: API.CredentialsRequest & { policy_id: string },
) {
  return request<API.ResponseWithItems<API.CredentialsDatum>>(
    '/api/v1/risk/credentials',
    {
      params,
    },
  );
}

export async function getComplianceRiskCredentials(
  data: API.CredentialsRequest & {
    compliance_content_id: string;
    policy_id: string;
    credential_ids: number[];
  },
) {
  return request<API.ResponseWithItems<API.CredentialsDatum>>(
    '/api/v1/compliance/risk/credentials',
    { method: 'POST', data },
  );
}

export async function addCredentials(data?: API.AddCredentialRequest) {
  return request<{ id: number }>('/api/v1/credential', {
    method: 'POST',
    data,
  });
}

export async function editCredentials(data?: API.EditCredentialRequest) {
  return request(`/api/v1/credential`, {
    method: 'PATCH',
    data,
  });
}

export async function deleteCredentials(params: API.DeleteCredentialRequest) {
  return request('/api/v1/credential', {
    method: 'DELETE',
    data: params,
  });
}
// 账户详情
export async function getCredentialById(params: { id: string }) {
  return request<API.CredentialResponse>(`/api/v1/credential/detail`, {
    params,
  });
}
// 报告的账户详情
export async function getCredentialHistoryById(params: {
  id: string;
  task_id: string;
}) {
  return request<API.CredentialResponse>(`/api/v1/credential/history/detail`, {
    params,
  });
}
// 账户的风险列表
// export async function getCredentialRisksById(
//   id: string,
//   params: API.RisksByIdRequest,
// ) {
//   return request<API.RisksByIdResponse>(`/api/v1/credentials/${id}/risks`, {
//     params,
//   });
// }
// 账户的扫描记录
export async function getCredentialReportsById(
  id: string,
  params: API.CredentialReportsRequest,
) {
  return request<API.ResponseWithItems<API.CredentialReportDatum>>(
    `/api/v1/credentials/${id}/reports`,
    {
      params,
    },
  );
}
// 扫描报告详情
export async function getReportsById(id: string) {
  return request<API.ReportDetailResponse>(`/api/v1/risk/scan/history/detail`, {
    params: { id },
  });
}
export async function getReportsById1(id: string) {
  return request<API.ReportDetailResponse>(`/api/v1/reports/${id}`, {
    skipErrorHandler: true,
    getResponse: false,
    requestInterceptors: [],
    responseInterceptors: [],
  });
}

// 报告的风险列表
export async function getReportRisksById(
  params: Pick<
    API.RisksRequest,
    'policy_name' | 'service_ids' | 'severity' | 'size' | 'page'
  > & { task_id: string },
) {
  return request<API.ResponseWithItems<API.RisksDatum>>(
    `/api/v1/risk/scan/history/risk`,
    {
      params,
    },
  );
}
// 区域列表
export async function getRegions(params?: API.RegionsRequest) {
  return request<API.RegionsResponse[]>(`/api/v1/common/regions/tree`, {
    params,
  });
}
// 导出报告 /api/v1/risk/scan/history/export
export async function exportReports(params: {
  id: string;
  export_name: string;
}) {
  return request(`/api/v1/risk/scan/history/export`, {
    params,
  });
}
export async function exportRisks(data: API.ExportRisksRequest) {
  return request(`/api/v1/risk/export`, {
    method: 'POST',
    data,
  });
}
// 按账户导出报告
export async function exportReportsByCredentials(params: {
  id: string;
  export_name: string;
}) {
  return request(`/api/v1/credential/export`, params);
}

//基线列表
export async function getBaselines(params?: API.BaselinesRequest) {
  return request<API.ResponseWithItems<API.BaselinesDatum>>(
    '/api/v1/benchmarks/list',
    {
      method: 'POST',
      data: params,
    },
  );
}
//新增基线
export async function addBaseline(body?: API.AddBaselineRequest) {
  return request<{ id: number }>('/api/v1/benchmarks', {
    method: 'POST',
    data: body,
  });
}

//编辑基线
export async function editBaselines(
  id: string,
  body?: API.EditBaselineRequest,
) {
  return request(`/api/v1/benchmarks/${id}`, {
    method: 'PATCH',
    data: body,
  });
}

//删除基线
export async function deleteBaselines(params: API.DeleteBaselineRequest) {
  return request('/api/v1/benchmarks', {
    method: 'DELETE',
    params,
  });
}
// 基线详情
export async function getBaselineById(id: string) {
  return request<API.BaselineResponse>(`/api/v1/benchmarks/${id}`);
}
// 风险列表
export async function getRisks(data: API.RisksRequest) {
  return request<API.ResponseWithItems<API.RisksDatum>>(`/api/v1/risk`, {
    method: 'POST',
    data,
    isSignal: true,
  });
}
// 漏洞列表
export async function getVulnRisks(params: API.VulnRisksRequest) {
  return request<API.ResponseWithItems<API.VulnRisksDatum>>(
    `/api/v1/risk/vuln/list`,
    { params },
  );
}
// 敏感文件规则列表
export async function getRuleSensitiveRisks(
  params?: API.RuleSensitiveRisksRequest,
) {
  return request<API.ResponseWithItems<API.RuleSensitiveRisksDatum>>(
    `/api/v1/risk/rule/sensitive/list`,
    { params },
  );
}
// 敏感文件列表
export async function getSensitiveRisks(params: API.SensitiveRisksRequest) {
  return request<API.ResponseWithItems<API.SensitiveRisksDatum>>(
    `/api/v1/risk/sensitive/list`,
    { params },
  );
}
// 资产详情-风险检测结果（配置风险）
export async function getAssetsPolicies(params: API.AssetsPoliciesRequest) {
  return request<API.ResponseWithItems<API.AssetsPoliciesDatum>>(
    `/api/v1/assets/policies`,
    {
      params,
    },
  );
}
// 风险报告-资产列表-资产详情-风险检测结果（配置风险）
export async function getHistoryAssetsPolicies(
  params: API.AssetsPoliciesRequest,
) {
  return request<API.ResponseWithItems<API.AssetsPoliciesDatum>>(
    `/api/v1/assets/scan/history/policies`,
    {
      params,
    },
  );
}

// 检测项详情
export async function getPolicyById(params: { id: Key; type?: string }) {
  return request<API.PolicyInfoResponse>(`/api/v1/common/policy/detail`, {
    params,
  });
}
// 漏洞风险详情
export async function getVulnRisksById(unique_id: Key) {
  return request<API.VulnRiskInfoResponse>(`/api/v1/risk/vuln/detail`, {
    params: { unique_id },
  });
}
export async function getRuleSensitiveById(unique_id: Key) {
  return request<API.RuleSensitiveInfoResponse>(
    `/api/v1/risk/rule/sensitive/detail`,
    {
      params: { unique_id },
    },
  );
}
export async function getSensitiveById(unique_id: Key) {
  return request<API.SensitiveInfoResponse>(`/api/v1/risk/sensitive/detail`, {
    params: { unique_id },
  });
}
// 漏洞/凭证密钥下的资产列表
export async function getAgentlessRisksAssets(
  params?: API.AgentlessRisksAssetsRequest,
) {
  return request<API.ResponseWithItems<API.AgentlessRisksAssetsResponse>>(
    `/api/v1/risk/assets/list`,
    {
      params,
    },
  );
}
export async function getRiskPkgList(params?: API.RiskPkgRequest) {
  return request<API.ResponseWithItems<API.RiskPkgResponse>>(
    `/api/v1/risk/pkg/list`,
    {
      params,
    },
  );
}
// 资产概况
export async function getAssetsCompare(params?: API.AssetsCompareRequest) {
  return request<API.PeriodicCompareResponse[]>(
    '/api/v1/dashboard/statistics/compare/assets',
    { params },
  );
}
// 风险概况
export async function getRisksCompare(params?: API.AssetsCompareRequest) {
  return request<API.PeriodicCompareResponse[]>(
    '/api/v1/dashboard/statistics/compare/risks',
    { params },
  );
}
// 资产周期任务扫描对比
export async function getAssetsPeriodicCompare(
  params?: API.AssetsPeriodicCompareRequest,
) {
  return request<API.PeriodicCompareResponse[]>(
    '/api/v1/dashboard/assets/periodic/compare',
    { params },
  );
}
// 风险周期任务扫描对比
export async function getRisksPeriodicCompare(
  params?: API.RisksPeriodicCompareRequest,
) {
  return request<API.PeriodicCompareResponse[]>(
    '/api/v1/dashboard/risks/periodic/compare',
    { params },
  );
}
// 手动资产扫描
export async function assetsScan(data: API.AssetsScanRequest) {
  return request(`/api/v1/assets/scan`, {
    method: 'POST',
    data,
  });
}
