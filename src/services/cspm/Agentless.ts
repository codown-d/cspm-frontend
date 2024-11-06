import { request } from '@umijs/max';
import { Key } from 'react';

// 漏洞列表
export async function getVulnRisks(params: API_AGENTLESS.VulnRisksRequest) {
  return request<API.ResponseWithItems<API_AGENTLESS.VulnRisksDatum>>(
    `/api/v1/risk/vuln/list`,
    { params },
  );
}
// 敏感文件规则列表
export async function getRuleSensitiveRisks(
  params?: API_AGENTLESS.RuleSensitiveRisksRequest,
) {
  return request<API.ResponseWithItems<API_AGENTLESS.RuleSensitiveRisksDatum>>(
    `/api/v1/risk/rule/sensitive/list`,
    { params },
  );
}
// 敏感文件列表
export async function getSensitiveRisks(
  params: API_AGENTLESS.SensitiveRisksRequest,
) {
  return request<API.ResponseWithItems<API_AGENTLESS.SensitiveRisksDatum>>(
    `/api/v1/risk/sensitive/list`,
    { params },
  );
}
// 漏洞风险详情
export async function getVulnRisksById(unique_id: Key) {
  return request<API_AGENTLESS.VulnRiskInfoResponse>(
    `/api/v1/risk/vuln/detail`,
    {
      params: { unique_id },
    },
  );
}
export async function getRuleSensitiveById(unique_id: Key) {
  return request<API_AGENTLESS.RuleSensitiveInfoResponse>(
    `/api/v1/risk/rule/sensitive/detail`,
    {
      params: { unique_id },
    },
  );
}
export async function getSensitiveById(unique_id: Key) {
  return request<API_AGENTLESS.SensitiveInfoResponse>(
    `/api/v1/risk/sensitive/detail`,
    {
      params: { unique_id },
    },
  );
}
// 漏洞/凭证密钥下的资产列表
export async function getAgentlessRisksAssets(
  params?: API_AGENTLESS.AgentlessRisksAssetsRequest,
) {
  return request<
    API.ResponseWithItems<API_AGENTLESS.AgentlessRisksAssetsResponse>
  >(`/api/v1/risk/assets/list`, {
    params,
  });
}
export async function getRiskPkgList(params?: API_AGENTLESS.RiskPkgRequest) {
  return request<API.ResponseWithItems<API_AGENTLESS.RiskPkgResponse>>(
    `/api/v1/risk/pkg/list`,
    {
      params,
    },
  );
}
export async function getVulnAssetsTop(
  params?: API_AGENTLESS.VulnAssetsTopRequest,
) {
  return request<API_AGENTLESS.VulnAssetsTopResponse[]>(
    `/api/v1/risk/vuln/assets/top5`,
    {
      params,
    },
  );
}

export async function getSensitiveAssetsTop(
  params?: API_AGENTLESS.VulnAssetsTopRequest,
) {
  return request<API_AGENTLESS.SensitiveAssetsTopResponse[]>(
    `/api/v1/risk/sensitive/assets/top5`,
    {
      params,
    },
  );
}
export async function getSensitiveCategory() {
  return request<API_AGENTLESS.SensitiveCategoryResponse[]>(
    `/api/v1/risk/rule/sensitive/category`,
  );
}
