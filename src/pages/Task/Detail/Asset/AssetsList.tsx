import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { FilterFormParam } from '@/components/lib/TzFilterForm/filterInterface';
import NoData from '@/components/NoData';
import useCommonFilterItem from '@/hooks/filterItems/useCommonFilterItem';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import AssetList from '@/pages/components/AssetList';
import AssetFilters from '@/pages/components/AssetList/AssetFilters';
import { getReportsAssetsById } from '@/services/cspm/Assets';
import { history, useIntl, useParams } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { useMemo, useRef, useState } from 'react';

type IList = {
  platformIds?: string[];
};
function AssetsList(props: IList) {
  const { platformIds } = props;
  const [filters, setFilters] = useState<any>();
  const filterOriginData = useRef<Record<string, any>>();
  const intl = useIntl();
  const serviceItem = useServiceFilterItem({
    platform: platformIds,
    only_top: 1,
  }) as FilterFormParam;

  const regionItem = useRegionFilterItem({
    platform: platformIds,
  }) as FilterFormParam;

  const { riskTypesItem } = useCommonFilterItem();

  const credentialItem = useCredentialFilterItem();
  const assetTypeItem = useServiceFilterItem({
    platform: platformIds,
  });
  const defaultFilterOpt = useMemo(
    () => ({
      credentialItem,
      regionItem,
      serviceItem,
      assetTypeItem,
      riskTypesItem,
    }),
    [credentialItem, regionItem, assetTypeItem, serviceItem, riskTypesItem],
  );
  const { id } = useParams();
  const filtersMemo = useMemo(
    () => ({ ...filters, platformIds, task_id: id }),
    [filters],
  );

  const optionals = useMemo(
    () => [
      'instance_info',
      'region_ids',
      'risk_types',
      {
        name: 'created_at',
        sorter: false,
        label: intl.formatMessage({ id: 'taskCreatedAt' }),
      },
      'service_ids',
      'credential_ids',
    ],
    [],
  );

  const onRowFn = useMemoizedFn((record) => {
    return {
      onClick: () =>
        onRowClick(() => {
          history.push(`/asset/info/${record.hash_id}`, {
            task_id: id,
            from: 'task',
          });
        }),
    };
  });
  return (
    <div>
      {platformIds?.length ? (
        <>
          <AssetFilters
            {...defaultFilterOpt}
            onChange={(val, originData) => {
              setFilters(val);
              filterOriginData.current = originData;
            }}
          />
          <AssetList
            filters={filtersMemo}
            {...defaultFilterOpt}
            filterItems={defaultFilterOpt}
            optionals={optionals}
            onRow={onRowFn}
            request={async (dp, _, filter) => {
              const queryData = {
                ...dp,
                ...filter,
              } as API_ASSETS.AssetsRequest;
              const { credential_ids, ...rest } = queryData ?? {};
              const _queryData = credential_ids
                ? { ...rest, credential_ids: credential_ids.map((v) => +v) }
                : rest;

              const { total, items } = await getReportsAssetsById(_queryData);
              // set(hostAssetExistedStore, platform, host_asset_existed);
              return { total, data: items || [] };
            }}
          />
        </>
      ) : (
        <NoData />
      )}
    </div>
  );
}

export default AssetsList;
