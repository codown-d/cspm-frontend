import { renderExpandedIcon } from '@/components/lib/ProComponents/TzProTable';
import AssetsList, {
  AssetsListProps,
  AssetsListRefFn,
} from '@/pages/components/AssetsList';
import { getAgentlessRisksAssets } from '@/services/cspm/CloudPlatform';
import { memo, useRef, useState } from 'react';

export type AgentlessExpandedRowRenderProps = (
  record: API.AgentlessRisksAssetsResponse,
  setExpandedRowKeys: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >,
  filters?: any,
) => JSX.Element;
export type AgentlessAssetsListProps = AssetsListProps<
  API.AgentlessRisksAssetsRequest,
  API.AgentlessRisksAssetsResponse
> & {
  expandedRowRender: AgentlessExpandedRowRenderProps;
};
function AgentlessAssetsList({
  expandedRowRender,
  ...restProps
}: AgentlessAssetsListProps) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>();
  const ref = useRef<AssetsListRefFn>(null);

  return (
    <AssetsList<
      API.AgentlessRisksAssetsRequest,
      API.AgentlessRisksAssetsResponse
    >
      {...restProps}
      scope="agentless"
      mRef={ref}
      apiUrl={getAgentlessRisksAssets}
      tableProps={{
        className: 'tz-expand-table',
        rowKey: 'id',
        expandable: {
          expandedRowRender: (record, _a, _b, expand) =>
            expandedRowRender(
              record as API.AgentlessRisksAssetsResponse,
              setExpandedRowKeys,
              ref.current?.getFilters(),
            ),
          columnWidth: 40,
          expandedRowKeys,
          expandIcon: ({ expanded, onExpand, record }) =>
            renderExpandedIcon({ expanded, record, setExpandedRowKeys }),
        },
        ...restProps?.tableProps,
      }}
    />
  );
}

export default memo(AgentlessAssetsList);
