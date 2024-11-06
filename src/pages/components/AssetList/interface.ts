import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';

// 资产筛选项：credentialItem(云账号), 服务(serviceItem),风险类型(riskTypesItem - risk_type)，区域(regionItem)，检测结果(scanResItem 非合规)
export type IAssetTableFilterProps = Partial<
  Record<
    | 'serviceItem'
    | 'assetTypeItem'
    | 'credentialItem'
    | 'riskTypesItem'
    | 'regionItem'
    | 'scanResItem',
    FilterFormParam
  >
>;
