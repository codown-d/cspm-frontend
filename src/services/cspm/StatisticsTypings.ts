declare namespace API_STATISTICS {
  // export enum Category {
  //   Credential = 'credential',
  //   Platform = 'platform',
  //   Region = 'region',
  //   Service = 'service',
  // }
  export type Category = 'credential' | 'platform' | 'region' | 'service';
  /**
   * 比对的类型，月比对还是周比对
   */
  export type CompareType = 'week' | 'month';

  export interface RiskStatisticsRequest {
    category: Category;
    /**
     * 比对类型
     */
    compare_type: CompareType;
    /**
     * 风险类型
     */
    risk_types: string[];
  }
  export interface RiskStatisticsResponse {
    /**
     * 图标标识号
     */
    icon?: string;
    is_new: boolean;
    key?: string;
    label: string;
    platform: string;
    platform_name?: string;
    ratio?: string;
    ratio_type?: RatioType;
    value?: Value;
  }
  export enum RatioType {
    The0 = '0',
    The1 = '1',
    The2 = '2',
  }
  export interface Value {
    config?: number;
    sensitive?: number;
    vuln?: number;
  }

  export interface AssetsStatisticsRequest {
    /**
     * 统计类型，按照地区，云平台，云服务，云账户
     */
    category?: Category;
    /**
     * 比对的类型，月比对还是周比对
     */
    compare_type?: CompareType;
    /**
     * 云账户id（云账户详情页用到）
     */
    credential_id?: string;
  }
  /**
   * 比对的类型，月比对还是周比对
   */
  // export enum CompareType {
  //   Month = 'month',
  //   Week = 'week',
  // }
  // export interface AssetsStatisticsResponse {
  //   /**
  //    * 图标标识
  //    */
  //   icon?: string;
  //   is_new: boolean;
  //   key?: string;
  //   label: string;
  //   platform: string;
  //   platform_name?: string;
  //   ratio?: string;
  //   ratio_type?: RatioType;
  //   value?: number;
  // }

  export interface TendencyRequest {
    credential_ids?: number[];
    ended_at: number;
    risk_types: string[];
    started_at: number;
  }

  export interface TendencyResponse {
    data: Datum[];
    dimensions: { name: string; id: number }[];
  }

  export interface Datum {
    datetime?: string;
    distribution?: Distribution[];
  }
  export interface Distribution {
    /**
     * 云账户名称
     */
    name: string;
    /**
     * 风险数
     */
    value: number;
  }
}
