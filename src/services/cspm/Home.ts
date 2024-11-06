import { request } from '@umijs/max';

// 风险TOP5
export async function getTopRisks(params: API.TopRisksRequest) {
  return request<API.TopRisksResponse[]>('/api/v1/dashboard/top/risks', {
    params,
  });
}
// 风险数 Top5 的资产
export async function getTopAssetsRisks(params: API.TopRisksRequest) {
  return request<API.TopRisksResponse[]>('/api/v1/dashboard/top/assets', {
    method: 'GET',
    params,
  });
}
// 账户TOP5
export async function getTopCredentials(platforms?: string[]) {
  return request<API.StatisticsRisksPlatformResponse[]>(
    '/api/v1/dashboard/top/credentials',
    {
      method: 'GET',
      params: { platforms },
    },
  );
}
// 资产统计
export async function getStatisticsAssets(params: API.StatisticsAssetRequest) {
  return request<API.StatisticsAssetsResponse[]>(
    '/api/v1/dashboard/statistics/assets',
    {
      params,
    },
  );
}
// 风险统计
export async function getStatisticsRisks(params: API.StatisticsRisksRequest) {
  return request<API.StatisticsRisksResponse[]>(
    '/api/v1/dashboard/statistics/risks/config',
    {
      method: 'GET',
      params,
    },
  );
}

// 我的任务
export async function getTasksFuture() {
  return request<API.TasksFutureItem[]>('/api/v1/tasks/future');
}

// 全局创建导出任务
export async function exportTask(data: API.ExportRequest) {
  return request(`/api/v1/export/task/${data.execute_type}`, {
    method: 'POST',
    data,
  });
}
// 确认”实体“是否存在
export async function getEntityIsexists(params: API.EntityIsExistsRequest) {
  return request<API.EntityIsExistsResponse>('/api/v1/common/entity/exists', {
    params,
  });
}
// 是否包含主机资产
export async function checkHost(params: API.checkHostRequest) {
  return request<{
    agentless_scannable: boolean;
  }>('/api/v1/assets/check_agentless_scannable', {
    params,
  });
}
