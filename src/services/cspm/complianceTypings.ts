declare namespace API_COMPLIANCE {
  export enum Type {
    Manual = 'manual',
    Program = 'program',
  }
  export interface ComplianceRequest {
    /**
     * 合规名称筛选
     */
    search?: string;
    // 开启状态，1表示只查开启的，0表示只查未开启的，不传该字段表示全查
    status?: number;
  }
  export interface RelatedComplianceRequest {
    /**
     * 合规名称筛选
     */
    policy_id?: string;
    page?: number;
    size?: number;
  }

  export interface ComplianceDatum {
    /**
     * 是否内置框架
     */
    built_in: boolean;
    /**
     * 合规框架id
     */
    id: string;
    /**
     * 合规框架名称
     */
    name: string;
    /**
     * 检测项数
     */
    policy_count: number;
    /**
     * 序号
     */
    sequence: number;
    /**
     * 状态
     */
    status: boolean;
    /**
     * 更新时间
     */
    updated_at: number;
    /**
     * 更新人
     */
    updater: string;
  }
  export interface RelatedComplianceDatum {
    compensation?: string;
    compliance_type?: string;
    key?: string;
    requirement?: string;
    scene?: string;
    suggestion?: string;
  }
  export interface ComplianceInfoRequest {
    /**
     * 映射范围，云帐号id
     */
    credential_ids?: number[];
    /**
     * 合规id
     */
    key: string;
  }
  export interface ComplianceInfoResponse {
    /**
     * 是否内置框架
     */
    built_in: boolean;
    created_at: number;
    creator: string;
    data: ComplianceInfoData[];
    id: number;
    /**
     * 框架名称
     */
    name: string;
    /**
     * 检测项计数
     */
    policy_count: number;
    /**
     * 展示顺序
     */
    sequence: number;
    /**
     * 启停状态
     */
    status: boolean;
    updated_at: number;
    updater: string;
  }

  export interface ChildPolicy {
    asset_type: string;
    asset_type_name: string;
    description: string;
    id: string;
    key: string;
    mitigation: string;
    platform: string;
    platform_name: string;
    policy_title: string;
    policy_type: string;
    policy_type_name: string;
    service: string;
    service_id: string;
    service_name: string;
    severity: string;
  }

  // export interface PolicyPolicy {
  //   desc: string;
  //   mitigation: string;
  //   policy_id: string;
  //   policy_title: string;
  //   references: string[];
  //   service: string;
  //   service_name: string;
  //   severity: string;
  //   /**
  //    * 检测方式，手动自动
  //    */
  //   type: Type;
  // }

  export interface DatumTag {
    id: number;
    key: string;
    /**
     * 用户是否在该层设置的标签
     */
    user_set?: boolean;
    values?: Value[];
  }
  export interface Value {
    id: number;
    value: string;
  }
  export interface AddComplianceRequest {
    data: ComplianceInfoData[];
    name: string;
    sequence: number;
    status: boolean;
  }

  export interface ComplianceInfoData {
    children?: ComplianceInfoData[];
    key: number | string;
    tags?: DatumTag[];
    title?: string;
    type?: 'catalog' | 'requirement';
    level?: number;
    status?: string;
    policy_count?: number;
    policies?: ChildPolicy[];
  }

  export interface ComplianceWithRisksRequest {
    /**
     * 映射范围，云帐号id
     */
    credential_ids?: number[];
    compliance_id?: number;

    not_passed?: boolean;
  }

  export interface ComplianceWithRisksResponse {
    data: ComplianceWithRisksDatum[];
    id: number;
    /**
     * 框架名称
     */
    name: string;
  }

  export interface ComplianceWithRisksDatum {
    children: ComplianceWithRisksDatum[];
    key: string;
    risks_count: number;
    status: ComplianceRisksStatus;
    title: string;
    type: string;
  }
  export enum ComplianceRisksStatus {
    passed = 'passed', // 通过
    unpassed = 'unpassed', // 未检测
    warn = 'warn', // 警告
    unscan = 'unscan', // 未检测
  }

  export interface ComplianceSequence {
    id: number;
    sequence: number;
  }
  export interface ComplianceToggle {
    id: number;
    status: boolean;
  }

  export interface ComplianceOverviewItem {
    key: string;
    label: string;
    updated_at: number;
    value: ComplianceOverviewItemValue;
  }
  export interface ComplianceOverviewItemValue {
    manual_scanned: number;
    manual_total: number;
    passed: number;
    program_scanned: number;
    program_total: number;
    unpassed: number;
    unscan: number;
    warn: number;
  }
  export interface ComplianceSettingsResponse {
    remain: number;
  }
  export interface ComplianceSettingsReq {
    remain: number;
  }
  export interface ComplianceScanRequest {
    compliance_ids: number[];
    credential_ids: number[];
    platforms: string[];
  }
  export interface RectifyPolicyResultRequest {
    policy_id?: string;
    instance_hash_id?: string;
    /**
     * unpass
     */
    result: string;
  }
}
