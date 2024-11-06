import TzProTable, {
  RenderExpandedRow,
  TzProColumns,
  renderTextWithCopy,
} from '@/components/lib/ProComponents/TzProTable';
import { getSensitiveRisks } from '@/services/cspm/CloudPlatform';
import { useIntl, useLocation, useParams } from '@umijs/max';
import { memo } from 'react';
import AgentlessAssetsList, {
  AgentlessAssetsListProps,
  AgentlessExpandedRowRenderProps,
} from '../AgentlessAssetsList';

const expandedRowRender: AgentlessExpandedRowRenderProps = (
  record,
  setExpandedRowKeys,
  filters,
) => {
  const intl = useIntl();
  const { state } = useLocation();
  const { task_id } = state ?? {};
  const { id } = useParams();

  const column: TzProColumns<API.SensitiveRisksDatum>[] = [
    {
      title: intl.formatMessage({ id: 'filePath' }),
      dataIndex: 'filename',
      width: 400,
      render: (dom, record) =>
        record.filename ? renderTextWithCopy(dom as string, 370) : '-',
    },
    {
      title: intl.formatMessage({ id: 'fileExt' }),
      dataIndex: 'ext',
      tzEllipsis: true,
    },

    {
      title: intl.formatMessage({
        id: 'turnoverTime',
      }),
      dataIndex: 'updated_at',
      valueType: 'dateTime',
    },
  ];
  return (
    <div className="expanded-content">
      <TzProTable
        isInDetail
        className="no-hover-table"
        columns={column}
        request={async (dp) => {
          const { total, items } = await getSensitiveRisks({
            ...dp,
            instance_hash_id: record.hash_id,
            rule_unique_id: id,
            task_id,
            ...(filters || {}),
          });

          return { total, data: items || [] };
        }}
      />
      <RenderExpandedRow
        setExpandedRowKeys={setExpandedRowKeys}
        record={record}
      />
    </div>
  );
};

const RiskAssetsList = (
  props: Omit<AgentlessAssetsListProps, 'expandedRowRender'>,
) => <AgentlessAssetsList {...props} expandedRowRender={expandedRowRender} />;

export default memo(RiskAssetsList);
