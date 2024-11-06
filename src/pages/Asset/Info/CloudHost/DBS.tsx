import TzProTable, {
  TzProColumns,
} from '@/components/lib/ProComponents/TzProTable';
import { useIntl } from '@umijs/max';

type DBSProps = {
  dataSource?: API_ASSETS.Disk[];
  loading?: boolean;
  isHistory?: boolean;
};
function DBS({ isHistory, dataSource, ...restProps }: DBSProps) {
  const intl = useIntl();

  const columns: TzProColumns<API_ASSETS.Disk>[] = [
    {
      title: 'ID',
      dataIndex: 'name',
      tzEllipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'dbsVolume' }),
      dataIndex: 'size',
    },
    {
      title: intl.formatMessage({ id: 'dbsUsage' }),
      dataIndex: 'label',
      tzEllipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'dbsType' }),
      dataIndex: 'type',
      tzEllipsis: true,
    },
  ];
  return (
    <div className="px-4 mb-3">
      <div className="card-tit my-3">{intl.formatMessage({ id: 'dbs' })}</div>
      <TzProTable<API_ASSETS.Disk>
        className="no-hover-table"
        rowKey="name"
        isInDetail
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
}

export default DBS;
