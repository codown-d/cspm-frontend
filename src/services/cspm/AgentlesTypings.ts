declare namespace API_AGENTLESS {
  export enum SEVERITY_LEVEL {
    CRITICAL = 'CRITICAL',
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW',
    UNKNOWN = 'UNKNOWN',
  }
  export interface VulnRisksRequest {
    /**
     * 攻击路径
     */
    attack_path?: string[];
    /**
     * 云账户 ID列表
     */
    credential_ids?: string[];
    /**
     * 重点关注漏洞,传参 true
     */
    focus?: boolean;
    /**
     * 云主机实例列表
     */
    instance_hash_ids?: string[];
    /**
     * 软件unique_id
     */
    pkg_unique_id?: string;
    /**
     * 云平台搜索
     */
    platforms?: string[];
    /**
     * 漏洞名及简介搜索
     */
    search?: string;
    /**
     * 云服务ID列表
     */
    service_ids?: string[];
    /**
     * 严重级别搜索
     */
    severity?: string[];
    size?: string;
    /**
     * 扫描任务 ID
     */
    task_id?: number;
    /**
     * 漏洞属性
     */
    vuln_attr?: string[];
  }

  /**
   * 漏洞列表
   */
  export interface VulnRisksDatum {
    /**
     * 影响资产数
     */
    assets_count: number;
    /**
     * 攻击路径
     */
    attack_path: string;
    /**
     * 攻击路径
     */
    attack_path_name: string;
    /**
     * 云平如统计
     */
    cloud_static?: CloudStatic[];
    /**
     * 数据库写入时间
     */
    created_at: number;
    /**
     * CVSS3.0评分
     */
    cvssv3_score: number;
    /**
     * 漏洞描述
     */
    description: string;
    /**
     * 最早发现时间
     */
    found_at: number;
    /**
     * 漏洞编号
     */
    name: string;
    /**
     * 漏洞严重级别
     */
    severity: SEVERITY_LEVEL;
    severity_name: string;
    /**
     * 漏洞唯一值
     */
    unique_id: string;
    /**
     * 最近更新时间
     */
    updated_at: number;
    /**
     * 漏洞属性
     */
    vuln_attr: string[];
    /**
     * 漏洞名
     */
    vuln_name: string;
  }
  //   export enum Value {
  //     Empty = "",
  //     Exp = "EXP",
  //     PoC = "PoC",
  // }

  interface CloudStatic {
    count: number;
    platform: string;
  }
  /**
   * 敏感文件规则
   */
  export interface RuleSensitiveRisksDatum {
    /**
     * 影响资产数
     */
    assets_count: number;
    /**
     * 规则类型
     */
    category: string;
    /**
     * 云平台统计
     */
    cloud_static?: CloudStatic[];
    /**
     * 最早发现时间
     */
    found_at: number;
    id: string;
    /**
     * 对应的正则表达示
     */
    regex_value: string;
    /**
     * 严重级别
     */
    severity: SEVERITY_LEVEL;
    /**
     * 敏感文件规则
     */
    title: string;
    /**
     * 唯一值
     */
    unique_id: string;
  }

  export interface RuleSensitiveRisksRequest {
    page?: number;
    size?: number;
    /**
     * 敏感文件信息类型，精确匹配多选
     */
    category?: string[];
    /**
     * 云账户 ID
     */
    credential_ids?: string[];
    /**
     * 重点关注敏感文件，传参 true
     */
    focus?: string;
    /**
     * 传 true 就返回全部category
     */
    group_category?: string;
    instance_hash_ids?: string[];
    /**
     * 云平台列表
     */
    platforms?: string[];
    /**
     * 云服务id列表
     */
    service_ids?: string[];
    severity?: string[];
    /**
     * 任务 ID
     */
    task_id?: number;
    /**
     * 信息规则（模糊匹配）
     */
    title?: string;
  }

  export interface SensitiveRisksRequest {
    /**
     * 查询某个实例的敏感文件
     */
    instance_hash_id?: string;
    rule_unique_id?: string;
    sensitive_keyword?: string;
    severity?: string;
    task_id?: number;
  }

  /**
   * 敏感文件列表
   */
  export interface SensitiveRisksDatum {
    assets_count: number;
    /**
     * 文件类型
     */
    ext: string;
    filemod: TFilemod;
    filename: string;
    md5: string;
    /**
     * 敏感文件规则
     */
    rule_category: string;
    /**
     * 规则信息类型
     */
    rule_title: string;
    /**
     * 规则unique_id
     */
    rule_unique_id: string;
    /**
     * 严重程度
     */
    severity: string;
    unique_id: string;
    updated_at: number;
  }
  /**
   * 文件权限
   */
  export interface TFilemod {
    group: string;
    perm: string;
    user: string;
  }
  /**
   * 漏洞详情
   */
  export interface VulnRiskInfoResponse {
    /**
     * 攻击路径
     */
    attack_path: string;
    /**
     * 攻击路径
     */
    attack_path_name: string;
    cloud_static: assetCount[];
    /**
     * CnnvdName
     */
    cnnvd_name: string;
    /**
     * 数据库写入时间
     */
    created_at: number;
    /**
     * CVSS3.0评分
     */
    cvssv3_score: number;
    /**
     * 漏洞描述（自动适配中英文）
     */
    description: string;
    /**
     * 最早发现时间
     */
    found_at: number;
    /**
     * 最近一次更新时间
     */
    modify_at: number;
    /**
     * 漏洞编号,一个漏洞的唯一标识
     */
    name: string;
    /**
     * 漏洞发步时间
     */
    publish_at: number;
    /**
     * 漏雷达图
     */
    radar_attr: LableValue[];
    /**
     * 引用
     */
    references: string[];
    /**
     * 漏洞严重级别
     */
    severity: SEVERITY_LEVEL;
    severity_name: string;
    /**
     * 漏洞类型
     */
    title: string;
    /**
     * 数据库更新时间
     */
    updated_at: number;
    /**
     * 漏洞属性
     */
    vuln_attr: string[];
    /**
     * 漏洞名，中文件环境才有的
     */
    vuln_name: string;
  }

  /**
   * 云平台资产统计
   */
  export interface assetCount {
    count: number;
    platform: string;
  }

  /**
   * LableValue
   */
  export interface LableValue {
    lablel: string;
    value: string;
  }
  export interface RuleSensitiveInfoResponse {
    assets_count: number;
    /**
     * 规则类型
     */
    category: string;
    id: number;
    /**
     * 对应的正则表达示
     */
    regex_value: string;
    /**
     * 严重级别
     */
    severity: SEVERITY_LEVEL;
    /**
     * 敏感文件规则
     */
    title: string;
    /**
     * 唯一值
     */
    unique_id: string;
  }
  export interface SensitiveInfoResponse {
    filename: string;
    filetype: string;
    /**
     * 级别
     */
    severity: SEVERITY_LEVEL;
    severity_name: string;
    unique_id: string;
    update_at: number;
    [property: string]: any;
  }

  /**
   * 漏洞 ATTR
   */
  export interface VulnRiskInfoResponseAttr {
    lable: string;
    name: string;
    pos: number;
    value: string;
  }
  /**
   * 资产列表
   */
  export interface AgentlessRisksAssetsResponse {
    /**
     * 资产数
     */
    risk_count: string;
    /**
     * 创建时间
     */
    created_at: string;
    /**
     * 云账户id
     */
    credential_id?: number;
    /**
     * 云账户名称
     */
    credential_name?: string;
    /**
     * 实例 hash_id
     */
    hash_id: string;
    /**
     * 实例 ID
     */
    instance_id: string;
    /**
     * 实例名
     */
    instance_name: string;
    /**
     * 云平台
     */
    platform: string;
    /**
     * 云平台
     */
    platform_name: string;
    /**
     * 区域
     */
    region: string;
    /**
     * 区域
     */
    region_name: string;
    /**
     * 云服务类型
     */
    service: string;
    /**
     * 云服务类型
     */
    service_name: string;
    /**
     * 最近更新时间
     */
    updated_at: number;
  }

  export interface VulnAssetsTopRequest {
    platforms?: string[];
  }

  /**
   * TOP5
   */
  export interface VulnAssetsTopResponse {
    /**
     * 做跳转时使用
     */
    key: string;
    /**
     * 名
     */
    label: string;
    /**
     * 按风险统计
     */
    value: SEVERITY_LEVEL;
  }
  /**
   * TOP5
   */
  export interface SensitiveAssetsTopResponse {
    /**
     * 做跳转时使用
     */
    key: string;
    /**
     * 名
     */
    label: string;
    /**
     * 按风险统计
     */
    value: null;
  }
  export interface RiskPkgRequest {
    /**
     * 是否可修复
     */
    can_fixed?: string[];
    /**
     * 软件类型
     */
    class?: string[];
    /**
     * 云主机实例hashID
     */
    instance_hash_id?: string;
    /**
     * 是否是内核软件
     */
    kernel?: string[];
    /**
     * 云服务 id列表
     */
    service_id?: string[];
    /**
     * 扫描任务 ID
     */
    task_id?: number;
    /**
     * 漏洞uniqueID
     */
    vuln_unique_id?: string;
  }

  /**
   * 软件详情
   */
  export interface RiskPkgResponse {
    /**
     * 是否可修复
     */
    can_fixed: boolean;
    /**
     * 系统软件，应用软件
     */
    class: string;
    /**
     * 系统软件，应用软件
     */
    class_name: string;
    /**
     * 路径
     */
    filename: string;
    /**
     * 修复版本
     */
    fixed_version: string;
    /**
     * 是否内核
     */
    kernel: boolean;
    /**
     * 编程语言
     */
    language: string;
    /**
     * LICENSE
     */
    license: string[];
    /**
     * 软件名
     */
    name: string;
    os_family: string;
    os_name: string;
    /**
     * 参考连接
     */
    references: string[];
    /**
     * 对应的漏洞的级别
     */
    severity: string;
    /**
     * 对应的漏洞的级别
     */
    severity_name: string;
    /**
     * 唯一值
     */
    unique_id: string;
    /**
     * 软件版本号
     */
    version: string;
  }

  export interface AgentlessRisksAssetsRequest {
    /**
     * 云账户多选
     */
    credential_id?: string[];
    /**
     * 搜索instance_id
     */
    instance_id?: string;
    /**
     * 搜索instance_name
     */
    instance_name?: string;
    /**
     * 漏洞unique_id
     */
    pkg_unique_id?: string;
    /**
     * 区域
     */
    region_ids?: string[];
    /**
     * 凭证密钥规则unique_id
     */
    sensitive_rule_unique_id?: string;
    /**
     * 敏感文件unique_id
     */
    sensitive_unique_id?: string;
    /**
     * 云服务列表
     */
    service_id?: string[];
    task_id?: number;
    /**
     * 漏洞unique_id
     */
    vuln_unique_id?: string;
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

  export interface SensitiveCategoryResponse {
    lablel: string;
    value: string;
  }
}
