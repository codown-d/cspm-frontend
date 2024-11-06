import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';

// 检测项筛选项：平台(platformItem),credentialItem(云账号), 服务(serviceItem)，检测结果(scanResItem 非合规)，严重程度，检测方式(policyTypeItem)，资产类型
export type IPolicyTableFilterProps = Partial<
  Record<
    | 'credentialItem'
    | 'assetTypeItem'
    | 'serviceItem'
    | 'platformItem'
    | 'policyTypeItem'
    | 'scanResItem'
    | 'serviceItem',
    FilterFormParam
  >
>;
