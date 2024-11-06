import { request } from '@umijs/max';

// 标签列表
export async function getTags(params: API_TAG.TagsRequest) {
  return request<API_TAG.TagsDatum[]>(`/api/v1/compliance/tag`, {
    params,
  });
}

// 新增标签
export async function addTag(data: API_TAG.AddTagsRequest) {
  return request<API_TAG.TagsDatum>(`/api/v1/compliance/tag`, {
    data,
    method: 'POST',
  });
}

// 修改标签
export async function updateTag(data: API_TAG.UpdateTagsRequest) {
  return request(`/api/v1/compliance/tag`, {
    data,
    method: 'PUT',
  });
}

// 删除标签
export async function deleteTag(key: string) {
  return request<API_TAG.TagsDatum>(`/api/v1/compliance/tag`, {
    data: { key },
    method: 'DELETE',
  });
}
