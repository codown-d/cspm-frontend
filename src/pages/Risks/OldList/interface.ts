import { BreadcrumbProps } from 'antd';
import { CSSProperties, ReactNode, RefObject } from 'react';
import { RiskStoreRes, TRiskStoreItem } from './useRiskStore';

export type RiskListProps = Pick<
  RiskListItemProps,
  | 'infoBreadcrumb'
  | 'className'
  | 'platform'
  | 'refreshAction'
  | 'tableAnchorStyle'
> &
  Omit<RiskStoreRes, 'state'> & {
    total?: number;
    boxH?: number;
    affix?: boolean;
    task_id?: string;
    credential_id?: string;
    riskType: string;
    state: TRiskStoreItem;
  };

export type RiskListItemProps = {
  refreshAction?: number;
  // boxH?: number;
  isFir?: boolean; //是否是一级页面
  className?: string;
  platform?: string | string[];
  tableAnchorStyle?: CSSProperties;
  filterToRef?: RefObject<HTMLDivElement>;
  isScanRes?: boolean;
  infoBreadcrumb?: BreadcrumbProps['items'];
  setFilters?: (filters: Record<string, any>) => void;
  fetchParams?: Record<string, any> & { service_ids?: string[] };
  defaultParams?: {
    task_id?: string;
    credential_id?: string;
    credential_ids?: string[];
  };
};

export type TScanResList = {
  pageTit?: string;
  showExport?: boolean;
  extra?: ReactNode;
  className?: string;
  infoBreadcrumb?: BreadcrumbProps['items'];
  // riskNums?: API.SeverityCount;
  instanceId?: string;
  filterToRef: RefObject<HTMLDivElement>;
  // boxH?: number;
  defaultParams: { task_id?: string; instance_hash_id?: string };
  tableAnchorStyle?: CSSProperties;
};
