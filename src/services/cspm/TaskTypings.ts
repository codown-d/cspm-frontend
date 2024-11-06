declare namespace API_TASK {
  // 任务
  export type ITaskType =
    | 'assets_sync'
    | 'assets_scan_schedule'
    | 'risks_scan_schedule'
    | 'risks_scan'
    | 'reports_export';
  export type ITaskScopeType =
    | 'assets_scan'
    | 'compliance_scan'
    | 'reports_export';
  export type ITaskScanType = 'assets_scan' | 'compliance_scan' | 'risk_verify';

  export interface TaskListRequest {
    path: ITaskScanType;
    ascending?: boolean;
    /**
     * 合规检测：合规框架（框架id）
     */
    compliance_ids?: string[];
    page?: number;
    /**
     * 资产检测：检测内容（config, vuln, sensitive）
     */
    scan_types?: string[];
    /**
     * 周期id
     */
    schedule_id?: number;
    size?: number;
    sort_by?: string;
    /**
     * 任务状态：pending(等待中),running(执行中),finished(已完成),failed(已失败)
     */
    status?: string[];
    /**
     * 子类型：
     * 资产检测：manual(手动),schedule(周期)
     * 导出：config(配置风险报告),vuln(漏洞报告),sensitive(凭证秘钥报告),asset(资产报告),compliance(合规报告),audit(日志审计)
     */
    sub_type?: string[];
  }

  export interface TaskDetailRequest {
    id: string;
    type: string;
  }

  export interface TaskDetailResponse {
    basic: TaskDetailBasic;
    fail_reason: string;
    progress: TaskDetailProgressObj[];
  }

  export interface TaskDetailBasic {
    content: string;
    platforms: string[];
    created_at: number;
    creator: string;
    scan_types: ('config' | 'agentless')[];
    status: TaskDetailBasicStatus;
    type_name: string;
    schedule_type: ScheduleType;
    agentless_config: PeriodTaskInfoConfInfo;
    asset_config: PeriodTaskInfoConfInfo;
    config_config: PeriodTaskInfoConfInfo;
    benchmark_name: string;
    benchmark_id: number;
  }

  export enum ScheduleType {
    Manual = 'manual',
    Schedule = 'schedule',
  }

  export enum TaskDetailBasicStatus {
    Failed = 'failed',
    Finished = 'finished',
    Pending = 'pending',
    Running = 'running',
    Unscheduled = 'unscheduled',
  }

  export interface TaskDetailProgressObj {
    name: string;
    status: AssetsSyncStatus;
  }

  export enum AssetsSyncStatus {
    Pending = 'pending',
    Running = 'running',
    Success = 'success',
  }

  export interface TaskListResponse {
    /**
     * 任务内容
     */
    content: string;
    /**
     * 创建时间
     */
    created_at: number;
    /**
     * 创建人
     */
    creator: string;
    /**
     * 下载文件id
     */
    download_id: string;
    /**
     * 失败原因
     */
    fail_reason: string;
    id: number;
    /**
     * 任务状态
     */
    status: 'failed' | 'finished' | 'pending' | 'running';
    /**
     * 任务类型
     */
    type: ITaskType;
  }

  export interface PeriodTaskRequest {
    search?: string;
  }
  // 周期任务
  export interface PeriodTaskListRes {
    /**
     * 配置内容
     */
    content?: string;
    id?: number;
    /**
     * 周期配置名称
     */
    name?: string;
    /**
     * 周期配置
     */
    schedule?: string;
    /**
     * 状态
     */
    status?: boolean;
    /**
     * 更新时间
     */
    updated_at?: number;
    /**
     * 更新人
     */
    updater?: string;
  }

  export interface PeriodTaskInfoConfInfo {
    items: {
      key: string;
      label: string;
      platform?: string;
    }[];
    select_all: string;
    type: 'platform' | 'credential' | 'region' | 'service';
    type_name: string;
  }
  export interface PeriodTaskInfo {
    /**
     * 拼好的内容
     */
    content: string;
    created_at: number;
    creator: string;
    cron: string;
    name: string;
    note: string;
    /**
     * 检测内容，config, vuln, sensitive
     */
    scan_types: string[];
    schedule: string;
    scope: Scope;
    status: boolean;
    updated_at: number;
    updater: string;
  }
  export interface Scope {
    items: Item[];
    select_all: string;
    type: Type;
    type_name: string;
    [property: string]: any;
  }

  export interface Item {
    key: string;
    label: string;
    platform: string;
    [property: string]: any;
  }
  export enum Type {
    Credential = 'credential',
    Platform = 'platform',
    Region = 'region',
    Service = 'service',
  }

  // 脆弱链分析
  export interface VulnerabilityItem {
    /**
     * 创建时间
     */
    created_at?: number;
    /**
     * 云账号名称
     */
    credential_name?: string;
    cloud_platform: string;
    /**
     * 是否仍然存在
     */
    status?: number; // 0 存在 1 不存在
    id?: number;
    /**
     * 最近发现时间
     */
    last_find_at?: number;
    /**
     * 脆弱链名称
     */
    name?: string;
    /**
     * 云平台
     */
    platform?: string;
    /**
     * 严重程度
     */
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  }
  export interface SchedulesTaskRequest {
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
     * 配置具体内容，资产同步：{"assets_sync": {}}；风险扫描：{"risks_scan_config": {}, "risks_scan_agentless": {}}
     */
    scope: Scope;
    /**
     * 开关
     */
    status: boolean;
    /**
     * 配置内容，资产同步 传 [assets_sync]， 风险扫描 根据实际情况 传 [risks_scan_config, risks_scan_agentless] 的一项或两项
     */
    sub_type: string[];
  }
}
