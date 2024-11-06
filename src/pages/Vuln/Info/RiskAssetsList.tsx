import TzProTable, {
  RenderExpandedRow,
  TzProColumns,
  renderTextEllipsis,
  renderTextWithCopy,
} from '@/components/lib/ProComponents/TzProTable';
import AgentlessAssetsList, {
  AgentlessAssetsListProps,
} from '@/pages/components/AgentlessAssetsList';
import { getRiskPkgList } from '@/services/cspm/CloudPlatform';
import { ISNO_TABLE_ENUM } from '@/utils';
import { useIntl, useLocation, useParams } from '@umijs/max';
import { memo } from 'react';
const expandedRowRender = (
  record: API_AGENTLESS.AgentlessRisksAssetsResponse,
  setExpandedRowKeys: React.Dispatch<
    React.SetStateAction<string[] | undefined>
  >,
  filters?: any,
) => {
  const intl = useIntl();
  const { id } = useParams();
  const { state } = useLocation();
  const { task_id } = state ?? {};

  const column: TzProColumns<API_AGENTLESS.RiskPkgResponse>[] = [
    {
      title: intl.formatMessage({ id: 'pkgName' }),
      dataIndex: 'name',
      width: '20%',
      tzEllipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'path' }),
      dataIndex: 'filename',
      width: '15%',
      tzEllipsis: true,
      render: (dom, record) =>
        record.filename ? renderTextWithCopy(dom as string, 230) : '-',
    },
    {
      title: intl.formatMessage({ id: 'sourceLicense' }),
      dataIndex: 'license',
      render: (dom, record) => {
        if (!record?.license.length) {
          return '-';
        }
        const txt = record.license.join(' , ');
        return renderTextEllipsis(txt);
      },
    },
    {
      title: intl.formatMessage({ id: 'pkgClass' }),
      dataIndex: 'class_name',
      width: '15%',
      tzEllipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'canFixed' }),
      dataIndex: 'can_fixed',
      width: '13%',
      align: 'center',
      valueEnum: ISNO_TABLE_ENUM,
    },
    {
      title: intl.formatMessage({ id: 'fixedVersion' }),
      dataIndex: 'fixed_version',
      width: '12%',
      tzEllipsis: true,
    },
  ];
  return (
    <div className="expanded-content">
      <TzProTable
        isInDetail
        className="no-hover-table"
        columns={column}
        headerTitle={false}
        search={false}
        options={false}
        request={async (dp) => {
          const { total, items } = await getRiskPkgList({
            ...dp,
            instance_hash_id: record.hash_id,
            vuln_unique_id: id,
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
) => (
  <AgentlessAssetsList
    {...props}
    rowEllipsis={false}
    expandedRowRender={expandedRowRender}
  />
);

export default memo(RiskAssetsList);
