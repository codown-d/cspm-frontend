import { request } from '@umijs/max';

// 风险概况（工作台）
export async function getRiskStatistics(
  params: API_STATISTICS.RiskStatisticsRequest,
) {
  return request<API_STATISTICS.RiskStatisticsResponse[]>(
    `/api/v1/dashboard/statistics/compare/risks`,
    {
      params,
    },
  );
}

// 资产概况（工作台）
export async function getAssetsStatistics(
  params: API_STATISTICS.AssetsStatisticsRequest,
) {
  return request<API_STATISTICS.RiskStatisticsResponse[]>(
    `/api/v1/dashboard/statistics/compare/assets`,
    {
      params,
    },
  );
}

// 合规概览（工作台）
export async function getComplianceStatistics(id: string) {
  return request<API_COMPLIANCE.ComplianceOverviewItem[]>(
    `/api/v1/dashboard/statistics/compliance/${id}`,
  );
}

// 风险趋势
export async function getTendency(params: API_STATISTICS.TendencyRequest) {
  return request<API_STATISTICS.TendencyResponse>(
    '/api/v1/dashboard/tendency',
    {
      params,
    },
  );
}
