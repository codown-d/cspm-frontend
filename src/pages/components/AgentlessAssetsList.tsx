import {
  onRowClick,
  renderExpandedIcon,
} from '@/components/lib/ProComponents/TzProTable';
import useCredentialFilterItem from '@/hooks/filterItems/useCredentialFilterItem';
import useRegionFilterItem from '@/hooks/filterItems/useRegionFilterItem';
import {
  AssetsListProps,
  AssetsListRefFn,
} from '@/pages/components/AssetsList';
import { getAgentlessRisksAssets } from '@/services/cspm/Agentless';
import { toDetailIntercept } from '@/utils';
import { useIntl } from '@umijs/max';
import { memo, useMemo, useRef, useState } from 'react';
import AssetInfoDrawer from '../Asset/Info/AssetInfoDrawer';
import AssetFilters from './AssetList/AssetFilters';
import AssetTable from './AssetList/AssetTable';

export type AgentlessExpandedRowRenderProps = (
  record: API_AGENTLESS.AgentlessRisksAssetsResponse,
  setExpandedRowKeys: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >,
  filters?: any,
) => JSX.Element;
export type AgentlessAssetsListProps = AssetsListProps<
  API_AGENTLESS.AgentlessRisksAssetsRequest,
  API_AGENTLESS.AgentlessRisksAssetsResponse
> & {
  expandedRowRender: AgentlessExpandedRowRenderProps;
};
function AgentlessAssetsList({
  expandedRowRender,
  defaultParams,
  ...restProps
}: AgentlessAssetsListProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>();
  const ref = useRef<AssetsListRefFn>(null);
  const [filters, setFilters] = useState<any>();
  const [recordInfo, setRecordInfo] = useState<API_ASSETS.AssetsDatum>();
  const intl = useIntl();

  const regionItem = useRegionFilterItem();
  const credentialItem = useCredentialFilterItem();
  const defaultFilterOpt = useMemo(() => {
    const { options, ...rest } = credentialItem.props;
    return {
      credentialItem,
      regionItem,
    };
  }, [credentialItem, regionItem]);

  const optionals = useMemo(
    () => [
      'instance_name',
      'instance_id',
      'credential_ids',
      'region_ids',
      'risk_count',
      {
        name: 'created_at',
        sorter: false,
        label: intl.formatMessage({ id: 'firstFindTime' }),
      },
    ],
    [],
  );
  return (
    <>
      <AssetFilters {...defaultFilterOpt} onChange={setFilters} />
      <AssetTable
        {...restProps}
        // ref={ref}
        className="flex-1 tz-expand-table"
        params={{ ...filters, ...defaultParams }}
        optionals={optionals}
        request={async (dp, sort, filter) => {
          let _data = {
            ...dp,
            ...sort,
          };

          const { total, items } = await getAgentlessRisksAssets(
            _data as API_AGENTLESS.AssetsInRiskInfoByIdRequest,
          );
          return { total, data: items || [] };
        }}
        onRow={(record) => {
          return {
            onClick: () =>
              onRowClick(() => {
                toDetailIntercept({ type: 'asset', id: record.hash_id }, () => {
                  setRecordInfo(record);
                });
              }),
          };
        }}
        rowKey="id"
        expandable={{
          expandedRowRender: (record, _a, _b, expand) =>
            expandedRowRender(record, setExpandedRowKeys, filters),
          columnWidth: 40,
          expandedRowKeys,
          expandIcon: ({ expanded, onExpand, record }) =>
            renderExpandedIcon({ expanded, record, setExpandedRowKeys }),
        }}
      />
      <AssetInfoDrawer
        canbe2Detail
        open={!!recordInfo}
        onClose={() => setRecordInfo(undefined)}
        record={recordInfo}
      />
    </>
  );
}

export default memo(AgentlessAssetsList);
