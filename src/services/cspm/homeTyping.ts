declare namespace API {
  export interface TopRisksResponse {
    /**
     * 云账号名
     */
    credential_name: string;
    /**
     * 资产id
     */
    id: string;
    /**
     * 资产名称
     */
    name?: string;
    /**
     * 云平台
     */
    platform?: string;
    /**
     * 云服务资产类型
     */
    service?: string;
    /**
     * 计数
     */
    value?: number;
  }
  export interface TopCredentialsResponse {
    high: number;
    /**
     * 数量
     */
    low: number;
    medium: number;
    /**
     * 账户名称
     */
    name: string;
    platform: string;
    platform_name: string;
  }
  export type Category = 'platform' | 'region' | 'service' | 'credential';
  export type RiskTypeCategory = 'config' | 'vuln' | 'sensitive';
  export interface StatisticsAssetsResponse {
    /**
     * 统计项名称，例：地域：程度；云服务：ram，平台：ali
     */
    label: string;
    key: string;
    /**
     * 云平台，标记
     */
    platform: string;
    /**
     * 云平台名称
     */
    platform_name: string;
    /**
     * 数量
     */
    value: number;
  }
  export interface StatisticsRisksPlatformResponse {
    /**
     * 账号名称
     */
    credential_name: string;
    /**
     * 云平台key
     */
    platform: string;
    /**
     * 云平台名称
     */
    platform_name: string;
    /**
     * 风险统计
     */
    severity_count: StatisticsSeverityCount;
  }

  export type StatisticsSeverity = Record<
    | CONFIG_RISK_STATIC.config
    | CONFIG_RISK_STATIC.sensitive
    | CONFIG_RISK_STATIC.vuln,
    StatisticsSeverityCount
  >;
  export interface StatisticsSeverityCount {
    CRITICAL?: number;
    HIGH?: number;
    LOW?: number;
    MEDIUM?: number;
    UNKNOWN?: number;
  }
  export interface StatisticsRisksResponse {
    CRITICAL: number;
    HIGH: number;
    LOW: number;
    MEDIUM: number;
    name: string;
    key: string;
    platform: Platform;
    platform_name: string;
    unified_service_name: string;
    UNKNOWN: number;
  }
  export interface StatisticsAssetRequest {
    category: API.Category;
    platforms?: string[];
  }
  export interface TopRisksRequest {
    risk_type: API.RiskTypeCategory;
    platforms?: string[];
  }
  export interface StatisticsRisksRequest {
    category: API.Category;
    /**
     * 统计的风险类型
     */
    platforms?: string[];
  }
  /**
   * 状态
   */
  export enum TasksFutureStatus {
    Failed = 'failed',
    Finished = 'finished',
    Pending = 'pending',
    Running = 'running',
  }
  export enum TasksFutureType {
    ReportsExport = 'reports_export',
    AssetsScanSchedule = 'assets_scan_schedule',
    ComplianceScsnTask = 'compliance_scan_task',
    AssetsScsnTask = 'assets_scan_task',
  }

  export interface TasksFutureItem {
    /**
     * 创建时间
     */
    created_at?: number;
    id?: number;
    /**
     * 下次执行时间
     */
    next_schedule_time?: number;
    /**
     * 状态
     */
    status?: TasksFutureStatus;
    type: TasksFutureType;
    /**
     * 任务类型
     */
    type_name?: string;
  }
  export interface WeaknessItem {
    /**
     * 创建时间
     */
    created_at?: number;
    /**
     * 云账号名称
     */
    credential_name?: string;
    /**
     * 是否仍然存在
     */
    existed?: boolean;
    id?: number;
    /**
     * 最近发现时间
     */
    last_found_at?: number;
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
    severity?: string;
  }
  export interface TendencyRequest {
    /**
     * 云账户列表
     */
    credential_ids?: string[];
    /**
     * 结束时间
     */
    ended_at: number;
    /**
     * 开始时间
     */
    started_at: number;
    risk_types: string[];
  }
  export interface TendencyResponse {
    datetime: Date;
    distribution: StatisticsSeverityCount;
  }

  export interface TendencyDistribution {
    high: number;
    low: number;
    medium: number;
  }
  /**
   * execute_type：
   * ExportExecuteAsset          = "asset"      // 资产列表导出
   * ExportExecuteSyncAsset      = "scanAsset"  // 资产扫描报告导出
   * ExportExecuteRiskAsset      = "config"  // 风险列表
   * ExportExecuteVuln           = "vuln"    // 漏洞
   * ExportExecuteSensitive      = "sensitive"    // 凭证密钥
   * ExportExecuteScanAsset      = "scanAsset"  // 风险扫描报告
   * ExportExecuteTypeAudit      = "audit"      // 审计
   * ExportExecuteTypeCompliance = "compliance" // 合规
   *
   *
   */
  export interface ExportRequest {
    execute_type: string;
    filename: string;
    parameter: Partial<ExportParameter>;
    task_type: string;
  }

  export interface ExportParameter {
    asset_search: AssetsRequest;
    config_search: RisksRequest;
    credential_id: number;
    export_range: ScanType[];
    sens_rule_search: RuleSensitiveRisksRequest;
    task_id: number;
    vuln_search: VulnRisksRequest;
    audit_log_search: SystemLogsRequest;
    compliance_search: ComplianceInfoRequest;
  }
  export enum TaskType {
    Excel = 'excel',
  }
  export interface EntityIsExistsRequest {
    id?: string | number;
    /**
     * credential-云账号；asset-资产；benchmark-基线
     */
    type: string;
    policy_type?: string;
  }
  export interface EntityIsExistsResponse {
    exists: boolean;
  }
  export interface checkHostRequest {
    /**
     * 资产类型
     */
    asset_type_ids?: string[];
    /**
     * 云账户
     */
    credential_ids?: string[];
    /**
     * 云平台
     */
    platforms?: string[];
    /**
     * 区域
     */
    region_ids?: string[];
    /**
     * 云服务
     */
    service_ids?: string[];
  }
}
