declare namespace API_ASSETS {
  export enum SEVERITY_LEVEL {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
    UNKNOWN = 'UNKNOWN',
  }
  export interface AssetsRequest {
    /**
     * 排序方式，true=升序
     */
    ascending?: boolean;
    /**
     * 云账户id
     */
    credential_ids?: number[];
    /**
     * 页码
     */
    page: number;
    /**
     * 云平台
     */
    platform?: string;
    /**
     * 地区
     */
    region_ids?: string[];
    /**
     * 风险类型，config-配置 vuln-漏洞 sensitive-敏感文件
     */
    risk_types?: string[];
    /**
     * 模糊搜索（实例id、资产名称）
     */
    search?: string;
    /**
     * 云服务类型
     */
    service_ids?: string[];
    /**
     * 每页数量
     */
    size: number;
    /**
     * 排序字段，updated_at=最近更新时间
     */
    sort_by?: string;
    //  前端额外参数
    task_id?: string | number;
  }

  /**
   * 风险统计
   */
  export interface SeverityCount {
    config: SEVERITY_LEVEL;
    sensitive: SEVERITY_LEVEL;
    vuln: SEVERITY_LEVEL;
  }

  export interface Config {
    CRITICAL: number;
    HIGH: number;
    LOW: number;
    MEDIUM: number;
  }

  export interface Sensitive {
    CRITICAL: number;
    HIGH: number;
    LOW: number;
    MEDIUM: number;
  }

  export interface Vuln {
    CRITICAL: number;
    HIGH: number;
    LOW: number;
    MEDIUM: number;
    UNKNOWN: number;
  }
  export interface AssetsDatum {
    created_at?: number;
    credential_id?: number;
    credential_name?: string;
    /**
     * 哈希id
     */
    hash_id: string;
    id?: number;
    instance_id?: string;
    instance_name?: string;
    platform?: string;
    platform_name?: string;
    region_name?: string;
    service_name?: string;
    severity_count?: SeverityCount;
    status?: Status;
    updated_at: number;
  }
  export enum Status {
    Error = 'error',
    Fail = 'fail',
    Pass = 'pass',
    Unscan = 'unscan',
    Warn = 'warn',
  }

  export interface AssetsSeverityCount {
    config: Config;
    sensitive: Sensitive;
    vuln: Vuln;
  }

  export interface AssetsInfoRequest {
    /**
     * 资产hash_id
     */
    hash_id: string;
    task_id: string;
  }

  export interface AssetsInfoResponse {
    asset_type_name?: string;
    agentless_scanable: boolean;
    created_at: number;
    credential_id?: number;
    credential_name?: string;
    infos: AssetsInfoResponseInfos;
    instance_id: string;
    instance_name: string;
    platform: string;
    platform_name: string;
    region_name: string;
    service_name: string;
    updated_at: number;
    /**
     * 服务类型，Cloud host 表示云主机
     */
    service: string;
    agentless_scannable: boolean;
  }

  export interface AssetsInfoResponseInfos {
    basic_info: Record<string, string>;
    disks: Disk[];
  }

  export enum Key {
    CpuAcrh = 'cpu_acrh',
    KernelVersion = 'kernel_version',
    Mac = 'mac',
    Memeory = 'memeory',
    OsVersion = 'os_version',
    Privateip = 'private_ip',
    Publicip = 'public_ip',
    SecurityGroup = 'security_group',
    Status = 'status',
    Vpc = 'vpc',
  }

  export interface Disk {
    /**
     * 用途
     */
    label?: string;
    mount?: string;
    name?: string;
    size?: string;
    type?: string;
  }
  /**
   * 风险统计
   */
  // export interface SeverityCount {
  //   '1': number;
  //   '2': number;
  //   '3': number;
  // }
  export interface AssetsOverviewResponse {
    /**
     * 平台标识
     */
    platform: string;
    /**
     * 数量
     */
    value: number;
  }

  export interface AssetsHistoryRequest {
    /**
     * 云平台帐号
     */
    credential_ids?: string[];
    end_at?: number;
    /**
     * 云平台
     */
    platform?: string;
    policy_id?: string;
    /**
     * 区域
     */
    region_ids?: string[];
    risk_types?: string[];
    /**
     * 模糊搜索字段
     */
    search?: string;
    /**
     * 资产类型
     */
    service_ids?: string[];
    start_at?: number;
    /**
     * 任务id
     */
    task_id: number;
  }
}
