import { request } from '@umijs/max';

export async function getAssets(data: API_ASSETS.AssetsRequest) {
  return request<API.ResponseWithItems<API_ASSETS.AssetsDatum>>(
    '/api/v1/assets',
    {
      method: 'POST',
      data,
    },
  );
}
export async function getAssetsById(params: API_ASSETS.AssetsInfoRequest) {
  return request<API_ASSETS.AssetsInfoResponse>(`/api/v1/assets`, {
    params,
  });
}
export async function getAssetsOverview() {
  return request<API_ASSETS.AssetsOverviewResponse[]>(
    '/api/v1/assets/overview',
  );
}

// 资产/风险报告-资产列表
export async function getReportsAssetsById(
  params: API_ASSETS.AssetsHistoryRequest,
) {
  return request<API.ResponseWithItems<API_ASSETS.AssetsDatum>>(
    `/api/v1/assets/scan/history/assets`,
    {
      params,
    },
  );
}

// 资产/风险报告-资产列表-资产详情
export async function getReportsDetailAssetsById(
  params: API_ASSETS.AssetsInfoRequest,
) {
  return request<API_ASSETS.AssetsInfoResponse>(
    `/api/v1/assets/scan/history/assets/detail`,
    {
      params,
    },
  );
}

// 配置风险详情的关联实例
export async function getAssetsInRiskInfoById({
  policy_id,
  ...params
}: API.AssetsInRiskInfoByIdRequest) {
  return request<API.ResponseWithItems<API.AssetsInRiskInfoByIdResponse>>(
    `/api/v1/risk/assets/${policy_id}`,
    { params },
  );
}
// 报告配置风险详情的关联实例
export async function getAssetsInRiskHistoryById({
  policy_id,
  ...params
}: API.AssetsInRiskInfoByIdRequest & { task_id: string }) {
  return request<API.ResponseWithItems<API.AssetsInRiskInfoByIdResponse>>(
    `/api/v1/risk/scan/history/assets/${policy_id}`,
    { params },
  );
}
