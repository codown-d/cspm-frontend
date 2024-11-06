import { request } from '@umijs/max';

// 角色列表
export async function getRoleList(params: API.RoleListRequest) {
  return request<API.ResponseWithItems<API.RoleListResponse>>(
    '/api/v1/system/role',
    {
      params,
      method: 'GET',
    },
  );
}

// 角色详情
export async function getRoleDetail(id: string | number) {
  return request<API.RoleListResponse>(
    '/api/v1/system/role/detail',
    {
      params: {id: +id},
      method: 'GET',
    },
  );
}

// 修改角色
export async function updateRole(data: API.SetRoleRequest) {
  return request(
    '/api/v1/system/role',
    {
      data,
      method: 'PUT',
    },
  );
}

// 新增角色
export async function addRole(data: API.AddRole) {
  return request<API.AddRole>(
    '/api/v1/system/role',
    {
      data,
      method: 'POST',
    },
  );
}

// 删除角色
export async function delRole(id: number | string) {
  return request(
    '/api/v1/system/role',
    {
      data: {id: +id},
      method: 'DELETE',
    },
  );
}

// 获取权限组
export async function getPermisionList() {
  return request<API.PermisionListResponse[]>(
    '/api/v1/system/role/permission',
    {
      method: 'GET',
    },
  );
}
