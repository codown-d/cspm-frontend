import { request } from '@umijs/max';
import { Key } from 'react';

// 任务列表 assets_sync(资产同步),risks_scan(风险检测)
export async function getTaskList(param: API_TASK.TaskListRequest) {
  const { path, ...req } = param;
  return request<API.ResponseWithItems<API_TASK.TaskListResponse>>(
    `/api/v1/tasks/${path}`,
    {
      params: req,
      method: 'GET',
    },
  );
}
// 任务列表 reports_export(报告导出)
export async function getExportList(param: API_TASK.TaskListRequest) {
  const { path, ...req } = param;
  return request<API.ResponseWithItems<API_TASK.TaskListResponse>>(
    `/api/v1/export/list`,
    {
      params: req,
      method: 'GET',
    },
  );
}

// 运行中的任务数量
export interface ITaskCount {
  assets_sync: number;
  reports_export: number;
  risks_scan: number;
}

export async function getRunningTaskCount() {
  return request<ITaskCount>('/api/v1/tasks/count', {
    method: 'GET',
    skipErrorHandler: true,
  });
}

// 周期任务列表
export async function getPeriodTaskList(params: API_TASK.PeriodTaskRequest) {
  return request<API.ResponseWithItems<API_TASK.PeriodTaskListRes>>(
    `/api/v1/schedules/assets_scan`,
    {
      params: params,
    },
  );
}

// 任务详情
export async function getTaskDetailById({
  id,
  type,
}: API_TASK.TaskDetailRequest) {
  return request<API_TASK.TaskDetailResponse>(`api/v1/tasks/${type}/id/${id}`, {
    method: 'GET',
  });
}

// 任务重试
export async function taskRetry(params: {
  task_id: number;
  type: API_TASK.ITaskType;
}) {
  return request('api/v1/tasks/rerun', {
    method: 'POST',
    data: params,
  });
}

// 下载文件 id: 文件id
export async function downloadExportFile(id: string) {
  return request<{ url: string }>('/api/v1/export/download', {
    params: { id },
    method: 'GET',
  });
}

// 新增
export async function addPeriodTask(
  type: ITaskType,
  data: API_TASK.SchedulesTaskRequest,
) {
  return request(`/api/v1/schedules/${type}`, {
    data,
    method: 'POST',
  });
}

// 详情
export async function getPeriodTask(param: { type: ITaskType; id: string }) {
  return request<API_TASK.PeriodTaskInfo>(
    `/api/v1/schedules/${param.type}/id/${param.id}`,
    {
      method: 'GET',
    },
  );
}

// 修改
export async function editPeriodTask(req: {
  type: ITaskType;
  id: string;
  /**
   * 配置具体内容
   */
  data: { [key: string]: any };
  /**
   * 周期配置名称
   */
  name: string;
  /**
   * 备注
   */
  note: string;
  /**
   * 周期配置
   */
  schedule: string;
  /**
   * 配置内容
   */
  sub_type: string[];
}) {
  const { type, id, ...data } = req;
  return request(`/api/v1/schedules/${type}/id/${id}`, {
    data,
    method: 'PATCH',
  });
}

// 删除
export async function delPeriodTask(param: {
  type: ITaskType;
  id: string | number;
}) {
  return request(`/api/v1/schedules/${param.type}/id/${param.id}`, {
    method: 'DELETE',
  });
}

// 开关
export async function togglePeriodTask(param: {
  disable: boolean;
  type: ITaskType;
  id: string | number;
}) {
  return request(`/api/v1/schedules/${param.type}/toggle/${param.id}`, {
    data: { disable: param.disable },
    method: 'POST',
  });
}

// 周期配置操作记录
export async function getOperateLog(param: {
  type: ITaskType;
  id: string;
  page?: number;
  size?: number;
}) {
  const { id, type, ...arg } = param;
  return request(`/api/v1/schedules/${type}/modify_history/${id}`, {
    params: arg,
    method: 'GET',
  });
}

// 周期配置执行记录
export async function getExecLog(param: {
  type: ITaskType;
  id: string;
  page?: number;
  size?: number;
}) {
  const { id, type, ...arg } = param;
  return request(`/api/v1/schedules/${type}/modify_history/${id}`, {
    params: arg,
    method: 'GET',
  });
}

// 合规概览
export async function getComplianceTaskOverview(
  tid?: string,
  params?: { credential_ids?: number[] },
) {
  return request<API_COMPLIANCE.ComplianceOverviewItem[]>(
    `/api/v1/compliance/task/${tid}/overview`,
    { params },
  );
}

// 带风险计数的合规框架
export async function getComplianceTaskWithRisks({
  id,
  tid,
  ...params
}: API_COMPLIANCE.ComplianceWithRisksRequest & { id: Key; tid: Key }) {
  return request<API_COMPLIANCE.ComplianceWithRisksResponse>(
    `/api/v1/compliance/${id}/task/${tid}/detail_with_risks`,
    {
      params,
    },
  );
}
