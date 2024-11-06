import NoData from '@/components/NoData';
import { onRowClick } from '@/components/lib/ProComponents/TzProTable';
import { TzButton } from '@/components/lib/tz-button';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useServiceFilterItem from '@/hooks/filterItems/useServiceFilterItem';
import PolicyList from '@/pages/components/PolicyList';
import PolicyFilters from '@/pages/components/PolicyList/PolicyFilters';
import { riskStore } from '@/pages/components/PolicyList/PolicyListItem';
import { getRisk } from '@/services/cspm/Risks';
import { toDetailIntercept } from '@/utils';
import { history, useIntl, useSnapshot } from '@umijs/max';
import { useMemoizedFn } from 'ahooks';
import { set } from 'lodash';
import { memo, useMemo, useState } from 'react';
import RiskExport from '../components/RiskExport';

type IList = {
  platformIds?: string[];
  credentialIds?: number[];
};
function List(props: IList) {
  const { credentialIds, platformIds } = props;
  const [filters, setFilters] = useState<any>();
  const intl = useIntl();
  const { refreshLoading } = useSnapshot(riskStore) ?? {};
  const serviceItem = useServiceFilterItem({
    platform: platformIds,
    only_top: 1,
  });
  const assetTypeItem = useServiceFilterItem({
    platform: platformIds,
  });
  const credentialItem = useCredentialFilterItem();
  const defaultFilterOpt = useMemo(
    () => ({
      credentialItem: {
        ...credentialItem,
        value: credentialIds,
      },
      serviceItem,
      assetTypeItem,
    }),
    [credentialIds, credentialItem, serviceItem, assetTypeItem],
  );

  const optionals = useMemo(
    () => [
      {
        name: 'service_ids',
        serviceItem,
        // valueEnum: getValueEnumByFilterOption(serviceItem),
        label: intl.formatMessage({ id: 'cloudServices' }),
      },
      {
        name: 'asset_type_ids',
        assetTypeItem,
        // valueEnum: getValueEnumByFilterOption(serviceItem),
        // label: intl.formatMessage({ id: 'cloudServices' }),
      },
      {
        name: 'assets_count',
      },
      {
        name: 'updated_at',
        label: intl.formatMessage({ id: 'lastUpdatedTime' }),
      },
    ],
    [serviceItem],
  );
  const onRow = useMemoizedFn((record) => {
    return {
      onClick: () =>
        onRowClick(() => {
          toDetailIntercept(
            {
              type: 'policy',
              id: record.policy_id,
              policy_type: record.policy_type,
            },
            () =>
              history.push(`/risks/info/${record.policy_id}`, {
                policy_type: record.policy_type,
                entity_type: record.entity_type,
                status: 'unpassed',
              }),
          );
        }),
    };
  });

  const disabledRefreshRisk = useMemo(() => {
    if (!platformIds?.length) {
      return true;
    }
    return !!refreshLoading;
  }, [refreshLoading, platformIds]);

  return (
    <div>
      <div className="flex gap-4 justify-between -mb-2">
        <PolicyFilters {...defaultFilterOpt} onChange={setFilters} />
        <div className="mt-[3px] whitespace-nowrap">
          <TzButton
            disabled={disabledRefreshRisk}
            onClick={() => {
              set(riskStore, 'refreshLoading', true);
            }}
            type="text"
            size="small"
            icon={<i className="icon iconfont icon-refresh1" />}
          >
            {intl.formatMessage({ id: 'refreshRisk' })}
          </TzButton>
          <RiskExport
            disabled={!platformIds?.length}
            platformIds={platformIds}
          />
        </div>
      </div>
      {!platformIds?.length ? (
        <NoData />
      ) : (
        <>
          <PolicyList
            filters={{ ...filters, platformIds }}
            {...defaultFilterOpt}
            apiUrl={getRisk}
            // request={async (dp, sort, filter) => {
            //   const { total, items } = await getRisk({
            //     ...dp,
            //     ...filter,
            //     ...sort,
            //   } as API_RISK.RiskRequest);
            //   return { total, data: items || [] };
            // }}
            optionals={optionals}
            onRow={onRow}
            renderActionType="verify"
          />
        </>
      )}
    </div>
  );
}

export default memo(List);
