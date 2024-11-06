import { request } from '@umijs/max';

export async function getAiHistory(params: {
  limit: number;
  start_id: number;
}) {
  return request<API.ResponseWithItems<API.AiHistoryResponse>>(
    '/ai/v1/history',
    {
      method: 'GET',
      params,
    },
  );
}

export async function getAiHistoryById(id: string | number) {
  return request<API.AiHistoryByIdResponse>(`/ai/v1/history/${id}`, {
    method: 'GET',
    params: {},
  });
}

//删除所有历史记录
export async function clearHistory() {
  return request('/ai/v1/history/delete_all', {
    method: 'POST',
  });
}

//删除对话
export async function deleteHistoryById(conversation_id: string) {
  return request('/ai/v1/history/delete', {
    method: 'POST',
    data: { conversation_id },
  });
}
