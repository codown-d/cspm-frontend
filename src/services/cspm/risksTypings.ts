declare namespace API_RISK {
  export enum CONFIG_RISK_STATIC {
    config = 'config',
    vuln = 'vuln',
    sensitive = 'sensitive',
  }
  /**
   * 检测方式
   */
  export enum PolicyType {
    Manual = 'manual',
    Program = 'program',
  }
  export interface RiskRequest {
    /**
     * 排序方式，true=升序
     */
    ascending?: boolean;
    /**
     * 合规框架id
     */
    compliance_id?: number;
    /**
     * 合规条目id
     */
    compliance_content_id?: number;
    /**
     * 云账户ids
     */
    credential_ids?: number[];
    /**
     * 页码
     */
    page?: number;
    /**
     * 云平台
     */
    platform?: string;
    /**
     * 检测方式
     */
    policy_type_name?: PolicyType;
    /**
     * 模糊搜索 检测项名称（模糊搜索）
     */
    search?: string;
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
     * 排序字段，updated_at=最近更新时间
     */
    sort_by?: string;
  }

  export interface RiskItem {
    /**
     * 相关资产统计
     */
    assets_count: AssetsCount;
    description: string;
    platform: string;
    platform_name: string;
    policy_id: string;
    policy_title: string;
    entity_type: string;
    /**
     * 检测方式，自动手动
     */
    policy_type_name: string;
    service_name: string;
    severity: string;
    /**
     * 最近更新时间
     */
    updated_at: number;
  }

  /**
   * 相关资产统计
   */
  export interface AssetsCount {
    /**
     * 风险资产数
     */
    risks: number;
    /**
     * 总相关资产数
     */
    total: number;
  }

  export interface VerifyPolicyRequest {
    instance_hash_id?: string;
    policy_id?: string;
    credential_id?: string;
  }

  export type RisksStaticResponse = Record<keyof CONFIG_RISK_STATIC, number>;
  export interface PolicyHistoryRequest {
    /**
     * 检测项id
     */
    id: number;
    task_id?: number;
    /**
     * 检测类型   program:自动检测项  manual 手动检测项 必传
     */
    type: string;
  }
}
