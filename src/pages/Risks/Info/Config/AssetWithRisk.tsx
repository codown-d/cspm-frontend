import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import { TzCard } from '@/components/lib/tz-card';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import { IState } from '@/interface';
import AssetInfoDrawer from '@/pages/Asset/Info/AssetInfoDrawer';
import AssetFilters from '@/pages/components/AssetList/AssetFilters';
import AssetTable, {
  AssetTableRef,
} from '@/pages/components/AssetList/AssetTable';
import ActionNodeWithVerify from '@/pages/components/PolicyList/ActionNodeWithVerify';
import {
  getAssetsInRiskHistoryById,
  getAssetsInRiskInfoById,
} from '@/services/cspm/Assets';

import { getValueEnumByFilterOption, toDetailIntercept } from '@/utils';
import { useIntl, useLocation } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { get, set } from 'lodash';
import { memo, useMemo, useRef, useState } from 'react';

type FromType = 'compliance' | 'risk';
type IAssetWithRisk = {
  className?: string;
  status?: API_ASSETS.Status;
  policyInfo: {
    policy_id?: string;
    policy_type?: string;
  };
  complianceInfo?: {
    credential_ids?: number[];
    compliance_content_id?: string;
  };
};
function AssetWithRisk({
  policyInfo,
  className,
  complianceInfo,
  status,
}: IAssetWithRisk) {
  const { credential_ids, compliance_content_id } = complianceInfo ?? {};
  const intl = useIntl();
  const ref = useRef<AssetTableRef>();
  const [filters, setFilters] = useState<any>();
  const [recordInfo, setRecordInfo] = useState<API_ASSETS.AssetsDatum>();
  const { state, pathname } = useLocation();
  const { task_id, from = 'risk' } = (state as IState) ?? {};
  const { scanResItem } = useCommonFilterItem();
  const regionItem = useRegionFilterItem();
  const credentialItem = useCredentialFilterItem();
  const refreshList = useMemoizedFn(() => {
    ref.current?.reload();
  });

  const fromCompliance = ['compliance', 'task'].includes(from);
  const isTask = from === 'task';
  const optionals = useMemo(
    () => [
      'instance_name',
      'instance_id',
      'credential_ids',
      'region_ids',
      {
        name: 'status',
        valueEnum: getValueEnumByFilterOption(scanResItem),
      },
      {
        name: isTask ? 'created_at' : 'updated_at',
        sorter: !isTask,
        label: intl.formatMessage({
          id: isTask ? 'taskCreatedAt' : 'lastUpdatedTime',
        }),
      },
    ],
    [],
  );

  const canbe2Detail = useMemo(() => {
    if (isTask) {
      return false;
    }
    if (from === 'compliance') {
      return policyInfo.policy_type === 'program';
    }
    return true;
  }, [from]);

  const defaultFilterOpt = useMemo(() => {
    const { options, ...rest } = credentialItem.props;
    return {
      credentialItem: fromCompliance
        ? {
            ...credentialItem,
            value: credential_ids,
            fixed: true,
            props: {
              ...rest,
              options:
                options?.filter((v) => credential_ids?.includes(v.value)) || [],
            },
          }
        : (credentialItem as FilterFormParam),
      regionItem,
      scanResItem: status
        ? {
            ...scanResItem,
            value: [status],
          }
        : (scanResItem as FilterFormParam),
    };
  }, [credentialItem, regionItem, credential_ids, status]);

  return (
    <TzCard
      className={className}
      headStyle={{ paddingBottom: 4 }}
      bodyStyle={{ paddingTop: 0 }}
      title={intl.formatMessage({ id: 'relativeAsset' })}
      extra={
        !isTask && (
          <TzButton
            onClick={refreshList}
            type="text"
            size="small"
            icon={<i className="icon iconfont icon-refresh1" />}
          >
            {intl.formatMessage({ id: 'refreshRisk' })}
          </TzButton>
        )
      }
    >
      <AssetFilters
        className="mt-1"
        {...defaultFilterOpt}
        onChange={setFilters}
      />
      <AssetTable
        ref={ref}
        className="flex-1"
        params={{ ...filters, task_id }}
        optionals={optionals}
        request={async (dp, sort, filter) => {
          let _data = {
            ...dp,
            ...filter,
            ...sort,
            ...policyInfo,
          };
          if (fromCompliance) {
            set(_data, 'compliance_content_id', compliance_content_id);
            !get(_data, 'credential_ids') &&
              set(_data, 'credential_ids', credential_ids);
          }

          const apiUrl = task_id
            ? getAssetsInRiskHistoryById
            : getAssetsInRiskInfoById;
          const { total, items } = await apiUrl(_data);
          const _virTime = +new Date();
          return {
            total,
            data: (items || [])?.map((v) => ({ ...v, _virTime })),
          };
        }}
        renderActionBtns={
          isTask
            ? undefined
            : (_, record) => (
                <ActionNodeWithVerify
                  key={record._virTime}
                  record={{ ...policyInfo, instance_hash_id: record.hash_id }}
                  calFn={refreshList}
                />
              )
        }
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                if (isTask) {
                  setRecordInfo(record);
                  return;
                }
                toDetailIntercept({ type: 'asset', id: record.hash_id }, () => {
                  setRecordInfo(record);
                });
              }),
          };
        }}
      />
      <AssetInfoDrawer
        canbe2Detail={canbe2Detail}
        open={!!recordInfo}
        onClose={() => setRecordInfo(undefined)}
        record={recordInfo}
      />
    </TzCard>
  );
}

export default memo(AssetWithRisk);
