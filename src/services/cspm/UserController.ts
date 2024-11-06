import { request } from '@umijs/max';

export async function login(body?: API.LoginRequest) {
  return request<API.LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    data: body,
  });
}

export async function oidcLogin(body: { code: string }) {
  return request<API.LoginResponse>('/api/v1/auth/oidc/login', {
    method: 'POST',
    data: body,
  });
}

export async function oidcAuth(data?: { state?: string }) {
  return request<API.CaptchaResponse>('/api/v1/auth/oidc/auth', {
    data,
  });
}

export async function getCaptcha() {
  return request<API.CaptchaResponse>('/api/v1/auth/captcha', {
    method: 'GET',
  });
}

export async function getAuthLicense() {
  return request<API.AuthLicenseResponse>('/api/v1/auth/license', {
    method: 'GET',
  });
}

export async function registerAuthLicense(
  body: API.RegisterAuthLicenseRequest,
) {
  return request('/api/v1/auth/license', {
    method: 'POST',
    data: body,
  });
}

export async function addUser(body?: API.AddUserRequest) {
  return request<{ id: number }>('/api/v1/system/user', {
    method: 'POST',
    data: body,
  });
}

export async function editUser(body?: API.EditUserRequest) {
  return request(`/api/v1/system/user`, {
    method: 'PUT',
    data: body,
  });
}

export async function querySysUserList(
  params: API.SysUserRequest,
  options?: { [key: string]: any },
) {
  return request<API.ResponseWithItems<API.SysUserDatum>>(
    '/api/v1/system/user',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    },
  );
}

export async function deleteSysUser(uid: string) {
  return request('/api/v1/system/user', {
    method: 'DELETE',
    data: { uid },
  });
}

export async function resetPwd(body: API.ResetPwdRequest) {
  return request<{ password: string }>('/api/v1/system/user/restpwd', {
    method: 'POST',
    data: body,
  });
}

export async function editPwd(body: API.EditPwdRequest) {
  return request('/api/v1/system/user/changepwd', {
    method: 'POST',
    data: body,
  });
}

// 用户详情
export async function getSysUser(uid: string) {
  return request<API.SysUserDatum>('/api/v1/system/user/detail', {
    method: 'GET',
    params: { uid },
  });
}

// 启/停用户
export async function enableDisable(body: { uid: string; disable: boolean }) {
  return request('/api/v1/system/user/toggle', {
    method: 'POST',
    data: body,
  });
}

// 启/停用户
export async function unlockUser(uid: string) {
  return request('/api/v1/system/user/unlock', {
    method: 'POST',
    data: { uid },
  });
}

// 分配点数
export async function allotcredit(param: { uid: string; credit: number }) {
  return request('/api/v1/system/user/allotcredit', {
    method: 'POST',
    data: param,
  });
}

// 获取当前可分配点数
export async function getResidueCredit() {
  return request<{ credit: number }>('/api/v1/system/user/creditlimit', {
    method: 'GET',
  });
}

// 用户操作记录
export interface IUserActionLog {
  created_at: number;
  creator: string;
  operator: string;
}
export async function getActLog(params: {
  uid: string;
  page?: number;
  size?: number;
}) {
  return request<API.ResponseWithItems<IUserActionLog>>(
    '/api/v1/system/user/log',
    {
      method: 'GET',
      params,
    },
  );
}

// 获取【管理配置】
export async function getManageConf() {
  return request<API.ResponseWithData<API.IManageConf>>(
    '/api/v1/system/settings',
    {
      customHandleRes: true,
    },
  );
}

// 设置【管理配置】
export async function setManageConf(data: API.IManageConf) {
  return request('/api/v1/system/settings', {
    data,
    method: 'PUT',
  });
}

// 获取用户账号数量限制
export async function getUserAccountLimit() {
  return request<
    API.ResponseWithData<{
      sub_account_limit: number;
    }>
  >('/api/v1/system/user/accountlimit', {
    customHandleRes: true,
    skipErrorHandler: true,
  });
}

// 获取云帐号数量限制
export async function getCloudAccountLimit() {
  return request<
    API.ResponseWithData<{
      cloud_account_limit: number;
    }>
  >('/api/v1/system/user/cloudlimit', {
    customHandleRes: true,
    skipErrorHandler: true,
  });
}
