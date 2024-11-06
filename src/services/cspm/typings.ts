declare namespace API {
  export interface ResponseWithData<T> {
    data: T;
    total: number;
  }
  export interface ResponseIdWithAdd<T = string> {
    id: T;
  }
  export interface ResponseWithItems<T> {
    items: T[];
    /**
     * 总数
     */
    total: number;
  }
  export interface LoginRequest {
    /**
     * 账号
     */
    username: string;
    /**
     * 验证码的id
     */
    captcha_id: string;
    /**
     * 输入的验证码
     */
    captcha_value: string;
    /**
     * 密码
     */
    password: string;
  }
  export interface LoginResponse {
    /**
     * 用户id
     */
    id: number;
    /**
     * 用户的昵称
     */
    name: string;
    permissions: Permision[];
    /**
     * 是否是主帐号
     */
    primary: boolean;
    primary_username: string;
    role_id: string;
    /**
     * token
     */
    token: string;
    username: string;
    cycle_change_pwd_day: number;
    must_change_pwd: boolean;
  }
  export interface CaptchaResponse {
    /**
     * 验证码的id
     */
    captcha_id: string;
    /**
     * 验证码图片
     */
    image: string;
  }
  export interface AuthLicenseResponse {
    expire_at: number;
    license: string;
    name: string;
    valid: boolean;
  }

  export interface SysUserRequest {
    username?: string;
    email?: string;
    page?: number;
    role_ids?: string[];
    size?: number;
    /**
     * enabled=启用 disabled=停用 locked=锁定
     */
    status?: string;
    tel?: string;
  }

  export interface SysUserDatum {
    cloud_account_num: number;
    created_at: number;
    creator: string;
    credit_limit: number;
    credit_used: number;
    email: string;
    uid: string;
    primary: boolean;
    role_id: number;
    role_name: string;
    status: 'enabled' | 'disabled' | 'locked';
    tel: string;
    updated_at: number;
    updater: string;
    username: string;
    credentials: {
      name: string;
      id: number;
    }[];
  }

  /**
   * 角色
   */
  export enum Role {
    Admin = 'Admin',
    User = 'User',
  }
  export interface DeleteUserRequest {
    /**
     * 用户ID
     */
    id: string[];
  }
  export interface RegisterAuthLicenseRequest {
    license: string;
  }
  export interface AddUserRequest {
    credential_ids: number[];
    credit_limit: number;
    desc: string;
    /**
     * 邮箱，邮箱号
     */
    email: string;
    /**
     * 密码，账户密码
     */
    password: string;
    role_id: number;
    tel: string;
    /**
     * 用户名
     */
    username: string;
  }
  export interface EditUserRequest {
    credential_ids: number[];
    desc: string;
    /**
     * 邮箱
     */
    email: string;
    /**
     * 角色id
     */
    role_id: number;
    tel: string;
    uid: string;
  }
  export interface EditPwdRequest {
    /**
     * 新密码
     */
    new_password: string;
    /**
     * 旧密码
     */
    old_password: string;
  }
  export interface ResetPwdRequest {
    /**
     * 密码
     */
    uid: string;
    password: string;
  }

  export interface SystemLogsRequest {
    /**
     * 账号
     */
    account?: string;
    created_at_end?: string;
    created_at_start?: string;
    /**
     * IP
     */
    ip?: string;
    /**
     * 请求类型
     */
    method?: string[];
    /**
     * 页码
     */
    page: number;
    /**
     * 每页数量
     */
    size: number;
    /**
     * 排序字段
     */
    sort?: string[];
    /**
     * 状态码
     */
    status?: string[];
    /**
     * 用户名
     */
    username?: string;
  }

  export interface SystemLogsDatum {
    create_at?: string;
    details?: string;
    id?: number;
    operation?: string;
    source_ip?: string;
    status?: string;
    username?: string;
  }

  /**
   * 请求类型
   */
  export enum Method {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT',
  }

  export interface CredentialsRequest {
    /**
     * 合规框架内容的id，目录或要求
     */
    compliance_content_id?: number;
    /**
     * 云账户ids
     */
    credential_ids?: string[];
    /**
     * 云平台账户名
     */
    name?: string;
    /**
     * 页码
     */
    page?: number;
    /**
     * 平台类型
     */
    platforms?: string[];
    risk_types?: string[];
    /**
     * 单页数量
     */
    size: number;
    /**
     * 使用场景
     */
    use_case?: string;
  }
  export interface CredentialsResponse {
    data: CredentialsDatum[];
    /**
     * 总数
     */
    total: number;
  }
  export interface CredentialsDatum {
    id?: string;
    name?: string;
    platform?: string;
    severity_count?: SeverityCount;
    tags?: API_TAG.DatumValue[];
    updated_at?: number;
  }

  /**
   * 云平台类型
   */
  export enum CredentialsPlatform {
    Ali = 'Ali',
    Aws = 'AWS',
    HuaWei = 'HuaWei',
    Tencent = 'Tencent',
    VMware = 'VMware',
    Zoom = 'Zoom',
  }

  export interface DashboardCredentialsResponse {
    /**
     * 云平台名称
     */
    name: string;
    /**
     * 云平台
     */
    platform: string;
    /**
     * 计数
     */
    value: number;
  }

  export interface AddCredentialRequest {
    access: string;
    /**
     * 账户名
     */
    name: string;
    /**
     * 云平台类型
     */
    platform: string;
    secret: string;
    token?: string;
  }

  export interface EditCredentialRequest {
    access?: string;
    name?: string;
    secret?: string;
    token?: string;
    id: string;
  }

  export interface DeleteCredentialRequest {
    /**
     * 云账户ID
     */
    id: number;
  }

  /**
   * 服务列表
   */
  export interface ServicesResponse {
    /**
     * 服务标识
     */
    id: string;
    /**
     * 服务名称
     */
    name: string;
  }
  export interface CommonPluginsRequest {
    /**
     * 如果需要完整的数据则传递full，默认simple
     */
    mode?: string;
    /**
     * 平台类型
     */
    platform: string;
    /**
     * 服务名称
     */
    service?: string;
  }

  export interface CommonPluginsResponse {
    plugins: CommonPluginsDatum[];
    /**
     * 服务名称
     */
    service: string;
    /**
     * 服务标识
     */
    id: string;
  }
  export interface CommonServicetreeResponse {
    children: CommonServicetreeResponseChild[];
    id: string;
    key: string;
    label: string;
    value?: string;
  }

  export interface CommonServicetreeResponseChild {
    top_service: string;
    top_service_name: string;
    id: string;
    name: string;
    label?: string;
    value?: string;
  }

  export interface RiskServicetreeRequest {
    /**
     * 云账号id
     */
    credential_id?: number;
    /**
     * 风险类型（配置、漏洞、敏感文件）
     */
    risk_type?: string;
  }
  export interface HistoryRiskServicetreeRequest {
    /**
     * 云账号id
     */
    credential_id?: string;
    /**
     * 风险类型（配置、漏洞、敏感文件）
     */
    risk_type?: string;
  }
  export interface ServicetreeResponse {
    children: ServicetreeChild[];
    id: string;
    num: number;
    label: string;
  }
  export interface ServicetreeChild {
    id: string;
    num: number;
    label: string;
    platform?: string;
  }
  export interface CommonPolicyTreeResponse {
    children: CommonPolicyTreeDatumChild[];
    key: string; //云平台key
    label: string; //云平台名称
    value?: string; //云平台名称
  }

  export interface CommonPolicyTreeDatumChild {
    children?: CommonPolicyTreeChildChild[];
    key: string;
    label: string; //服务类型
    value?: string; //云平台名称
  }

  export interface CommonPolicyTreeChildChild {
    description: string;
    id: number;
    mitigation: string;
    name: string;
    severity: number;
    title: string;
    value?: string;
    label?: string;
  }

  export interface CommonPolicyDatum {
    count?: number;
    key: string;
    label?: string;
    policy_items?: CommonPolicyItem[];
  }

  export interface CommonPolicyItem {
    asset_type_id: string;
    asset_type_name: string;
    description: string;
    id: string;
    key: string;
    mitigation: string;
    platform: Key;
    platform_name: string;
    policy_title: string;
    policy_type: string;
    policy_type_name: string;
    service: string;
    service_id: string;
    service_name: string;
    severity: string;
  }
  /**
   * 扫描项列表
   */
  export interface CommonPluginsDatum {
    /**
     * full模式字段
     */
    description: string;
    /**
     * 插件标识
     */
    id: string;
    /**
     * full模式字段
     */
    mitigation: string;
    /**
     * 插件名称
     */
    name: string;
    /**
     * full模式字段
     */
    service?: string;
    /**
     * full模式字段
     */
    severity: PolicySeverity;
  }
  /**
   * 云平台列表
   */

  export interface CommonPlatformsResponse {
    /**
     * 颜色
     */
    colors: string[];
    /**
     * 图标
     */
    icon: string;
    /**
     * 平台key
     */
    key: string;
    /**
     * 平台名
     */
    name: string;
    /**
     * 不同的云平台长度不确定
     * 第一项：access；第二项：secret；第三项：extra；
     */
    secret_key_names: [string, string, string?];
    extra: { component_type: string; key: string; options: LableValue[] }[];
    /**
     * 步骤
     */
    steps: Step[];
  }

  export interface Step {
    data: string[];
    title: string;
    type: string;
  }

  export interface SystemConfigs {
    /**
     * ai提问模板
     */
    ai_prompt_templates: AiPromptTemplate[];
    /**
     * 云服务类型
     */
    services: Record<string, string[]>;
    /**
     * 各类文案
     */
    text: SystemConfigsText;
    platform_sequence: Record<string, number>;
  }

  export type ICommonConstEnum = {
    label: string | Object;
    value: string;
  };
  export type ICommonConst = Record<string, ICommonConstEnum[]>;

  /**
   * LableValue
   */
  export interface LableValue {
    label: string;
    value: string;
  }
  /**
   * 各类文案
   */
  export interface SystemConfigsText {
    /**
     * 无代理检测支持的区域详情
     */
    agentless_regions_info: AgentlessRegionsInfo[];
    [k: string]: any;
  }

  export interface AgentlessRegionsInfo {
    key: string;
    platform: string;
    value: string;
  }

  export interface AiPromptTemplate {
    /**
     * 确认文案
     */
    confirm: string;
    /**
     * key
     */
    key: string;
    /**
     * 后端实际文案
     */
    prompt: string;
    /**
     * 页面展示文案
     */
    ui_question: string;
  }

  /**
   * 扫描结果
   */
  export interface CredentialResponse {
    /**
     * 云账户AK
     */
    accesskey: string;
    /**
     * 扫描时间
     */
    last_scam: number;
    /**
     * 账户名
     */
    name: string;
    platform: string;
    /**
     * 最近扫描时间
     */
    token: string;
    tags: API_TAG.DatumValue[];
  }

  export interface CredentialAssets {
    /**
     * 本次覆盖资产数
     */
    cover: number;
    /**
     * 总资产数
     */
    total: number;
  }
  /**
   * 基本信息
   */
  export interface CredentialBasic {
    /**
     * 最近扫描时间
     */
    last_scan?: Date;
    /**
     * 账户名
     */
    name: string;
    /**
     * 云平台类型
     */
    platform: string;
    token?: string;
  }

  /**
   * 风险统计
   */
  export interface Risks {
    /**
     * 高风险数量
     */
    high: number;
    /**
     * 低风险数量
     */
    low: number;
    /**
     * 中风险数量
     */
    medium: number;
  }

  export interface ReportDetailRequest {
    /**
     * 合规类型
     */
    compliance?: string[];
    /**
     * 扫描时间结束
     */
    created_at_end?: string;
    /**
     * 扫描时间开始
     */
    created_at_start?: string;
    /**
     * 账户名
     */
    name?: string;
    /**
     * 页码【0始】
     */
    page: number;
    /**
     * 云平台类型
     */
    platform?: string[];
    /**
     * 严重程度
     */
    severity?: string[];
    /**
     * 单页数量
     */
    size: number;
    /**
     * 多列排序重复传递
     */
    sort?: string[];
    /**
     * 操作人
     */
    operator?: string[];
  }

  /**
   * 扫描结果
   */
  export type ReportDetailResponse = {
    /**
     * 基线id，自定义基线=0
     */
    benchmark_id: number;
    benchmark_name: string;
    /**
     * 风险覆盖率
     */
    coverage: number;
    created_at: number;
    /**
     * 操作人
     */
    creator: string;
    finished_at: number;
    /**
     * 策略id列表
     */
    policy_ids: number[];
    /**
     * 风险统计
     */
    severity_count: SeverityCount;
    status: ReportStatus;
  };
  export enum ReportStatus {
    Finished = 'finished',
    Pending = 'pending',
    Running = 'running',
  }
  /**
   * 基本信息
   */
  export interface ReportsBasic {
    /**
     * 基线名称
     */
    baseline: string;
    /**
     * 账户名
     */
    name: string;
    /**
     * 操作人
     */
    operator?: string;
    /**
     * 云平台类型
     */
    platform: string;
    is_default: boolean;
    created_at: string;
  }

  export interface ReportsRequest {
    /**
     * 合规类型
     */
    compliance?: string[];
    /**
     * 扫描时间结束
     */
    created_at_end?: string;
    /**
     * 扫描时间开始
     */
    created_at_start?: string;
    /**
     * 账户名
     */
    name?: string;
    /**
     * 页码【0始】
     */
    page: number;
    /**
     * 云平台类型
     */
    platform?: string[];
    /**
     * 严重程度
     */
    severity?: string[];
    /**
     * 单页数量
     */
    size: number;
    /**
     * 多列排序重复传递
     */
    sort?: string[];
    /**
     * 操作人
     */
    operator?: string[];
  }
  export enum ReportsStatus {
    Failed = 'failed',
    Finished = 'finished',
    Pending = 'pending',
    Running = 'running',
  }

  export interface BaselineDetailResponse {
    /**
     * 内容描述
     */
    description: string;
    /**
     * 插件标识
     */
    id: string;
    /**
     * 修复措施
     */
    mitigation: string;
    /**
     * 扫描项
     */
    name: string;
    /**
     * 扫描类型
     */
    service: string;
    /**
     * 严重程度
     */
    severity: PolicySeverity;
  }

  export interface ReportsAssetsRequest {
    /**
     * 云平台帐号
     */
    credential_ids?: string[];
    end_at?: number;
    /**
     * 实例id模糊匹配
     */
    instance_id?: string;
    instance_name?: string;
    /**
     * 云平台
     */
    platforms?: string[];
    /**
     * 区域
     */
    region_ids?: string[];
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

  export interface RisksByIdRequest {
    /**
     * 实例ID
     */
    instance?: string;
    /**
     * 页码【0始】
     */
    page: number;
    /**
     * 扫描项ID
     */
    plugin?: string[];
    /**
     * 区域
     */
    region?: string[];
    /**
     * 扫描类型
     */
    service?: string[];
    /**
     * 严重程度
     */
    severity?: string[];
    /**
     * 单页数量
     */
    size: number;
    /**
     * 多列排序重复传递
     */
    sort?: string[];
  }

  export enum Compliance {
    Cis1 = 'CIS1',
    Hipaa = 'HIPAA',
    Mlps = 'MLPS',
    PCI = 'PCI',
  }

  export interface CredentialReportsRequest {
    /**
     * 合规类型
     */
    compliance?: string[];
    /**
     * 扫描时间结束
     */
    created_at_end?: string;
    /**
     * 扫描时间开始
     */
    created_at_start?: string;
    /**
     * 页码
     */
    page: number;
    /**
     * 严重程度
     */
    severity?: string[];
    /**
     * 每页数量
     */
    size: number;
    /**
     * 排序字段
     */
    sort?: string[];
    /**
     * 操作人
     */
    operator?: string[];
  }
  export interface CredentialReportsResponse {
    data: CredentialReportDatum[];
    /**
     * 总数
     */
    total: number;
  }

  export interface CredentialReportDatum {
    /**
     * 基线名称
     */
    baseline: string;
    /**
     * 合规类型
     */
    compliance: string[];
    /**
     * 扫描时间
     */
    created_at: Date;
    /**
     * 高风险数量
     */
    high: number;
    /**
     * 报告ID
     */
    id: string;
    /**
     * 低风险数量
     */
    low: number;
    /**
     * 中风险数量
     */
    medium: number;
    /**
     * 操作人
     */
    operator: string;
  }

  export interface RegionsRequest {
    /**
     * 使用场景
     */
    use_case?: string;
  }

  export interface ExportRisksRequest {
    /**
     * agentless筛选条件
     */
    agentless_filter?: AgentlessFilter;
    /**
     * 配置风险筛选条件
     */
    config_filter?: RisksRequest;
    /**
     * 导出名称
     */
    export_name: string;
    /**
     * 导出风险类型
     */
    risk_type: ScanType[];
  }

  /**
   * agentless筛选条件
   */
  export interface AgentlessFilter {
    sensitive?: RuleSensitiveRisksRequest;
    vuln?: VulnRisksRequest;
  }

  /**
   * 配置风险筛选条件
   */
  export interface ConfigFilter {
    policy_name: string;
    service_ids: string[];
    severity: string[];
    [property: string]: any;
  }

  export interface RegionsResponse {
    key: string;
    label: string;
    children?: RegionsResponse[];
  }

  // export interface RegionsDatum {
  //   /**
  //    * 区域，使用的时候传递该字段的内容
  //    */
  //   id?: string;
  //   /**
  //    * 区域名称，区域名称（英文时和region内容一样）
  //    */
  //   name?: string;
  //   /**
  //    * 哪一个服务
  //    */
  //   service?: string;
  // }

  export interface BaselinesRequest {
    /**
     * 基线名称
     */
    name?: string;
    page?: number;
    /**
     * 云平台key
     */
    platforms?: string[];
    size?: number;
  }

  export interface BaselinesDatum {
    /**
     * 创建时间
     */
    created_at: number;
    /**
     * 创建者
     */
    creator: string;
    /**
     * 基线描述
     */
    description: string;
    id: string;
    /**
     * 是否默认基线
     */
    is_default: boolean;
    /**
     * 基线名称
     */
    name: string;
    /**
     * 云平台
     */
    platforms: string[];
    /**
     * 检测项
     */
    policies: number[];
    /**
     * 更新时间
     */
    updated_at: number;
    /**
     * 更新者
     */
    updater: string;
  }

  export interface AddBaselineRequest {
    /**
     * 备注
     */
    description?: string;
    /**
     * 基线名称
     */
    name: string;
    /**
     * 云平台类型
     */
    platforms: string[];
    /**
     * 检测项id
     */
    policies: number[];
  }

  export interface DeleteBaselineRequest {
    /**
     * 基线ID
     */
    ids: string[];
  }
  export interface EditBaselineRequest {
    /**
     * 备注
     */
    description?: string;
    /**
     * 基线名称
     */
    name?: string;
    /**
     * 云平台类型
     */
    platforms: string[];
    /**
     * 检测项id列表
     */
    policies?: number[];
  }
  export interface BaselineResponse {
    /**
     * 基本信息
     */
    basic: BaselineBasic;
    /**
     * 扫描项
     */
    policies: CommonPolicyDatum[];
  }

  /**
   * 基本信息
   */
  export interface BaselineBasic {
    /**
     * 创建时间
     */
    created_at: number;
    /**
     * 创建者
     */
    creator: string;
    /**
     * 基线描述
     */
    description: string;
    /**
     * 基线id
     */
    id: number;
    /**
     * 是否默认基线
     */
    is_default: boolean;
    /**
     * 基线名称
     */
    name?: string;
    /**
     * 云平台
     */
    platforms: string[];
    platform_names: string[];
    /**
     * 检测项
     */
    policies: number[];
    /**
     * 更新时间
     */
    updated_at: number;
    /**
     * 更新者
     */
    updater: string;
  }

  export interface CredentialsScanResRequest {
    agentless_config: AgentlessConfig;
    config_config: ConfigConfig;
    /**
     * 扫描类型
     */
    scan_type: ScanType[];
  }

  export interface AgentlessConfig {
    credential_ids: string[];
    platforms: string[];
    region_ids: string[];
    type: AgentlessConfigType[];
  }

  export enum AgentlessConfigType {
    Sensitive = 'sensitive',
    Vuln = 'vuln',
  }

  export interface ConfigConfig {
    benchmark_id: number;
    credential_ids: number[];
    platforms: string[];
    region_ids: string[];
    service_ids: string[];
  }

  export enum ScanType {
    Vuln = 'vuln',
    Sensitive = 'sensitive',
    Config = 'config',
  }

  export interface CredentialsScanResponse {
    code: string;
    data: string;
    message: string;
  }
  export interface RisksRequest {
    platform?: string;
    /**
     * 资产hash id
     */
    asset_hash_id?: string;
    /**
     * 合规目录id前缀
     */
    compliance_catalog_prefix?: string;
    /**
     * 合规id
     */
    compliance_id?: number;
    /**
     * 合规分类key
     */
    compliance_key?: string;
    /**
     * 云账户id
     */
    credential_ids?: number[];
    /**
     * 结束时间
     */
    end_at?: number;
    /**
     * 实例id（模糊搜索）
     */
    instance_id?: string;
    /**
     * 页码
     */
    page?: number;
    /**
     * 检测项名称（模糊搜索）
     */
    policy_name?: string;
    /**
     * 地区id
     */
    region_ids?: string[];
    /**
     * 云服务id
     */
    service_ids?: string[];
    /**
     * 严重级别
     */
    severity?: number[];
    /**
     * 每页数量
     */
    size?: number;
    /**
     * 开始时间
     */
    start_at?: number;
  }
  export interface RisksDatum {
    asset_type_name?: string;
    /**
     * 影响资产数
     */
    assets_count: number;
    /**
     * 发现时间
     */
    created_at?: number;
    /**
     * 云账户id
     */
    credential_id?: number;
    /**
     * 云账户名称
     */
    credential_name?: string;
    /**
     * 描述
     */
    description?: string;
    /**
     * 风险id
     */
    id?: number;
    /**
     * 实例id
     */
    instance_id?: string;
    /**
     * 云平台key
     */
    platform?: string;
    /**
     * 云平台名称
     */
    platform_name?: string;
    /**
     * 检测项id
     */
    policy_id?: number;
    /**
     * 检测项名称
     */
    policy_title?: string;
    /**
     * 地区
     */
    region_name?: string;
    /**
     * 云服务资产类型
     */
    service_name?: string;
    /**
     * 严重程度
     */
    severity?: PolicySeverity;
  }

  export interface AssetsPoliciesRequest {
    /**
     * 结束时间
     */
    end_at?: number;
    /**
     * 实例id
     */
    instance_id?: string;
    page: number;
    /**
     * 检测项描述
     */
    description?: string;
    /**
     * 检测项名称
     */
    policy_title?: string;
    /**
     * 严重程度（可多选）
     */
    severity?: string[];
    size: number;
    /**
     * 时间选择器开始时间
     */
    start_at?: number;
    /**
     * 检查结果（扫描状态）（多选）
     */
    status?: string[];
  }

  export interface AssetsPoliciesDatum {
    /**
     * 检测项描述
     */
    description: string;
    /**
     * 检测项id
     */
    policy_id: string;
    /**
     * 检测项名称
     */
    policy_title: string;
    /**
     * 严重程度
     */
    severity: PolicySeverity;
    /**
     * 风险项id
     */
    risk_id: string;
    /**
     * 风险检测类型
     */
    risk_type: RiskType;
    /**
     * 风险更新时间
     */
    risk_updated_at: string;
    /**
     * 检测项状态
     */
    status: DetecteRisksStatus;
  }

  /**
   * 严重程度
   */
  export enum PolicySeverity {
    Critical = 'CRITICAL',
    High = 'HIGH',
    Low = 'LOW',
    Medium = 'MEDIUM',
    Unknown = 'UNKNOWN',
  }

  export enum SucFailStatus {
    success = 'success',
    failed = 'failed',
  }
  export enum UserStatus {
    disabled = 'disabled',
    enabled = 'enabled',
    locked = 'locked',
  }

  /**
   * 风险检测类型
   */
  export enum RiskType {
    Config = 'config',
    Sensitive = 'sensitive',
    Vuln = 'vuln',
  }

  /**
   * 检测项状态
   */
  export enum DetecteRisksStatus {
    // unpassed、warn、passed
    Error = 'failed', // 出错
    Fail = 'unpassed', // 未通过
    Pass = 'passed', // 通过 / 合规
    Unscan = 'unscan', // 未检测
    Warn = 'warn', // 警告
  }
  export interface RiskInfoResponse {
    /**
     * 资产id
     */
    asset_id: number;
    /**
     * 发现时间
     */
    created_at: number;
    /**
     * 云账户id
     */
    credential_id?: number;
    /**
     * 云账户名称
     */
    credential_name?: string;
    /**
     * 实例id
     */
    instance_id: string;
    /**
     * 实例名称
     */
    instance_name: string;
    /**
     * 检测项名称
     */
    name: string;
    policy_title?: string;
    /**
     * 云平台
     */
    platform: Platform;
    /**
     * 检测项描述
     */
    policy_desc: string;
    /**
     * 检测项id
     */
    policy_id: number;
    /**
     * 检测项修复措施
     */
    policy_mitigation: string;
    /**
     * 参考链接
     */
    references: string[];
    /**
     * 区域名称
     */
    region_name: string;
    /**
     * 云服务资产类型
     */
    service: string;
    service_name: string;
    /**
     * 检测项风险级别
     */
    severity: PolicySeverity;
  }

  export interface PolicyInfoResponse {
    apis: string[];
    desc: string;
    hash_id: string;
    hipaa: string;
    id: number;
    mitigation: string;
    mlps2: string;
    mlps3: string;
    pci: string;
    platform: Platform;
    platform_name: string;
    policy_title: string;
    references: string[];
    service: string;
    service_name: string;
    severity: PolicySeverity;
  }

  export interface AssetsInRiskInfoByIdResponse {
    /**
     * 云账户id
     */
    credential_id?: number;
    /**
     * 云账户名称
     */
    credential_name?: string;
    instance_id?: string;
    instance_name?: string;
    platform?: Platform;
    platform_name?: string;
    region_name?: string;
    risk_type?: RiskType;
    service_name?: string;
    severity_count?: StatisticsSeverity;
    update_at?: string;
    created_at?: string;
  }

  export interface Credential {
    id: string;
    name: string;
  }
  export interface AssetsInRiskInfoByIdRequest {
    policy_id: string;
    /**
     * 云账号ids
     */
    credential_ids?: string[];
    /**
     * 实例id（模糊查询）
     */
    instance_id?: string;
    /**
     * 实例名称（模糊查询）
     */
    instance_name?: string;
    /**
     * 区域ids
     */
    region_ids?: string[];
    /**
     * 云服务ids
     */
    service_ids?: string[];
  }
  /**
   * 增减标识符,The1 增,The2 减
   */
  export enum RatioType {
    The0 = '0',
    The1 = '1',
    The2 = '2',
  }

  export interface PeriodicCompareResponse {
    category?: Category;
    /**
     * 图标标识
     */
    icon_name: string;
    name?: string;
    platform: Platform;
    platform_name?: string;
    ratio?: number;
    ratio_type?: RatioType;
    value?: string;
    is_new?: boolean;
  }
  export interface RisksPeriodicCompareRequest {
    /**
     * 类型
     */
    category?: string;
    /**
     * 获取的风险类型
     */
    risk_types?: string[];
    /**
     * 周期id
     */
    task_id?: string;
    compare_type?: string;
    credential_id?: string;
  }
  export interface AssetsCompareRequest {
    /**
     * 比对类型
     */
    category?: string;
    compare_type?: string;
  }
  export interface AssetsPeriodicCompareRequest {
    /**
     * 比对类型
     */
    category?: string;
    /**
     * 周期任务id
     */
    task_id?: string;
    compare_type?: string;
    credential_id?: string;
  }
  export interface AssetsScanRequest {
    assets_type_ids?: string[];
    /**
     * 云账户id
     */
    credential_ids?: number[];
    instance_hash_ids?: string[];
    /**
     * 平台类型
     */
    platforms: string[];
    /**
     * 地域id列表
     */
    region_ids?: string[];
    /**
     * 扫描类型，config  vuln  sensitive
     */
    scan_types: string;
    /**
     * 云服务id列表
     */
    service_ids?: string[];
  }

  // 角色管理
  export interface RoleListRequest {
    page?: number;
    size?: number;
    name?: string;
  }
  export interface Permision {
    action: 'readonly' | 'readwrite' | 'deny';
    key: string;
    name?: string;
  }
  export interface RoleListResponse {
    created_at: number;
    creator: string;
    desc: string;
    id: number;
    name: string;
    updated_at: number;
    updater: string;
    permissions: Permision[];
  }

  export interface SetRoleRequest {
    desc: string;
    id: number;
    name: string;
    permissions: Permision[];
  }

  export interface AddRole {
    desc: string;
    name: string;
    permissions: Permision[];
  }
  export interface PermisionListResponse {
    actions: Permision['action'][];
    default?: string;
    desc?: string;
    key: string;
    name: string;
  }

  // 管理配置
  export interface IManageConf {
    password_rating: 'week' | 'moderate' | 'strong' | 'veryStrong';
    reset_fl_pwd_change: boolean;
    account_lock: boolean;
    account_lock_threshold: number;
    cycle_day: number;
    cycle_pwd_change: boolean;
    fl_pwd_change: boolean;
    ip_block: string[];
    mfa: boolean;
  }

  export interface VulnerabilityInfo {
    chain_data: ChainData;
    change_logs: ChangeLog[];
    assets_exist_map: Record<string, boolean>;
    cloud_platform: string;
    created_at: number;
    credential_id: number;
    credential_name: string;
    hash_id: string;
    id: number;
    last_find_at: number;
    name: string;
    name_en: string;
    security_threat: string;
    security_threat_en: string;
    severity: VulnerabilityItem['severity'];
    status: number;
    updated_at: number;
  }
  export interface ChainData {
    config: {
      hash_id: string;
      instance_hash_id: string;
      is_active: boolean;
      risk_name: string;
    };
    hosts: {
      hash_id: string;
      name: string;
      is_active: boolean;
      region_name: string;
      region_id: string;
      instance_id: string;
    }[];
    s3: {
      hash_id: string;
      name: string;
      is_active: boolean;
    };
    sensitive: {
      hash_id: string;
      instance_hash_id: string;
      is_active: boolean;
      risk_name: string;
    };
    vpc: {
      hash_id: string;
      name: string;
      is_active: boolean;
      region_name: string;
      region_id: string;
      instance_id: string;
    };
    vuln: {
      hash_id: string;
      instance_hash_id: string;
      is_active: boolean;
      risk_name: string;
    }[];
  }
  export interface ChangeLog {
    data: ChangeLogData;
    created_at: number;
    type:
      | 'addConfig'
      | 'removeConfig'
      | 'addVuln'
      | 'removeVuln'
      | 'addSensitive'
      | 'removeSensitive'
      | 'addVPC'
      | 'removeVPC';
  }
  export interface ChangeLogData {
    config_hash_id?: string;
    config_name: string;
    sensitive_hash_id?: string;
    sensitive_rule_name?: string;
    vuln_cve_code?: string;
    vuln_hash_id?: string;
    vpc_hash_id: string;
    vpc_name: string;
    Host: {
      name: string;
      hash_id: string;
      is_active: boolean;
      instance_id: string;
    };
  }
}
