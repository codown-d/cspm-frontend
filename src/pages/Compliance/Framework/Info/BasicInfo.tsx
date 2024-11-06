import TzProDescriptions from '@/components/lib/ProComponents/TzProDescriptions';
import { TzCard } from '@/components/lib/tz-card';
import { useIntl } from '@umijs/max';

type IBasicInfo = {
  dataSource?: Omit<API_COMPLIANCE.ComplianceInfoResponse, 'data'>;
  loading?: boolean;
};
function BasicInfo({ dataSource, loading }: IBasicInfo) {
  const intl = useIntl();
  return (
    <TzCard
      className="is-descriptions"
      bodyStyle={
        loading ? { padding: '4px 16px 16px 16px' } : { paddingBlock: '4px 0' }
      }
      title={intl.formatMessage({ id: 'basicInfo' })}
    >
      <TzProDescriptions
        dataSource={dataSource}
        columns={[
          {
            title: intl.formatMessage({ id: 'number' }),
            key: 'sequence',
            dataIndex: 'sequence',
          },
          {
            title: intl.formatMessage({ id: 'updater' }),
            key: 'updater',
            dataIndex: 'updater',
          },
          {
            title: intl.formatMessage({ id: 'turnoverTime' }),
            key: 'updated_at',
            dataIndex: 'updated_at',
            valueType: 'dateTime',
          },
          {
            title: intl.formatMessage({ id: 'creator' }),
            key: 'creator',
            dataIndex: 'creator',
            tzEllipsis: 2,
          },
          {
            title: intl.formatMessage({ id: 'creationTime' }),
            key: 'created_at',
            dataIndex: 'created_at',
            valueType: 'dateTime',
          },
        ]}
      />
    </TzCard>
  );
}

export default BasicInfo;
